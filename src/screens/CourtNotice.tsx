import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import {moderateScale} from 'react-native-size-matters';
import ViewShot from 'react-native-view-shot';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../api';
import LogoSimple from '../assets/svg/LogoSimple';
import {Color, Fonts, Routes} from '../common/Constants';
import {UserProfile} from '../common/Type';
import {getCode, getDataFrom, handleError} from '../common/Utils';
import Container from '../components/Container';
import DateTimePickerInput from '../components/DateTimePickerInput';
import Header from '../components/Header';
import PrinterManager from '../components/PrinterManager';
import {RootState} from '../redux/store';

interface CourtNoticeProps {}

const CourtNotice = (props: CourtNoticeProps) => {
  console.log('Propsssss', props.route.params.text);

  const titleShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const headerShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const generatShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const contentShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();
  const qrShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();

  const [isLoaing, setIsLoading] = React.useState(true);
  const [showPrinter, setShowPrinter] = React.useState(false);
  const [printing, setPrinting] = React.useState(false);
  const [imgPath, setImgPath] = React.useState('');
  const [magistrateName, setMagistrateName] = React.useState('');
  const [inspectDate, setInspectDate] = React.useState(new Date());
  // const [shopAddress, setShopAddress] = React.useState("")
  const [challan, setChallan] = React.useState();
  const [officerName, setOfficerName] = React.useState('-');
  const [voilations, setVoilations] = React.useState('-');

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  // console.log('user', User);
  const navigation = useNavigation();
  const {params} = useRoute();
  const {trackingId} = useRoute().params;
  // console.log('params', params);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const isDataOk = () => {
    if (magistrateName.trim() == '') {
      Alert.alert('Message', 'Please enter magistrate name');
      return false;
    }
    // else if (shopAddress.trim() == "") {
    //     Alert.alert("Message", "Please enter shop address")
    //     return false
    // }
    return true;
  };

  const printNotice = async () => {
    if (!isDataOk()) {
      return;
    }

    setPrinting(true);
    const titleUri = await titleShot.current?.capture();
    const generateUri = await generatShot.current?.capture();
    const headerUri = await headerShot.current?.capture();
    const contentUri = await contentShot.current?.capture();
    const qrUri = await qrShot.current?.capture();

    setImgPath(
      '[C]<img>' +
        titleUri +
        '</img>\n' +
        '[C]<img>https://raw.githubusercontent.com/geek-ibrar/tmp_files/master/food-logo-bw-sm.jpg</img>\n' +
        '[C]<img>' +
        generateUri +
        '</img>\n\n' +
        '[C]<img>' +
        qrUri +
        '</img>\n\n' +
        '[C]<img>' +
        headerUri +
        '</img>\n' +
        '[C]<img>' +
        contentUri +
        '</img>\n',
    );
    setShowPrinter(true);
    setPrinting(false);
  };

  const onNext = async () => {
    if (!isDataOk()) {
      return;
    }
    navigation.navigate(Routes.Home);
  };

  const getChallanData = () => {
    const payload = new FormData();
    payload.append('inspection_shop_id', params?.data?.id);
    // console.log('payload', payload);

    api
      .getShopEChallan(payload)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          const {inspection_data} = respData;
          // console.log('resp-data e chalan', JSON.stringify(inspection_data));
          setChallan({...inspection_data, tracking_url: respData.tracking_url});
          try {
            setOfficerName(inspection_data?.inspection?.officers[0]?.user.name);
            setVoilations(
              inspection_data.shop_violations
                .map((v: any) => v.title)
                .join(','),
            );
          } catch (error) {
            // console.log('error', error);
          }
        }
        setIsLoading(false);
      })
      .catch(error => {
        handleError(error);
        setIsLoading(false);
      });
  };

  const getOwnerName = () => {
    return challan?.shops[0]?.owner_name;
  };

  const getBusinessAddress = () => {
    return challan?.shops[0]?.address || +'-';
  };

  React.useEffect(() => {
    getChallanData();
  }, []);

  return (
    <Container hideBg={true}>
      <Header title="Court Notice" />
      {isLoaing ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : challan ? (
        <>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.card}>
                <Text style={styles.heading3}>Enter Details</Text>
                <TextInput
                  mode="flat"
                  label={'Magistrate Name'}
                  placeholder={'Full Name'}
                  value={magistrateName}
                  onChangeText={setMagistrateName}
                  style={styles.input}
                  returnKeyType="done"
                />

                <DateTimePickerInput
                  label="Hearing Date"
                  date={inspectDate}
                  style={styles.input}
                  mode={'date'}
                  format={'DD-MMM-yyyy'}
                  onChange={setInspectDate}
                />

                {/* <TextInput
                                mode="flat"
                                label={"Shop Address"}
                                placeholder={"Enter address"}
                                value={shopAddress}
                                onChangeText={setShopAddress}
                                style={styles.input}
                                returnKeyType='done'
                            /> */}
              </View>
              <ViewShot
                ref={titleShot}
                options={{
                  fileName: 'notice_title',
                  format: 'jpg',
                  quality: 0.9,
                }}>
                <>
                  <View style={styles.header}>
                    <Text
                      style={[
                        styles.heading1,
                        {textAlign: 'center', fontSize: 18, padding: 10},
                      ]}>
                      Directorate of Food{'\n'}Govt of Khyber Pakhtunkhwa
                    </Text>
                  </View>
                </>
              </ViewShot>

              <LogoSimple style={{transform: [{scale: 0.6}]}} hideTxt={true} />

              <ViewShot
                ref={generatShot}
                options={{
                  fileName: 'challan_header',
                  format: 'jpg',
                  quality: 0.9,
                }}>
                <View style={styles.header}>
                  <Text style={styles.heading1}>
                    {props?.route?.params?.text === 'Notice'
                      ? 'e-Notice'
                      : 'e-Marasla'}
                  </Text>
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
                    // size={30}
                  />
                </ViewShot>
              </View>

              <ViewShot
                ref={headerShot}
                options={{
                  fileName: 'notice_header',
                  format: 'jpg',
                  quality: 0.9,
                }}>
                <View style={styles.header}>
                  {props?.route?.params?.text === 'Notice' ? (
                    <Text style={styles.heading2}>نوٹس برائے حاضری عدالت</Text>
                  ) : (
                    <Text style={styles.heading2}>
                      مراسلہ برائے حاضری عدالت
                    </Text>
                  )}
                  <Text style={[styles.txtSm, {paddingHorizontal: 10}]}>
                    فرسٹ کلاس مجسٹریٹ: {magistrateName}
                  </Text>
                </View>
              </ViewShot>

              <ViewShot
                ref={contentShot}
                options={{
                  fileName: 'notice_header',
                  format: 'jpg',
                  quality: 0.9,
                }}>
                <View style={styles.header}>
                  {/* <Text style={styles.txtSm}>اسسٹنٹ فوڈ کنٹرولر پشاور</Text> */}
                  <Text style={styles.txtSm}>{officerName}: افسر </Text>
                  <Text style={styles.txtSm}>
                    {moment(inspectDate).format('DD-MMM-yyyy') + ' :'}مورخہ
                    حاضری
                  </Text>
                  <Text style={styles.txtSm}>
                    {getOwnerName()} : دکاندار کا نام
                  </Text>
                  {/* <Text style={styles.txtSm}>{''} : شناختی کارڈ نمبر</Text> */}
                  <Text style={styles.txtSm}>
                    {getBusinessAddress()} : دکان کا پتہ
                  </Text>
                  <Text style={styles.txtSm}>Voilations: {voilations}</Text>
                </View>
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
              onPress={printNotice}>
              Print
            </Button>

            <Button
              mode="contained"
              style={styles.btn}
              // loading={printing}
              onPress={onNext}>
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

export default CourtNotice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrCode: {
    width: 100,
    height: 100,
    backgroundColor: Color.textLight,
    marginTop: 20,
    marginBottom: 20,
    // backgroundColor: 'white',
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
  heading3: {
    fontFamily: Fonts.UniNeueHeavy,
    fontSize: 16,
    margin: 10,
  },
  txtSm: {
    fontFamily: Fonts.Urdu,
    fontSize: 20,
    textAlign: 'center',
    // marginTop: 2,
  },
  btn: {
    // position: 'absolute',
    bottom: 0,
    maxWidth: 200,
    // flex: 1,
    width: '40%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f3f3f3',
    width: '100%',
    padding: 15,
    borderRadius: 10,
  },
  input: {
    marginBottom: moderateScale(20),
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
  },
});
