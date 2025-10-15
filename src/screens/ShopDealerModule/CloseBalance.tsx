import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../api';
import { Routes } from '../../common/Constants';
import { CommonStyle } from '../../common/Theme';
import { UserProfile } from '../../common/Type';
import { getDataFrom, handleError } from '../../common/Utils';
import Container from '../../components/Container';
import DateTimePickerInput from '../../components/DateTimePickerInput';
import Header from '../../components/Header';
import { RootState } from '../../redux/store';

interface CloseBalanceProps { }

const CloseBalance = (props: CloseBalanceProps) => {

    const [isLoading, setIsLoading] = React.useState(false)
    const [ob, setOb] = React.useState('')
    const [noOfSoldBags, setNoOfSoldBags] = React.useState('')
    const [noOfRemainigBags, setNoOfRemainigBags] = React.useState('')
    const [comments, setComments] = React.useState('')
    const [closeDate, setCloseDate] = React.useState()

    const navigation = useNavigation()
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const submitData = () => {
        if (ob.trim() == "") {
            Alert.alert("Message", "Please enter opening balance")
            return
        }
        else if (noOfSoldBags.trim() == "") {
            Alert.alert("Message", "Please enter number of bags you sold today")
            return
        }
        else if (noOfRemainigBags.trim() == "") {
            Alert.alert("Message", "Please enter number of remaining bags")
            return
        }
        else if (!closeDate) {
            Alert.alert("Message", "Please select a date")
            return
        }

        setIsLoading(true)
        const data = new FormData()

        data.append('ob_bags', ob.trim());
        data.append('receive_bags', noOfRemainigBags.trim());
        data.append('sold_bags', noOfSoldBags.trim());
        data.append('receiving_date', moment(closeDate).format("YYYY-MM-DD"));
        data.append('comments', comments.trim());

        api.addClosingBags(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    Alert.alert("Message", respData.title || "Record saved successfully")
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
            <Header title='Closing Bags' />
            <ScrollView>
                <View style={styles.container}>
                    {/* <Text style={[styles.label, { alignSelf: 'center', }]}>Please add the number of bags you received</Text> */}

                    <TextInput
                        mode="flat"
                        label="Opening Balance"
                        placeholder="0"
                        placeholderTextColor={'rgba(0,0,0,.7)'}
                        value={ob}
                        onChangeText={setOb}
                        style={styles.input}
                        keyboardType='number-pad'
                        returnKeyType='done'
                    />

                    <TextInput
                        mode="flat"
                        label="No of Sold Bags"
                        placeholder="0"
                        placeholderTextColor={'rgba(0,0,0,.7)'}
                        value={noOfSoldBags}
                        onChangeText={setNoOfSoldBags}
                        style={styles.input}
                        keyboardType='number-pad'
                        returnKeyType='done'
                    />

                    <TextInput
                        mode="flat"
                        label="No of Remaining Bags"
                        placeholder="0"
                        placeholderTextColor={'rgba(0,0,0,.7)'}
                        value={noOfRemainigBags}
                        onChangeText={setNoOfRemainigBags}
                        style={styles.input}
                        keyboardType='number-pad'
                        returnKeyType='done'
                    />

                    <DateTimePickerInput
                        label='Closing date'
                        date={closeDate}
                        mode='date'
                        format='DD MMM YYYY'
                        style={styles.input}
                        onChange={setCloseDate}
                    />

                    <TextInput
                        mode="flat"
                        label="Comments"
                        placeholder="(Optional)"
                        placeholderTextColor={'rgba(0,0,0,.7)'}
                        value={comments}
                        onChangeText={setComments}
                        style={styles.input}
                        returnKeyType='done'
                    />

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

export default CloseBalance;

const styles = StyleSheet.create({
    ...CommonStyle,
    container: {
        padding: 20
    },
    input: {
        marginTop: 25,
        backgroundColor: 'transparent',
        marginBottom: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginLeft: 10
    },
});
