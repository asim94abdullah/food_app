import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Button, Card, TextInput} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import Api from '../../api';
import {Color, DummyItem, Fonts, Routes} from '../../common/Constants';
import {TypeDropdownItem, UserProfile} from '../../common/Type';
import {getDataFrom, handleError} from '../../common/Utils';
import Container from '../../components/Container';
import DateTimePickerInput from '../../components/DateTimePickerInput';
import Dropdown from '../../components/Dropdown';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import {RootState} from '../../redux/store';
import {setShipedQty} from '../../redux/slices/dataSlice';

interface SendStockProps {}

const isIos = Platform.OS == 'ios';
const LocationPermission = isIos
  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
const SendStock = (props: SendStockProps) => {
  const {params} = useRoute();
  const [allocation, setAllocation] = React.useState<
    TypeDropdownItem | undefined
  >();
  const [dst, setDst] = React.useState<TypeDropdownItem | undefined>();
  const [src, setSrc] = React.useState<TypeDropdownItem | undefined>();
  const [driver, setDriver] = React.useState('');
  const [vehicle, setVehicle] = React.useState('');
  const [qty, setQty] = React.useState(0);
  const [bags, setBags] = React.useState(0);
  // const [jutt, setJutt] = React.useState('')
  // const [pp50, setPp50] = React.useState('')
  // const [pp100, setPp100] = React.useState('')
  const [estDelivery, setEstDelivery] = React.useState('');
  const [drBookNo, setDrBookNo] = React.useState('');
  const [drPageNo, setDrPageNo] = React.useState('');
  const [transTime, setTransTime] = React.useState(new Date());
  const [attachment, setAttachment] = React.useState<Asset | undefined>();
  const [loadingData, setLoadingData] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  // const [showPopup, setShowPopup] = React.useState(false)
  const [coordinates, setCoordinates] = React.useState<
    Geolocation.GeoCoordinates | undefined
  >();

  const [loadingSubCenter, setLoadingSubCenter] = React.useState(false);
  const [showPrToPr, setShowPrToPr] = React.useState(false);

  const [juttImpQty, setJuttImpQty] = React.useState('');
  const [juttIndgQty, setJuttIndgQty] = React.useState('');
  const [juttImpBags, setJuttImpBags] = React.useState('');
  const [juttIndgBags, setJuttIndgBags] = React.useState('');

  const [pp50ImpQty, setPp50ImpQty] = React.useState('');
  const [pp50IndgQty, setPp50IndgQty] = React.useState('');
  const [pp50ImpBags, setPp50ImpBags] = React.useState('');
  const [pp50IndgBags, setPp50IndgBags] = React.useState('');

  const [pp100ImpQty, setPp100ImpQty] = React.useState('');
  const [pp100IndgQty, setPp100IndgQty] = React.useState('');
  const [pp100ImpBags, setPp100ImpBags] = React.useState('');
  const [pp100IndgBags, setPp100IndgBags] = React.useState('');

  const [allocationList, setAllocationList] = React.useState([]);
  const [dstList, setDstList] = React.useState([]);
  const [srcList, setSrcList] = React.useState([]);
  const [hiddenData, setHiddenData] = React.useState({});
  const [bardanaList, setBardanaList] = React.useState([]);
  const [subSourceList, setSubSourceList] = React.useState([]);
  const [estDeliveryDate, setEstDeliveryDate] = React.useState('');
  const [notifiedQty, setNotifiedQty] = React.useState('');
  const [issuedQty, setIssuedQty] = React.useState('');
  const [notificationId, setNotificationId] = React.useState('');

  const [subOfficer, setSubOfficer] = React.useState<
    TypeDropdownItem | undefined
  >();

  // const _notifiedQty = useSelector<RootState, number>(state => state.data.notifiedQty) || 0
  // const _shipedQty = useSelector<RootState, number>(state => state.data.shipedQty) || 0

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  // console.log('session', User);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const isDataOk = () => {
    if (!showPrToPr && !allocation) {
      Alert.alert('Message', 'Please select allocation');
      return false;
    } else if (!dst) {
      Alert.alert('Message', 'Please select destination');
      return false;
    } else if (!src) {
      Alert.alert('Message', 'Please select source');
      return false;
    } else if (!showPrToPr && !subOfficer) {
      Alert.alert('Message', 'Please select sub center');
      return false;
    } else if (parseFloat(qty) <= 0) {
      Alert.alert('Message', 'Please add Jutt/PP50/PP100 quantity');
      return false;
    } else if (parseFloat(bags) <= 0) {
      Alert.alert('Message', 'Please add Jutt/PP50/PP100 Bags');
      return false;
    }

    // ✅ IMPORTED WHEAT VALIDATION (both directions)

    // Jute Import
    else if (
      parseFloat(juttImpQty) > 0 &&
      (!juttImpBags || parseFloat(juttImpBags) <= 0)
    ) {
      Alert.alert(
        'Message',
        'Please enter Jute Import Bags when Imported Wheat Quantity is entered.',
      );
      return false;
    } else if (
      parseFloat(juttImpBags) > 0 &&
      (!juttImpQty || parseFloat(juttImpQty) <= 0)
    ) {
      Alert.alert(
        'Message',
        'Please enter Jute Imported Wheat Quantity when Import Bags are entered.',
      );
      return false;
    }

    // PP50 Import
    else if (
      parseFloat(pp50ImpQty) > 0 &&
      (!pp50ImpBags || parseFloat(pp50ImpBags) <= 0)
    ) {
      Alert.alert(
        'Message',
        'Please enter PP50 Import Bags when Imported Wheat Quantity is entered.',
      );
      return false;
    } else if (
      parseFloat(pp50ImpBags) > 0 &&
      (!pp50ImpQty || parseFloat(pp50ImpQty) <= 0)
    ) {
      Alert.alert(
        'Message',
        'Please enter PP50 Imported Wheat Quantity when Import Bags are entered.',
      );
      return false;
    }

    // PP100 Import
    else if (
      parseFloat(pp100ImpQty) > 0 &&
      (!pp100ImpBags || parseFloat(pp100ImpBags) <= 0)
    ) {
      Alert.alert(
        'Message',
        'Please enter PP100 Import Bags when Imported Wheat Quantity is entered.',
      );
      return false;
    } else if (
      parseFloat(pp100ImpBags) > 0 &&
      (!pp100ImpQty || parseFloat(pp100ImpQty) <= 0)
    ) {
      Alert.alert(
        'Message',
        'Please enter PP100 Imported Wheat Quantity when Import Bags are entered.',
      );
      return false;
    }

    // ✅ Continue existing validations
    else if (estDelivery.trim() === '') {
      Alert.alert('Message', 'Please enter Estimated Delivery Time');
      return false;
    } else if (drBookNo.trim() === '') {
      Alert.alert('Message', 'Please enter DR Book Number');
      return false;
    } else if (drPageNo.trim() === '') {
      Alert.alert('Message', 'Please enter DR Page Number');
      return false;
    } else if (!transTime) {
      Alert.alert('Message', 'Please select Transportation Time');
      return false;
    } else if (!attachment) {
      Alert.alert('Message', 'Please attach an image');
      return false;
    } else if (!coordinates) {
      Alert.alert(
        'Message',
        'GPS coordinates are empty, please enable your GPS (location services) & try again. If the issue still persists then reopen the application.',
      );
      return false;
    }

    return true;
  };

  const submitData = () => {
    if (!isDataOk()) {
      return;
    }

    const data = new FormData();

    if (showPrToPr) {
      data.append('from_company_id', src?.id);
      data.append('to_company_id', dst?.id);
      data.append('pr_notification_id', notificationId);

      const newQty = issuedQty + parseFloat(qty);
      if (newQty > notifiedQty) {
        Alert.alert(
          'Message',
          'Total quatity should not be greater than the remaining quantity',
        );
        return;
      }
    } else {
      data.append('procurement_allocation_id', allocation?.id);
      data.append('subcenter_id', subOfficer?.id);
      data.append('source_id', src?.id);
      data.append('company_id', dst?.id);
    }

    setIsLoading(true);

    data.append('import_qty', 0);
    data.append('quantity_tons', qty);
    data.append('indigenous_qty', 0);
    data.append('shipment_date', moment(transTime).format('YYYY-MM-DD')); // "2022-09-20"
    data.append('no_bags', bags);
    data.append('shipment_time', moment(transTime).format('h:mma')); // "4:00pm"
    data.append('approximate_delivery_time', estDelivery);
    // TODO: add estDelivery+estDelivery
    data.append('approximate_delivery_date_time', estDeliveryDate);
    data.append('dr_book_no', drBookNo);
    data.append('dr_page_no', drPageNo);
    data.append('vehicle_no', vehicle);
    data.append('driver_name', driver);

    data.append('jutt_import_qty', juttImpQty);
    data.append('jutt_import_bags', juttImpBags);
    data.append('jutt_indigenous_qty', juttIndgQty);
    data.append('jutt_indigenous_bags', juttIndgBags);

    data.append('pp50_import_qty', pp50ImpQty);
    data.append('pp50_import_bags', pp50ImpBags);
    data.append('pp50_indigenous_qty', pp50IndgQty);
    data.append('pp50_indigenous_bags', pp50IndgBags);

    data.append('pp100_import_qty', pp100ImpQty);
    data.append('pp100_import_bags', pp100ImpBags);
    data.append('pp100_indigenous_qty', pp100IndgQty);
    data.append('pp100_indigenous_bags', pp100IndgBags);

    data.append('latitude', coordinates?.latitude);
    data.append('longitude', coordinates?.longitude);
    data.append('attachment', {
      uri: attachment?.uri,
      name: attachment?.fileName || 'attachment.png',
      type: attachment?.type || 'image/png',
    });

    const keys = Object.keys(hiddenData);
    const values = Object.values(hiddenData);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];

      // 🛑 Skip keys that are already appended manually
      if (
        [
          'procurement_allocation_id',
          'subcenter_id',
          'source_id',
          'company_id',
          'from_company_id',
          'to_company_id',
          'pr_notification_id',
        ].includes(key)
      ) {
        continue;
      }

      data.append(key, value);
    }

    // console.log('asimmmmmmmmm', data);
    api
      .shipmentStore(data, showPrToPr)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          // navigation.navigate(Routes.ShipmentDetails, {
          //     shipmentId: respData.shipment?.shipment_id,
          //     bardanaList: respData.bardana,
          //     sourceList: respData.sub_center
          // })
          // if (showPrToPr) {
          //     const newQty = _shipedQty + parseFloat(qty)
          //     dispatch(setShipedQty(newQty))
          // }
          Alert.alert(
            'Thank you',
            response.data?.message || 'Data saved successfully',
          );
          navigation.goBack();
        }
        setIsLoading(false);
      })
      .catch(error => {
        handleError(error);
        setIsLoading(false);
      });
  };

  const openGalley = async () => {
    try {
      let cameraPermission: Permission | undefined;

      if (Platform.OS === 'android') {
        cameraPermission = PERMISSIONS.ANDROID.CAMERA;
      } else if (Platform.OS === 'ios') {
        cameraPermission = PERMISSIONS.IOS.CAMERA;
      }

      // Handle the case where cameraPermission might be undefined
      if (!cameraPermission) {
        Alert.alert('Error', 'Unable to determine the appropriate permission.');
        return;
      }

      const status = await check(cameraPermission);
      if (status !== RESULTS.GRANTED) {
        const requestStatus = await request(cameraPermission);
        if (requestStatus !== RESULTS.GRANTED) {
          Alert.alert(
            'Message',
            'Camera permission required, please allow camera permission.',
          );
          return;
        }
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0,
      });

      // Ensure result.assets is defined before accessing it
      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setAttachment(result.assets[0]);
      } else {
        console.error('No image captured or an error occurred.');
      }
    } catch (error) {
      Alert.alert(
        'Message',
        'Something went wrong. Unable to open the camera.',
      );
    }

    // launchCamera({
    //   mediaType: 'photo',
    // })
    //   .then(result => {
    //     if (result.assets) {
    //       setAttachment(result.assets[0]);
    //     }
    //   })
    //   .catch(error => {
    //     console.log('error', error);
    //   });
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log('location', position);
        setCoordinates(position.coords);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        Alert.alert('Message', 'Failed to get GPS location\n' + error.message);
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

  const changeSrc = (item: TypeDropdownItem) => {
    setSrc(item);
    setSubOfficer(undefined);
    setSubSourceList([]);
    setLoadingSubCenter(true);
    getSubcenter(item);
  };

  const getSubcenter = (item: TypeDropdownItem) => {
    let data = {
      contractor_id: hiddenData?.contractor_id,
      source_id: item?.id,
      procurement_allocation_id: allocation?.id,
    };

    console.log('datadata', data);

    api
      .getSubcentersList(data)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          setSubSourceList(respData.sub_center);
        }
        setLoadingSubCenter(false);
      })
      .catch(error => {
        handleError(error);
        setLoadingSubCenter(false);
      });
  };

  React.useEffect(() => {
    const {data} = params;
    if (data) {
      setAllocationList(data.sub_allocation);
      setDstList(data.destination);
      setSrcList(data.wheat_source);
      setHiddenData(data.hidden);
      setBardanaList(data.bardana);
      const prToPr = params?.prToPr; // data.notification_list?.length > 0
      if (prToPr) {
        const {notification} = params;
        setSrc({
          id: notification.pr_from_company_id,
          title: notification.from_company_title,
        });
        setDst({
          id: notification.pr_to_company_id,
          title: notification.to_company_title,
        });
        setNotifiedQty(notification.prc_notification_qty);
        setIssuedQty(notification.prc_shipment_qty);
        setNotificationId(notification.id);
      }
      setShowPrToPr(prToPr);
      setLoadingData(false);
    } else {
      api
        .getShipmentData()
        .then(response => {
          const respData = getDataFrom(response);
          if (respData) {
            setAllocationList(respData.sub_allocation);
            setDstList(respData.destination);
            setSrcList(respData.wheat_source);
            setHiddenData(respData.hidden);
            setBardanaList(respData.bardana);
          }
          setLoadingData(false);
        })
        .catch(error => {
          handleError(error);
          setLoadingData(false);
        });
    }

    getSafeLocation();
  }, []);

  React.useEffect(() => {
    if (!isNaN(parseFloat(estDelivery)) && transTime) {
      setEstDeliveryDate(
        moment(transTime).add(estDelivery, 'hours').format('YYYY-MM-DD h:mma'),
      );
    }
  }, [estDelivery, transTime]);

  React.useEffect(() => {
    // let sum = parseFloat(juttImpQty) + parseFloat(pp50ImpQty) + parseFloat(pp100ImpQty)
    let sum = 0;

    if (!isNaN(parseFloat(juttImpQty))) {
      sum += parseFloat(juttImpQty);
    }

    if (!isNaN(parseFloat(juttIndgQty))) {
      sum += parseFloat(juttIndgQty);
    }

    if (!isNaN(parseFloat(pp50ImpQty))) {
      sum += parseFloat(pp50ImpQty);
    }

    if (!isNaN(parseFloat(pp50IndgQty))) {
      sum += parseFloat(pp50IndgQty);
    }

    if (!isNaN(parseFloat(pp100ImpQty))) {
      sum += parseFloat(pp100ImpQty);
    }

    if (!isNaN(parseFloat(pp100IndgQty))) {
      sum += parseFloat(pp100IndgQty);
    }

    if (!isNaN(sum)) {
      setQty(sum.toFixed(3));
    }
  }, [
    juttImpQty,
    juttIndgQty,
    pp50ImpQty,
    pp50IndgQty,
    pp100ImpQty,
    pp100IndgQty,
  ]);
  React.useEffect(() => {
    // const sum = parseFloat(juttImpBags) + parseFloat(pp50ImpBags) + parseFloat(pp100ImpBags)
    let sum = 0;

    if (!isNaN(parseFloat(juttImpBags))) {
      sum += parseFloat(juttImpBags);
    }

    if (!isNaN(parseFloat(juttIndgBags))) {
      sum += parseFloat(juttIndgBags);
    }

    if (!isNaN(parseFloat(pp50ImpBags))) {
      sum += parseFloat(pp50ImpBags);
    }

    if (!isNaN(parseFloat(pp50IndgBags))) {
      sum += parseFloat(pp50IndgBags);
    }

    if (!isNaN(parseFloat(pp100ImpBags))) {
      sum += parseFloat(pp100ImpBags);
    }

    if (!isNaN(parseFloat(pp100IndgBags))) {
      sum += parseFloat(pp100IndgBags);
    }

    if (!isNaN(sum)) {
      setBags(sum);
    }
  }, [
    juttImpBags,
    juttIndgBags,
    pp50ImpBags,
    pp50IndgBags,
    pp100ImpBags,
    pp100IndgBags,
  ]);

  // console.log('allocation', allocation);

  return (
    <Container>
      <View style={styles.container}>
        <Header title="Send Stock" />
        <KeyboardAvoidingView>
          <ScrollView
            contentContainerStyle={{padding: 20}}
            style={{flexGrow: 0.9}}>
            {showPrToPr ? (
              <>
                <Card style={styles.card}>
                  <Card.Content>
                    <View style={styles.row}>
                      <View style={styles.cell}>
                        <Text style={styles.txtBold}>Wheat Source</Text>
                        <Text style={styles.txtSmall}>{src?.title}</Text>
                      </View>

                      <View style={styles.cell}>
                        <Text style={styles.txtBold}>Destination</Text>
                        <Text style={styles.txtSmall}>{dst?.title}</Text>
                      </View>
                    </View>

                    <Text> </Text>

                    <View style={styles.row}>
                      <View style={styles.cell}>
                        <Text style={styles.txtBold}>Notified Quantity:</Text>
                        <Text style={styles.txtSmall}>{notifiedQty} (MT)</Text>
                      </View>

                      <View style={styles.cell}>
                        <Text style={styles.txtBold}>Issued Quantity:</Text>
                        <Text style={styles.txtSmall}>{issuedQty} (MT)</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </>
            ) : (
              <>
                <Dropdown
                  data={allocationList}
                  onItemSelect={setAllocation}
                  label={loadingData ? 'Loading...' : 'Allocation'}
                  value={allocation}
                  style={styles.input}
                />
                <Dropdown
                  data={srcList}
                  label={loadingData ? 'Loading...' : 'Wheat Source'}
                  value={src}
                  style={styles.input}
                  onBeforeOpen={() => {
                    if (!allocation || !allocation.id) {
                      Alert.alert('Message', 'Please select allocation first');
                      return false; // prevent modal
                    }
                    return true; // allow modal
                  }}
                  onItemSelect={item => changeSrc(item)}
                />

                <Dropdown
                  data={subSourceList}
                  onItemSelect={setSubOfficer}
                  label={loadingSubCenter ? 'Loading...' : 'Sub Center'}
                  value={subOfficer}
                  style={styles.input}
                />

                <Dropdown
                  data={dstList}
                  onItemSelect={setDst}
                  label={loadingData ? 'Loading...' : 'Destination'}
                  value={dst}
                  style={styles.input}
                />
              </>
            )}

            <TextInput
              mode="flat"
              label="Driver Name"
              placeholder="Full Name (Optional)"
              value={driver}
              onChangeText={setDriver}
              style={styles.input}
              returnKeyType="next"
            />

            <TextInput
              mode="flat"
              label="Vehicle Reg. No"
              placeholder="(Optional)"
              value={vehicle}
              onChangeText={setVehicle}
              style={styles.input}
              returnKeyType="next"
            />

            {/* <TextInput
                            mode="flat"
                            label="Quantity (MT)"
                            placeholder="Enter Quantity in MT"
                            value={qty}
                            onChangeText={setQty}
                            style={styles.input}
                            returnKeyType='next'
                            keyboardType='decimal-pad'
                        />

                        <TextInput
                            mode="flat"
                            label="No. of Bags"
                            placeholder="100"
                            value={bags}
                            onChangeText={setBags}
                            style={styles.input}
                            returnKeyType='next'
                            keyboardType='decimal-pad'
                        /> */}

            {/* <View style={styles.row}>
                            <TextInput
                                mode="flat"
                                label="JUTT"
                                placeholder="0"
                                value={jutt}
                                onChangeText={setJutt}
                                style={styles.input2}
                                returnKeyType='next'
                                keyboardType='decimal-pad'
                            />

                            <TextInput
                                mode="flat"
                                label="PP50"
                                placeholder="0"
                                value={pp50}
                                onChangeText={setPp50}
                                style={styles.input2}
                                returnKeyType='next'
                                keyboardType='decimal-pad'
                            />

                            <TextInput
                                mode="flat"
                                label="PP100"
                                placeholder="0"
                                value={pp100}
                                onChangeText={setPp100}
                                style={styles.input2}
                                returnKeyType='next'
                                keyboardType='decimal-pad'
                            />
                        </View> */}

            <TextInput
              mode="flat"
              label="DR Book No"
              placeholder="Book Number"
              value={drBookNo}
              onChangeText={setDrBookNo}
              style={styles.input}
              returnKeyType="done"
              keyboardType="decimal-pad"
            />

            <TextInput
              mode="flat"
              label="DR Page No"
              placeholder="Page Number"
              value={drPageNo}
              onChangeText={setDrPageNo}
              style={styles.input}
              returnKeyType="done"
              keyboardType="decimal-pad"
            />

            <TextInput
              mode="flat"
              label="Estimated Delivery Time"
              placeholder="In Hours"
              value={estDelivery}
              onChangeText={setEstDelivery}
              style={styles.input}
              returnKeyType="next"
              keyboardType="decimal-pad"
            />

            <DateTimePickerInput
              label="Loading Time" //'Transportation Time'
              date={transTime}
              style={styles.input}
              onChange={setTransTime}
            />

            <Text>Estimated Devliery Date: {estDeliveryDate + '\n'}</Text>

            <View style={styles.card}>
              <Text style={styles.heading}>Jute 100 KG</Text>

              <TextInput
                mode="flat"
                label="Imported Wheat Quantity (MT)"
                placeholder="Imported Quantity"
                value={juttImpQty}
                onChangeText={setJuttImpQty}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="flat"
                label="Jute Import Bags"
                placeholder="Number of Bags"
                value={juttImpBags}
                onChangeText={setJuttImpBags}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="flat"
                label="Indigenous Wheat Quantity (MT)"
                placeholder="Indigenous Quantity"
                value={juttIndgQty}
                onChangeText={setJuttIndgQty}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="flat"
                label="Jute Indigenous Bags"
                placeholder="Number of Bags"
                value={juttIndgBags}
                onChangeText={setJuttIndgBags}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.heading}>PP-50 KG</Text>

              <TextInput
                mode="flat"
                label="Imported Wheat Quantity (MT)"
                placeholder="Imported Quantity"
                value={pp50ImpQty}
                onChangeText={setPp50ImpQty}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="flat"
                label="PP-50 Imported Bags"
                placeholder="Number of Bags"
                value={pp50ImpBags}
                onChangeText={setPp50ImpBags}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="flat"
                label="Indigenous Wheat Quantity (MT)"
                placeholder="Indigenous Quantity"
                value={pp50IndgQty}
                onChangeText={setPp50IndgQty}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="flat"
                label="PP-50 Indigenous Bags"
                placeholder="Indigenous Bags"
                value={pp50IndgBags}
                onChangeText={setPp50IndgBags}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.heading}>PP-100 KG</Text>

              <TextInput
                mode="flat"
                label="Imported Wheat Quantity (MT)"
                placeholder="Imported Quantity"
                value={pp100ImpQty}
                onChangeText={setPp100ImpQty}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="flat"
                label="PP100 Import Bags"
                placeholder="Import Bags"
                value={pp100ImpBags}
                onChangeText={setPp100ImpBags}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="flat"
                label="Indigenous Wheat Quantity (MT)"
                placeholder="Indigenous Quantity"
                value={pp100IndgQty}
                onChangeText={setPp100IndgQty}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />

              <TextInput
                mode="flat"
                label="PP100 Indigenous Bags"
                placeholder="Indigenous Bags"
                value={pp100IndgBags}
                onChangeText={setPp100IndgBags}
                style={styles.input}
                returnKeyType="next"
                keyboardType="decimal-pad"
              />
            </View>

            <Text style={styles.lbl}>Total Bags: {bags}</Text>
            <Text style={styles.lbl}>Total Quantity (MT): {qty + '\n'}</Text>

            {attachment ? (
              <View style={styles.thumbnailWrapper}>
                <Image
                  source={{uri: attachment.uri}}
                  style={styles.thumbnail}
                />

                <View style={styles.overlay}>
                  <Icon
                    type="Entypo"
                    name="circle-with-cross"
                    color={'white'}
                    size={20}
                    onPress={() => setAttachment(undefined)}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity activeOpacity={0.8} onPress={openGalley}>
                <View style={styles.btn1}>
                  <Text style={styles.lbl}>Dispatch Report Image</Text>
                  <Icon
                    type="Entypo"
                    name="camera"
                    size={40}
                    color={Color.textLight}
                    style={{marginTop: 10}}
                  />
                </View>
              </TouchableOpacity>
            )}

            <Button
              mode="contained"
              style={styles.btn}
              loading={isLoading}
              onPress={submitData}>
              Submit
            </Button>

            {/* <View style={{ height: 40, width: 40, }} /> */}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Container>
  );
};

export default SendStock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
  },
  input2: {
    marginBottom: 20,
    width: '25%',
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    borderRadius: moderateScale(10),
    marginTop: 20,
    // marginBottom: 40,
    height: 50,
    justifyContent: 'center',
  },
  btn1: {
    flex: 1,
    backgroundColor: '#cfcfcf',
    height: 130,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lbl: {
    color: Color.textLight,
    fontFamily: Fonts.UniNeueRegular,
  },
  thumbnailWrapper: {
    width: 100,
    height: 130,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 20,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    width: 100,
    height: 130,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'flex-end',
    padding: 10,
  },
  txtWhite: {
    color: 'white',
    // backgroundColor: 'red',
    textAlign: 'center',
    // marginTop: 30,
  },
  heading: {
    color: Color.textLight,
    // fontFamily: Fonts.UniNeueRegular
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: Color.White,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
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
});
