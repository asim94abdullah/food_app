import * as React from 'react';
import { Text, View, StyleSheet, Alert, ScrollView } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { TypeDropdownItem, UserProfile } from '../../common/Type';
import { useNavigation } from '@react-navigation/native';
import Api from '../../api';
import { formatDateForServer, getDataFrom, handleError } from '../../common/Utils';
import { moderateScale } from 'react-native-size-matters';
import Dropdown from '../../components/Dropdown';
import { Button, TextInput } from 'react-native-paper';
import DateTimePickerInput from '../../components/DateTimePickerInput';
import { CommonStyle } from '../../common/Theme';

interface AttaReceivingProps { }

const AttaReceiving = (props: AttaReceivingProps) => {

    const bardanaTypes = useSelector<RootState, TypeDropdownItem[]>(state => state.data.bardanaTypes)
    const provincesList = useSelector<RootState, TypeDropdownItem[]>(state => state.data.provinceList)
    const User = useSelector<RootState, UserProfile>(state => state.data.user);

    const [province, setProvince] = React.useState<TypeDropdownItem | undefined>()
    const [fromDistList, setFromDistList] = React.useState<TypeDropdownItem[]>([])
    const [fromDist, setFromDist] = React.useState<TypeDropdownItem | undefined>()
    const [bardanaType, setBardanaType] = React.useState<TypeDropdownItem | undefined>()
    const [noOfBags, setNoOfBags] = React.useState('')
    const [entryDate, setEntryDate] = React.useState<Date | undefined>()
    const [truckNo, setTruckNo] = React.useState('')

    const [sendingData, setSendingData] = React.useState(false)
    const [loadingDist, setLoadingDist] = React.useState(false)

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const isDataOk = () => {
        if (!province) {
            Alert.alert("Message", "Please select a province you're receiving from")
            return false
        }
        else if (!fromDist) {
            Alert.alert("Message", "Please select a District")
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
        else if (!entryDate) {
            Alert.alert("Message", "Please select receiving date")
            return false
        }
        // else if (truckNo.trim() == "") {
        //     Alert.alert("Message", "Please enter truck No")
        //     return false
        // }
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
        data.append("dated", formatDateForServer(entryDate))
        data.append("truck_no", truckNo?.trim())
        data.append("atta_bardana_type_id", bardanaType.id)
        data.append("no_of_bags", noOfBags.trim())

        api.addDealerReceiving(data)
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

    return (
        <Container>
            <Header title='Atta Receiving' />

            <ScrollView>
                <View style={styles.container}>
                    <Dropdown
                        label='Atta Receiving (From)'
                        data={provincesList}
                        value={province}
                        onItemSelect={setProvince}
                        style={styles.input}
                    />

                    <Dropdown
                        label={loadingDist ? 'Loading...' : 'District'}
                        data={fromDistList}
                        value={fromDist}
                        onItemSelect={setFromDist}
                        style={styles.input}
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

                    <DateTimePickerInput
                        label='Receiving Date'
                        mode='date'
                        format='DD MMM YYYY'
                        date={entryDate}
                        style={styles.input}
                        onChange={setEntryDate}
                    />

                    <TextInput
                        mode="flat"
                        label="Truck No"
                        placeholder="(Optional)"
                        value={truckNo}
                        onChangeText={setTruckNo}
                        style={styles.input}
                        returnKeyType='next'
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

export default AttaReceiving;

const styles = StyleSheet.create({
    ...CommonStyle,
    container: {
        padding: moderateScale(20)
    },
    input: {
        marginBottom: 40,
        backgroundColor: 'transparent'
    }
});
