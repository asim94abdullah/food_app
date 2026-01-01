import { useNavigation } from '@react-navigation/native';
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
import { Button, IconButton, TextInput, Card } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../api';
import {
  Color,
  Fonts,
  InputType,
  Routes,
} from '../../common/Constants';
import { TypeDropdownItem, TypeFile, UserProfile } from '../../common/Type';
import { getDataFrom, getDataFrom1, handleError, isValidCnic, isValidPhone } from '../../common/Utils';
import Dropdown from '../../components/Dropdown';
import FileUploader from '../../components/FileUploader';
import MultiSelect from '../../components/MultiSelect';
import RadioButtonsYesNo from '../../components/RadioButtonsYesNo';
import { RootState } from '../../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import MaskInput from 'react-native-mask-input';

interface ShopVoilationsProps {
  onNext: (data: any, amoutn: string, shop: TypeDropdownItem) => void;
  _commonData: any;
  _step1Response: any;
}

const isIos = Platform.OS == 'ios';
const OtherVoilationId = 6;
const ShopVoilations = ({
  onNext,
  _commonData,
  _step1Response,
}: ShopVoilationsProps) => {
  // console.log('_commonData', _commonData.inspectionActions);
  // console.log('_step1Response', _step1Response);

  const scrollView = React.useRef();
  const [shopType, setShopType] = React.useState<
    TypeDropdownItem | undefined
  >();
  const [voilationStatus, setVoilationStatus] = React.useState<any>([]);
  const [shop, setShop] = React.useState<TypeDropdownItem | undefined>();
  const [violation, setViolation] = React.useState<TypeDropdownItem[]>([]);
  const [sendingData, setSendingData] = React.useState(false);
  const [fineAmount, setFinedAmount] = React.useState('');
  const [otherVoilation, setOtherVoilation] = React.useState('');
  const [voilationDesc, setVoilationDesc] = React.useState('');
  const [attachment, setAttachment] = React.useState<TypeFile[]>([]);
  const [attachmentIds, setAttachmentIds] = React.useState<string[]>([]);
  const [voilationradio, setVoilationRadio] = React.useState(false);
  const [gettingMillStats, setGettingMillStats] = React.useState(false);
  const [millStats, setMillStats] = React.useState(undefined);

  const [ownerName, setOwnerName] = React.useState('');
  const [ownerContact, setOwnerContact] = React.useState('');
  const [ownerCnic, setOwnerCnic] = React.useState('');

  const [shopsList, setShopsList] = React.useState<TypeDropdownItem[]>(
    _commonData.shops,
  );

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const btnClick = () => {
    console.log('btn click', typeof voilationradio);

    if (!shopType) {
      Alert.alert('Message', 'Please select shop type');
      return;
    } else if (!shop) {
      Alert.alert('Message', 'Please select shop');
      return;
    }
    // else if (attachmentIds.length < 1) {
    //   Alert.alert(
    //     'Message',
    //     'Please attach an image/video & wait for upload to complete',
    //   );
    //   return;
    // }

    setSendingData(true);
    const payload = new FormData();
    let inspection_id = _step1Response?.inspection?.id
      ? _step1Response?.inspection?.id
      : _step1Response?.id;
    payload.append('id', inspection_id);
    payload.append('shop_type_id', shopType.id);
    payload.append('shop_id', shop.id);
    payload.append('owner_name', ownerName.trim() || '');
    payload.append('owner_contact', ownerContact.trim()?.replaceAll(" ", "") || '');
    payload.append('owner_cnic', ownerCnic.trim()?.replaceAll("-", "") || '');

    // payload.append('fine', fineAmount || 0);
    // payload.append(
    //   'violation_ids',
    //   violation.length > 0 ? violation.map(i => i.id).join(',') : '',
    // );
    // payload.append('other_violation', otherVoilation);
    // payload.append('attachment_ids', attachmentIds.join(','));
    // payload.append('is_violation', voilationradio);
    // console.log('payload', payload);

    api
      .sendShopStep2Data(payload)
      .then(response => {
        const respData = getDataFrom(response);
        // console.log('data comming from', JSON.stringify(respData));
        if (respData) {
          Alert.alert(
            'Inspection Successfull',
            'Inspection data added successfully!',
            [
              {
                text: 'OK',
                onPress: () =>
                  onNext(
                    respData.inspection_shop,
                    fineAmount,
                    shop,
                    voilationStatus?.title,
                  ),
              },
            ],
          );

          // setMill(undefined)
          // setAttachments([])
          // setAttachmentIds([])
          // setIsFined(false)
          // setFinedAmount("")
          // setIsWarned(false)
          // setIsSuspend(false)
          // setIsSealed(false)
          // form.current?.clearData()
          // scrollView.current?.scrollTo({
          //     y: 0,
          //     animated: true,
          // });
        }
        setSendingData(false);
      })
      .catch(error => {
        console.log('error', error);

        handleError(error);
        setSendingData(false);
      });
  };
  const btnClickWithVoilation = () => {
    if (!shopType) {
      Alert.alert('Message', 'Please select shop type');
      return;
    } else if (!shop) {
      Alert.alert('Message', 'Please select shop');
      return;
    } else if (!ownerName.trim()) {
      Alert.alert('Message', 'Please enter shop owner name');
      return;
    } else if (!isValidPhone(ownerContact.trim())) {
      Alert.alert('Message', 'Please enter valid shop owner contact');
      return;
    } else if (!isValidCnic(ownerCnic.trim())) {
      Alert.alert('Message', 'Please enter valid shop owner cnic');
      return;
    } else if (violation.length === 0) {
      Alert.alert('Message', 'Please select violation');
      return;
    } else if (violation.length > 0 && voilationDesc === '') {
      Alert.alert('Message', 'Please enter description for voilations');
      return;
    } else if (!voilationStatus) {
      Alert.alert('Message', 'Please select voilation status');
      return;
    } else if (voilationStatus?.title === 'Fine' && fineAmount === '') {
      Alert.alert('Message', 'Please enter the fine');
      return;
    }
    // else if (attachmentIds.length < 1) {
    //   Alert.alert(
    //     'Message',
    //     'Please attach an image/video & wait for upload to complete',
    //   );
    //   return;
    // }

    setSendingData(true);
    const payload = new FormData();
    let inspection_id = _step1Response?.inspection?.id
      ? _step1Response?.inspection?.id
      : _step1Response?.id;

    payload.append('id', inspection_id);
    payload.append('shop_type_id', shopType.id);
    payload.append('shop_id', shop.id);
    payload.append('fine', fineAmount || 0);
    payload.append('violation_ids', violation.map(i => i.id).join(','));
    payload.append('other_violation', otherVoilation);
    payload.append('attachment_ids', attachmentIds.join(','));
    payload.append('is_violation', voilationradio);
    payload.append('inspection_action_id', voilationStatus?.id);
    payload.append('owner_name', ownerName.trim() || '');
    payload.append('owner_contact', ownerContact.trim()?.replaceAll(" ", "") || '');
    payload.append('owner_cnic', ownerCnic.trim()?.replaceAll("-", "") || '');


    console.log('Payload', payload);
    api
      .sendShopStep2Data(payload)
      .then(response => {
        const respData = getDataFrom(response);
        // console.log('Data response', respData.inspection_shop);

        if (respData) {
          Alert.alert(
            'Inspection Successfull',
            'Inspection data added successfully!',
            [
              {
                text: 'OK',
                onPress: () =>
                  onNext(
                    {
                      ...respData.inspection_shop,
                      owner_name: ownerName.trim(),
                      owner_contact: ownerContact.trim(),
                      owner_cnic: ownerCnic.trim(),
                    },
                    fineAmount,
                    shop,
                    voilationStatus?.title,
                  ),
              },
            ],
          );
        }
        setSendingData(false);
      })
      .catch(error => {
        handleError(error);
        setSendingData(false);
      });
  };

  const addShop = (data: any) => {
    // console.log('shop.license_number', data.data.shop);
    // console.log('new-shop', shopsList);
    try {
      // Check if shop already exists using license number
      const isDuplicate = shopsList.some(
        shop => shop?.license_number === data?.data?.shop?.license_number,
      );
      console.log('isDuplicate', isDuplicate);
      if (isDuplicate) {
      } else {
        let data1 = {
          id: data?.data?.shop?.id,
          license_number: data?.data?.shop?.license_number,
          title: data?.data?.shop?.title,
        };

        const newList = [...shopsList, data1];
        // console.log('added', data1);
        setShopsList(newList);
      }
    } catch (error) {
      console.error('Error adding shop:', error);
    }
    // try {
    //   const list = [...shopsList];
    //   list.unshift(data.shop);
    //   // console.log('updt-list', list);
    //   setShopsList(data.data.shop);
    // } catch (error) {
    //   console.log('error', error);
    // }
    navigation.goBack();
  };

  const updateAttachments = (fieldId: string, file?: TypeFile, index?: any) => {
    let _attachments = [...attachment];
    let _attachmentIds = [...attachmentIds];
    if (file) {
      _attachments.push(file);
    } else if (index != undefined) {
      _attachments.splice(index, 1);
      _attachmentIds.splice(index, 1);
      setAttachmentIds(_attachmentIds);
    }
    setAttachment(_attachments);
  };

  const addFileId = (id: string) => {
    // save uploaded file ID, its removed in `updateAttachments()`
    let _attachmentIds = [...attachmentIds];
    _attachmentIds.push(id);
    // console.log('image uploaded', id);

    setAttachmentIds(_attachmentIds);
  };

  React.useEffect(() => {
    setShopsList(_commonData.shops);
  }, [_commonData]);

  React.useEffect(() => {
    if (!shop) {
      return;
    }
    setGettingMillStats(true);
    api
      .getShopStats(shop.id)
      .then(response => {
        const respData = getDataFrom1(response);
        if (respData) {
          console.log('shop_response', respData);
          setMillStats(respData?.data);
        }
        setGettingMillStats(false);
      })
      .catch(error => {
        handleError(error);
        setGettingMillStats(false);
        setMillStats(undefined);
      });
  }, [shop]);

  React.useEffect(() => {
    setGettingMillStats(true);
    api
      .getShopbyCategory(shopType?.id)
      .then(response => {
        const respData = getDataFrom1(response);
        if (respData) {
          // console.log(
          //   'shop_Type_response',
          //   JSON.stringify(respData.data.shops),
          // );
          setShopsList(respData?.data?.shops);
        }
        setGettingMillStats(false);
      })
      .catch(error => {
        handleError(error);
        setGettingMillStats(false);
        // setMillStats(undefined);
      });
  }, [shopType]);

  // React.useEffect(() => {
  //   if (violation?.id != OtherVoilationId) {
  //     setOtherVoilation('');
  //   }
  // }, [violation]);

  const ShopStatus = () => {
    // console.log('millStats', millStats);

    return gettingMillStats ? (
      <ActivityIndicator
        color={Color.Blue}
        size="large"
        style={{ alignSelf: 'center', margin: 20, marginBottom: 40 }}
      />
    ) : millStats ? (
      <Card style={styles.card}>
        <Card.Content>
          <View style={[styles.colom]}>
            <Text style={{ fontWeight: '700', color: '#000', fontSize: 14 }}>
              Inspection History Of
            </Text>
            <Text style={{ fontWeight: '700', color: '#000', fontSize: 14 }}>
              {millStats?.shop_title}
            </Text>
          </View>
          <Card.Content>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Total Inspections: </Text>
                <Text style={styles.txtSmall}>
                  {millStats?.totalInspections}
                </Text>
              </View>

              <View style={styles.cell}>
                <Text style={styles.txtBold}>Imprisoned</Text>
                <Text style={styles.txtSmall}>
                  {millStats?.countImprisoned}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Marasla: </Text>
                <Text style={styles.txtSmall}>{millStats?.countMarasla}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Warning: </Text>
                <Text style={styles.txtSmall}>{millStats?.countWarning}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Fine Amount: </Text>
                <Text style={styles.txtSmall}>{millStats?.fineAmount}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Notice: </Text>
                <Text style={styles.txtSmall}>{millStats?.countNotice}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Fine: </Text>
                <Text style={styles.txtSmall}>{millStats?.countFine}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Others: </Text>
                <Text style={styles.txtSmall}>{millStats?.countOther}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Last Inspected: </Text>
                <Text style={styles.txtSmall}>
                  {millStats?.lastInspectionDate}
                </Text>
              </View>
              {/* <View style={styles.cell}>
                <Text style={styles.txtBold}>Total Inspections: </Text>
                <Text style={styles.txtSmall}>
                  {millStats?.totalInspections}
                </Text>
              </View> */}
            </View>
          </Card.Content>
        </Card.Content>
      </Card>
    ) : (
      <></>
    );
  };

  // console.log('setMillStats', millStats);

  return (
    <ScrollView style={{ marginVertical: 40 }}>
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <Dropdown
            data={_commonData.shop_types}
            onItemSelect={setShopType}
            label="Choose Shop Type"
            value={shopType}
            style={styles.input}
          />

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Dropdown
                data={shopsList}
                onItemSelect={setShop}
                label="Choose Shop/Businesses"
                value={shop}
                style={styles.input}
              />
              <ShopStatus />
            </View>

            <IconButton
              icon="plus"
              mode="contained"
              iconColor={Color.White}
              containerColor={Color.Green}
              size={20}
              onPress={() =>
                navigation.navigate(Routes.AddShop, {
                  shopType: _commonData.shop_types,
                  addShop: addShop,
                })
              }
            />
          </View>

          <TextInput
            label="Owner Name"
            value={ownerName}
            style={styles.input}
            onChangeText={setOwnerName}
          />

          <TextInput
            mode="flat"
            label="Owner CNIC No"
            placeholder="12301-4567890-0"
            value={ownerCnic}
            onChangeText={setOwnerCnic}
            style={styles.input}
            autoCapitalize='none'
            keyboardType='number-pad'
            returnKeyType='next'
            render={props =>
              <MaskInput
                {...props}
                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]}
              />
            }
          />

          <TextInput
            mode="flat"
            label="Owner Contact No"
            placeholder="0301 2345678"
            value={ownerContact}
            onChangeText={setOwnerContact}
            style={styles.input}
            autoCapitalize='none'
            keyboardType='number-pad'
            returnKeyType='next'
            render={props =>
              <MaskInput
                {...props}
                mask={[/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
              />
            }
          />

          <RadioButtonsYesNo
            title={'Voilations'}
            value={voilationradio}
            style={styles.radioBtn}
            onChange={setVoilationRadio}
          />

          {voilationradio === true && (
            <MultiSelect
              data={_commonData.violations}
              onItemSelect={setViolation}
              label="Choose Violation(s)"
              value={violation}
              style={styles.input}
            />
          )}
          {violation.length > 0 && (
            <TextInput
              mode="flat"
              label={'Voilation Description'}
              placeholder={'Enter voilation description'}
              value={voilationDesc}
              onChangeText={newText => {
                const englishLetterRegex =
                  /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/;
                // console.log('text', newText);
                if (newText === '') {
                  setVoilationDesc('');
                }
                // setTitle(newText);

                if (englishLetterRegex.test(newText)) {
                  setVoilationDesc(newText);
                } else {
                  console.log('Invalid character entered');
                }
              }}
              style={styles.input}
              returnKeyType="next"
            />
          )}
          {violation?.some(
            violation => violation.title == 'Other Violation',
          ) && (
              <TextInput
                mode="flat"
                label={'Other Violation'}
                placeholder={'Details...'}
                value={otherVoilation}
                onChangeText={newText => {
                  const englishLetterRegex =
                    /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/;
                  // console.log('text', newText);
                  if (newText === '') {
                    setOtherVoilation('');
                  }
                  // setTitle(newText);

                  if (englishLetterRegex.test(newText)) {
                    setOtherVoilation(newText);
                  } else {
                    console.log('Invalid character entered');
                  }
                }}
                style={styles.input}
                returnKeyType="next"
              />
            )}

          {voilationradio === true && (
            <Dropdown
              data={_commonData?.inspectionActions}
              // data={StatusText}
              onItemSelect={setVoilationStatus}
              label="Choose Status For Voilation"
              value={voilationStatus}
              status={true}
              style={styles.input}
            />
          )}

          {violation.some(violation => violation.title != 'No-Violation') &&
            voilationStatus?.title === 'Fine' &&
            voilationradio === true && (
              <TextInput
                mode="flat"
                label={'Fine Amount'}
                placeholder={'0'}
                value={fineAmount}
                onChangeText={setFinedAmount}
                style={styles.input}
                keyboardType="phone-pad"
                returnKeyType="done"
              />
            )}
          <FileUploader
            field={{
              id: 'attachments',
              type: InputType.File,
              name: 'Attachments',
            }}
            inspection={
              _step1Response?.inspection?.id
                ? _step1Response?.inspection?.id
                : _step1Response?.id
            }
            files={attachment}
            style={styles.input}
            updateFiles={updateAttachments}
            onUploadComplete={addFileId}
            isShop={true}
          />

          {voilationradio === false && (
            <Button
              mode="contained"
              style={styles.btn}
              loading={sendingData}
              onPress={btnClick}>
              Save
            </Button>
          )}
          {((voilationradio === true && voilationStatus?.title === 'Fine') ||
            voilationStatus?.title === 'Marasla' ||
            voilationStatus?.title === 'Notice') && (
              <Button
                mode="contained"
                style={styles.btn}
                loading={sendingData}
                onPress={btnClickWithVoilation}>
                Save & Next
              </Button>
            )}
          {((voilationradio === true &&
            voilationStatus?.title === 'Imprison') ||
            voilationStatus?.title === 'Warning') && (
              <Button
                mode="contained"
                style={styles.btn}
                loading={sendingData}
                onPress={btnClickWithVoilation}>
                Save
              </Button>
            )}

          {/* <Button
            mode="contained"
            style={styles.btn}
            loading={sendingData}
            onPress={btnClick}>
            Save & Next
          </Button> */}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default ShopVoilations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  input: {
    marginBottom: moderateScale(40),
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
  },
  btn: {
    borderRadius: moderateScale(10),
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
  card: {
    // marginHorizontal: 20,
    marginBottom: 20,
    alignSelf: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  colom: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
