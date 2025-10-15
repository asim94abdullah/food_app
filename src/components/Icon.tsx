import * as React from 'react';
import { Text, View, StyleSheet, StyleProp, TextStyle } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Zocial from "react-native-vector-icons/Zocial";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

interface IconProps {
    name: string,
    type?: 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Fontisto' | 'Foundation' | 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'Octicons' | 'Zocial' | 'SimpleLineIcons',
    size?: number,
    color?: string,
    onPress?: () => void,
    style?: StyleProp<TextStyle>
}


const IconType = {
    'AntDesign': AntDesign,
    'Entypo': Entypo,
    'EvilIcons': EvilIcons,
    'Feather': Feather,
    'FontAwesome': FontAwesome,
    'FontAwesome5': FontAwesome5,
    'Fontisto': Fontisto,
    'Foundation': Foundation,
    'Ionicons': Ionicons,
    'MaterialIcons': MaterialIcons,
    'MaterialCommunityIcons': MaterialCommunityIcons,
    'Octicons': Octicons,
    'Zocial': Zocial,
    'SimpleLineIcons': SimpleLineIcons,
}

const Icon = ({ type, name, size, color, onPress, style }: IconProps) => {
    const Icon = IconType[type || 'AntDesign']
    return (
        <Icon name={name} size={size} color={color} onPress={onPress} style={style} />
    );
};

export default Icon;

