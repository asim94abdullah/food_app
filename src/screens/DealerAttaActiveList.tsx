import * as React from 'react';
import { Text, View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import Container from '../components/Container';
import Header from '../components/Header';
import { Color, Fonts } from '../common/Constants';
import { Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../api';
import { RootState } from '../redux/store';
import { UserProfile } from '../common/Type';
import { getDataFrom, handleError } from '../common/Utils';
import { moderateScale } from 'react-native-size-matters';
import { CommonStyle } from '../common/Theme';

interface DealerAttaActiveListProps { }

const DealerAttaActiveList = (props: DealerAttaActiveListProps) => {

    const [data, setData] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)

    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const getActiveList = () => {
        api.getDealerAttaActiveList()
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    setData(respData.dealer_list)
                }
                setIsLoading(false)
            })
            .catch(error => {
                handleError(error)
                setIsLoading(false)
            })
    }

    React.useEffect(getActiveList, [])

    const onRefresh = () => {
        setIsLoading(true);
        getActiveList()
    };

    const removeItem = (index: number) => {
        const items = [...data]
        items.splice(index, 1)
        setData(items)
    }

    return (
        <Container>
            <Header title='Active Transits' />
            <View style={{ flex: 1 }}>

                <FlatList
                    data={data}
                    // style={styles.container}
                    ListEmptyComponent={() => <Text style={[styles.txtSmall, { alignSelf: 'center', }]}>{isLoading ? '' : "\n\nThere's no data in active list"}</Text>}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                    }
                    renderItem={({ item, index }) => <ActiveCard
                        item={item}
                        index={index}
                        removeItem={removeItem} />
                    }
                />

            </View>
        </Container>
    );
};

const ActiveCard = ({ item, index, removeItem }) => {

    const [isLoading, setIsLoading] = React.useState(false)

    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const markReveive = () => {
        if (isLoading) {
            return
        }
        Alert.alert("Message", "You are about to mark this item as received. Do you want to continue?", [
            { text: 'No' },
            {
                text: 'Yes', onPress: () => {
                    api.dealerMarkAttaReceive(item.id)
                        .then(response => {
                            const respData = getDataFrom(response)
                            if (respData) {
                                Alert.alert("Message", respData.title || "Operation successful")
                                removeItem(index)
                            }
                            setIsLoading(false)
                        })
                        .catch(error => {
                            handleError(error)
                            setIsLoading(false)
                        })
                }
            }
        ])
    }

    return <Card style={styles.card}>
        <Card.Content>
            <View style={[styles.row, { marginBottom: 0, }]}>
                <Card.Title title={(index + 1) + ' # ' + item.agent_name} style={styles.cell} />

            </View>
            <Card.Content>
                {/* Date, Name, NIC, Contact, address, Bags (size, qty) */}
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>CNIC No:</Text>
                        <Text style={styles.txtSmall}>{item.agent_cnic || "-"}</Text>
                    </View>

                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>Truck No:{' '}</Text>
                        <Text style={styles.txtSmall}>{item.truck_no}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>Permit No:{' '}</Text>
                        <Text style={styles.txtSmall}>{item.permit_no}</Text>
                    </View>

                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>No of Bags:{' '}</Text>
                        <Text style={styles.txtSmall}>{item.bags}</Text>
                    </View>


                </View>

                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>From:{' '}</Text>
                        <Text style={styles.txtSmall}>{item.from_province}</Text>
                    </View>

                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>To:{' '}</Text>
                        <Text style={styles.txtSmall}>{item.to_district}</Text>
                    </View>
                </View>

                <Button
                    mode="contained"
                    style={styles.btn1}
                    loading={isLoading}
                    onPress={markReveive}>
                    Receive
                </Button>
            </Card.Content>
        </Card.Content>
    </Card>
}

export default DealerAttaActiveList;

const styles = StyleSheet.create({
    // ...CommonStyle,
    container: {
        // padding: 20,
    },
    loader: {
        alignSelf: 'center',
        margin: moderateScale(30),
    },
    card: {
        marginHorizontal: 20,
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
    },
    btn1: {
        borderRadius: moderateScale(10),
        marginTop: moderateScale(20),
        height: moderateScale(40),
        width: moderateScale(150),
        justifyContent: 'center',
        alignSelf: 'center',
    }
});
