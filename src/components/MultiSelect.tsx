import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleProp, StyleSheet, View, ViewProps, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Divider, Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { Color, Fonts } from '../common/Constants';
import { TypeDropdownItem } from '../common/Type';
import Icon from './Icon';

interface MultiSelectProps {
    data: TypeDropdownItem[],
    onItemSelect: (i: any) => void,
    label: string,
    // placeholder: string,
    value?: TypeDropdownItem[],
    style?: StyleProp<ViewProps>
}
const MultiSelect = ({ data, onItemSelect, label, value, style }: MultiSelectProps) => {
    const [showModel, setShowModel] = useState(false)
    const [listData, setListData] = useState(data)
    // console.log(data, listData);


    const toggleItem = (index: number) => {
        // setShowModel(false)
        // onItemSelect(item)
        const items = [...listData]
        items[index].isChecked = !items[index].isChecked
        setListData(items)
    }

    const btnClick = () => {
        // console.log('selected-items', listData.filter(item => item.isChecked));
        onItemSelect(listData.filter(item => item.isChecked))
        setShowModel(false)
    }

    useEffect(() => {
        setListData(data)
    }, [data])
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
                        {value?.length > 0 ? label : ""}
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
                            {/* {value?.title || label} */}
                            {value?.length > 0 ? value.map(i => i.title).join(", ") : label}
                        </Text>

                        <Icon
                            name="down"
                            type="AntDesign"
                            style={{ fontSize: 16, color: '#afafaf' }}
                        />
                    </View>
                </View>
            </TouchableOpacity>

            <Modal visible={showModel} transparent>
                <View style={styles.overlay}>
                    <View style={styles.dialog}>
                        <View style={styles.row}>
                            <Text style={styles.title}>Choose an option</Text>
                            <Icon name='close' type='AntDesign' size={20} onPress={() => setShowModel(false)} />
                        </View>

                        <FlatList
                            data={listData}
                            style={{ marginTop: 20, }}
                            ItemSeparatorComponent={() => <Divider />}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity onPress={() => {
                                    toggleItem(index)
                                }}>
                                    <View style={styles.row}>
                                        <Icon
                                            type='MaterialCommunityIcons'
                                            name={item.isChecked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                            size={20}
                                            color={Color.Green} />
                                        <Text style={styles.item}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        />

                        <Button
                            mode="contained"
                            style={styles.btn}
                            // loading={sendingData}
                            onPress={btnClick}>
                            Done
                        </Button>
                    </View>
                </View>
            </Modal>
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: 18
    },
    item: {
        padding: 15
    },
    btn: {
        borderRadius: moderateScale(10),
        marginTop: 10,
        // marginBottom: 40,
        height: 50,
        justifyContent: 'center',
    },
});

export default MultiSelect;
