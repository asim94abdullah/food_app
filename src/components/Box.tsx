import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Shop from '../assets/svg/Shop';
import { Color, Fonts } from '../common/Constants';

interface BoxProps {
    Icon: React.ReactNode,
    title: string,
    onPress?: () => void,
    empty?: boolean
}

const boxSize = Math.min(Dimensions.get('window').width / 2.5, 150)
const Box = ({ title, Icon, onPress, empty }: BoxProps) => {
    return (
        <Pressable onPress={onPress}>
            <View style={[styles.box, { backgroundColor: empty ? 'transparent' : Color.White }]}>
                {
                    !empty && <>
                        {Icon}
                        <Text style={styles.title}>{title}</Text>
                    </>
                }
            </View>
        </Pressable>
    );
};

export default Box;

const styles = StyleSheet.create({
    box: {
        width: boxSize,
        height: boxSize,
        // backgroundColor: Color.White,
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    title: {
        fontFamily: Fonts.UniNeueBold,
        textAlign: 'center'
    },
});
