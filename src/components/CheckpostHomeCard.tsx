import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CommonStyle } from '../common/Theme';
import { moderateScale } from 'react-native-size-matters';
import { Color } from '../common/Constants';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { UserProfile } from '../common/Type';

interface CheckpostHomeCardProps {
    data: any
}

const CheckpostHomeCard = ({ data }: CheckpostHomeCardProps) => {
    const User = useSelector<RootState, UserProfile>(state => state.data.user);

    return (
        <View style={styles.card}>
            <Text style={styles.userName}>{'\n'}Checkpost Details</Text>
            <View style={styles.row}>
                <Text style={styles.title}>{User?.name}</Text>
                <Text style={styles.title}>MT</Text>
            </View>

            <View style={[styles.row, { marginBottom: 0, }]}>
                <Text style={styles.userName}>{data?.total_no_trucks} Vehicle Passed</Text>
                <Text style={styles.userName}>{data?.qty_mt}</Text>
            </View>

            <Text style={styles.userName}>Total No of Bags {data?.bags}</Text>

        </View >
    );
};

export default CheckpostHomeCard;

const styles = StyleSheet.create({
    ...CommonStyle,
    card: {
        width: '100%',
        // height: 200,
        backgroundColor: Color.Blue,
        borderRadius: moderateScale(20),
        marginBottom: 30,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'flex-end',
        padding: moderateScale(15)
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
        // marginVertical: 20,
        // alignSelf: 'center',
        // textAlign: 'center',
        fontSize: 12,
        marginBottom: moderateScale(10)
    },
    row: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        marginBottom: moderateScale(10)
    }
});
