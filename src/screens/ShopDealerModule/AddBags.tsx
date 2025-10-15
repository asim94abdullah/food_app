import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../api';
import { CommonStyle } from '../../common/Theme';
import { UserProfile } from '../../common/Type';
import { getDataFrom, handleError } from '../../common/Utils';
import Container from '../../components/Container';
import DateTimePickerInput from '../../components/DateTimePickerInput';
import Header from '../../components/Header';
import RadioButton from '../../components/RadioButton';
import { setStockTotal } from '../../redux/slices/dataSlice';
import { RootState } from '../../redux/store';

interface AddBagsProps { }

const AddBags = (props: AddBagsProps) => {

    const [isLoading, setIsLoading] = React.useState(false)
    const [noOfBags, setNoOfBags] = React.useState('')
    const [receivDate, setReceivDate] = React.useState()
    const [is20KG, setIs20KG] = React.useState(!true)

    const navigation = useNavigation()
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const stockTotal = useSelector<RootState, number>(state => state.data.stockTotal);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)
    

    const submitData = () => {
        if (noOfBags.trim() == "") {
            Alert.alert("Message", "Please enter number of bags you received today")
            return
        }
        else if (!receivDate) {
            Alert.alert("Message", "Please select the date when you receive these number of bags")
            return
        }

        setIsLoading(true)
        const data = new FormData()
        data.append('bag_size_kg', is20KG ? "20" : "10");
        data.append('num_of_bags', noOfBags.trim());
        data.append('receiving_date', moment(receivDate).format("YYYY-MM-DD"));
        

        api.addOpeningBags(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    // respData.data?.total_kg
                    // dispatch(setStockOut(
                    //     // Math.max(0, 
                    //     (parseFloat(stockOut) + parseFloat(totalQty))
                    //     // )
                    // ))

                    dispatch(setStockTotal(
                        Math.max(0,
                            (parseFloat(respData.data?.total_kg) + parseFloat(stockTotal))
                        )
                    ))
                    Alert.alert("Message", respData.title || "Bags added successfully")
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
            <Header title='Add Bags' />
            <ScrollView>
                <View style={styles.container}>
                    <Text style={[styles.label, { alignSelf: 'center', marginBottom: 20 }]}>Please add the number of bags you received</Text>

                    {/* <View style={styles.row}>
                        <Text style={styles.label}>Size of type:</Text>
                        <RadioButton
                            label="10 KG"
                            checked={!is20KG}
                            onPress={() => setIs20KG(false)}
                            style={[styles.label, { marginRight: 30, marginLeft: 20, }]}
                        />

                        <RadioButton
                            label="20 KG"
                            checked={is20KG}
                            onPress={() => setIs20KG(true)}
                        />
                    </View> */}


                    <TextInput
                        mode="flat"
                        label="No of Bags"
                        placeholder="0"
                        placeholderTextColor={'rgba(0,0,0,.7)'}
                        value={noOfBags}
                        onChangeText={setNoOfBags}
                        style={styles.input}
                        keyboardType='number-pad'
                        returnKeyType='send'
                    />

                    <DateTimePickerInput
                        label='Receiving date'//'Transportation Time'
                        date={receivDate}
                        mode='date'
                        format='DD MMM YYYY'
                        style={styles.input}
                        onChange={setReceivDate}
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

export default AddBags;

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
