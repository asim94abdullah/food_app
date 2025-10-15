import React from "react";
import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Color, Fonts } from "./Constants";

export const CommonStyle = StyleSheet.create({
    fill: {
        flex: 1
    },
    label: {
        color: Color.textDark
    },
    txtLight: {
        color: Color.textLight,
        fontFamily: Fonts.UniNeueRegular,
        fontSize: 12,
        alignSelf: 'center',
        textAlign: 'center'
    },
    btn: {
        borderRadius: moderateScale(10),
        marginTop: 20,
        height: 50,
        justifyContent: 'center',
    }
})