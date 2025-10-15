import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { Button, Card, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../api';
import { Color, Fonts } from '../common/Constants';
import { CommonStyle } from '../common/Theme';
import { TypeDropdownItem, UserProfile } from '../common/Type';
import { getDataFrom, handleError } from '../common/Utils';
import Container from '../components/Container';
import Dropdown from '../components/Dropdown';
import Header from '../components/Header';
import RadioButton from '../components/RadioButton';
import { setStockOut, setStockTotal } from '../redux/slices/dataSlice';
import { RootState } from '../redux/store';

interface DealerSellFormProps { }

const DealerSellForm = (props: DealerSellFormProps) => {
    const bardanaTypes = useSelector<RootState, TypeDropdownItem[]>(state => state.data.bardanaTypes)
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const stockOut = useSelector<RootState, number>(state => state.data.stockOut)
    const allowedQty = useSelector<RootState, number>(state => state.data.allowedQty)

    const stockTotal = useSelector<RootState, number>(state => state.data.stockTotal)

    const [isLoading, setIsLoading] = React.useState(false)
    const [userName, setUserName] = React.useState('')
    const [cnic, setCnic] = React.useState('')
    const [contactNo, setContactNo] = React.useState('')
    const [address, setAddres] = React.useState('')
    const [bardanaType, setBardanaType] = React.useState<TypeDropdownItem | undefined>()
    const [noOfBags, setNoOfBags] = React.useState('')
    const [totalQty, setTotalQty] = React.useState('')
    const [isPakistani, setIsPakistani] = React.useState(true)

    // const navigation = useNavigation()
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const submitData = () => {
        if (isLoading) {
            return
        }
        else if (userName.trim() == "") {
            Alert.alert("Message", "Please enter citizen name")
            return
        }
        else if ((isPakistani && cnic.trim().length < 13) || cnic.trim().length < 4) {
            Alert.alert("Message", "Please enter a valid CNIC No.")
            return
        }
        else if (contactNo.trim().length < 10) {
            Alert.alert("Message", "Please enter a valid contact No.")
            return
        }
        else if (address.trim() == "") {
            Alert.alert("Message", "Please enter citizen address")
            return
        }
        else if (!bardanaType) {
            Alert.alert("Message", "Please select bardana type")
            return
        }
        else if (noOfBags.trim() == "") {
            Alert.alert("Message", "Please enter No. of Bags")
            return
        }
        else if (parseFloat(totalQty) > parseFloat(allowedQty)) {
            Alert.alert("Message", "Total quantity cannot be greater than allowed quantity " + allowedQty + " KG")
            return
        }
        else if (parseFloat(totalQty) > parseFloat(stockTotal)) {
            Alert.alert("Message", "Total quantity cannot be greater than available stock (" + stockTotal + " KG)")
            return
        }

        setIsLoading(true)
        const data = new FormData()
        data.append('citizen_name', userName)
        data.append('cnic', cnic)
        data.append('contact_no', contactNo)
        data.append('address', address)
        data.append('atta_bardana_type_id', bardanaType.id)
        data.append('no_of_bags', noOfBags)
        data.append('citizen_type', isPakistani ? "Pakistani" : "Other")
        // console.log('payload', data);


        api.saveDealerSell(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    // navigation.goBack()
                    setUserName("")
                    setCnic("")
                    setContactNo("")
                    setAddres("")
                    setBardanaType(undefined)
                    setNoOfBags("")
                    Alert.alert("Message", "Data saved successfully")
                    try {
                        dispatch(setStockOut(
                            // Math.max(0, 
                            (parseFloat(stockOut) + parseFloat(totalQty))
                            // )
                        ))

                        dispatch(setStockTotal(
                            Math.max(0,
                                (parseFloat(stockTotal) - parseFloat(totalQty))
                            )
                        ))
                    } catch (error) {
                        console.log('updating-stock-error', error);
                    }
                }
                setIsLoading(false)
            })
            .catch(error => {
                handleError(error)
                setIsLoading(false)
            })
    }

    const chaneNoOfBags = (input: string) => {
        setNoOfBags(input)
        const num = parseFloat(input.trim())
        if (!isNaN(num) && bardanaType) {
            setTotalQty((num * parseFloat(bardanaType.qty_value)) + " KG")
        }
        else {
            setTotalQty("")
        }
    }

    React.useEffect(() => {
        setCnic('')
    }, [isPakistani])

    React.useEffect(() => {
        setNoOfBags('')
        setTotalQty("")
    }, [bardanaType])


    return (
        <Container>
            <Header title='Selling Details' />
            <ScrollView>
                <View style={styles.container}>

                    <Text style={styles.tag}>Allowed limit per user is  {allowedQty} KG</Text>

                    <TextInput
                        mode="flat"
                        label="Citizen Name"
                        placeholder="Full Name"
                        placeholderTextColor={'rgba(0,0,0,.7)'}
                        value={userName}
                        onChangeText={setUserName}
                        style={styles.input}
                        autoCapitalize='none'
                        returnKeyType='next'
                    />

                    <View style={styles.row}>
                        <Text style={styles.label}>Citizen type:</Text>
                        <RadioButton
                            label="Pakistan"
                            checked={isPakistani}
                            onPress={() => setIsPakistani(true)}
                            style={styles.label}
                        />

                        <RadioButton
                            label="Other"
                            checked={!isPakistani}
                            onPress={() => setIsPakistani(false)}
                        />
                    </View>

                    <TextInput
                        mode="flat"
                        label="CNIC No"
                        placeholder={isPakistani ? "12301-4567890-0" : "1234567890"}
                        value={cnic}
                        onChangeText={setCnic}
                        style={styles.input}
                        autoCapitalize='none'
                        keyboardType={isPakistani ? 'number-pad' : 'default'}
                        returnKeyType='next'
                        render={!isPakistani ? undefined : props =>
                            <MaskInput
                                {...props}
                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]}
                            />
                        }
                    />


                    <TextInput
                        mode="flat"
                        label="Contact No"
                        placeholder="0301 2345678"
                        value={contactNo}
                        onChangeText={setContactNo}
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

                    <TextInput
                        mode="flat"
                        label="Address"
                        placeholder="House No, Street No, City"
                        value={address}
                        onChangeText={setAddres}
                        style={styles.input}
                        autoCapitalize='none'
                        returnKeyType='next'
                    />

                    <Dropdown
                        label='Bardana Type'
                        data={bardanaTypes}
                        value={bardanaType}
                        style={{ marginTop: 40, }}
                        onItemSelect={setBardanaType} />

                    <TextInput
                        mode="flat"
                        label="No of Bags"
                        placeholder="Number of bags selling"
                        value={noOfBags}
                        onChangeText={chaneNoOfBags}
                        style={styles.input}
                        autoCapitalize='none'
                        returnKeyType='done'
                        keyboardType='number-pad'
                        onSubmitEditing={submitData}
                    />

                    <Text style={[styles.label, { marginTop: 20, }]}>Total Quantity: {totalQty}</Text>

                    <Button
                        mode="contained"
                        style={styles.btn}
                        loading={isLoading}
                        onPress={submitData}>
                        Save
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
};

export default DealerSellForm;

const styles = StyleSheet.create({
    ...CommonStyle,
    container: {
        padding: 20
    },
    input: {
        marginTop: 25,
        backgroundColor: 'transparent',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30
    },
    label: {
        // fontFamily: Fonts.UniNeueRegular,
        marginRight: 20
    },
    tag: {
        textAlign: 'center',
        fontSize: 12,
        backgroundColor: Color.Green,
        color: Color.White,
        padding: 3,
        borderRadius: 15
    }
});
