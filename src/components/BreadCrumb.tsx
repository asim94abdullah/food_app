import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ChecklistIcon from '../assets/svg/ChecklistIcon';
import EditIcon from '../assets/svg/EditIcon';
import { Color, Fonts } from '../common/Constants';

interface BreadCrumbProps {
    step: number
}

const BreadCrumb = ({ step }: BreadCrumbProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <EditIcon active={step >= 1} />
                <Text style={styles.label}>Basic{'\n'}Info</Text>
            </View>

            <View style={{ flex: 1, height: 2, backgroundColor: step >= 2 ? Color.Blue : "#DCDCDC", marginBottom: 50 }} />

            <View style={[styles.iconWrapper, { marginLeft: -20 }]}>
                <ChecklistIcon active={step >= 2} />
                <Text style={styles.label}>Violations{'\n'}and Actions</Text>
            </View>
        </View>
    );
};

export default BreadCrumb;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '80%',
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        alignSelf: 'center',
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: Color.Blue,
        fontFamily: Fonts.UniNeueBold,
        marginTop: 10,
        textAlign: 'center'
    },
});
