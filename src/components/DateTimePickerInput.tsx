import React, { useState } from 'react';
import { FlatList, Modal, StyleProp, StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import DatePicker from 'react-native-date-picker'
import { Divider, Text } from 'react-native-paper';
import { Color, Fonts } from '../common/Constants';
import Icon from './Icon';
import moment from 'moment';

interface DateTimePickerInputProps {
    // navigation: NavigationProp<ReactNavigation.RootParamList, never, undefined, Readonly<{
    //     key: string;
    //     index: number;
    //     routeNames: never[];
    //     history?: unknown[] | undefined;
    //     routes: any,// NavigationRoute<ReactNavigation.RootParamList, never>[];
    //     type: string;
    //     stale: false;
    // }>, {}, {}>,
    date?: Date,
    onChange: (i: any) => void,
    label: string,
    style?: StyleProp<ViewProps>,
    mode?: "time" | "date" | "datetime" | undefined,
    format?:string
}
const DateTimePickerInput = ({ date, onChange, label, style, mode, format }: DateTimePickerInputProps) => {
    const [showModel, setShowModel] = useState(false)

    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    setShowModel(true)
                }}>
                <View style={style}>
                    <Text
                        style={{
                            // color: "#59565F",
                            fontSize: 10,
                            flex: 1,
                            fontFamily: Fonts.UniNeueRegular,
                            marginLeft: 15,
                        }}>
                        {date ? label : ""}
                    </Text>
                    <View
                        style={{
                            // width: '100%',
                            // maxWidth: 400,
                            // height: 60,
                            // margin: 20,
                            borderRadius: 10,
                            paddingHorizontal: 15,
                            paddingBottom: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: "#BFBFC0",
                            // backgroundColor: 'red',
                        }}>
                        <Text
                            style={{
                                color: "#59565F",
                                fontSize: 16,
                                flex: 1,
                                // fontFamily: Fonts.UniNeueRegular,
                            }}>
                            {date ? moment(date).format(format || "hh:mm a DD/MM/YYYY") : label}
                        </Text>

                        <Icon
                            name="calendar"
                            type="FontAwesome"
                            style={{ fontSize: 16, color: '#afafaf' }}
                        />
                    </View>
                </View>
            </TouchableOpacity>

            {/* {showModel && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date || new Date()}
                    mode={'datetime'}
                    // is24Hour={true}
                    onChange={onChange}
                />
            )} */}
            <DatePicker
                modal
                mode={mode}
                open={showModel}
                date={date || new Date()}
                // minimumDate={new Date()}
                onConfirm={(date) => {
                    setShowModel(false)
                    onChange(date)
                }}
                onCancel={() => {
                    setShowModel(false)
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
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
    title: {
        flex: 1,
        fontSize: 18
    },
    item: {
        padding: 15
    }
});

export default DateTimePickerInput;
