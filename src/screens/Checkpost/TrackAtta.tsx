import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { moderateScale } from 'react-native-size-matters';
import { CommonStyle } from '../../common/Theme';
import { TypeDropdownItem, UserProfile } from '../../common/Type';
import Dropdown from '../../components/Dropdown';
import { Button, TextInput } from 'react-native-paper';
import MaskInput from 'react-native-mask-input';
import DateTimePickerInput from '../../components/DateTimePickerInput';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import Api from '../../api';
import { formatDateForServer, formatDateTimeForServer, getDataFrom, handleError } from '../../common/Utils';
import QR_code from '../../assets/svg/QR_code';

interface TrackAttaProps { }

const TrackAtta = (props: TrackAttaProps) => {

    const bardanaTypes = useSelector<RootState, TypeDropdownItem[]>(state => state.data.bardanaTypes)
    const provincesList = useSelector<RootState, TypeDropdownItem[]>(state => state.data.provinceList)
    const toDistList = useSelector<RootState, TypeDropdownItem[]>(state => state.data.districtList)
    const User = useSelector<RootState, UserProfile>(state => state.data.user);

    // const [provincesList, setProvincesList] = React.useState<TypeDropdownItem[]>([])
    const [fromDistList, setFromDistList] = React.useState<TypeDropdownItem[]>([])
    // const [toDistList, setToDistList] = React.useState<TypeDropdownItem[]>([])
    const [dealersList, setDealersList] = React.useState<TypeDropdownItem[]>([])
    const [millsList, setMillsList] = React.useState<TypeDropdownItem[]>([])

    const [province, setProvince] = React.useState<TypeDropdownItem | undefined>()
    const [fromDist, setFromDist] = React.useState<TypeDropdownItem | undefined>()
    const [millName, setMillName] = React.useState('')
    const [licenseNo, setLicenseNo] = React.useState('')
    const [agentName, setAgentName] = React.useState('')
    const [agentCNIC, setAgentCNIC] = React.useState('')
    const [agentCellNo, setAgentCellNo] = React.useState('')
    const [permitNo, setPermitNo] = React.useState('')
    const [permitExpiry, setPermitExpiry] = React.useState<Date | undefined>()
    const [entryDate, setEntryDate] = React.useState<Date | undefined>()
    const [bardanaType, setBardanaType] = React.useState<TypeDropdownItem | undefined>()
    const [noOfBags, setNoOfBags] = React.useState('')
    const [toDist, setToDist] = React.useState<TypeDropdownItem | undefined>()
    const [dealer, setDealer] = React.useState<TypeDropdownItem | undefined>()
    const [truckNo, setTruckNo] = React.useState('')
    const [mill, setMill] = React.useState<TypeDropdownItem | undefined>()

    const [sendingData, setSendingData] = React.useState(false)
    const [loadingDist, setLoadingDist] = React.useState(false)
    const [loadingMills, setLoadingMills] = React.useState(false)
    const [loadingDealers, setLoadingDealers] = React.useState(false)


    const navigation = useNavigation()
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    React.useEffect(() => {
        if (!province) {
            return
        }

        setLoadingDist(true)
        setFromDistList([])
        setFromDist(undefined)
        api.getDistricts(province.id)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    setFromDistList(respData.district)
                }
                setLoadingDist(false)
            })
            .catch(error => {
                handleError(error)
                setLoadingDist(false)
            })

    }, [province])


    React.useEffect(() => {
        if (!toDist) {
            return
        }

        setLoadingDealers(true)
        setDealersList([])
        setDealer(undefined)
        api.getMillDealers(toDist.id)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    setDealersList(respData.dealer?.map(i => {
                        return { id: i.id, title: i.business_title }
                    }))
                }
                setLoadingDealers(false)
            })
            .catch(error => {
                handleError(error)
                setLoadingDealers(false)
            })

    }, [toDist])

    React.useEffect(() => {
        if (!fromDist) {
            return
        }

        setLoadingMills(true)
        setMillsList([])
        setMill(undefined)
        api.getMillDealers(fromDist.id)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    setMillsList(respData.mill_other_province?.map(i => {
                        return { id: i.id, title: i.name }
                    }))
                }
                setLoadingMills(false)
            })
            .catch(error => {
                handleError(error)
                setLoadingMills(false)
            })

    }, [fromDist])

    const isDataOk = () => {
        if (!province) {
            Alert.alert("Message", "Please select a province")
            return false
        }
        else if (!fromDist) {
            Alert.alert("Message", "Please select a District (From)")
            return false
        }
        // else if (!mill) {
        //     Alert.alert("Message", "Please select a Flour Mill (From)")
        //     return false
        // }
        else if (licenseNo.trim() == "") {
            Alert.alert("Message", "Please enter a licence No")
            return false
        }
        else if (agentName.trim() == "") {
            Alert.alert("Message", "Please enter the agent name")
            return false
        }
        else if (agentCNIC.trim().length < 15) {
            Alert.alert("Message", "Invalid Agent CNIC number")
            return false
        }
        else if (agentCellNo.trim().length < 12) {
            Alert.alert("Message", "Invalid Agent Cell No")
            return false
        }
        else if (permitNo.trim() == "") {
            Alert.alert("Message", "Please enter Permit No")
            return false
        }
        else if (!permitExpiry) {
            Alert.alert("Message", "Please enter validity of permit")
            return false
        }
        else if (!bardanaType) {
            Alert.alert("Message", "Please select bardana")
            return false
        }
        else if (noOfBags.trim() == "") {
            Alert.alert("Message", "Please enter No of Bags")
            return false
        }
        else if (!toDist) {
            Alert.alert("Message", "Please select a value in District (to)")
            return false
        }
        else if (!dealer) {
            Alert.alert("Message", "Please select a dealer")
            return false
        }
        else if (truckNo.trim() == "") {
            Alert.alert("Message", "Please enter truck No")
            return false
        }
        else if (!entryDate) {
            Alert.alert("Message", "Please select entry date")
            return false
        }

        return true
    }


    const submit = () => {
        if (sendingData || !isDataOk()) {
            return
        }
        setSendingData(true)
        const data = new FormData()
        data.append("from_province_id", province.id)
        data.append("from_district_id", fromDist.id)
        data.append("from_mill_id", mill?.id)
        data.append("from_mill_name", millName?.trim())
        data.append("dated", formatDateTimeForServer(entryDate))
        data.append("license_no", licenseNo.trim())
        data.append("agent_name", agentName.trim())
        data.append("agent_cnic", agentCNIC.trim())
        data.append("agent_cell_no", agentCellNo.trim())
        data.append("permit_no", permitNo.trim())
        data.append("validity_permit", formatDateForServer(permitExpiry))
        data.append("total_authorized_qty", "0")
        data.append("qty_permitted", "0")
        data.append("district_id", toDist.id)
        data.append("dealer_id", dealer.id)
        data.append("truck_no", truckNo.trim())
        data.append("atta_bardana_type_id", bardanaType.id)
        data.append("no_of_bags", noOfBags.trim())
        // if (data) {
        //     console.log('data', JSON.stringify(data, null, 8));
        //     setSendingData(false)
        //     return
        // }


        api.saveDealerStock(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    Alert.alert("Message", respData.title || "Data saved successfully")
                    navigation.goBack()
                }
                setSendingData(false)
            })
            .catch(error => {
                handleError(error)
                setSendingData(false)
            })
    }
    return (
        <Container>
            <Header title='Track Atta' />

            <ScrollView>
                <View style={styles.container}>

                    <View style={styles.qrcode}>
                        <QR_code />
                    </View>

                    <Dropdown
                        label='Dispatched Province'
                        data={provincesList}
                        value={province}
                        onItemSelect={setProvince}
                        style={styles.input}
                    />

                    <Dropdown
                        label={loadingDist ? 'Loading...' : 'District (From)'}
                        data={fromDistList}
                        value={fromDist}
                        onItemSelect={setFromDist}
                        style={styles.input}
                    />

                    <Dropdown
                        label={loadingMills ? 'Loading...' : 'Flour Mill (From)'}
                        data={millsList}
                        value={mill}
                        onItemSelect={setMill}
                        style={styles.input}
                    />

                    <TextInput
                        mode="flat"
                        label="Flour Mill Name (Optional)"
                        placeholder="(Optional)"
                        value={millName}
                        onChangeText={setMillName}
                        style={styles.input}
                        returnKeyType='next'
                    />

                    <TextInput
                        mode="flat"
                        label="Licence No"
                        placeholder="TS-1234"
                        value={licenseNo}
                        onChangeText={setLicenseNo}
                        style={styles.input}
                        returnKeyType='next'
                    />

                    <TextInput
                        mode="flat"
                        label="Agent Name"
                        placeholder="Enter Full Name"
                        value={agentName}
                        onChangeText={setAgentName}
                        style={styles.input}
                        returnKeyType='next'
                    />

                    <TextInput
                        mode="flat"
                        label="Agent CNIC"
                        placeholder="17301-1122334-4"
                        value={agentCNIC}
                        onChangeText={setAgentCNIC}
                        style={styles.input}
                        returnKeyType='next'
                        keyboardType='number-pad'
                        render={props =>
                            <MaskInput
                                {...props}
                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]}
                            />
                        }
                    />

                    <TextInput
                        mode="flat"
                        label="Agent Cell No"
                        placeholder="0313 1234567"
                        value={agentCellNo}
                        onChangeText={setAgentCellNo}
                        style={styles.input}
                        returnKeyType='next'
                        keyboardType='number-pad'
                        render={props =>
                            <MaskInput
                                {...props}
                                mask={[/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                            />
                        }
                    />

                    <TextInput
                        mode="flat"
                        label="Permit No"
                        placeholder="ABC-123456"
                        value={permitNo}
                        onChangeText={setPermitNo}
                        style={styles.input}
                        // keyboardType='number-pad'
                        returnKeyType='next'
                    />

                    <DateTimePickerInput
                        label='Validity of Permit'
                        mode='date'
                        format='DD MMM YYYY'
                        date={permitExpiry}
                        style={styles.input}
                        onChange={setPermitExpiry}
                    />

                    <Dropdown
                        label='Bardana'
                        data={bardanaTypes}
                        value={bardanaType}
                        onItemSelect={setBardanaType}
                        style={styles.input}
                    />


                    <TextInput
                        mode="flat"
                        label="No of Bags"
                        placeholder="0"
                        value={noOfBags}
                        onChangeText={setNoOfBags}
                        style={styles.input}
                        keyboardType='number-pad'
                        returnKeyType='next'
                    />

                    <Dropdown
                        label='District (To)'
                        data={toDistList}
                        value={toDist}
                        onItemSelect={setToDist}
                        style={styles.input}
                    />

                    <Dropdown
                        label={loadingDealers ? 'Loading...' : 'Dealer'}
                        data={dealersList}
                        value={dealer}
                        onItemSelect={setDealer}
                        style={styles.input}
                    />


                    <TextInput
                        mode="flat"
                        label="Truck No"
                        placeholder="Registration No (AB-1234)"
                        value={truckNo}
                        onChangeText={setTruckNo}
                        style={styles.input}
                        returnKeyType='next'
                    />

                    <DateTimePickerInput
                        label='Time and Date'
                        mode='datetime'
                        format='DD MMM YYYY hh:mm a'
                        date={entryDate}
                        style={styles.input}
                        onChange={setEntryDate}
                    />

                    <Button
                        mode="contained"
                        style={styles.btn}
                        loading={sendingData}
                        onPress={submit}>
                        Save
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
};

export default TrackAtta;

const styles = StyleSheet.create({
    ...CommonStyle,
    container: {
        padding: moderateScale(20)
    },
    input: {
        marginBottom: 40,
        backgroundColor: 'transparent'
    },
    qrcode: {
        padding: moderateScale(20),
        justifyContent: 'center',
        alignItems: 'center',
    }
});
