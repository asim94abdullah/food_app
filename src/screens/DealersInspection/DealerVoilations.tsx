import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../api';
import {
  Color,
  Fonts,
  InputType,
} from '../../common/Constants';
import { TypeDropdownItem, TypeFile, UserProfile } from '../../common/Type';
import { getDataFrom, handleError, isValidCnic, isValidPhone } from '../../common/Utils';
import Dropdown from '../../components/Dropdown';
import FileUploader from '../../components/FileUploader';
import RadioButtonsYesNo from '../../components/RadioButtonsYesNo';
import { RootState } from '../../redux/store';
import MaskInput from 'react-native-mask-input';

interface DealerVoilationsProps {
  onNext: (data: any, amoutn: string) => void;
  _commonData: any;
  _step1Response: any;
}

const isIos = Platform.OS == 'ios';
const DealerVoilations = ({
  onNext,
  _commonData,
  _step1Response,
}: DealerVoilationsProps) => {
  // console.log('_commonData', _commonData);
  // console.log('_step1Response', _commonData.dealers);

  const scrollView = React.useRef();
  const [shop, setShop] = React.useState<TypeDropdownItem | undefined>();
  const [sendingData, setSendingData] = React.useState(false);
  const [fineAmount, setFinedAmount] = React.useState('');
  const [attachment, setAttachment] = React.useState<TypeFile[]>([]);
  const [attachmentIds, setAttachmentIds] = React.useState<string[]>([]);

  const [isFined, setIsFined] = React.useState(false);
  const [smoothDistr, setSmoothDistr] = React.useState(true);
  const [bannerDisplay, setBannerDisplay] = React.useState(true);
  const [sellingRecord, setSellingRecord] = React.useState(true);
  const [fixedPrice, setFixedPrice] = React.useState(true);
  const [licenseExpired, setLicenseExpired] = React.useState(false);
  const [dualQuota, setDualQuota] = React.useState(true);

  const [licenseCancelled, setLicenseCancelled] = React.useState(false);
  const [qoutaTerminated, setQoutaTerminated] = React.useState(false);
  const [warning, setWarning] = React.useState(false);
  const [blacklisted, setBlacklisted] = React.useState(false);
  const [irregularities, setIrregularities] = React.useState('');

  const [ownerName, setOwnerName] = React.useState('');
  const [ownerContact, setOwnerContact] = React.useState('');
  const [ownerCnic, setOwnerCnic] = React.useState('');

  const [shopsList, setShopsList] =
    React.useState<TypeDropdownItem[]>(_commonData.dealers) || [];

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const btnClick = () => {
    if (!shop) {
      Alert.alert('Message', 'Please select a dealer');
      return;
    } else if (!ownerName.trim()) {
      Alert.alert('Message', 'Please enter owner name');
      return;
    } else if (!isValidPhone(ownerContact.trim())) {
      Alert.alert('Message', 'Please enter valid owner contact');
      return;
    } else if (!isValidCnic(ownerCnic.trim())) {
      Alert.alert('Message', 'Please enter valid owner cnic');
      return;
    } else if (isFined && fineAmount.trim() == '') {
      Alert.alert(
        'Message',
        "Please either select enter fine amount of select 'Is Fined' as No",
      );
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
    payload.append('id', _step1Response?.inspection?.id);
    payload.append('dealer_id', shop.id);
    payload.append('fine', fineAmount);
    payload.append('fined', isFined ? 'yes' : 'no');
    payload.append('quota_terminated', qoutaTerminated ? 'yes' : 'no');
    payload.append('warned', warning ? 'yes' : 'no');
    payload.append('license_cancelled', licenseCancelled ? 'yes' : 'no');
    payload.append('smooth_distribution', smoothDistr ? 'yes' : 'no');
    payload.append('display_of_banner', bannerDisplay ? 'yes' : 'no');
    payload.append('license_expired', licenseExpired ? 'yes' : 'no');
    payload.append('dual_quota', dualQuota ? 'yes' : 'no');
    payload.append('irregularities', irregularities);
    payload.append('attachment_ids', attachmentIds.join(','));
    payload.append('owner_name', ownerName.trim() || '');
    payload.append('owner_contact', ownerContact.trim()?.replaceAll(" ", "") || '');
    payload.append('owner_cnic', ownerCnic.trim()?.replaceAll("-", "") || '');

    api
      .sendDealerStep2Data(payload)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          onNext({
            ...respData.inspection_dealer,
            owner_name: ownerName.trim(),
            owner_contact: ownerContact.trim(),
            owner_cnic: ownerCnic.trim(),
          }, fineAmount);

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
        handleError(error);
        setSendingData(false);
      });
  };

  // const openGalley = () => {
  //     launchCamera({
  //         mediaType: 'photo'
  //     }).then(result => {
  //         if (result.assets) {
  //             setAttachment(result.assets[0])
  //         }
  //     }).catch(error => {
  //         console.log('error', error);
  //     })
  // }

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
    setAttachmentIds(_attachmentIds);
  };

  React.useEffect(() => {
    setShopsList(_commonData.dealers);
  }, [_commonData]);

  return (
    <KeyboardAvoidingView behavior={'position'}>
      <ScrollView ref={scrollView}>
        <View style={styles.container}>
          {/* <Dropdown
                        data={_commonData.shop_types}
                        onItemSelect={setShopType}
                        label="Choose Shop Type"
                        value={shopType}
                        style={styles.input}
                    /> */}

          <Dropdown
            data={shopsList}
            onItemSelect={setShop}
            label="Choose dealer"
            value={shop}
            style={styles.input}
          />

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

          <Text style={styles.title}>Voilations</Text>
          <RadioButtonsYesNo
            title={'Smooth distribution of subsidized atta?'}
            value={smoothDistr}
            style={styles.input}
            onChange={setSmoothDistr}
          />

          <RadioButtonsYesNo
            title={'Record of subsidized atta on daily basis?'}
            value={sellingRecord}
            style={styles.input}
            onChange={setSellingRecord}
          />

          <RadioButtonsYesNo
            title={'Banner displayed?'}
            value={bannerDisplay}
            style={styles.input}
            onChange={setBannerDisplay}
          />

          <RadioButtonsYesNo
            title={'Selling atta on fixed price?'}
            value={fixedPrice}
            style={styles.input}
            onChange={setFixedPrice}
          />

          <RadioButtonsYesNo
            title={'License Expired'}
            value={licenseExpired}
            style={styles.input}
            onChange={setLicenseExpired}
          />

          <RadioButtonsYesNo
            title={'Dual Quota on Single Dealer Outlet'}
            value={dualQuota}
            style={styles.input}
            onChange={setDualQuota}
          />

          <Text style={styles.title}>Actions</Text>
          <RadioButtonsYesNo
            title={'Cancel distribution license?'}
            value={licenseCancelled}
            style={styles.input}
            onChange={setLicenseCancelled}
          />

          <RadioButtonsYesNo
            title={'Quota Suspended?'}
            value={qoutaTerminated}
            style={styles.input}
            onChange={setQoutaTerminated}
          />

          <RadioButtonsYesNo
            title={'Warning Issued?'}
            value={warning}
            style={styles.input}
            onChange={setWarning}
          />

          <RadioButtonsYesNo
            title={'Dealer Blacklisted?'}
            value={blacklisted}
            style={styles.input}
            onChange={setBlacklisted}
          />

          <RadioButtonsYesNo
            title={'Is the dealer fined?'}
            value={isFined}
            style={styles.input}
            onChange={setIsFined}
          />

          {isFined && (
            <TextInput
              mode="flat"
              label={'Fine Amount'}
              placeholder={'0'}
              value={fineAmount}
              onChangeText={setFinedAmount}
              style={styles.input}
              returnKeyType="next"
              keyboardType="number-pad"
            />
          )}

          <TextInput
            mode="flat"
            label={'Irregularities/Remarks (if any)'}
            placeholder={'Add here...'}
            value={irregularities}
            onChangeText={setIrregularities}
            style={styles.input}
            returnKeyType="done"
          />

          {/* TODO: change this for dealer inspection */}
          <FileUploader
            field={{
              id: 'attachments',
              type: InputType.File,
              name: 'Attachments',
            }}
            files={attachment}
            style={styles.input}
            updateFiles={updateAttachments}
            onUploadComplete={addFileId}
            isShop={true}
            inspection={_step1Response?.inspection?.id || _step1Response?.id}
          />

          <Button
            mode="contained"
            style={styles.btn}
            loading={sendingData}
            onPress={btnClick}>
            Save & Next
          </Button>

          {/* <Button
                        mode="contained"
                        style={styles.btn}
                        loading={sendingData}
                        onPress={btnClick}>
                        Close
                    </Button> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DealerVoilations;

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
    marginTop: 40,
    // marginBottom: 40,
    height: 50,
    justifyContent: 'center',
  },
  // radioBtn: {
  //     justifyContent: 'flex-start',
  //     marginTop: 8
  // },
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
  title: {
    fontFamily: Fonts.UniNeueBold,
    fontSize: 18,
    marginBottom: 10,
    color: Color.textDark,
  },
});
