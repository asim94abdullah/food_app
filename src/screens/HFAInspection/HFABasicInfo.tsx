import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Card, HelperText, TextInput} from 'react-native-paper';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {moderateScale} from 'react-native-size-matters';
import Geolocation from 'react-native-geolocation-service';
import {BusinessIdTypes, Color, Fonts} from '../../common/Constants';
import {TypeDropdownItem, UserProfile} from '../../common/Type';
import Dropdown from '../../components/Dropdown';
import RadioButton from '../../components/RadioButton';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import Api from '../../api';
import {getDataFrom, handleError} from '../../common/Utils';
import Icon from '../../components/Icon';
import moment from 'moment';

interface HFABasicInfoProps {
  onNext: (data: any) => void;
}

const isIos = Platform.OS == 'ios';
const LocationPermission = isIos
  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const CheckItem = ({title, checked}: {title: string; checked?: boolean}) => (
  <Text>
    <Icon
      type="Entypo"
      name={checked ? 'check' : 'cross'}
      color={checked ? Color.Green : Color.Red}
    />{' '}
    <Text style={styles.txtBold}>{title}</Text>
  </Text>
);

const InspectionDetails = ({inspections}: any) => (
  <>
    <Text style={styles.txtUnderline}>Inspection History</Text>
    <View style={styles.table}>
      <View style={styles.tableCell}>
        <Text style={styles.txtBold}>Warned</Text>
        <Text style={styles.txtLarge}>{inspections.notices}</Text>
      </View>

      <View style={styles.verticalLine} />

      <View style={styles.tableCell}>
        <Text style={styles.txtBold}>Sealed</Text>
        <Text style={styles.txtLarge}>{inspections.sealed}</Text>
      </View>

      <View style={styles.verticalLine} />

      <View style={styles.tableCell}>
        <Text style={styles.txtBold}>Seized</Text>
        <Text style={styles.txtLarge}>{inspections.seized}</Text>
      </View>

      <View style={styles.verticalLine} />

      <View style={styles.tableCell}>
        <Text style={styles.txtBold}>FIR</Text>
        <Text style={styles.txtLarge}>{inspections.firs}</Text>
      </View>

      <View style={styles.verticalLine} />

      <View style={styles.tableCell}>
        <Text style={styles.txtBold}>Total Fine</Text>
        <Text style={styles.txtLarge}>{inspections.fine}</Text>
      </View>
    </View>

    <Text></Text>

    {inspections.history.map((item: any, index: number) => (
      <View key={index} style={styles.row1}>
        <View style={styles.inspectionDate}>
          <Text style={styles.txtBold}>Date</Text>
          <Text style={styles.txtSmall}>
            {moment(item.date).format('DD-MM-YYYY')}
          </Text>
        </View>

        <View style={{flex: 1, marginLeft: 10}}>
          <View style={styles.inspectionDetails}>
            <CheckItem title="Warned" checked={item.notice == 'yes'} />
            <CheckItem title="Sealed" checked={item.sealed == 'yes'} />
            <CheckItem title="seized" checked={item.seized == 'yes'} />
            <CheckItem title="FIR" checked={item.fir == 'yes'} />
          </View>

          {/* <View style={styles.inspectionDetails}> */}
          <CheckItem title="Fined" checked={item.fined == 'yes'} />
          {/* </View> */}

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={styles.txtBold}>Inspection Team: </Text>
            <Text style={styles.txtSmall}>{item.officers}</Text>
          </View>
        </View>
      </View>
    ))}
  </>
);

const HFABasicInfo = ({onNext}: HFABasicInfoProps) => {
  const [idType, setIdType] = React.useState<TypeDropdownItem | undefined>();
  const [sendingData, setSendingData] = React.useState(false);
  const [businessId, setBusinessId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [gettingLocation, setGettingLocation] = React.useState(true);
  const [coordinates, setCoordinates] = React.useState<
    Geolocation.GeoCoordinates | undefined
  >({
    latitude: '34.014975',
    longitude: '71.580490',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [businessList, setBusinessList] = React.useState([]);
  const [selectedBusiness, setSelectedBusiness] = React.useState();

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const saveData = () => {
    if (!selectedBusiness) {
      Alert.alert('Message', 'Please select a business first');
      return;
    } else if (title.trim() == '') {
      Alert.alert('Message', 'Please enter title');
      return;
    } else if (!coordinates) {
      Alert.alert(
        'Message',
        'Unable to get your location, please enable your GPS & reopen this app.',
      );
      return;
    }
    setSendingData(true);
    const data = new FormData();
    data.append('title', title?.trim());
    data.append('description', details?.trim());
    data.append('latitude', coordinates?.latitude);
    data.append('longitude', coordinates?.longitude);
    data.append('shop_id', selectedBusiness?.id);
    data.append('business_id', selectedBusiness?.id);
    // TODO: remove this param
    data.append('officers', '1');

    api
      .hfaInspectionStep1(data)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          // console.log('respData', respData)
          onNext({
            businessId: selectedBusiness?.id,
            ...respData.inspection,
          });
        }
        setSendingData(false);
      })
      .catch(error => {
        handleError(error);
        setSendingData(false);
      });
  };

  const renderBusiness = ({item, index}) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={{flexDirection: 'row'}}>
          <RadioButton
            label={''}
            checked={selectedBusiness?.id == item.id}
            onPress={() => setSelectedBusiness(item)}
          />
          <View style={{flex: 1}}>
            <View style={[styles.row, {marginBottom: 0}]}>
              <Card.Title title={item.title} style={styles.cell} />
              {/* <Text style={styles.txtBold}>No of Bags: {'item.no_of_bags'} of {'item.title'}</Text> */}
            </View>
            <Card.Content>
              <View style={styles.row}>
                <View style={styles.cell}>
                  <Text style={styles.txtBold}>Business Owner</Text>
                  <Text style={styles.txtSmall}>
                    {item.owner_name + ` (${item.owner_cnic})`}
                  </Text>
                </View>

                <View style={styles.cell}>
                  <Text style={styles.txtBold}>Father Name</Text>
                  <Text style={styles.txtSmall}>
                    {item.owner_father_name || '-'}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.cell}>
                  <Text style={styles.txtBold}>Contact No: </Text>
                  <Text style={styles.txtSmall}>{item.contact_number}</Text>
                </View>

                <View style={styles.cell}>
                  <Text style={styles.txtBold}>License No</Text>
                  <Text style={styles.txtSmall}>
                    {item.license_number || '-'}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.txtBold}>Address: </Text>
                <Text style={styles.txtSmall}>{item.address}</Text>
              </View>
            </Card.Content>
          </View>
        </View>

        {selectedBusiness?.id == item.id && (
          <InspectionDetails inspections={item.inspections} />
        )}
      </Card.Content>
    </Card>
  );

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position: any) => {
        // console.log('location', position);
        setCoordinates(position.coords);
        setGettingLocation(false);
      },
      (error: any) => {
        // See error code charts below.
        // console.log(error.code, error.message);
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
        setGettingLocation(false);
      }
    }
  };

  const searchBusiness = () => {
    if (!idType) {
      Alert.alert('Message', `Please select "Search business by"`);
      return;
    } else if (businessId.trim() == '') {
      Alert.alert('Message', `Please enter Business ID`);
      return;
    }
    setIsLoading(true);
    setBusinessList([]);
    setSelectedBusiness(undefined);
    const data = new FormData();
    data.append('search_type', idType?.id);
    data.append('search', businessId.trim());

    api
      .businessSearch(data)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          setBusinessList(respData.businesses);
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
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {gettingLocation ? (
        <ActivityIndicator color={Color.Green} size="large" />
      ) : (
        <View style={styles.container}>
          <Dropdown
            label="Search business by"
            data={BusinessIdTypes}
            value={idType}
            onItemSelect={setIdType}
          />

          <TextInput
            mode="flat"
            label="Business ID"
            placeholder="License / Registration No / CNIC "
            value={businessId}
            onChangeText={setBusinessId}
            style={[styles.input, {marginBottom: 20}]}
            returnKeyType="done"
          />

          <Button
            mode="contained"
            style={[styles.btn, {backgroundColor: Color.Blue}]}
            loading={isLoading}
            onPress={searchBusiness}>
            Search Business
          </Button>

          <FlatList data={businessList} renderItem={renderBusiness} />

          <TextInput
            mode="flat"
            label="Title"
            placeholder="Inspection title "
            value={title}
            onChangeText={setTitle}
            style={[styles.input, {marginBottom: 5}]}
            returnKeyType="done"
          />

          <TextInput
            mode="flat"
            label="Details"
            placeholder="Some details / remarks "
            value={details}
            onChangeText={setDetails}
            multiline={true}
            style={[styles.input, {marginBottom: 5}]}
            returnKeyType="done"
          />

          <HelperText type="info" visible={true}>
            {gettingLocation
              ? 'Getting location...'
              : `Latitude: ${coordinates?.latitude}, Longitude: ${coordinates?.longitude}`}
          </HelperText>

          <Button
            mode="contained"
            style={styles.btn}
            loading={sendingData}
            onPress={saveData}>
            Save & Next
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default HFABasicInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: moderateScale(40),
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
    marginTop: 30,
  },
  btn: {
    borderRadius: moderateScale(10),
    marginTop: 40,
    // marginBottom: 40,
    height: 50,
    justifyContent: 'center',
  },
  card: {
    // marginHorizontal: 20,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cell: {
    flex: 1,
  },
  txtBold: {
    fontFamily: Fonts.UniNeueBold,
    color: Color.textDark,
    fontSize: 10,
  },
  txtSmall: {
    fontFamily: Fonts.UniNeueRegular,
    color: Color.textLight,
    fontSize: 10,
  },
  txtUnderline: {
    fontFamily: Fonts.UniNeueBold,
    color: Color.textLight,
    fontSize: 10,
    textDecorationStyle: 'solid',
    textDecorationColor: Color.textLight,
    marginBottom: 10,
  },
  table: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: Color.textLight,
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  verticalLine: {
    borderRightWidth: 0.5,
    borderColor: Color.textLight,
  },
  txtLarge: {
    fontSize: 16,
    fontFamily: Fonts.UniNeueRegular,
    color: Color.textDark,
    marginTop: 5,
  },
  inspectionDate: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inspectionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    // marginLeft: 10
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 0.3,
    borderBottomColor: Color.textLight,
  },
});
