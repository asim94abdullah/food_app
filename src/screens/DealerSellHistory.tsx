import * as React from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../api';
import { Color, Fonts } from '../common/Constants';
import { UserProfile } from '../common/Type';
import { getDataFrom, handleError } from '../common/Utils';
import Container from '../components/Container';
import Header from '../components/Header';
import { RootState } from '../redux/store';

interface DealerSellHistoryProps { }

const DealerSellHistory = (props: DealerSellHistoryProps) => {
    const [isLoaing, setIsLoading] = React.useState(true)
    const [responseData, setResponseData] = React.useState()
    const [history, setHistory] = React.useState([])
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const getHistory = (fromDate?: string, toDate?: string) => {
        setIsLoading(true)
        api.getDealerSellHistory(User.user_type, fromDate, toDate)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    setResponseData(respData)
                    setHistory(respData.data)
                }
                setIsLoading(false)
            })
            .catch(error => {
                handleError(error)
                setIsLoading(false)
            })
    }

    React.useEffect(getHistory, [])

    const renderCard = ({ item, index }) => <Card style={styles.card}>
        <Card.Content>
            <View style={[styles.row, { marginBottom: 0, }]}>
                <Card.Title title={(index + 1) + ' # ' + item.citizen_name} style={styles.cell} />
                <Text style={styles.txtBold}>No of Bags: {item.no_of_bags} of {item.title}</Text>
            </View>
            <Card.Content>
                {/* Date, Name, NIC, Contact, address, Bags (size, qty) */}
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>CNIC</Text>
                        <Text style={styles.txtSmall}>{item.cnic}</Text>
                    </View>

                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>Contact No.</Text>
                        <Text style={styles.txtSmall}>{item.contact_no || "-"}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>Date:{' '}</Text>
                        <Text style={styles.txtSmall}>{item.dated}</Text>
                    </View>

                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>Quantity</Text>
                        <Text style={styles.txtSmall}>{item.qty} Kg</Text>
                    </View>
                </View>



                <View style={styles.row}>
                    <Text style={styles.txtBold}>Address:{' '}</Text>
                    <Text style={styles.txtSmall}>{item.address}</Text>

                </View>
            </Card.Content>
        </Card.Content>
    </Card>

    const filterOnDate = (fromDate?: string, toDate?: string) => {
        if (isLoaing) {
            Alert.alert("Message", "Please wait for previous request to load")
            return
        }
        setHistory([])
        setResponseData(undefined)
        getHistory(fromDate, toDate)
    }

    return (
        <Container>
            <Header title='Sell Hsitory' onDateChange={filterOnDate} />
            {isLoaing ?
                <ActivityIndicator color={Color.Green} size='large' style={{ alignSelf: 'center', margin: 20 }} /> :
                <View style={styles.container}>
                    {responseData &&
                        <Card style={[styles.card, { backgroundColor: Color.Blue, }]}>
                            <Card.Content>
                                {/* <View style={styles.box}> */}
                                <Text style={styles.heading2}>{responseData?.total_beneficiries}</Text>
                                <Text style={styles.heading1}>Total Beneficiaries{'\n'}</Text>
                                {/* </View> */}
                                <View style={styles.row}>
                                    <View style={styles.box}>
                                        <Text style={styles.heading2}>{responseData?.total_one_bags}</Text>
                                        <Text style={styles.heading1}>One bag</Text>
                                    </View>

                                    <View style={styles.box}>
                                        <Text style={styles.heading2}>{responseData?.total_two_bags}</Text>
                                        <Text style={styles.heading1}>Two bags</Text>
                                    </View>

                                    <View style={styles.box}>
                                        <Text style={styles.heading2}>{responseData?.total_three_bags}</Text>
                                        <Text style={styles.heading1}>Three bags</Text>
                                    </View>
                                    {/* <Text>One bag</Text>
                                <Text>Two bags</Text>
                                <Text>Three bags</Text> */}
                                </View>
                            </Card.Content>
                        </Card>
                    }
                    <FlatList
                        data={history}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => <Text style={{ alignSelf: 'center', }}>No data to display</Text>}
                        renderItem={renderCard} />
                </View>
            }
        </Container>
    );
};

export default DealerSellHistory;

const styles = StyleSheet.create({
    container: {
        padding: 20
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
    box: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading1: {
        fontFamily: Fonts.UniNeueRegular,
        color: Color.White,
        fontSize: 10,
        textAlign: 'center',
        alignSelf: 'center',
    },
    heading2: {
        fontFamily: Fonts.UniNeueBold,
        color: Color.White,
        fontSize: 20,
        textAlign: 'center',
        alignSelf: 'center',
    }
});
