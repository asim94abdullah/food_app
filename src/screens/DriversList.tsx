import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import UserIcon from '../assets/svg/UserIcon';
import { Color } from '../common/Constants';
import Container from '../components/Container';
import Header from '../components/Header';

interface DriversListProps { }

const DriversList = (props: DriversListProps) => {
    return (
        <Container>
            <View style={styles.container}>
                <Header title='Drivers List' />
                <FlatList
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]}
                    style={{ flexGrow: 0.97 }}
                    ItemSeparatorComponent={() => <View style={styles.divider} />}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity>
                            <View style={styles.row}>
                                <UserIcon />
                                <View style={styles.details}>
                                    <Text style={styles.txtGreen}>Driver name {index + 1}</Text>
                                    <Text style={styles.txtBlack}>Vehicle# Reg-1234</Text>
                                    <Text style={styles.txtBlack}>CNIC# 12301-3344556-6</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />

                <Button
                    mode="contained"
                    style={styles.btn}
                    // loading={true}
                    onPress={() => console.log('Pressed')}>
                    Add Driver
                </Button>
            </View>
        </Container>
    );
};

export default DriversList;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
        padding: 20,
        paddingHorizontal: 30
    },
    details: {
        justifyContent: 'center',
        marginLeft: 15
    },
    txtGreen: {
        color: Color.Green,
    },
    txtBlack: {
        marginTop: 5
    },
    divider: {
        backgroundColor: '#cfcfcf',
        width: '50%',
        alignSelf: 'center',
        height: 1
    },
    btn: {
        borderRadius: moderateScale(10),
        marginTop: 20,
        height: 50,
        justifyContent: 'center',
        // width: '80%',
        width: 300,
        alignSelf: 'center',
    }
});
