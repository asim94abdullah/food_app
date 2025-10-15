import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../api';
import { Color, Fonts, Routes } from '../common/Constants';
import { UserProfile } from '../common/Type';
import { getDataFrom, handleError } from '../common/Utils';
import Container from '../components/Container';
import Header from '../components/Header';
import { RootState } from '../redux/store';

interface DealerReceivedStockProps { }

const DealerReceivedStock = (props: DealerReceivedStockProps) => {

    const [isLoaing, setIsLoading] = React.useState(true)
    const [history, setHistory] = React.useState([])
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const getHistory = () => {
        // setIsLoading(true)
        api.getRecievedStock()
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
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

    const renderCard = ({ item, index }) => <Card style={styles.card} >
        <Card.Content>
            <View style={[styles.row, { marginBottom: 0, }]}>
                <Card.Title title={(index + 1) + " # " + item.name} style={styles.cell} />
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
                        <Text style={styles.txtBold}>Received Date:{' '}</Text>
                        <Text style={styles.txtSmall}>{item.issued_date}</Text>
                    </View>

                    <View style={styles.cell}>
                        <Text style={styles.txtBold}>Received</Text>
                        <Text style={styles.txtSmall}>{item.issued_qty} KG</Text>
                    </View>
                </View>

            </Card.Content>
        </Card.Content>
    </Card>

    return (
        <Container>
            <Header title='Received Stock' />
            <View style={styles.container}>
                {isLoaing ?
                    <ActivityIndicator color={Color.Green} size='large' style={{ alignSelf: 'center', margin: 20 }} /> :
                    <FlatList
                        data={history}
                        ListEmptyComponent={() => <Text style={styles.label}>There's nothing in received stock</Text>}
                        style={{ marginBottom: 60 }}
                        renderItem={renderCard} />}
            </View>
        </Container>
    );
};

export default DealerReceivedStock;

const styles = StyleSheet.create({
    container: {},
    card: {
        marginHorizontal: 20,
        marginVertical: 10
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
    label: {
        alignSelf: 'center',
        marginTop: 20,
        fontFamily: Fonts.UniNeueRegular
    }
});
