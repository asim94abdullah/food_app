import * as React from 'react';
import { Text, View, StyleSheet, StyleProp, ViewProps } from 'react-native';
import { Color, Fonts } from '../common/Constants';
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from './Icon';

interface RadioButtonProps {
    label: String,
    checked: Boolean,
    onPress: () => void,
    style?: StyleProp<ViewProps>
}

const RadioButton = ({ label, checked, onPress, style }: RadioButtonProps) => {
    return (
        <View style={[styles.container, style]}>
            <Icon type='MaterialIcons'
                name={checked ? "radio-button-on" : "radio-button-off"}
                color={checked ? Color.Green : Color.textLight}
                size={25} onPress={onPress} />
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

export default RadioButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    label: {
        paddingLeft: 4,
        color: Color.textDark,
    }
});
