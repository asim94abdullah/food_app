import {useRoute} from '@react-navigation/native';
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
import {TextInput, Button} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import Api from '../api';
import {Color, DummyItem, Fonts} from '../common/Constants';
import {TypeDropdownItem, UserProfile} from '../common/Type';
import {getDataFrom, getDataFrom1} from '../common/Utils';
import Container from '../components/Container';
import Dropdown from '../components/Dropdown';
import Header from '../components/Header';
import {RootState} from '../redux/store';

interface AddShopProps {}

const isIos = Platform.OS == 'ios';
const AddShop = (props: AddShopProps) => {
  const [shopType, setShopType] = React.useState<
    TypeDropdownItem | undefined
  >();
  const [shopName, setShopName] = React.useState('');
  const [ownerName, setOnwerName] = React.useState('');
  const [fatherName, setFatherName] = React.useState('');
  const [cnic, setCnic] = React.useState('');
  const [contactNo, setContactNo] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [licence, setLicence] = React.useState('');
  const [sendingData, setSendingData] = React.useState(false);

  const {params} = useRoute();
  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const api = new Api(User);

  const btnClick = () => {
    if (!shopType) {
      Alert.alert('Message', 'Please select Shop Type');
      return;
    } else if (shopName.trim() == '') {
      Alert.alert('Message', 'Please enter shop name');
      return;
    } else if (ownerName.trim() == '') {
      Alert.alert('Message', 'Please enter owner name');
      return;
    } else if (fatherName.trim() == '') {
      Alert.alert('Message', 'Please enter owner father name');
      return;
    } else if (cnic.trim().length < 13) {
      Alert.alert(
        'Message',
        'Please enter a valid CNIC number, must be 13 digit',
      );
      return;
    } else if (contactNo.trim().length < 10) {
      Alert.alert('Message', 'Please enter a valid contact number');
      return;
    } else if (address.trim() == '') {
      Alert.alert('Message', 'Please enter owner address');
      return;
    }

    setSendingData(true);
    const data = new FormData();
    data.append('shop_type_id', shopType.id);
    data.append('title', shopName.trim());
    data.append('owner_name', ownerName.trim());
    data.append('owner_father_name', fatherName.trim());
    data.append('owner_cnic', cnic.trim());
    data.append('contact_number', contactNo.trim());
    data.append('address', address.trim());

    console.log('data', data);

    api
      .saveShop(data)
      .then(response => {
        const respData = getDataFrom1(response);
        // console.log('respData', respData);

        if (respData) {
          Alert.alert('Message', respData.message);
          params.addShop(respData);
        }
        setSendingData(false);
      })
      .catch(error => {
        // console.log('error', error);
        Alert.alert(
          'Message',
          'Invalid response from server, please try again later',
        );
        setSendingData(false);
      });
  };

  const handleCnicChange = (text: any) => {
    if (text.length < 14) {
      setCnic(text);
    }
  };
  const handleContacChange = (text: any) => {
    if (text.length < 12) {
      setContactNo(text);
    }
  };

  return (
    <Container>
      <Header title="Add Shop" />
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.container}>
            <Dropdown
              data={params?.shopType || []}
              onItemSelect={setShopType}
              label="Choose Shop Type"
              value={shopType}
              style={styles.input}
            />

            <TextInput
              mode="flat"
              label="Business/Shop Name"
              placeholder=""
              value={shopName}
              onChangeText={newText => {
                const englishLetterRegex =
                  /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/;
                // console.log('text', newText);
                if (newText === '') {
                  setShopName('');
                }
                // setTitle(newText);

                if (englishLetterRegex.test(newText)) {
                  setShopName(newText);
                } else {
                  console.log('Invalid character entered');
                }
              }}
              style={styles.input}
              returnKeyType="next"
            />

            <TextInput
              mode="flat"
              label="Owner Name"
              placeholder=""
              value={ownerName}
              onChangeText={newText => {
                const englishLetterRegex =
                  /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/;
                // console.log('text', newText);
                if (newText === '') {
                  setOnwerName('');
                }
                // setTitle(newText);

                if (englishLetterRegex.test(newText)) {
                  setOnwerName(newText);
                } else {
                  console.log('Invalid character entered');
                }
              }}
              style={styles.input}
              returnKeyType="next"
            />

            <TextInput
              mode="flat"
              label="Owner Father Name"
              placeholder=""
              value={fatherName}
              onChangeText={newText => {
                const englishLetterRegex =
                  /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/;
                // console.log('text', newText);
                if (newText === '') {
                  setFatherName('');
                }
                // setTitle(newText);

                if (englishLetterRegex.test(newText)) {
                  setFatherName(newText);
                } else {
                  console.log('Invalid character entered');
                }
              }}
              style={styles.input}
              returnKeyType="next"
            />

            <TextInput
              mode="flat"
              label="Owner CNIC"
              placeholder="1420211111111"
              placeholderTextColor={Color.textLight}
              value={cnic}
              onChangeText={handleCnicChange}
              style={styles.input}
              keyboardType="number-pad"
              returnKeyType="next"
            />

            <TextInput
              mode="flat"
              label="Contact Number"
              placeholder="03000000000"
              placeholderTextColor={Color.textLight}
              value={contactNo}
              onChangeText={handleContacChange}
              style={styles.input}
              keyboardType="number-pad"
              returnKeyType="next"
            />

            <TextInput
              mode="flat"
              label="Owner Address"
              placeholder=""
              value={address}
              onChangeText={newText => {
                const englishLetterRegex =
                  /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/;
                // console.log('text', newText);
                if (newText === '') {
                  setAddress('');
                }
                if (englishLetterRegex.test(newText)) {
                  setAddress(newText);
                } else {
                  console.log('Invalid character entered');
                }
              }}
              style={styles.input}
              returnKeyType="next"
            />
            {/* <TextInput
              mode="flat"
              label="Licence No"
              placeholder=""
              value={licence}
              onChangeText={setLicence}
              style={styles.input}
              returnKeyType="next"
            /> */}

            <Button
              mode="contained"
              style={styles.btn}
              loading={sendingData}
              onPress={btnClick}>
              Save Shop
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AddShop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
  },
  input: {
    marginBottom: moderateScale(40),
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
  },
  btn: {
    borderRadius: moderateScale(10),
    marginTop: 40,
    marginBottom: 140,
    height: 50,
    justifyContent: 'center',
  },
});
