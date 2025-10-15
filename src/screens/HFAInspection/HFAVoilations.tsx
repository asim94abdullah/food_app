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
import {Button, Divider, Title} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../api';
import {
  DummyForm,
  Fonts,
  HFA_Inspection_Questions,
} from '../../common/Constants';
import {CommonStyle} from '../../common/Theme';
import {UserProfile} from '../../common/Type';
import {getDataFrom, handleError} from '../../common/Utils';
import DynmicForm from '../../components/DynmicForm';
import {RootState} from '../../redux/store';

interface HFAVoilationsProps {
  onNext: (data: any) => void;
  _commonData?: object;
  _step1Response?: object;
}

const isIos = Platform.OS == 'ios';
const HFAVoilations = ({
  onNext,
  _commonData,
  _step1Response,
}: HFAVoilationsProps) => {
  // console.log('voilation-data', _commonData)
  // console.log('_step1Response', _step1Response)
  const User = useSelector<RootState, UserProfile>(state => state.data.user);

  const [sendingData, setSendingData] = React.useState(false);

  const form = React.useRef([]);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const saveData = () => {
    // onNext({})
    const payload = new FormData();
    payload.append('inspection_id', _step1Response.id);
    let error = false;
    _commonData.checklist.map((group, index) => {
      const data = form.current[index]?.getData();
      // console.log('formdata', data);
      group.checklist.map(ques => {
        const ans = data[ques.id];
        error = error || !ans;
        payload.append(
          `checklist_${ques.id}`,
          data[ques.id] == 1 ? 'yes' : 'no',
        );
      });
    });
    // console.log('payload', payload);
    if (error) {
      Alert.alert('Message', 'Please check all questions');
      return;
    }

    setSendingData(true);

    api
      .hfaInspectionStep2(payload)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          // console.log('respData', respData)
          onNext(respData);
        }
        setSendingData(false);
      })
      .catch(error => {
        handleError(error);
        setSendingData(false);
      });
  };

  return (
    <ScrollView>
      {/* <KeyboardAvoidingView behavior={isIos ? 'position' : 'height'}> */}
      <View style={styles.container}>
        {_commonData.checklist.map((group, index) => (
          <>
            <Title style={styles.title}>{group.title}</Title>
            <DynmicForm
              fields={group.checklist}
              // ref={form[index]}
              ref={el => (form.current[index] = el)}
            />
            <Divider style={styles.divider} />
          </>
        ))}
        {/* {_commonData && <DynmicForm fields={_commonData.checklist[0].checklist} ref={form} />} */}

        <Button
          mode="contained"
          style={styles.btn}
          loading={sendingData}
          onPress={saveData}>
          Save & Next
        </Button>
      </View>
      {/* </KeyboardAvoidingView> */}
    </ScrollView>
  );
};

export default HFAVoilations;

const styles = StyleSheet.create({
  ...CommonStyle,
  container: {
    flex: 1,
    padding: 25,
  },
  btn: {
    borderRadius: moderateScale(10),
    marginTop: 40,
    // marginBottom: 40,
    height: 50,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.UniNeueBold,
    marginBottom: moderateScale(20),
  },
  divider: {
    width: '100%',
    backgroundColor: 'gray',
    marginBottom: moderateScale(30),
  },
});
