import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import {Button, TextInput} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import ViewShot from 'react-native-view-shot';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../api';
import LoginHeader from '../assets/svg/LoginHeader';
import {Routes, UserType, userTypes} from '../common/Constants';
import {CommonStyle} from '../common/Theme';
import {UserProfile} from '../common/Type';
import {handleError, TrackEvent} from '../common/Utils';
import Container from '../components/Container';
import Dropdown from '../components/Dropdown';
import Footer from '../components/Footer';
import {saveUser} from '../redux/slices/dataSlice';
import {RootState} from '../redux/store';

interface LoginProps {}

const isIos = Platform.OS == 'ios';
const Login = (props: LoginProps) => {
  const [userType, setUserType] = React.useState(userTypes[0]);
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPrinter, setShowPrinter] = React.useState(false);
  const [hidePassword, setHidePassword] = React.useState(true);
  const [imgPath, setImgPath] = React.useState('');

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);
  const viewShot = React.useRef<React.LegacyRef<ViewShot> | undefined>();

  const login = () => {
    TrackEvent('Login', {event: 'Btn_clicked'});
    if (isLoading) {
      return;
    }
    TrackEvent('Login', {event: 'checking_validations'});
    if (userName.trim() == '') {
      Alert.alert('Message', 'Please enter a username');
      return;
    } else if (password.trim() == '') {
      Alert.alert('Message', 'Please enter a valid password');
      return;
    }
    TrackEvent('Login', {event: 'Sending_Request'});
    setIsLoading(true);
    const data = new FormData();
    data.append('username', userName.trim());
    data.append('password', password.trim());
    data.append('role', userType.id);
    // console.log('data', data);
    api
      .login(data)
      .then(response => {
        console.log('login response', response);
        const {data} = response;
        if (data.status == 'success') {
          dispatch(
            saveUser({
              ...data.user,
              ...data.authorisation,
              username: userName.trim(),
              password: password.trim(),
              user_type: data.user_type,
              _role: userType.id,
            }),
          );
        } else {
          Alert.alert('Message', 'Invalid response from server');
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log('error', error);
        handleError(error);
        // console.log('error', error);
        // Alert.alert("Sorry", "Something went wrong please later")
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.fill}>
            <LoginHeader />
            <StatusBar backgroundColor={'transparent'} translucent />

            <ViewShot
              ref={viewShot}
              options={{
                fileName: 'challan?.created_at',
                format: 'jpg',
                quality: 0.9,
              }}>
              <View style={styles.content}>
                <Dropdown
                  data={userTypes}
                  onItemSelect={setUserType}
                  label="Login as"
                  value={userType}
                />

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
                  returnKeyType="next"
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

                <TextInput
                  mode="flat"
                  label="Password"
                  placeholder="********"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry={hidePassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={login}
                  right={
                    <TextInput.Icon
                      icon={hidePassword ? 'eye' : 'eye-off'}
                      onPress={() => setHidePassword(!hidePassword)}
                    />
                  }
                />

                <Button
                  mode="contained"
                  style={styles.btn}
                  loading={isLoading}
                  onPress={login}>
                  Login
                </Button>

                <Button
                  mode="text"
                  style={styles.btn}
                  // loading={isLoading}
                  onPress={() => navigation.navigate(Routes.ForgotPassword)}>
                  Forgot Password
                </Button>
              </View>
            </ViewShot>

            {/* <Image source={{ uri: imgPath }} style={{ borderWidth: 1, minHeight: 300, backgroundColor: '#cfcfcf', }} /> */}

            <View style={styles.footer}>
              <Footer />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Login;

const styles = StyleSheet.create({
  ...CommonStyle,
  content: {
    padding: 30,
    marginTop: '10%',
    // backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  input: {
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(20),
    // marginTop: moderateScale(40)
  },
});
