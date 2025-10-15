import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../api';
import { BagsQty, Color, Routes } from '../../common/Constants';
import { CommonStyle } from '../../common/Theme';
import { TypeDropdownItem, UserProfile } from '../../common/Type';
import { getDataFrom, handleError, TrackEvent } from '../../common/Utils';
import Container from '../../components/Container';
import Dropdown from '../../components/Dropdown';
import Header from '../../components/Header';
import RadioButton from '../../components/RadioButton';
import StockDetails from '../../components/StockDetails';
import { setStockOut, setStockTotal, setStockIn } from '../../redux/slices/dataSlice';
import { RootState } from '../../redux/store';

interface ShopSellFormProps { }

const ShopSellForm = (props: ShopSellFormProps) => {

    // const bardanaTypes = useSelector<RootState, TypeDropdownItem[]>(state => state.data.bardanaTypes)
    // const User = useSelector<RootState, UserProfile>(state => state.data.user);
    // const stockOut = useSelector<RootState, number>(state => state.data.stockOut)
    // const allowedQty = useSelector<RootState, number>(state => state.data.allowedQty)

    // const stockTotal = useSelector<RootState, number>(state => state.data.stockTotal)

    const [isLoading, setIsLoading] = React.useState(false)
    const [userName, setUserName] = React.useState('')
    const [cnic, setCnic] = React.useState('')
    const [contactNo, setContactNo] = React.useState('')
    const [address, setAddres] = React.useState('')
    const [noOfBags, setNoOfBags] = React.useState("3")
    // const [isPakistani, setIsPakistani] = React.useState(true)
    const [is20KG, setIs20KG] = React.useState(!true)

    const navigation = useNavigation()
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const stockOut = useSelector<RootState, number>(state => state.data.stockOut);
    const stockTotal = useSelector<RootState, number>(state => state.data.stockTotal);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)
    const { citizen } = useRoute().params || {}

    const submitData = () => {
        TrackEvent("Sell_bags", { event: "Btn_clicked" })
        if (isLoading) {
            return
        }
        TrackEvent("Sell_bags", { event: "checking_validations" })
        if (stockTotal < 1) {
            Alert.alert("Message", "You do not have enough stock to make this transaction")
            return
        }
        else if (userName.trim() == "") {
            Alert.alert("Message", "Please enter citizen full name")
            return
        }
        else if (address.trim() == "") {
            Alert.alert("Message", "Please enter father name")
            return
        }
        else if (cnic.trim().length < 13) {
            Alert.alert("Message", "Please enter a valid CNIC number")
            return
        }
        else if (contactNo.trim().length < 9) {
            Alert.alert("Message", "Please enter a valid contact number")
            return
        }
        else if (noOfBags.trim() == "") {
            Alert.alert("Message", "Please enter the number of bags")
            return
        }

        TrackEvent("Sell_bags", { event: "sending_request" })
        setIsLoading(true)
        const data = new FormData()
        data.append('citizen_name', userName.trim());
        data.append('cnic_no', cnic.trim().replaceAll("-", ""));
        data.append('contact_no', contactNo.trim().replaceAll(" ", ""));
        data.append('address', citizen?.address);
        data.append('father_name', address.trim());
        data.append('bag_size_kg', is20KG ? "20" : "10");
        data.append('num_of_bags', noOfBags.trim());
        data.append('family_no', citizen?.family_no);
        try {
            data.append("extra", citizen ? JSON.stringify(citizen) : "")
        } catch (error) {
        }

        // if (data) {
        // console.log('sending-sell-data', JSON.stringify(data));
        //     // Alert.alert("Message", "Data saved successfully")
        //     // // navigation.navigate(Routes.Home)
        //     // navigation.goBack()
        //     setIsLoading(false)
        //     return
        // }

        api.addSellBags(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    /**
                        remains_total: 200,
                        remains_stock_out: 200,
                        remains_stock_in: 200
                     */
                    // console.log('resp-data', respData);
                    // const { data } = respData
                    if (respData.manual_stock != undefined) {
                        dispatch(setStockTotal(
                            Math.max(0, parseFloat(respData?.manual_stock))
                        ))

                        dispatch(setStockIn(
                            Math.max(0, parseFloat(respData.manual_received))
                        ))

                        dispatch(setStockOut(
                            Math.max(0, parseFloat(respData.manual_issued))
                        ))
                    }
                    // dispatch(setStockOut(
                    //     Math.max(0,
                    //         (parseFloat(respData.data.total_kg) + parseFloat(stockOut))
                    //     )
                    // ))

                    // dispatch(setStockTotal(
                    //     Math.max(0,
                    //         parseFloat(stockTotal) - (parseFloat(respData.data?.total_kg))
                    //     )
                    // ))
                    Alert.alert("Message", respData.title || "Data saved successfully")
                    // navigation.navigate(Routes.Home)
                    navigation.goBack()
                }
                setIsLoading(false)
            })
            .catch(error => {
                handleError(error)
                setIsLoading(false)
            })
    }

    React.useEffect(() => {
        const _citizen = citizen?.citizen_name ? citizen : citizen[0]
        // console.log('citizen-2', citizen);
        if (_citizen) {
            setUserName(_citizen.citizen_name || "")
            setCnic(_citizen.cnic_no?.toString() || _citizen.cnic?.toString() || "")
            setContactNo(_citizen.contact_no?.toString() || "")
            setAddres(_citizen.father_name || "")
        }
    }, [])

    const renderNoOfBags = () => {
        try {
            return citizen.remaining_qty && <Text style={styles.tag}>This citizen have {citizen.remaining_qty} bag{citizen.remaining_qty > 1 ? 's' : ''} remaining</Text>
        } catch (error) {
            return <></>
        }
    }

    return (
        <Container>
            <Header title='Sale Bags' />
            <ScrollView>
                <View style={styles.container}>
                    <StockDetails />
                    {renderNoOfBags()}

                    <TextInput
                        mode="flat"
                        label="Citizen Name (شہری کا نام)"
                        placeholder="Full Name"
                        placeholderTextColor={'rgba(0,0,0,.7)'}
                        value={userName}
                        onChangeText={setUserName}
                        style={styles.input}
                        autoCapitalize='none'
                        returnKeyType='next'
                    />

                    <TextInput
                        mode="flat"
                        label="Father Name (والدکانام)"
                        placeholder="Full Name"
                        placeholderTextColor={'rgba(0,0,0,.7)'}
                        value={address}
                        onChangeText={setAddres}
                        style={styles.input}
                        returnKeyType='next'
                    />


                    <TextInput
                        mode="flat"
                        label="CNIC No (شناختی کارڈنمبر)"
                        placeholder={"12301-4567890-0"}
                        value={cnic}
                        onChangeText={setCnic}
                        style={styles.input}
                        autoCapitalize='none'
                        keyboardType={'number-pad'}
                        returnKeyType='next'
                        editable={false}
                        render={props =>
                            <MaskInput
                                {...props}
                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]}
                            />
                        }
                    />


                    <TextInput
                        mode="flat"
                        label="Contact No (رابطہ نمبر)"
                        placeholder="0301 2345678"
                        value={contactNo}
                        onChangeText={setContactNo}
                        style={styles.input}
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        returnKeyType='done'
                        render={props =>
                            <MaskInput
                                {...props}
                                // 0313 9503535
                                mask={[/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                            />
                        }
                    />

                    <View style={styles.row1}>
                        <Text style={styles.label}>Size of Bags:</Text>
                        <RadioButton
                            label="10 KG"
                            checked={!is20KG}
                            onPress={() => setIs20KG(false)}
                            style={[styles.label, { marginRight: 30, marginLeft: 20, }]}
                        />

                        {/* <RadioButton
                            label="20 KG"
                            checked={is20KG}
                            onPress={() => setIs20KG(true)}
                        /> */}
                    </View>


                    {/* <Dropdown
                        label='No of Bags'
                        value={noOfBags}
                        data={BagsQty}
                        style={{ marginTop: 40, }}
                        onItemSelect={setNoOfBags} /> */}



                    <View style={styles.row1}>
                        <Text style={styles.label}>No of Bags:{"       "}</Text>
                        <RadioButton
                            label="1 Bag"
                            checked={noOfBags == "1"}
                            onPress={() => setNoOfBags("1")}
                            style={styles.label}
                        />

                        <RadioButton
                            label="2 Bags"
                            checked={noOfBags == "2"}
                            onPress={() => setNoOfBags("2")}
                            style={styles.label}
                        />


                        <RadioButton
                            label="3 Bags"
                            checked={noOfBags == "3"}
                            onPress={() => setNoOfBags("3")}
                            style={styles.label}
                        />

                        {/* <RadioButton
                            label="4 Bags"
                            checked={noOfBags == "4"}
                            onPress={() => setNoOfBags("4")}
                            style={styles.label}
                        /> */}

                    </View>

                    {/* <View style={styles.row1}>
                    </View> */}

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

export default ShopSellForm;

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
    row1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        // flexWrap: 'wrap',
        // justifyContent: 'space-between',
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
