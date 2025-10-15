import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { Button, TextInput } from 'react-native-paper';
import { CommonStyle } from '../../common/Theme';
import { moderateScale } from 'react-native-size-matters';

interface WheatClosingProps { }

const WheatClosing = (props: WheatClosingProps) => {

    const [receivQty, setReceivQty] = React.useState('')
    const [consumQty, setConsumQty] = React.useState('')
    const [todayBalance, setTodayBalance] = React.useState('')
    const [netBalance, setNetBalance] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    const submitData = () => { }

    return (
        <Container>
            <Header title='Wheat Closing' />

            <View style={styles.container}>
                <TextInput
                    mode="flat"
                    label="Today Received Quantity (MT)"
                    placeholder="0"
                    placeholderTextColor={'rgba(0,0,0,.7)'}
                    value={receivQty}
                    onChangeText={setReceivQty}
                    style={styles.input}
                    keyboardType='number-pad'
                    returnKeyType='next'
                />

                <TextInput
                    mode="flat"
                    label="Total Consumed Quantity (MT)"
                    placeholder="0"
                    placeholderTextColor={'rgba(0,0,0,.7)'}
                    value={consumQty}
                    onChangeText={setConsumQty}
                    style={styles.input}
                    keyboardType='number-pad'
                    returnKeyType='next'
                />

                <TextInput
                    mode="flat"
                    label="Today Balance (MT)"
                    placeholder="0"
                    placeholderTextColor={'rgba(0,0,0,.7)'}
                    value={todayBalance}
                    onChangeText={setTodayBalance}
                    style={styles.input}
                    keyboardType='number-pad'
                    returnKeyType='next'
                />

                <TextInput
                    mode="flat"
                    label="Net Balance (MT)"
                    placeholder="0"
                    placeholderTextColor={'rgba(0,0,0,.7)'}
                    value={netBalance}
                    onChangeText={setNetBalance}
                    style={styles.input}
                    keyboardType='number-pad'
                    returnKeyType='next'
                />

                <Text>{'\n\n'}</Text>

                <Button
                    mode="contained"
                    style={styles.btn}
                    loading={isLoading}
                    onPress={submitData}>
                    Save
                </Button>

            </View>
        </Container>
    );
};

export default WheatClosing;

const styles = StyleSheet.create({
    ...CommonStyle,
    container: {
        padding: moderateScale(20)
    },
    input: {
        marginTop: 25,
        backgroundColor: 'transparent',
    },
});
