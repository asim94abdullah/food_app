import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Button, HelperText, TextInput} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import Geolocation from 'react-native-geolocation-service';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Color, DummyItem, Fonts, Routes} from '../../common/Constants';
import DateTimePickerInput from '../../components/DateTimePickerInput';
import Dropdown from '../../components/Dropdown';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {TypeDropdownItem, UserProfile} from '../../common/Type';
import Api from '../../api';
import {getDataFrom, handleError} from '../../common/Utils';
import MultiSelect from '../../components/MultiSelect';
import MapView, {PROVIDER_GOOGLE, Marker, Circle} from 'react-native-maps';

interface BasicInfoProps {
  inspection: string;
  onNext: (data: any) => void;
  // sendData: (data: FormData) => Promise<AxiosResponse<any, any>>,
  // commonDataRequest: Promise<AxiosResponse<any, any>>,
}

const isIos = Platform.OS == 'ios';
const LocationPermission = isIos
  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
const BasicInfo = ({inspection, onNext}: BasicInfoProps) => {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState();
  const [team, setTeam] = React.useState<TypeDropdownItem[]>([]);
  const [details, setDetails] = React.useState('');
  const [locationAddress, setLocationAddress] = React.useState('');
  const [coordinates, setCoordinates] = React.useState<
    Geolocation.GeoCoordinates | undefined
  >();
  const [isLoading, setIsLoading] = React.useState(true);
  const [sendingData, setSendingData] = React.useState(false);
  const [gettingLocation, setGettingLocation] = React.useState(true);
  const [commonData, setCommonData] = React.useState(undefined);

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const btnClick = () => {
    // onNext({ _commonData: commonData, _step1Response: {} })
    if (title.trim() == '') {
      Alert.alert('Message', 'Please enter title');
      return;
    } else if (team.length < 1) {
      Alert.alert('Message', 'Please select inspection team');
      return;
    } else if (details.trim() == '') {
      Alert.alert('Message', 'Please enter address');
      return;
    } else if (!coordinates) {
      Alert.alert('Message', 'Please wait for GPS to load coordinates');
      return;
    }

    // onNext({ title, date, team, details, coordinates })

    setSendingData(true);
    const data = new FormData();
    data.append('title', title);
    data.append('description', details);
    data.append('latitude', coordinates.latitude);
    data.append('longitude', coordinates.longitude);
    data.append('officers', team.map(i => i.id).join(','));
    let request = undefined;
    if (inspection == Routes.MillsInspection) {
      request = api.sendStep1Data(data);
    } else if (inspection == Routes.ShopsInspection) {
      request = api.sendShopStep1Data(data);
    } else {
      request = api.sendDealerStep1Data(data);
    }

    // let request = shopInspection ? api.sendShopStep1Data(data) : api.sendStep1Data(data)
    request
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          // setCommonData(respData)
          onNext({_commonData: commonData, _step1Response: respData});
        }
        setSendingData(false);
      })
      .catch(error => {
        handleError(error);
        setSendingData(false);
      });
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log('location', position);
        setCoordinates(position.coords);
        setGettingLocation(false);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        Alert.alert('Message', 'Failed to get GPS location\n' + error.message);
        setGettingLocation(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const getSafeLocation = async () => {
    const preResult = await check(LocationPermission);
    if (preResult == RESULTS.GRANTED) {
      getLocation();
    } else {
      const postResult = await request(LocationPermission);
      if (postResult == RESULTS.GRANTED) {
        getLocation();
      } else {
        Alert.alert(
          'Permission Required',
          'Please allow the application to access your current location',
        );
      }
    }
  };

  const getCommonData = () => {
    // let request = shopInspection ? api.getShopInspectionData() : api.getInspectionData()
    let request = undefined;
    if (inspection == Routes.MillsInspection) {
      request = api.getInspectionData();
    } else if (inspection == Routes.ShopsInspection) {
      request = api.getShopInspectionData();
    } else {
      request = api.getDealerInspectionData();
    }

    request
      .then(response => {
        const respData = getDataFrom(response);
        // console.log('Data officer', JSON.stringify(respData));

        if (respData) {
          setCommonData(respData);
        }
        setIsLoading(false);
      })
      .catch(error => {
        handleError(error);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    getSafeLocation();
    getCommonData();
  }, []);

  const onRegionChange = (region:any) => {
    // console.log(region);
  };

  // console.log('officerrrrr', commonData);

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator color={Color.Green} size="large" />
    </View>
  ) : (
    <ScrollView style={{marginVertical: 40, height: '100%'}}>
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <TextInput
            mode="flat"
            label="Inspection Title"
            placeholder="Purpose of Inspection"
            value={title}
            onChangeText={newText => {
              const englishLetterRegex =
                /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/;
              // console.log('text', newText);
              if (newText === '') {
                setTitle('');
              }
              // setTitle(newText);

              if (englishLetterRegex.test(newText)) {
                setTitle(newText);
              } else {
                console.log('Invalid character entered');
              }
            }}
            style={styles.input}
            returnKeyType="next"
          />
          <MultiSelect
            data={commonData?.officers || []}
            onItemSelect={setTeam}
            label="Inspection Team"
            value={team}
            style={styles.input}
          />
          <TextInput
            mode="flat"
            label="Address"
            placeholder="Add Address Here!"
            value={details}
            onChangeText={newText => {
              const englishLetterRegex =
                /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/;
              // console.log('text', newText);
              if (newText === '') {
                setDetails('');
              }
              // setTitle(newText);

              if (englishLetterRegex.test(newText)) {
                setDetails(newText);
              } else {
                console.log('Invalid character entered');
              }
            }}
            multiline={true}
            style={[styles.input, {marginBottom: 15}]}
            returnKeyType="done"
          />
          <HelperText type="info" visible={true}>
            {gettingLocation
              ? 'Getting location...'
              : `Latitude: ${coordinates?.latitude}, Longitude: ${coordinates?.longitude}`}
          </HelperText>
          <View
            style={{
              padding: 5,
              backgroundColor: Color.White,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: Color.Blue,
            }}>
            {gettingLocation === false && (
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{
                  width: '100%',
                  height: 190,
                }}
                scrollEnabled={true} // Enable scrolling
                zoomEnabled={true} // Enable zoom gestures
                showsMyLocationButton={true}
                showsUserLocation={true}
                onRegionChange={region => onRegionChange(region)}
                region={{
                  latitude: coordinates?.latitude,
                  longitude: coordinates?.longitude,
                  latitudeDelta: 0.001, // smaller value for closer zoom
                  longitudeDelta: 0.001, // smaller value for closer zoom
                }}>
                {coordinates != undefined && (
                  <Marker
                    coordinate={coordinates}
                    title={'Your are here'}
                    // description={''}
                  />
                )}
                <Circle
                  center={coordinates}
                  radius={50} // radius in meters
                  strokeWidth={1} // no border
                  strokeColor={Color.RedTransparent}
                  fillColor="rgba(0, 0, 0, 0.2)" // dark white color (semi-transparent)
                />
              </MapView>
            )}
          </View>

          <Button
            mode="contained"
            style={styles.btn}
            loading={sendingData}
            onPress={btnClick}>
            Save & Next
          </Button>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default BasicInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  container1: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  input: {
    marginBottom: moderateScale(20),
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
  },
  btn: {
    borderRadius: moderateScale(10),
    marginTop: 40,
    // marginBottom: 40,
    height: 50,
    justifyContent: 'center',
  },
});
