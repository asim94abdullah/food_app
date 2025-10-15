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
import {Button, Card, TextInput} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../api';
import {Color, DummyForm, DummyItem, Fonts} from '../../common/Constants';
import {TypeDropdownItem, UserProfile} from '../../common/Type';
import {getDataFrom, handleError} from '../../common/Utils';
import Dropdown from '../../components/Dropdown';
import DynmicForm from '../../components/DynmicForm';
import FileUploader from '../../components/FileUploader';
import RadioButton from '../../components/RadioButton';
import RadioButtonsYesNo from '../../components/RadioButtonsYesNo';
import {RootState} from '../../redux/store';

interface MillVoilationsProps {
  onNext: (data: any, fine: string) => void;
  _commonData: any;
  _step1Response: any;
}

const isIos = Platform.OS == 'ios';
const MillVoilations = ({
  onNext,
  _commonData,
  _step1Response,
}: MillVoilationsProps) => {
  // console.log('data', _step1Response);

  const form = React.useRef();
  const scrollView = React.useRef();
  const [mill, setMill] = React.useState<TypeDropdownItem | undefined>();
  const [attachments, setAttachments] = React.useState([]);
  const [attachmentIds, setAttachmentIds] = React.useState<string[]>([]);
  const [isFined, setIsFined] = React.useState(false);
  const [fineAmount, setFinedAmount] = React.useState('');
  const [isWarned, setIsWarned] = React.useState(false);
  const [isSuspend, setIsSuspend] = React.useState(false);
  const [isSealed, setIsSealed] = React.useState(false);
  const [sendingData, setSendingData] = React.useState(false);
  const [gettingMillStats, setGettingMillStats] = React.useState(false);
  const [millStats, setMillStats] = React.useState(undefined);

  const [millsList, setMillsList] = React.useState([]); //_commonData.mills
  const [questionsList, setQuestionsList] = React.useState([]); //_commonData.mills

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const btnClick = () => {
    if (!mill) {
      Alert.alert('Message', 'Please select a mill');
      return;
    } else if (isFined && fineAmount.trim() == '') {
      Alert.alert('Message', 'Please enter fine amount');
      return;
    }
    const data = form.current?.getData();
    // console.log('data', data);

    if (!_commonData.questionnare) {
      Alert.alert('Message', 'Invalid form data');
      return;
    }

    const payload = new FormData();
    payload.append('id', _step1Response?.inspection?.id);
    payload.append('mill_id', mill.id);
    payload.append('fined', isFined ? 'yes' : 'no');
    payload.append('fine', fineAmount);
    payload.append('sealed', isSealed ? 'yes' : 'no');
    payload.append('quota_cancelled', isSuspend ? 'yes' : 'no');
    payload.append('warned', isWarned ? 'yes' : 'no');

    let isError = false;
    _commonData.questionnare.forEach(question => {
      // name_1[]
      // console.log(`name_${question.id}[]`, data[question.id]);
      isError = isError || data[question.id] == undefined;

      payload.append(`name_${question.id}[]`, data[question.id]);
    });

    if (isError) {
      Alert.alert(
        'Message',
        'Please fill all the fields & answer all the questions',
      );
      return;
    }
    // else if (attachmentIds.length < 1) {
    //   Alert.alert('Message', 'Please add an attachment');
    //   return;
    // }
    payload.append('attachment_ids', attachmentIds.join(','));
    // console.log('payload', payload);
    setSendingData(true);

    api
      .sendStep2Data(payload)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          // setCommonData(respData)
          onNext(respData.inspection_mill, fineAmount);

          setMill(undefined);
          setAttachments([]);
          setAttachmentIds([]);
          setIsFined(false);
          setFinedAmount('');
          setIsWarned(false);
          setIsSuspend(false);
          setIsSealed(false);
          form.current?.clearData();
          scrollView.current?.scrollTo({
            y: 0,
            animated: true,
          });
        }
        setSendingData(false);
      })
      .catch(error => {
        handleError(error);
        setSendingData(false);
      });
  };

  const updateAttachments = (fieldId?: string, file?: any, index?: number) => {
    const _attachments = [...attachments];
    if (index != undefined) {
      _attachments.splice(index, 1);
      if (attachmentIds[index]) {
        const ids = [...attachmentIds];
        ids.splice(index, 1);
        setAttachmentIds(ids);
      }
    } else {
      _attachments.push(file);
    }
    setAttachments(_attachments);
  };

  const saveFileId = (id: string) => {
    const ids = [...attachmentIds];
    ids.push(id);
    setAttachmentIds(ids);
  };

  React.useEffect(() => {
    setMillsList(_commonData.mills);
    setQuestionsList(_commonData.questionnare);
  }, [_commonData]);

  React.useEffect(() => {
    if (!mill) {
      return;
    }
    setGettingMillStats(true);
    const data = new FormData();
    data.append('mill_id', mill?.id);
    api
      .getMillStats(data)
      .then(response => {
        const respData = getDataFrom(response);
        // if (respData) {
        console.log('mill-stats', respData);
        setMillStats(respData);
        // }
        setGettingMillStats(false);
      })
      .catch(error => {
        handleError(error);
        setGettingMillStats(false);
        setMillStats(undefined);
      });
  }, [mill]);

  const MillStats = () => {
    return gettingMillStats ? (
      <ActivityIndicator
        color={Color.Blue}
        size="large"
        style={{alignSelf: 'center', margin: 20, marginBottom: 40}}
      />
    ) : millStats ? (
      <Card style={styles.card}>
        <Card.Content>
          <View style={[styles.row, {marginBottom: 0}]}>
            <Card.Title title={mill?.title} style={styles.cell} />
            {/* <Text style={styles.txtBold}>No. of Bodies: {"item.no_of_bags"}</Text> */}
          </View>
          <Card.Content>
            {/* Date, Name, NIC, Contact, address, Bags (size, qty) */}
            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>No. of Bodies:</Text>
                <Text style={styles.txtSmall}>{millStats.no_of_bodies}</Text>
              </View>

              {/* <View style={styles.cell}>
                                    <Text style={styles.txtBold}>Privately purchased Wheat Stock Balance</Text>
                                    <Text style={styles.txtSmall}>{millStats.total_prvt_stock}</Text>
                                </View> */}
            </View>

            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Govt. Wheat Stock: </Text>
                <Text style={styles.txtSmall}>
                  {millStats.govt_wheat_stock}
                </Text>
              </View>

              <View style={styles.cell}>
                <Text style={styles.txtBold}>Govt. Flour Stock</Text>
                <Text style={styles.txtSmall}>{millStats.subs_atta_stock}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>
                  Privately purchased Wheat Stock Balance
                </Text>
                <Text style={styles.txtSmall}>
                  {millStats.total_prvt_stock}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={[styles.txtBold, {color: '#000', fontSize: 14}]}>
                  {'\n'}Subsidized Wheat Grinding Formula
                </Text>
                {/* <Text style={styles.txtSmall}>{"millStats.total_prvt_stock"}</Text> */}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Atta Percent: </Text>
                <Text style={styles.txtSmall}>
                  {millStats.grindig_formula[0]?.atta_percent}%
                </Text>
              </View>

              <View style={styles.cell}>
                <Text style={styles.txtBold}>Fine Percent</Text>
                <Text style={styles.txtSmall}>
                  {millStats.grindig_formula[0]?.fine_percent}%
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.cell}>
                <Text style={styles.txtBold}>Chokar Percent: </Text>
                <Text style={styles.txtSmall}>
                  {millStats.grindig_formula[0]?.chokar_percent}%
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card.Content>
      </Card>
    ) : (
      <></>
    );
  };

  console.log('questionsList', questionsList);

  return (
    <ScrollView style={{marginVertical: 40}}>
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <Dropdown
            data={millsList}
            onItemSelect={setMill}
            label="Choose Mill"
            value={mill}
            style={styles.input}
          />

          <MillStats />

          <DynmicForm fields={questionsList || []} ref={form} />

          <RadioButtonsYesNo
            title={'Is the Mill fined?'}
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
              returnKeyType="done"
              keyboardType="number-pad"
            />
          )}

          <RadioButtonsYesNo
            title={'Warning Issued?'}
            value={isWarned}
            style={styles.radioBtn}
            onChange={setIsWarned}
          />

          <RadioButtonsYesNo
            title={'Quota Suspended?'}
            value={isSuspend}
            style={styles.radioBtn}
            onChange={setIsSuspend}
          />

          <RadioButtonsYesNo
            title={'Sealed?'}
            value={isSealed}
            style={styles.radioBtn}
            onChange={setIsSealed}
          />

          <FileUploader
            field={DummyForm[0]}
            files={attachments}
            style={styles.input}
            updateFiles={updateAttachments}
            onUploadComplete={saveFileId}
          />

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

export default MillVoilations;

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
  card: {
    // marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
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
    // fontFamily: Fonts.UniNeueRegular,
    color: Color.textLight,
    fontSize: 10,
  },
});
