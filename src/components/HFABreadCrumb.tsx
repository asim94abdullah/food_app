import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ChecklistIcon from '../assets/svg/ChecklistIcon';
import EditIcon from '../assets/svg/EditIcon';
import { Color, Fonts } from '../common/Constants';

interface HFABreadCrumbProps {
    step: number
}

const HFABreadCrumb = ({ step }: HFABreadCrumbProps) => {

    const getIcon = (editing: boolean, active: boolean) => editing ?
        <EditIcon active={step >= 1} /> :
        <ChecklistIcon active={active} />
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                {getIcon(step == 1, true)}
                {/* <EditIcon active={step >= 1} /> */}
                <Text style={styles.label}>{step == 1 ? 'Basic\nInfo' : '\n'}</Text>
            </View>

            <View style={{ flex: 1, height: 2, backgroundColor: step >= 2 ? Color.Blue : "#DCDCDC", marginBottom: 50 }} />

            <View style={[styles.iconWrapper, { marginLeft: -20 }]}>
                {getIcon(step == 2, step >= 2)}
                <Text style={styles.label}>{step == 2 ? 'Inspection\nDetails' : '\n'}</Text>
            </View>



            <View style={{ flex: 1, height: 2, backgroundColor: step >= 3 ? Color.Blue : "#DCDCDC", marginBottom: 50 }} />

            <View style={[styles.iconWrapper, { marginLeft: -20 }]}>
                {getIcon(step == 3, step >= 3)}
                <Text style={styles.label}>{step == 3 ? 'Samples\n& Tests' : '\n'}</Text>
            </View>

            <View style={{ flex: 1, height: 2, backgroundColor: step >= 4 ? Color.Blue : "#DCDCDC", marginBottom: 50 }} />

            <View style={[styles.iconWrapper, { marginLeft: -20 }]}>
                {getIcon(step == 4, step >= 4)}
                <Text style={styles.label}>{step == 4 ? 'Violations\nand Actions' : '\n'}</Text>
            </View>
        </View>
    );
};

export default HFABreadCrumb;

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
