import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../api';
import { Color, Fonts } from '../common/Constants';
import { UserProfile } from '../common/Type';
import { getDataFrom, handleError } from '../common/Utils';
import Container from '../components/Container';
import DateTimePickerInput from '../components/DateTimePickerInput';
import Header from '../components/Header';
import { RootState } from '../redux/store';

interface DealerReceivingFormProps { }

const DealerReceivingForm = (props: DealerReceivingFormProps) => {
    const { item, refreshData } = useRoute().params

    const [isLoading, setIsLoading] = React.useState(false)
    const [receiveDate, setReceiveDate] = React.useState(new Date())
    const [receiveQty, setReceiveQty] = React.useState('')
    const [noOfBags, setNoOfBags] = React.useState('')

    const navigation = useNavigation()
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const onSubmit = () => {
        if (!receiveDate) {
            Alert.alert("Message", "Please select receiving date")
            return
        }
        else if (receiveQty.trim() == "") {
            Alert.alert("Message", "Please enter receiving quantity")
            return
        }
        else if (noOfBags.trim() == "") {
            Alert.alert("Message", "Please enter Number of Bags")
            return
        }
        else if (parseFloat(receiveQty) > parseFloat(item.issued_qty)) {
            Alert.alert("Message", "Receiving quantity should not exceed issued quantity")
            return
        }


        setIsLoading(true)
        const data = new FormData()
        data.append("issued_id", item.issued_id)
        data.append("received_date", moment(receiveDate).format("YYYY-MM-DD"))
        data.append("received_qty", receiveQty.trim())
        data.append("rec_no_of_bags", noOfBags.trim())

        api.receiveStock(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    // console.log('respData', respData);
                    Alert.alert("Message", respData.title || "Data saved successfully")
                    refreshData && refreshData()
                    navigation.goBack()
                }
                setIsLoading(true)
            })
            .catch(error => {
                handleError(error)
                setIsLoading(false)
            })
    }

    React.useEffect(() => {
        const no = parseFloat(noOfBags)
        const weight = parseFloat(item.title?.toLowerCase()?.replace("kg", ""))
        if (isNaN(no) || isNaN(weight)) {
            setReceiveQty("")
            return
        }
        // console.log('qty', no * weight);
        setReceiveQty((no * weight) + "")
    }, [noOfBags])

    return (
        <Container>
            <Header title='Receive Stock' />
            <ScrollView>
                <View style={styles.container}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={[styles.row, { marginBottom: 0, }]}>
                                <Card.Title title={item.name} style={styles.cell} />
                                <Text style={styles.txtBold}></Text>
                            </View>
                            <Card.Content>
                                {/* Date, Name, NIC, Contact, address, Bags (size, qty) */}
                                <View style={styles.row}>
                                    <View style={styles.cell}>
                                        <Text style={styles.txtBold}>Type</Text>
                                        <Text style={styles.txtSmall}>{item.title}</Text>
                                    </View>

                                    <View style={styles.cell}>
                                        <Text style={styles.txtBold}>No of Bags:</Text>
                                        <Text style={styles.txtSmall}>{item.no_of_bags}</Text>
                                    </View>

                                </View>

                                <View style={styles.row}>
                                    <View style={styles.cell}>
                                        <Text style={styles.txtBold}>Issue Date:{' '}</Text>
                                        <Text style={styles.txtSmall}>{item.issued_date}</Text>
                                    </View>

                                    <View style={styles.cell}>
                                        <Text style={styles.txtBold}>Issued</Text>
                                        <Text style={styles.txtSmall}>{item.issued_qty} KG</Text>
                                    </View>
                                </View>

                            </Card.Content>
                        </Card.Content>
                    </Card>

                    <DateTimePickerInput
                        label='Receiving Date'
                        date={receiveDate}
                        onChange={setReceiveDate}
                        mode='date'
                        style={styles.input}
                        format='DD MMM YYYY' />

                    <TextInput
                        mode="flat"
                        label={"Number of Bags"}
                        placeholder={"Enter a number"}
                        value={noOfBags}
                        onChangeText={setNoOfBags}
                        style={styles.input}
                        keyboardType='phone-pad'
                        returnKeyType='done'
                    />

                    <TextInput
                        mode="flat"
                        label={"Receiving Quantity (KG)"}
                        placeholder={"KG"}
                        value={receiveQty}
                        onChangeText={setReceiveQty}
                        style={styles.input}
                        keyboardType='phone-pad'
                        returnKeyType='next'
                    />

                    <Button
                        mode="contained"
                        style={styles.input}
                        loading={isLoading}
                        onPress={onSubmit}>
                        Submit
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
};

export default DealerReceivingForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
    },
    card: {
        marginVertical: 30
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    cell: {
        flex: 1
    },
    txtBold: {
        fontFamily: Fonts.UniNeueBold,
        color: Color.textDark,
        fontSize: 10,
    },
    txtSmall: {
        fontFamily: Fonts.UniNeueRegular,
        color: Color.textLight,
        fontSize: 10
    },
    input: {
        marginBottom: moderateScale(35)
    }
});
