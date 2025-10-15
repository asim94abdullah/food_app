import * as React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { Button, TextInput } from 'react-native-paper';
import { CommonStyle } from '../../common/Theme';
import { moderateScale } from 'react-native-size-matters';
import Dropdown from '../../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { TypeDropdownItem, UserProfile } from '../../common/Type';
import { useNavigation } from '@react-navigation/native';
import Api from '../../api';
import DateTimePickerInput from '../../components/DateTimePickerInput';
import { formatDateForServer, getDataFrom, handleError } from '../../common/Utils';

interface AttaClosingProps { }

const AttaClosing = (props: AttaClosingProps) => {

    const bardanaTypes = useSelector<RootState, TypeDropdownItem[]>(state => state.data.bardanaTypes)
    const User = useSelector<RootState, UserProfile>(state => state.data.user);

    const [bardanaType, setBardanaType] = React.useState<TypeDropdownItem | undefined>()
    const [receivQty, setReceivQty] = React.useState('')
    const [consumQty, setConsumQty] = React.useState('')
    const [todayBalance, setTodayBalance] = React.useState('')
    const [netBalance, setNetBalance] = React.useState('')
    const [entryDate, setEntryDate] = React.useState<Date | undefined>()
    const [isLoading, setIsLoading] = React.useState(false)

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const isDataOk = () => {
        if (!bardanaType) {
            Alert.alert("Message", "Please select bardana type")
            return
        }
        else if (receivQty.trim() == "") {
            Alert.alert("Message", "Please enter bags received today")
            return
        }
        else if (consumQty.trim() == "") {
            Alert.alert("Message", "Please enter bags consumed today")
            return
        }
        else if (todayBalance.trim() == "") {
            Alert.alert("Message", "Please enter today balance")
            return
        }
        // else if (netBalance.trim() == "") {
        //     Alert.alert("Message", "Please enter net balance")
        //     return
        // }
        else if (!entryDate) {
            Alert.alert("Message", "Please select entery date")
            return
        }
        return true
    }
    const submitData = () => {
        if (isLoading || !isDataOk()) {
            return
        }

        setIsLoading(true)
        const data = new FormData()
        data.append("dated", formatDateForServer(entryDate))
        data.append("atta_bardana_type_id", bardanaType.id)
        data.append("today_received_bags", receivQty.trim())
        data.append("today_consumed_bags", consumQty.trim())
        data.append("today_balance_bags", todayBalance.trim())
        data.append("net_balance_bags", netBalance?.trim())

        api.addDealerConcilation(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    Alert.alert("Message", respData.title || "Data saved successfully")
                    navigation.goBack()
                }
                setIsLoading(false)
            })
            .catch(error => {
                handleError(error)
                setIsLoading(false)
            })
    }

    return (
        <Container>
            <Header title='Atta Closing' />

            <View style={styles.container}>

                <Dropdown
                    label='Bardana'
                    data={bardanaTypes}
                    value={bardanaType}
                    onItemSelect={setBardanaType}
                    style={styles.input}
                />

                <TextInput
                    mode="flat"
                    label="Total Bags Received Today"
                    placeholder="0"
                    placeholderTextColor={'rgba(0,0,0,.7)'}
                    value={receivQty}
                    onChangeText={setReceivQty}
                    style={styles.input}
                    keyboardType='number-pad'
                    returnKeyType='next'
                />

                <TextInput
                    mode="flat"
                    label="Total Consumed Bags"
                    placeholder="0"
                    placeholderTextColor={'rgba(0,0,0,.7)'}
                    value={consumQty}
                    onChangeText={setConsumQty}
                    style={styles.input}
                    keyboardType='number-pad'
                    returnKeyType='next'
                />

                <TextInput
                    mode="flat"
                    label="Balance"
                    placeholder="0"
                    placeholderTextColor={'rgba(0,0,0,.7)'}
                    value={todayBalance}
                    onChangeText={setTodayBalance}
                    style={styles.input}
                    keyboardType='number-pad'
                    returnKeyType='next'
                />

                {/* <TextInput
                    mode="flat"
                    label="Net Balance"
                    placeholder="0"
                    placeholderTextColor={'rgba(0,0,0,.7)'}
                    value={netBalance}
                    onChangeText={setNetBalance}
                    style={styles.input}
                    keyboardType='number-pad'
                    returnKeyType='next'
                /> */}

                <DateTimePickerInput
                    label='Date'
                    mode='date'
                    format='DD MMM YYYY'
                    date={entryDate}
                    style={styles.input}
                    onChange={setEntryDate}
                />

                <Text>{'\n\n'}</Text>

                <Button
                    mode="contained"
                    style={styles.btn}
                    loading={isLoading}
                    onPress={submitData}>
                    Save
                </Button>

            </View>
        </Container>
    );
};

export default AttaClosing;

const styles = StyleSheet.create({
    ...CommonStyle,
    container: {
        padding: moderateScale(20)
    },
    input: {
        marginTop: 25,
        backgroundColor: 'transparent',
    },
});
