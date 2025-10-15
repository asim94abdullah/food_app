import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { Text, View, StyleSheet, StatusBar, Modal, Alert } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { Color, Fonts } from '../common/Constants';
import DateTimePickerInput from './DateTimePickerInput';
import Icon from './Icon';

interface HeaderProps {
    title: string,
    subtitle?: string,
    onDateChange?: (fromDate?: string, toDate?: string) => void,
    flat?: boolean,
    handleRefresh?: () => void
}

const Header = ({ title, subtitle, onDateChange, flat, handleRefresh }: HeaderProps) => {
    const [showDateModel, setShowDateModel] = React.useState(false)

    const [fromDate, setFromDate] = React.useState()
    const [toDate, setToDate] = React.useState()

    const navigation = useNavigation()

    const applyDates = () => {
        if (!fromDate || !toDate) {
            Alert.alert("Message", "Please select both from & to date")
            return
        }

        onDateChange && onDateChange(moment(fromDate).format("YYYY-MM-DD"), moment(toDate).format("YYYY-MM-DD"))
        setShowDateModel(false)
    }
    const clearDates = () => {
        setFromDate(undefined)
        setToDate(undefined)
        onDateChange && onDateChange(undefined, undefined)
        setShowDateModel(false)
    }

    return (
        <View style={[styles.header, {
            borderBottomLeftRadius: flat ? 0 : 20,
            borderBottomRightRadius: flat ? 0 : 20,
        }]}>
            <Appbar.Header style={[styles.header, {
                borderBottomLeftRadius: flat ? 0 : 20,
                borderBottomRightRadius: flat ? 0 : 20,
            }]}>
                {navigation.canGoBack() && <Appbar.BackAction onPress={navigation.goBack} iconColor={Color.White} />}
                <Appbar.Content title={title} subtitle={subtitle} titleStyle={[styles.title, { marginLeft: handleRefresh ? 30 : 0 }]} subtitleStyle={{ color: Color.White }} />
                {onDateChange && <Appbar.Action icon="calendar" iconColor={Color.White} onPress={() => setShowDateModel(true)} />}
                {handleRefresh && <Appbar.Action icon="refresh" iconColor={Color.White} onPress={handleRefresh} />}
                {/* <Appbar.Action icon="magnify" /> */}
            </Appbar.Header>
            <StatusBar backgroundColor={Color.Blue} />

            <Modal visible={showDateModel} transparent >
                <View style={styles.overlay}>
                    <View style={styles.dialog}>
                        <View style={styles.row}>
                            <Text style={styles.dailogTitle}>Choose an option</Text>
                            <Icon name='close' type='AntDesign' size={20} onPress={() => setShowDateModel(false)} />
                        </View>


                        <DateTimePickerInput
                            label='From Date'
                            mode='date'
                            format='DD MMM YYYY'
                            date={fromDate}
                            style={styles.input}
                            onChange={setFromDate} />

                        <DateTimePickerInput
                            label='To Date'
                            mode='date'
                            format='DD MMM YYYY'
                            date={toDate}
                            style={styles.input}
                            onChange={setToDate} />


                        <View style={styles.row}>
                            <Button
                                mode="contained"
                                style={styles.btn}
                                // loading={isLoading}
                                onPress={clearDates}>
                                Clear
                            </Button>

                            <Button
                                mode="contained"
                                style={styles.btn}
                                // loading={isLoading}
                                onPress={applyDates}>
                                Submit
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        backgroundColor: Color.Blue,
        // borderBottomLeftRadius: 20,
        // borderBottomRightRadius: 20,
        overflow: 'hidden',
    },
    title: {
        fontFamily: Fonts.UniNeueBold,
        // fontWeight: 'bold',
        color: Color.White,
        // backgroundColor: 'red',
        // justifyContent: 'center',
        // alignItems: 'center',
        // textAlign: 'center',
        alignSelf: 'center',
        fontSize: 18,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        width: '80%',
        maxHeight: '80%',
        backgroundColor: Color.White,
        borderRadius: 10,
        padding: 20
    },
    row: {
        flexDirection: 'row'
    },
    dailogTitle: {
        flex: 1,
        fontSize: 18
    },
    input: {
        marginTop: 30
    },
    btn: {
        flex: 1,
        margin: 10,
        marginTop: 30
    }
});
