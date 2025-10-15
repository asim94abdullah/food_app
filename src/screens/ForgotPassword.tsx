import * as React from 'react';
import {Text, View, StyleSheet, Alert, StatusBar} from 'react-native';
import MaskInput from 'react-native-mask-input';
import {Button, TextInput} from 'react-native-paper';
import {Fonts, UserType, userTypes} from '../common/Constants';
import Container from '../components/Container';
import Dropdown from '../components/Dropdown';
import Header from '../components/Header';
import {CommonStyle} from '../common/Theme';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {UserProfile} from '../common/Type';
import Api from '../api';
import {handleError} from '../common/Utils';

interface ForgotPasswordProps {}

const ForgotPassword = (props: ForgotPasswordProps) => {
  const [userType, setUserType] = React.useState(userTypes[0]);
  const [userName, setUserName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  // const navigation = useNavigation()
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const forgotPassword = () => {
    if (userName.trim().length < 13) {
      Alert.alert('Message', 'Please enter a valid CNIC number');
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append('cnic_no', userName.trim());

    // console.log('data', data);
    api
      .forgotPassword(data)
      .then(response => {
        // console.log('response', response);
        const {data} = response;
        Alert.alert(
          'Message',
          data?.data?.message || 'Invalid response from server',
        );
        setIsLoading(false);
      })
      .catch(error => {
        handleError(error);
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <View style={styles.fill}>
        <Header title="Forgot Password" />

        <View style={styles.content}>
          <Text style={styles.desc}>
            Please enter your CNIC number, you will shorlt send you a new
            password through SMS.
          </Text>

          <TextInput
            mode="flat"
            label="Username / CNIC No"
            placeholder="CNIC without dashes"
            value={userName}
            onChangeText={setUserName}
            style={styles.input}
            autoCapitalize="none"
            keyboardType={
              userType.id == UserType.Dealer ? 'number-pad' : 'default'
            }
            returnKeyType="send"
            onSubmitEditing={forgotPassword}
            render={
              userType.id == UserType.Dealer
                ? props => (
                    <MaskInput
                      {...props}
                      mask={[
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        '-',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        '-',
                        /\d/,
                      ]}
                    />
                  )
                : undefined
            }
          />

          <Button
            mode="contained"
            style={styles.btn}
            loading={isLoading}
            onPress={forgotPassword}>
            Send
          </Button>
        </View>
      </View>
    </Container>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  ...CommonStyle,
  fill: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  content: {
    padding: 30,
    marginTop: '10%',
    // backgroundColor: 'white',
  },
  input: {
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  desc: {
    fontFamily: Fonts.UniNeueRegular,
    textAlign: 'center',
  },
});
