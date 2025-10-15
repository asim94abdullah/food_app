import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Button, Divider} from 'react-native-paper';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../api';
import ActiveTrasit from '../assets/svg/ActiveTrasit';
import Atta from '../assets/svg/Atta';
import Clipboard from '../assets/svg/Clipboard';
import DealerInsp from '../assets/svg/DealerInsp';
import Shop from '../assets/svg/Shop';
import Wheat from '../assets/svg/Wheat';
import {
  Color,
  CurrentAppVersion,
  Fonts,
  Routes,
  UserType,
} from '../common/Constants';
import {CommonStyle} from '../common/Theme';
import {UserProfile} from '../common/Type';
import {getDataFrom, handleError, TrackEvent} from '../common/Utils';
import Box from '../components/Box';
import CheckpostHomeCard from '../components/CheckpostHomeCard';
import Container from '../components/Container';
import Header from '../components/Header';
import Icon from '../components/Icon';
import StockDetails from '../components/StockDetails';
import {
  saveUser,
  setAllowedQty,
  setBardanaTypes,
  setDistrictsList,
  setProvinceList,
  setStockIn,
  setStockOut,
  setStockTotal,
} from '../redux/slices/dataSlice';
import {RootState} from '../redux/store';

interface HomeProps {}

const isIos = Platform.OS == 'ios';
const LocationPermission = isIos
  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
const Home = (props: HomeProps) => {
  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const stockTotal = useSelector<RootState, number>(
    state => state.data.stockTotal,
  );
  const stockIn = useSelector<RootState, number>(state => state.data.stockIn);
  const stockOut = useSelector<RootState, number>(state => state.data.stockOut);
  // console.log('user', User);

  // const notifiedQty = useSelector<RootState, number>(state => state.data.notifiedQty) || 0
  // const shipedQty = useSelector<RootState, number>(state => state.data.shipedQty) || 0

  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [askLocation, setAskLocation] = React.useState(false);
  const [dealerResp, setDealerResp] = React.useState({});
  const [isLoaing, setIsLoading] = React.useState(true);
  const [stockPercentage, setStockPercentage] = React.useState(0);
  const [gettingLocation, setGettingLocation] = React.useState(false);
  const [data, setData] = React.useState();
  const [notificationsCount, setNotificationsCount] = React.useState(0);
  const [ytLInk, setytLink] = React.useState('');
  const [showPopup, setShowPopup] = React.useState(false);

  const getPercentage = () => {
    // 48.98%
    try {
      if (stockTotal == 0) {
        return 0;
      }
      return parseInt(Math.min(100, (stockOut / stockTotal) * 100));
    } catch (error) {
      // console.log('value-err', error);
      return 0;
    }
  };

  const getDealerData = (isSilent?: boolean) => {
    if (!isSilent) {
      setIsLoading(true);
    }

    api
      .getDealerCommonData(isSilent)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          console.log('dealer-Data', respData);
          const {atta_bardana_list, atta_bardana_type, latitude, longitude} =
            respData;
          setDealerResp(respData);

          setytLink(respData.link);

          if (User?.user_type == UserType.Shop_Seller) {
            try {
              dispatch(
                setStockIn(Math.max(0, parseInt(respData.manual_received))),
              );
              dispatch(
                setStockOut(Math.max(0, parseInt(respData.manual_issued))),
              );
              dispatch(
                setStockTotal(Math.max(0, parseInt(respData.manual_stock))),
              );
            } catch (error) {
              dispatch(setStockIn(respData.manual_received));
              dispatch(setStockOut(respData.manual_issued));
              dispatch(setStockTotal(respData.manual_stock));
            }
          } else {
            dispatch(setStockIn(respData.stockin));
            dispatch(setStockOut(respData.stockout));
            dispatch(setStockTotal(respData.stock));
          }

          if (User?.user_type == UserType.Checkpost) {
            dispatch(setBardanaTypes(atta_bardana_type));
          } else {
            dispatch(setBardanaTypes(atta_bardana_list));
          }

          dispatch(setAllowedQty(respData.allowed_qty));
          dispatch(setDistrictsList(respData.district_kp));
          dispatch(setProvinceList(respData.province));

          if (!latitude || !longitude) {
            setAskLocation(true);
          }

          setUpdateAvailable(respData.version > CurrentAppVersion);
        }
        setIsLoading(false);
      })
      .catch(error => {
        handleError(error, isSilent);
        setIsLoading(false);
      });
  };

  const refreshData = () => {
    if (!isLoaing) {
      TrackEvent('refresh-btn-clicked');
      getDealerData();
    }
  };

  React.useEffect(() => {
    if (
      User?.user_type == UserType.Dealer ||
      User?.user_type == UserType.Shop_Seller ||
      User?.user_type == UserType.Checkpost
    ) {
      getDealerData();
    } else if (User?.user_type == UserType.Contractor) {
      api
        .getShipmentData()
        .then(response => {
          const respData = getDataFrom(response);
          if (respData) {
            // setAllocationList(respData.sub_allocation)
            // setDstList(respData.destination)
            // setSrcList(respData.wheat_source)
            // setHiddenData(respData.hidden)
            // setBardanaList(respData.bardana)
            setData(respData);
            // console.log('RespData', respData);

            setNotificationsCount(parseInt(respData.total_notification));
            // dispatch(setNotifiedQty(parseFloat(respData.prc_notification_qty)))
            // dispatch(setShipedQty(parseFloat(respData.prc_shipment_qty)))
          }
          setIsLoading(false);
        })
        .catch(error => {
          // handleError(error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    // TODO: change interval to 30
    // const myInterval = setInterval(() => getDealerData(true), 30 * 1000)
    // return () => clearInterval(myInterval)
  }, []);

  React.useEffect(() => {
    setStockPercentage(getPercentage());
  }, [stockOut, stockTotal, stockIn]);

  const getTitle = () => {
    // console.log('User', User);
    if (User?.user_type == UserType.Dealer) {
      return 'Atta Distribution App';
    } else if (User?.user_type == UserType.Contractor) {
      return 'Fleet Management App';
    }
    // TODO: check other types as well
    return 'Home';
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log('location', position);
        uploadLocation(position.coords);
        // setGettingLocation(false)
      },
      error => {
        // See error code charts below.
        // console.log(error.code, error.message);
        Alert.alert('Message', 'Failed to get GPS location\n' + error.message);
        setGettingLocation(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const getSafeLocation = async () => {
    if (!askLocation) {
      Alert.alert(
        'Message',
        'Location already uploaded, if you want to update your shop location. Please contact your admin in Directorate of Food, Govt. of KP',
      );
      return;
    }
    if (gettingLocation) {
      return;
    }
    setGettingLocation(true);
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

  const uploadLocation = (coords: Geolocation.GeoCoordinates) => {
    const data = new FormData();
    data.append('latitude', coords.latitude);
    data.append('longitude', coords.longitude);
    // console.log('payload', data);

    api
      .updateLocation(data)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          Alert.alert('Thank you', 'Your shop location has been updated');
          setAskLocation(false);
        }
        setGettingLocation(false);
      })
      .catch(error => {
        handleError(error);
        setGettingLocation(false);
      });
  };

  const getLocationBtn = () =>
    askLocation ? (
      <TouchableOpacity onPress={getSafeLocation} activeOpacity={0.8}>
        <View
          style={[
            styles.card,
            {
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            },
          ]}>
          {gettingLocation ? (
            <>
              <ActivityIndicator color={Color.White} size="large" />
              <Text
                style={[
                  styles.titleSmGreen,
                  {color: Color.White, textAlign: 'center', padding: 20},
                ]}>
                Getting your location
              </Text>
            </>
          ) : (
            <>
              <Icon
                name="shopping-store"
                type="Fontisto"
                color={Color.White}
                size={30}
              />
              <Text
                style={[
                  styles.titleSmGreen,
                  {color: Color.White, fontWeight: 'bold'},
                ]}>
                {'\n'}Upload location
              </Text>
              <Text
                style={[
                  styles.titleSmGreen,
                  {color: Color.White, textAlign: 'center', padding: 20},
                ]}>
                Please upload your store/shop location, make sure you are in
                your shop & then press this option.
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    ) : (
      <></>
    );

  const getContent = () => {
    if (User?.user_type == UserType.Contractor) {
      return (
        <>
          {notificationsCount > 0 && (
            <View style={styles.row}>
              <Box
                Icon={
                  <Icon
                    type="FontAwesome"
                    name="sign-out"
                    size={40}
                    style={{marginBottom: 20}}
                    color={Color.Blue}
                  />
                }
                title="Send PRC to PRC"
                onPress={() =>
                  navigation.navigate(Routes.PrNotificationsList, {
                    data: data,
                    prToPr: true,
                  })
                }
              />
            </View>
            // <Button
            //   mode="contained"
            //   onPress={() =>
            //     navigation.navigate(Routes.PrNotificationsList, {
            //       data: data,
            //       prToPr: true,
            //     })
            //   }
            //   style={[styles.btn, {width: 200}]}>
            //   Send PRC to PRC
            // </Button>
          )}

          <View style={styles.row}>
            <Box
              Icon={<Clipboard width={'60%'} height={'60%'} />}
              title="Send Stock"
              onPress={() => {
                if (data?.sub_allocation?.length > 0) {
                  navigation.navigate(Routes.SendStock, {
                    data: data,
                    prToPr: false,
                  });
                } else {
                  Alert.alert(
                    'Message',
                    'Looks like you do not have any assigned allocations',
                  );
                }
              }}
            />

            <Box
              Icon={
                <Icon
                  type="FontAwesome"
                  name="sign-out"
                  size={40}
                  style={{marginBottom: 20}}
                  color={Color.Blue}
                />
              }
              title="LOGOUT"
              onPress={() => dispatch(saveUser(undefined))}
            />
          </View>

          {/* <Text>{'\n'}</Text>

          <Button
            mode="contained"
            style={styles.btn}
            // loading={true}
            onPress={() => {
              // console.log('data', data);
              if (data?.sub_allocation?.length > 0) {
                navigation.navigate(Routes.SendStock, {
                  data: data,
                  prToPr: false,
                });
              } else {
                Alert.alert(
                  'Message',
                  'Looks like you do not have any assigned allocations',
                );
              }
            }}>
            Send Stock
          </Button>

          <Text>{'\n'}</Text>

          <Button
            mode="contained"
            style={styles.btn}
            // loading={true}
            onPress={() => {
              dispatch(saveUser(undefined));
            }}>
            Logout
          </Button> */}
        </>
      );
    } else if (User?.user_type == UserType.HFA_Officer) {
      return (
        <View style={styles.row}>
          {/* <Button
                    mode="contained"
                    style={styles.btn}
                    buttonColor={Color.Blue}
                    onPress={() => navigation.navigate(Routes.HFAInspection)}>
                    New Inspection
                </Button> */}
          <Box
            Icon={<Clipboard width={'60%'} height={'60%'} />}
            title="NEW INSPECTION"
            onPress={() => navigation.navigate(Routes.HFAInspection)}
          />
          <Box
            Icon={
              <Icon
                type="FontAwesome"
                name="sign-out"
                size={40}
                style={{marginBottom: 20}}
                color={Color.Blue}
              />
            }
            title="Logout"
            onPress={() => dispatch(saveUser(undefined))}
          />
        </View>
      );
    } else if (User?.user_type == UserType.Shop_Seller) {
      return (
        <>
          {/* <Box
                    Icon={<Clipboard width={'60%'} height={'60%'} />}
                    title="MILL INSPECTION"
                    onPress={() => navigation.navigate(Routes.MillsInspection)} /> */}

          <View style={styles.row}>
            <Box
              Icon={
                <Icon
                  type="FontAwesome"
                  name="users"
                  size={40}
                  style={{marginBottom: 20}}
                  color={Color.Blue}
                />
              }
              title="Sale Management"
              onPress={() => {
                if (stockTotal > 0) {
                  navigation.navigate(Routes.NIC_Scanner);
                } else {
                  Alert.alert(
                    'Message',
                    'Stock not available, if you have pending stock then please receive that first.\n\nThank you.',
                  );
                }
              }}
            />

            <Box
              Icon={
                <Icon
                  type="Ionicons"
                  name="list"
                  size={40}
                  style={{marginBottom: 20}}
                  color={Color.Blue}
                />
              }
              // Icon={<Clipboard width={'60%'} height={'60%'} />}
              title="Sale History"
              onPress={() => navigation.navigate(Routes.SellHsitory)}
            />
          </View>

          <View style={styles.row}>
            <Box
              Icon={
                <Icon
                  type="MaterialIcons"
                  name="pending-actions"
                  size={40}
                  style={{marginBottom: 20}}
                  color={Color.Blue}
                />
              }
              title="Pending Stock"
              onPress={() => {
                navigation.navigate(Routes.PendingStock);
              }}
            />

            <Box
              Icon={
                <Icon
                  type="MaterialCommunityIcons"
                  name="clipboard-check-outline"
                  size={40}
                  style={{marginBottom: 20}}
                  color={Color.Blue}
                />
              }
              // Icon={<Clipboard width={'60%'} height={'60%'} />}
              title="Received Stock"
              onPress={() => navigation.navigate(Routes.RecievedStock)}
            />
          </View>

          <View style={styles.row}>
            <Box
              Icon={
                <Icon
                  type="Ionicons"
                  name="ios-settings-sharp"
                  size={40}
                  style={{marginBottom: 20}}
                  color={Color.Blue}
                />
              }
              // Icon={<Clipboard width={'60%'} height={'60%'} />}
              title="Change Password"
              onPress={() => navigation.navigate(Routes.ChangePassword)}
            />

            <Box
              // Icon={<Icon type='FontAwesome' name='plus-square' size={40} style={{ marginBottom: 20, }} color={Color.Green} />}
              Icon={
                <Icon
                  type="Entypo"
                  name="help"
                  size={40}
                  style={{marginBottom: 20}}
                  color={Color.Blue}
                />
              }
              title="Video Tutorial"
              onPress={() => Linking.openURL(ytLInk)}
            />
          </View>

          <View style={styles.row}>
            <Box
              Icon={
                <Icon
                  type="FontAwesome"
                  name="sign-out"
                  size={40}
                  style={{marginBottom: 20}}
                  color={Color.Blue}
                />
              }
              title="Logout"
              onPress={() => dispatch(saveUser(undefined))}
            />

            <Box
              empty={true}
              Icon={
                <Icon
                  type="FontAwesome"
                  name="sign-out"
                  size={40}
                  style={{marginBottom: 20}}
                  color={Color.Blue}
                />
              }
              title="Logout"
              onPress={() => {}}
            />
          </View>
        </>
      );
    } else {
      return (
        <>
          {!askLocation && (
            <>
              <View style={styles.row}>
                <Box
                  Icon={
                    <Icon
                      type="FontAwesome"
                      name="users"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  title="Sale Management"
                  onPress={() => {
                    if (stockTotal > 0) {
                      navigation.navigate(Routes.DealerSellForm);
                    } else {
                      Alert.alert(
                        'Message',
                        'Stock not available, if you have pending stock then please receive that first.\n\nThank you.',
                      );
                    }
                  }}
                />

                <Box
                  Icon={
                    <Icon
                      type="MaterialIcons"
                      name="pin-drop"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  title="Active Transits"
                  onPress={() =>
                    navigation.navigate(Routes.DealerAttaActiveList)
                  }
                />
              </View>

              <View style={styles.row}>
                <Box
                  Icon={
                    <Icon
                      type="MaterialCommunityIcons"
                      name="truck-check-outline"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  title="Atta Receiving"
                  onPress={() => {
                    navigation.navigate(Routes.AttaReceiving);
                  }}
                />

                <Box
                  Icon={
                    <Icon
                      type="MaterialCommunityIcons"
                      name="note-check-outline"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  title="Atta Closing"
                  onPress={() => navigation.navigate(Routes.AttaClosing)}
                />
              </View>

              <View style={styles.row}>
                <Box
                  Icon={
                    <Icon
                      type="MaterialIcons"
                      name="pending-actions"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  title="Pending Stock"
                  onPress={() => {
                    // navigation.navigate(Routes.PendingStock)
                    navigation.navigate(Routes.PendingStock);
                  }}
                />

                <Box
                  Icon={
                    <Icon
                      type="MaterialCommunityIcons"
                      name="clipboard-check-outline"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  // Icon={<Clipboard width={'60%'} height={'60%'} />}
                  title="Received Stock"
                  onPress={() => navigation.navigate(Routes.RecievedStock)}
                />
              </View>

              <View style={styles.row}>
                <Box
                  Icon={
                    <Icon
                      type="Ionicons"
                      name="list"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  // Icon={<Clipboard width={'60%'} height={'60%'} />}
                  title="Sale History"
                  onPress={() => navigation.navigate(Routes.SellHsitory)}
                />

                <Box
                  Icon={
                    <Icon
                      type="Ionicons"
                      name="ios-settings-sharp"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  // Icon={<Clipboard width={'60%'} height={'60%'} />}
                  title="Change Password"
                  onPress={() => navigation.navigate(Routes.ChangePassword)}
                />
              </View>

              <View style={styles.row}>
                <Box
                  Icon={
                    <Icon
                      type="FontAwesome"
                      name="sign-out"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  title="Logout"
                  onPress={() => dispatch(saveUser(undefined))}
                />

                <Box
                  empty={true}
                  Icon={
                    <Icon
                      type="FontAwesome"
                      name="sign-out"
                      size={40}
                      style={{marginBottom: 20}}
                      color={Color.Blue}
                    />
                  }
                  title="Logout"
                  onPress={() => {}}
                />
              </View>
            </>
          )}
        </>
      );
    }
  };

  const getCheckPostUI = () => {
    return (
      <>
        <CheckpostHomeCard data={dealerResp} />
        <View style={styles.row}>
          <Box
            Icon={<ActiveTrasit width={'60%'} height={'60%'} />}
            title="Active Transits"
            // onPress={() => console.log('opening', Routes.CheckPostActiveList)}
            onPress={() => navigation.navigate(Routes.CheckPostActiveList)}
          />

          <Box
            // Icon={<Icon type='Ionicons' name='list' size={40} style={{ marginBottom: 20, }} color={Color.Blue} />}
            Icon={<Clipboard width={'60%'} height={'60%'} />}
            // title="Permit Verification"
            title="Today Summary"
            onPress={() => navigation.navigate(Routes.CheckpostSummary)}
          />
        </View>

        <View style={styles.row}>
          <Box
            // empty
            Icon={<Atta width={'70%'} height={'60%'} />}
            title="Atta Entry/Exit"
            // onPress={() => console.log('opening', Routes.TrackAtta)}
            onPress={() => navigation.navigate(Routes.TrackAtta)}
          />

          <Box
            Icon={
              <Wheat width={'60%'} height={'60%'} style={{marginBottom: 10}} />
            }
            title="Wheat Entry/Exit"
            // onPress={() => navigation.navigate(Routes.WheatClosing)}
            onPress={() => navigation.navigate(Routes.TrackWheat)}
          />
        </View>
        <View style={styles.row}>
          <Box
            Icon={
              <Icon
                type="FontAwesome"
                name="sign-out"
                size={40}
                style={{marginBottom: 20}}
                color={Color.Blue}
              />
            }
            title="Logout"
            onPress={() => dispatch(saveUser(undefined))}
          />

          <Box
            empty
            Icon={<Atta width={'70%'} height={'60%'} />}
            title="Atta Entry/Exit"
            // onPress={() => console.log('opening', Routes.TrackAtta)}
            onPress={() => {}}
          />
        </View>
      </>
    );
  };

  // console.log('Notification', notificationsCount);

  return (
    <Container>
      <View style={styles.fill}>
        {/* subtitle={User?.name} */}
        <Header
          title={getTitle()}
          handleRefresh={
            User?.user_type == UserType.Dealer ||
            User?.user_type == UserType.Shop_Seller
              ? refreshData
              : undefined
          }
        />

        <View style={styles.fill}>
          {isLoaing ? (
            <ActivityIndicator
              color={Color.Green}
              size="large"
              style={{flex: 1, alignSelf: 'center', margin: 40}}
            />
          ) : (
            <ScrollView>
              <View style={styles.content}>
                {User?.user_type == UserType.Checkpost ? (
                  getCheckPostUI()
                ) : (
                  <>
                    {User?.user_type == UserType.Officer ? (
                      <>
                        <View style={styles.row}>
                          <Box
                            Icon={<Clipboard width={'60%'} height={'60%'} />}
                            title="MILL INSPECTION"
                            onPress={() =>
                              navigation.navigate(Routes.MillsInspection)
                            }
                          />

                          <Box
                            Icon={<Shop width={'60%'} height={'60%'} />}
                            title="SHOP INSPECTION"
                            onPress={
                              () => setShowPopup(true)
                              // navigation.navigate(Routes.ShopsInspection)
                            }
                          />
                        </View>
                        <View style={styles.row}>
                          <Box
                            Icon={<DealerInsp width={'70%'} height={'70%'} />}
                            title="DEALER INSPECTION"
                            onPress={() =>
                              navigation.navigate(Routes.DealersInspection)
                            }
                          />

                          {/* <Box
                            Icon={<Shop width={'70%'} height={'70%'} />}
                            title="MY INSPECTIONS"
                            // onPress={() => {}}
                            // empty={true}
                            onPress={() =>
                              navigation.navigate(Routes.MyInspections)
                            }
                          /> */}
                          <Box
                            Icon={
                              <Icon
                                type="FontAwesome"
                                name="sign-out"
                                size={40}
                                style={{marginBottom: 20}}
                                color={Color.Blue}
                              />
                            }
                            title="LOGOUT"
                            onPress={() => dispatch(saveUser(undefined))}
                          />
                        </View>
                      </>
                    ) : (
                      <View>
                        {/* Showing Stock Quantity */}
                        {User?.user_type == UserType.Dealer ||
                        User?.user_type == UserType.Shop_Seller ? (
                          <>
                            <StockDetails />

                            {getLocationBtn()}

                            {/* TODO: remove "!" */}
                            {dealerResp?.pendingStock ? (
                              <View style={styles.tag}>
                                <Icon
                                  type="MaterialIcons"
                                  name="info-outline"
                                  color={Color.White}
                                />
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: Color.White,
                                    fontFamily: Fonts.UniNeueRegular,
                                  }}>
                                  {'  '}You have {dealerResp?.pendingStock} bags
                                  in pending stock to receive
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles.tag,
                                  {backgroundColor: Color.Green},
                                ]}>
                                {/* <Icon type='MaterialIcons' name='info-outline' color={Color.White} /> */}
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: Color.White,
                                    fontFamily: Fonts.UniNeueRegular,
                                  }}>
                                  {'  '}You have no pending stock to receive
                                </Text>
                              </View>
                            )}
                          </>
                        ) : (
                          <Text
                            style={[
                              styles.userName,
                              {color: '#000', fontSize: 20},
                            ]}>
                            Welcome {'\n' + User?.name}
                          </Text>
                        )}
                        {/* {User?.user_type == UserType.Contractor &&
                                        <View style={styles.row}>
                                            <Box
                                                Icon={<Card width={'60%'} height={'60%'} />}
                                                title="LIST OF DRIVERS"
                                                onPress={() => navigation.navigate(Routes.DriversList)} />

                                            <Box
                                                Icon={<Truck width={'60%'} height={'60%'} />}
                                                title="LIST OF VEHICLES"
                                                onPress={() => navigation.navigate(Routes.VehiclesList)} />
                                        </View>
                                    } */}

                        {getContent()}
                      </View>
                    )}
                  </>
                )}
                {/* {User?.user_type != UserType.Shop_Seller && User?.user_type != UserType.Dealer && User?.user_type != UserType.HFA_Officer ? <Button
                                    mode="contained"
                                    style={styles.btn}
                                    buttonColor={Color.Blue}
                                    onPress={() => dispatch(saveUser(undefined))}>
                                    Logout
                                </Button> : <></>} */}

                <Text style={styles.version}>Version 2.4.6</Text>
              </View>
            </ScrollView>
          )}
        </View>

        {/* <View style={styles.footer}>
          <Text style={styles.titleSm}>
            Powered by Directorate of Food, Govt. of KP
          </Text>
        </View> */}

        <Modal visible={updateAvailable} transparent>
          <View style={styles.overlay}>
            <View style={styles.box}>
              <Text style={styles.title1}>Message</Text>
              <Text style={styles.label}>
                You are using an old version of this app, please update your app
                from play store.
              </Text>

              <Button
                mode="contained"
                style={styles.btn}
                onPress={() =>
                  Linking.openURL(
                    'https://play.google.com/store/apps/details?id=com.ictapp.kp.foodapp',
                  )
                }>
                Update Now
              </Button>
            </View>
          </View>
        </Modal>
        <Modal
          transparent
          visible={showPopup}
          onRequestClose={() => setShowPopup(false)}>
          <View style={styles.overlay}>
            <View style={styles.contentModel}>
              <View style={styles.row}>
                <Text style={styles.titleModel}>Choose an option</Text>
                <Icon
                  name="close"
                  type="AntDesign"
                  size={20}
                  onPress={() => setShowPopup(false)}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Routes.ShopsInspection);
                  setShowPopup(false);
                }}>
                <View style={styles.item}>
                  <Icon
                    type="AntDesign"
                    name="plus"
                    size={30}
                    color={Color.textLight}
                  />
                  <Text style={styles.itemLabel}>New Inspection</Text>
                </View>
              </TouchableOpacity>

              <Divider style={styles.line} />

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Routes.PendingShopList);
                  setShowPopup(false);
                }}>
                <View style={styles.item}>
                  <Icon
                    type="Ionicons"
                    name="pencil"
                    size={30}
                    color={Color.textLight}
                  />
                  <Text style={styles.itemLabel}>Resume Inspection</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({
  ...CommonStyle,
  content: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    height: 200,
    backgroundColor: Color.Blue,
    borderRadius: moderateScale(10),
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // padding: 20
  },
  title: {
    fontSize: 25,
    color: Color.White,
    // fontFamily: Fonts.UniNeueBlack,
    fontWeight: 'bold',
  },
  titleSm: {
    fontSize: 12,
    color: Color.White,
  },
  titleSmGreen: {
    fontSize: 12,
    color: Color.Green,
  },
  footer: {
    backgroundColor: Color.Blue,
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    color: Color.White,
    marginVertical: 20,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 12,
  },
  tag: {
    backgroundColor: Color.Yellow,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    color: Color.White,
    fontSize: 12,
    textAlignVertical: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  version: {
    alignSelf: 'center',
    color: Color.textLight,
    fontFamily: Fonts.UniNeueRegular,
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10),
    fontSize: 12,
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleModel: {
    fontFamily: Fonts.UniNeueBold,
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  contentModel: {
    padding: 20,
    maxHeight: 600,
    backgroundColor: Color.White,
    borderRadius: 10,
    overflow: 'hidden',
    width: 300,
  },
  box: {
    backgroundColor: Color.White,
    borderRadius: 20,
    width: 250,
    padding: 20,
  },
  title1: {
    fontFamily: Fonts.UniNeueBold,
    alignSelf: 'center',
  },
  label: {
    fontFamily: Fonts.UniNeueRegular,
    marginTop: 20,
    marginBottom: 20,
  },
  btn: {
    width: 150,
    alignSelf: 'center',
    // height: 40
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  itemLabel: {
    fontFamily: Fonts.UniNeueRegular,
    marginLeft: 15,
  },
  line: {
    marginTop: 10,
  },
});
