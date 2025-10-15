import * as React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { CommonStyle } from '../../common/Theme';
import { moderateScale } from 'react-native-size-matters';
import { Color, Fonts } from '../../common/Constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserProfile } from '../../common/Type';
import Api from '../../api';
import { getDataFrom, handleError } from '../../common/Utils';

interface CheckpostSummaryProps { }

const CheckpostSummary = (props: CheckpostSummaryProps) => {

    const User = useSelector<RootState, UserProfile>(state => state.data.user);

    const [isLoading, setIsLoading] = React.useState(true)
    const [data, setData] = React.useState()

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    React.useEffect(() => {
        api.checkpostSummary()
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    setData(respData)
                }
                setIsLoading(false)
            })
            .catch(error => {
                handleError(error)
                setIsLoading(false)
            })
    }, [])

    return (
        <Container>
            <Header title='Analytics' />
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Today Summary</Text>
                    <Text style={styles.titleSm}>TRACK AND TRACE</Text>
                </View>


                {isLoading ? <ActivityIndicator color={Color.Blue} size={'large'} /> :
                    data ? <>
                        <View style={styles.row}>
                            <Text style={styles.txtBold}>NUMBER OF TRUCKS</Text>
                            <View style={styles.line} />
                            <Text style={styles.txtLight}>{data?.total_truck}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.txtBold}>WHEAT</Text>
                            <View style={styles.line} />
                            <Text style={styles.txtLight}>{data?.total_weights} MT</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.txtBold}>BAGS</Text>
                            <View style={styles.line} />
                            <Text style={styles.txtLight}>{data?.total_bags}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.txtBold}>District Dispatched</Text>
                            <View style={styles.line} />
                            <Text style={styles.txtLight}>{data?.total_dispatched}</Text>
                        </View>
                    </> :
                        <Text style={styles.msg}>Failed to get data. Please try again</Text>
                }

            </View>
        </Container>
    );
};

export default CheckpostSummary;

const styles = StyleSheet.create({
    ...CommonStyle,
    container: {
        padding: moderateScale(20)
    },
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
        fontFamily: Fonts.UniNeueBold,
        // fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: moderateScale(5)
    },
    titleSm: {
        fontSize: 12,
        color: Color.White,
        alignSelf: 'center',
        marginTop: moderateScale(10),
        marginBottom: moderateScale(10),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(20),
        marginTop: moderateScale(10),
    },
    txtBold: {
        fontSize: 14,
        color: Color.Blue,
        fontFamily: Fonts.UniNeueBold,
    },
    msg: {
        fontSize: 14,
        color: Color.Blue,
        fontFamily: Fonts.UniNeueRegular,
        alignSelf: 'center',
        textAlign: 'center',
        margin: moderateScale(20)
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#cfcfcf",
        marginHorizontal: moderateScale(5)
    }
});
