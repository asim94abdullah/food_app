import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { Color, UserType } from '../common/Constants';
import { CommonStyle } from '../common/Theme';
import { UserProfile } from '../common/Type';
import { RootState } from '../redux/store';
import RingChart from './RingChart';

interface StockDetailsProps { }

const StockDetails = (props: StockDetailsProps) => {
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const stockTotal = useSelector<RootState, number>(state => state.data.stockTotal)
    const stockIn = useSelector<RootState, number>(state => state.data.stockIn)
    const stockOut = useSelector<RootState, number>(state => state.data.stockOut)

    const formatQty = (value: string) => {
        return value + " KG"
    }

    const getNoOfBags = (qty: any) => {
        const bags = parseInt(qty) / 10
        return bags > -1 ? bags : "-"
    }

    const _getNoOfBags = (qty: any) => {
        const bags = parseInt(qty) / 10
        // return 13
        return bags > -1 ? bags : 0
    }

    return (
        <View style={[styles.card, { backgroundColor: _getNoOfBags(stockTotal) > 10 ? Color.Green : "#EF5350" }]}>
            <View style={{ width: '100%', position: 'absolute', height: '100%' }}>
                <View style={styles.fill}>
                    <View style={{ flex: 1, alignItems: 'center', }}>
                        <Text style={styles.userName}>Business Name: {'\n' + User?.name}</Text>
                        {/* <View style={{ width: '100%', position: 'absolute', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                            <Text style={styles.title}>{stockPercentage}%</Text>
                                        </View> */}
                        <RingChart progress={formatQty(stockTotal)} />
                        {User?.user_type == UserType.Shop_Seller && <Text style={styles.titleSm}>Number of Bags: {getNoOfBags(stockTotal)}</Text>}
                    </View>

                </View>
            </View>

            <View style={[styles.fill, { padding: 15 }]}>
                <Text style={[styles.titleSm, { fontWeight: 'bold' }]}>Stock Issued:</Text>
                <Text style={styles.titleSm}>{formatQty(stockOut)} ({getNoOfBags(stockOut)} Bag{getNoOfBags(stockOut) == 1 ? "" : "s"})</Text>
            </View>

            <View style={[styles.fill, { alignItems: 'flex-end', padding: 15 }]}>
                <Text style={[styles.titleSm, { fontWeight: 'bold' }]}>Stock Received:</Text>
                <Text style={styles.titleSm}>{formatQty(stockIn)} ({getNoOfBags(stockIn)} Bag{getNoOfBags(stockIn) == 1 ? "" : "s"})</Text>
            </View>
        </View>
    );
};

export default StockDetails;

const styles = StyleSheet.create({
    ...CommonStyle,
    card: {
        width: '100%',
        height: 200,
        // backgroundColor: Color.Green,
        borderRadius: moderateScale(10),
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        // padding: 20
    },
    title: {
        fontSize: 25,
        color: Color.White,
        // fontFamily: Fonts.UniNeueBlack,
        fontWeight: 'bold',
    },
    titleSm: {
        fontSize: 12,
        color: Color.White,
    },
    titleSmGreen: {
        fontSize: 12,
        color: Color.Green,
    },
    userName: {
        color: Color.White,
        marginVertical: 20,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 12
    },
});
