import {useNavigation, useRoute} from '@react-navigation/native';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from 'react-native';
import {Button, Card, TextInput} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../api';
import {Color, DummyItem, Fonts, Routes} from '../../common/Constants';
import {TypeDropdownItem, UserProfile} from '../../common/Type';
import {getDataFrom, handleError} from '../../common/Utils';
import Container from '../../components/Container';
import Dropdown from '../../components/Dropdown';
import Header from '../../components/Header';
import {RootState} from '../../redux/store';

interface ShipmentDetailsProps {}

const isIos = Platform.OS == 'ios';
const ShipmentDetails = (props: ShipmentDetailsProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [subOfficer, setSubOfficer] = React.useState<
    TypeDropdownItem | undefined
  >();
  const [bardana, setBardana] = React.useState<TypeDropdownItem | undefined>();
  const [qty, setQty] = React.useState('');
  const [indigQty, setIndigQty] = React.useState('');
  const [imptBags, setImptBags] = React.useState('0');
  const [indigBags, setIndigBags] = React.useState('0');
  const [noBags, setNoBags] = React.useState('0');
  const [totalQty, setTotalQty] = React.useState('0');
  const [bardanaList, setBardanaList] = React.useState([]);

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  // console.log('session', User);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const {params} = useRoute();
  // console.log('param', params);

  const isDataOk = () => {
    if (!subOfficer) {
      Alert.alert('Message', 'Please select Sub Office');
      return false;
    } else if (!bardana) {
      Alert.alert('Message', 'Please select Bardana');
      return false;
    } else if (qty.trim() == '') {
      Alert.alert('Message', 'Please enter Import Quantity');
      return false;
    } else if (indigQty.trim() == '') {
      Alert.alert('Message', 'Please add Indig.Qty (MT)');
      return false;
    } else if (imptBags.trim() == '') {
      Alert.alert('Message', 'Please add ImportNo. of Bags');
      return;
    } else if (noBags.trim() == '') {
      Alert.alert('Message', 'Please enter No. of Bags');
      return false;
    }

    return true;
  };

  const submitData = () => {
    if (!isDataOk()) {
      return;
    }
    setIsLoading(true);
    const data = new FormData();

    data.append('source_id', subOfficer?.id);
    data.append('bardana_type_id', bardana?.id);
    // data.append("quantity_tons", qty)
    data.append('import_qty', qty);
    data.append('indigenous_qty', indigQty);
    data.append('import_no_of_bags', imptBags);
    data.append('indigenous_no_of_bags', indigBags);
    data.append('no_of_bags', noBags);
    data.append('quantity_tons', totalQty);
    data.append('shipment_id', params?.shipmentId);
    console.log('details-payload', data);
    api
      .shipmentDetails(data)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          Alert.alert(
            'Message',
            'Record saved successfully, now you can add another',
          );

          setSubOfficer(undefined);
          setBardana(undefined);
          setQty('');
          setIndigQty('');
          setImptBags('0');
          setIndigBags('0');
          setNoBags('0');
          setTotalQty('0');
        }
        setIsLoading(false);
      })
      .catch(error => {
        handleError(error);
        setIsLoading(false);
      });
  };

  const changeImpQty = (input: string) => {
    setQty(input);
    // if (bardana) {
    //     setImptBags((parseFloat(input) * parseInt(bardana.value || 0)).toString())
    // }
    if (input.trim() == '') {
      setTotalQty(indigQty);
    } else if (indigQty.trim() == '') {
      setTotalQty(input);
    } else {
      let sum = parseFloat(input) + parseFloat(indigQty);
      setTotalQty(isNaN(sum) ? '' : sum?.toString());
    }
  };

  const changeIndQty = (input: string) => {
    setIndigQty(input);
    // if (bardana) {
    //     setIndigBags((parseFloat(input) * parseInt(bardana.value || 0)).toString())
    // }
    if (input.trim() == '') {
      setTotalQty(qty);
    } else if (qty.trim() == '') {
      setTotalQty(input);
    } else {
      let sum = parseFloat(input) + parseFloat(qty);
      setTotalQty(isNaN(sum) ? '' : sum?.toString());
    }
  };

  React.useEffect(() => {
    const sum = parseInt(indigBags) + parseInt(imptBags);
    if (!isNaN(sum)) {
      setNoBags(sum.toString());
    } else {
      setNoBags('0');
    }
  }, [indigBags, imptBags]);

  // React.useEffect(() => {
  //     const sum = parseInt(qty) + parseInt(indigQty)
  //     if (!isNaN(sum)) {
  //         setTotalQty(sum.toString())
  //     }
  //     else {
  //         setTotalQty('0')
  //     }
  // }, [indigQty, qty])

  React.useEffect(() => {
    // params.shipmentId
    setBardanaList(params?.bardanaList || []);
  }, []);

  return (
    <Container>
      <Header title="Details" />

      <ScrollView style={{flexGrow: 1}} bounces={false}>
        <KeyboardAvoidingView>
          <View style={styles.container}>
            <Dropdown
              data={params?.sourceList}
              onItemSelect={setSubOfficer}
              label="Sub Center"
              value={subOfficer}
              style={styles.input}
            />

            <Dropdown
              data={params?.bardanaList}
              onItemSelect={setBardana}
              label="Bardana"
              value={bardana}
              style={styles.input}
            />

            <TextInput
              mode="flat"
              label="Import Qty(MT)"
              placeholder="Enter Quantity in MT : 0"
              value={qty}
              onChangeText={changeImpQty}
              style={styles.input}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />

            <TextInput
              mode="flat"
              label="Indig.Qty (MT)"
              placeholder="Enter Quantity in MT: 0"
              value={indigQty}
              onChangeText={changeIndQty}
              style={styles.input}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />

            <TextInput
              mode="flat"
              label="Import No.of Bags"
              placeholder="Enter a number"
              value={imptBags}
              onChangeText={setImptBags}
              style={styles.input}
              returnKeyType="next"
              keyboardType="number-pad"
            />

            <TextInput
              mode="flat"
              label="Indig. No.of Bags"
              placeholder="Enter a number"
              value={indigBags}
              onChangeText={setIndigBags}
              style={styles.input}
              returnKeyType="next"
              keyboardType="number-pad"
            />

            <TextInput
              mode="flat"
              label="Total No. of Bags"
              placeholder="Enter a number"
              value={noBags}
              onChangeText={setNoBags}
              style={styles.input}
              returnKeyType="done"
              keyboardType="decimal-pad"
            />

            <TextInput
              mode="flat"
              label="Total Quantity"
              placeholder="Enter a number"
              value={totalQty}
              onChangeText={setTotalQty}
              style={styles.input}
              returnKeyType="done"
              keyboardType="decimal-pad"
            />

            {/* <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.row}>
                                    <View style={styles.cell}>
                                        <Text style={styles.txtBold}>Import No.of Bags</Text>
                                        <Text style={styles.txtSmall}>{imptBags}</Text>
                                    </View>

                                    <View style={styles.cell}>
                                        <Text style={styles.txtBold}>Indig. No.of Bags</Text>
                                        <Text style={styles.txtSmall}>{indigBags}</Text>
                                    </View>
                                </View>


                                <View style={styles.row}>
                                    <View style={styles.cell}>
                                        <Text style={styles.txtBold}>Total No. of Bags</Text>
                                        <Text style={styles.txtSmall}>{noBags}</Text>
                                    </View>

                                    <View style={styles.cell}>
                                        <Text style={styles.txtBold}>Total Quantity</Text>
                                        <Text style={styles.txtSmall}>{totalQty}</Text>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card> */}

            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}> */}
            <Button
              mode="contained"
              style={styles.btn}
              loading={isLoading}
              onPress={submitData}>
              Save & Add Another
            </Button>

            <Button
              mode="contained"
              buttonColor={Color.Blue}
              style={styles.btn}
              // loading={true}
              onPress={() => navigation.navigate(Routes.Home)}>
              Close
            </Button>
            {/* </View> */}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Container>
  );
};

export default ShipmentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
  },
  btn: {
    borderRadius: moderateScale(10),
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
    // flex: 1
    // width: '100%'
  },
  card: {
    // marginHorizontal: 20,
    marginVertical: 10,
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
    fontSize: 12,
  },
  txtSmall: {
    fontFamily: Fonts.UniNeueRegular,
    color: Color.textLight,
    fontSize: 12,
  },
});
