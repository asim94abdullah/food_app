import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { Color, DummyForm, Fonts, HfaActionsQuestions } from '../../common/Constants';
import DynmicForm from '../../components/DynmicForm';
import { Log, getDataFrom, handleError } from '../../common/Utils';
import { TypeDropdownItem, UserProfile } from '../../common/Type';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Api from '../../api';

interface HFAActionsProps {
    onNext: (data: any) => void,
    _step1Response?: any
}

const isIos = Platform.OS == 'ios'
const HFAActions = ({ onNext, _step1Response }: HFAActionsProps) => {

    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const [sendingData, setSendingData] = React.useState(false)

    const form = React.useRef()

    const saveData = () => {

        // TODO: test this
        const data = form.current?.getData()
        const payload = new FormData()

        if (data.fine == "yes" && parseInt(data.fine) < 1) {
            Alert.alert("Message", "Please enter fine amount")
            return
        }


        let error = false
        const discardedItems: { itemName: string, itemQty: string }[] = []
        data.discardedItems.map(item => {
            // { itemName: '', itemQty: '' }
            if ((item.itemName != "" && item.itemQty == "") || (item.itemName == "" && item.itemQty != "")) {
                error = true
            }
            else {
                discardedItems.push(item)
            }
        })
        if (error) {
            Alert.alert("Message", "Please enter both item name and quantity in discarded items")
            return
        }

        if (discardedItems.length) {
            payload.append("discarded_item[]", discardedItems.map(i => i.itemName))
            payload.append("discarded_item_qty[]", discardedItems.map(i => i.itemQty))
        }


        const seizedItems: { item: TypeDropdownItem | undefined, itemQty: string }[] = []
        data.seizedItems.map(item => {
            // { item: undefined, itemQty: '' }
            if ((item.item && item.itemQty == "") || (!item.item && item.itemQty != "")) {
                error = true
            }
            else {
                seizedItems.push(item)
            }
        })
        if (error) {
            Alert.alert("Message", "Please enter both item name and quantity in seized items")
            return
        }

        if (seizedItems.length) {
            payload.append("seized_item[]", seizedItems.map(i => i.item?.id))
            payload.append("seized_item_qty[]", seizedItems.map(i => i.itemQty))
        }
        // payload.append('attachment_ids', attachmentIds.join(","))

        payload.append("inspection_id", _step1Response.id)
        payload.append("notice", data.notice)
        payload.append("notice_desc", data.notice_desc)
        payload.append("fir", data.fir)
        payload.append("discarded", data.discarded)
        payload.append("sealed", data.sealed)
        payload.append("sealed_desc", data.sealed_desc)
        payload.append("seazed", data.seazed)
        payload.append("fined", data.fined)
        payload.append("fine", data.fine)
        payload.append("fine_desc", data.fine_desc)

        // Log('form-data', payload)
        setSendingData(true)


        api.hfaInspectionStep4(payload)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    onNext({
                        ..._step1Response,
                        fine: data.fine
                    })
                }
                setSendingData(false)
            })
            .catch(error => {
                handleError(error)
                setSendingData(false)
                // onNext({})
            })
    }

    return (
        <ScrollView>
            {/* <KeyboardAvoidingView behavior={'height'}> */}
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.txtBold}>Violation Severity: </Text>
                    <Text style={styles.tag}>Red Violation</Text>
                </View>

                {/* <View style={styles.row}> */}
                <Text style={styles.txtBold}>Recommended Action: </Text>
                <Text style={styles.txtBlack}>The business should be <Text style={styles.txtBold}>Warned , Sealed , with max fine 100</Text>{'\n'}</Text>
                {/* </View> */}

                <Text style={styles.txtBold}>Actions on Spot: </Text>
                <DynmicForm fields={HfaActionsQuestions} ref={form} extraData={_step1Response} />

                <Button
                    mode="contained"
                    style={styles.btn}
                    loading={sendingData}
                    onPress={saveData}>
                    Save & Next
                </Button>
            </View>
            {/* </KeyboardAvoidingView> */}
        </ScrollView>
    );
};

export default HFAActions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
    },
    btn: {
        borderRadius: moderateScale(10),
        marginTop: 40,
        // marginBottom: 40,
        height: 50,
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    txtBold: {
        fontFamily: Fonts.UniNeueBold,
        color: Color.textDark,
        fontSize: 14,
    },
    tag: {
        fontFamily: Fonts.UniNeueRegular,
        color: Color.Red,
        fontSize: 12,
        borderWidth: 1,
        borderColor: Color.Red,
        padding: 5,
        backgroundColor: Color.RedTransparent,
        borderRadius: 5,
        marginLeft: 10
    },
    txtBlack: {
        fontFamily: Fonts.UniNeueRegular,
        color: Color.textDark,
        fontSize: 14
    },
});
