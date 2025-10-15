import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import {Text, View, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import {
  request,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
import ViewShot from 'react-native-view-shot';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../api';
import LogoSimple from '../assets/svg/LogoSimple';
import {Color, Constants, Fonts, Routes} from '../common/Constants';
import {UserProfile} from '../common/Type';
import {getCode, getDataFrom, handleError} from '../common/Utils';
import Container from '../components/Container';
import Header from '../components/Header';
import PrinterManager from '../components/PrinterManager';
import {RootState} from '../redux/store';

interface EchallanProps {}

const Echallan = (props: EchallanProps) => {
  const {data, shopInspection, trackingId, inspection} = useRoute().params;

  const [isLoaing, setIsLoading] = React.useState(true);
  const [challan, setChallan] = React.useState();
  const [officerName, setOfficerName] = React.useState('-');
  const [voilations, setVoilations] = React.useState('-');
  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const [showPrinter, setShowPrinter] = React.useState(false);
  const [printing, setPrinting] = React.useState(false);
  const [imgPath, setImgPath] = React.useState('');

  const titleShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const headerShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const qrShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const officerShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const amountShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const footerShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const navigation = useNavigation();

  const getOwnerName = () => {
    if (inspection == Routes.MillsInspection) {
      return challan?.mills[0]?.owner_name;
    } else if (inspection == Routes.ShopsInspection) {
      return challan?.shops[0]?.owner_name;
    } else {
      return challan?.dealers[0]?.owner_name;
    }
    // shopInspection ? challan?.shops[0]?.owner_name : challan?.mills[0]?.owner_name
  };
  const getBusinessName = () => {
    if (inspection == Routes.MillsInspection) {
      return challan?.mills[0]?.name;
    } else if (inspection == Routes.ShopsInspection) {
      return challan?.shops[0]?.title;
    } else {
      return challan?.dealers[0]?.business_title;
    }
    // shopInspection ? challan?.shops[0]?.title : challan?.mills[0]?.name
  };

  const getTitle = () => (shopInspection ? 'Shop' : 'Mill');

  const printInvoice = async () => {
    setPrinting(true);
    const titleUri = await titleShot.current?.capture();
    const headerUri = await headerShot.current?.capture();
    const qrUri = await qrShot.current?.capture();
    const officerUri = await officerShot.current?.capture();
    const amountUri = await amountShot.current?.capture();
    const footerUri = await footerShot.current?.capture();

    console.log('titleUri', titleUri);
    console.log('headerUri', headerUri);
    console.log('qrUri', qrUri);
    console.log('officerUri', officerUri);
    console.log('amountUri', amountUri);
    console.log('footerUri', footerUri);

    // setImgPath(
    //   '[C]<font size='normal'><b>Directorate of Food </b></font> \n' +
    //     '[C]<b>Govt of Khyber Pakhtunkhwa </b> \n' +
    //     '[C]<img>https://raw.githubusercontent.com/geek-ibrar/tmp_files/master/food-logo-bw-sm.jpg</img>\n' +
    //     '[C]<font size='normal'><b>e-Challan </b></font> \n' +
    //     '[C]Tracking # ' +
    //     trackingId +
    //     '[C]\n' +
    //     '[C]Generated on: #  \n' +
    //     moment(new Date(challan?.created_at)).format('dddd, MMMM DD, yyyy') +
    //     '[C]\n\n' +
    //     '[C]<img>' +
    //     qrUri +
    //     '</img>\n' +
    //     '[C]\n' +
    //     '[L]<b>Due Amount : </b>' +
    //     ' [R]<b>Rs. </b>' +
    //     challan?.fine +
    //     '[C]\n' +
    //     '[L]Officer Name:' +
    //     '[R]' +
    //     officerName +
    //     '[C]\n' +
    //     '[L]Violations:' +
    //     '[R]' +
    //     voilations +
    //     '[C]\n' +
    //     '[L]Owner Name:' +
    //     '[R]' +
    //     getOwnerName() +
    //     '[C]\n' +
    //     '[L]Business Name:' +
    //     '[R]' +
    //     getBusinessName() +
    //     '[C]\n\n' +
    //     '[C]<b>Please deposite due </b> \n' +
    //     '[C]<b>amount in the DFC Office</b> \n',
    // );

    setImgPath(
      '[C]<img>' +
        titleUri +
        '</img>\n' +
        '[C]<img>https://raw.githubusercontent.com/geek-ibrar/tmp_files/master/food-logo-bw-sm.jpg</img>\n' +
        '[C]<img>' +
        headerUri +
        '</img>\n' +
        '[C]<img>' +
        qrUri +
        '</img>\n' +
        '[C]<img>' +
        officerUri +
        '</img>\n' +
        '[C]<img>' +
        amountUri +
        '</img>\n' +
        '[C]<img>' +
        footerUri +
        '</img>',
    );
    setShowPrinter(true);
    setPrinting(false);
  };

  const gotoHome = () => {
    navigation.navigate(Routes.Home);
  };

  const getChallanData = () => {
    const payload = new FormData();
    // payload.append(shopInspection ? "inspection_shop_id" : "inspection_mill_id", data.id)
    // let request = shopInspection ? api.getShopEChallan(payload) : api.getEChallan(payload)
    let request = undefined;
    if (inspection == Routes.MillsInspection) {
      payload.append('inspection_mill_id', data.id);
      request = api.getEChallan(payload);
    } else if (inspection == Routes.ShopsInspection) {
      payload.append('inspection_shop_id', data.id);
      request = api.getShopEChallan(payload);
    } else {
      payload.append('inspection_dealer_id', data.id);
      request = api.getDealerEChallan(payload);
    }
    // console.log('payload', payload);

    request
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          const {inspection_data} = respData;
          console.log('resp-data', JSON.stringify(inspection_data.inspection));
          setChallan({...inspection_data, tracking_url: respData.tracking_url});
          try {
            setOfficerName(inspection_data?.inspection?.officers[0]);
            if (shopInspection) {
              setVoilations(
                inspection_data.shop_violations.map(v => v.title).join(','),
              );
            }
          } catch (error) {
            console.log('error', error);
          }
        }
        setIsLoading(false);
      })
      .catch(error => {
        handleError(error);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    getChallanData();
    // initPrinter()
  }, []);

  // console.log('User echalar', JSON.stringify(User.company.district.title));

  return (
    <Container hideBg={true}>
      <Header title="E-Challan" />
      {isLoaing ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : challan ? (
        <>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.container}>
              <View
                style={{
                  alignItems: 'center',
                  height: 300,
                  backgroundColor: 'white',
                }}>
                <ViewShot
                  ref={titleShot}
                  options={{
                    fileName: 'challan_title',
                    format: 'jpg',
                    quality: 0.9,
                  }}>
                  <>
                    <View style={styles.header}>
                      {User.username === 'dfcpeshawar' ? (
                        <Text
                          style={[
                            styles.heading1,
                            {textAlign: 'center', fontSize: 18},
                          ]}>
                          Office of Rashning Food Controller {'\n'}
                          {User?.company?.district?.title}
                        </Text>
                      ) : (
                        <Text
                          style={[
                            styles.heading1,
                            {textAlign: 'center', fontSize: 18},
                          ]}>
                          Office of District Food Controller {'\n'}
                          {User?.company?.district?.title}
                        </Text>
                      )}
                    </View>
                  </>
                </ViewShot>
                <LogoSimple
                  style={{transform: [{scale: 0.6}]}}
                  hideTxt={true}
                />
                <ViewShot
                  ref={headerShot}
                  options={{
                    fileName: 'challan_header',
                    format: 'jpg',
                    quality: 0.9,
                  }}>
                  <View style={styles.header}>
                    <Text style={styles.heading1}>e-Challan</Text>
                    <Text style={styles.heading2}>Tracking # {trackingId}</Text>
                    {/* <Text style={styles.heading2}>Tracking # {challan?.tracking_id}</Text> */}
                    <Text style={styles.txtSm}>
                      Generated on:{' '}
                      {'\n' +
                        moment(new Date(challan?.created_at)).format(
                          'dddd, MMMM DD, yyyy',
                        )}
                    </Text>
                  </View>
                </ViewShot>

                <View style={styles.qrCode}>
                  <ViewShot
                    ref={qrShot}
                    options={{
                      fileName: 'challan_officer_name',
                      format: 'jpg',
                      quality: 0.9,
                    }}>
                    <QRCode
                      value={getCode(challan)}
                      backgroundColor={Color.White}
                      size={79}
                    />
                  </ViewShot>
                </View>
              </View>

              <ViewShot
                ref={officerShot}
                options={{
                  fileName: 'challan_officer_name',
                  format: 'jpg',
                  quality: 0.9,
                }}>
                <>
                  <View style={[styles.row]}>
                    <Text style={styles.heading1}>Due Amount:</Text>
                    <Text style={styles.heading1}>
                      Rs. {challan?.fine || 0}
                    </Text>
                  </View>
                  <View style={[styles.row]}>
                    <Text style={styles.heading2}>Officer Name:</Text>
                    <Text style={styles.headingrole}>
                      {officerName?.user?.name +
                        ' ' +
                        `(${officerName?.user?.roles[0]?.name})`}
                    </Text>
                  </View>
                </>
              </ViewShot>

              <ViewShot
                ref={amountShot}
                options={{
                  fileName: 'challan_amount',
                  format: 'jpg',
                  quality: 0.9,
                }}>
                <>
                  {shopInspection && (
                    <View style={[styles.row]}>
                      <Text style={styles.heading2}>Voilations:</Text>
                      <Text
                        style={[
                          styles.headingrole,
                          {textAlign: 'right', width: '50%'},
                        ]}>
                        {voilations}
                      </Text>
                    </View>
                  )}
                  <View style={styles.row}>
                    <Text style={styles.heading2}>Owner Name:</Text>
                    <Text style={styles.headingrole}>{getOwnerName()}</Text>
                  </View>
                </>
              </ViewShot>

              <ViewShot
                ref={footerShot}
                options={{
                  fileName: 'challan_footer',
                  format: 'jpg',
                  quality: 0.9,
                }}>
                <>
                  <View style={styles.row}>
                    <Text style={styles.heading2}>Business Name:</Text>
                    <Text style={styles.headingrole}>{getBusinessName()}</Text>
                  </View>
                  <View style={styles.header}>
                    <Text style={[styles.heading1, {textAlign: 'center'}]}>
                      Please deposit due{'\n'}
                      amount in the DFC Office{'\n'}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                      }}>{`@${User?.company?.district?.title}`}</Text>
                  </View>
                </>
              </ViewShot>
            </View>
          </ScrollView>

          <View
            style={{
              width: '100%',
              backgroundColor: '#f3f3f3',
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Button
              mode="contained"
              style={styles.btn}
              loading={printing}
              onPress={printInvoice}>
              Print
            </Button>

            <Button
              mode="contained"
              style={styles.btn}
              // loading={printing}
              onPress={gotoHome}>
              Close
            </Button>
          </View>
        </>
      ) : (
        <Text>Failed to get data</Text>
      )}

      <PrinterManager
        show={showPrinter}
        payload={imgPath}
        onClose={() => setShowPrinter(false)}
      />
    </Container>
  );
};

export default Echallan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff'
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  heading1: {
    fontFamily: Fonts.UniNeueHeavy,
    fontSize: 20,
  },
  heading2: {
    fontFamily: Fonts.UniNeueBold,
    fontSize: 14,
  },
  headingrole: {
    fontSize: 14,
  },
  txtSm: {
    fontFamily: Fonts.UniNeueRegular,
    fontSize: 14,
    textAlign: 'center',
  },
  qrCode: {
    width: 80,
    height: 80,
    backgroundColor: Color.textLight,
    marginTop: 10,
    // backgroundColor: 'white',
  },
  divider: {
    width: '100%',
    height: 0.4,
    backgroundColor: Color.textLight,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  txtLg: {
    fontFamily: Fonts.UniNeueRegular,
    fontSize: 14,
    textAlign: 'center',
  },
  txtLgBold: {
    fontFamily: Fonts.UniNeueBold,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '50%',
  },
  btn: {
    // position: 'absolute',
    bottom: 0,
    maxWidth: 200,
    width: '40%',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
