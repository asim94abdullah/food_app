import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Alert, Modal, TouchableOpacity } from 'react-native';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { Button, TextInput } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../api';
import { Color, Fonts, Routes } from '../../common/Constants';
import { CommonStyle } from '../../common/Theme';
import { UserProfile } from '../../common/Type';
import { getDataFrom, handleError, TrackEvent } from '../../common/Utils';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import { RootState } from '../../redux/store';

interface NIC_ScannerProps { }

const NIC_Scanner = (props: NIC_ScannerProps) => {

    const [cnic, setCnic] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [nicResp, setNicResp] = React.useState()
    // const [citizen, setCitizen] = React.useState()
    // const [eligible, setEligible] = React.useState(false)

    const navigation = useNavigation()
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const submitData = () => {
        // if (!isLoading) {
        //     Alert.alert("Message", "This user already purchased his allowed quantity")
        //     return
        // }
        TrackEvent("NIC_Scan", { event: "Btn_clicked" })
        if (isLoading) {
            return
        }
        TrackEvent("NIC_Scan", { event: "checking_validations" })
        if (cnic.trim().length < 13) {
            Alert.alert("Message", "Please scan QR code from citizen smart card or enter a valid CNIC number manually")
            return
        }
        TrackEvent("NIC_Scan", { event: "Sending_Request" })

        setIsLoading(true)
        const data = new FormData()
        // const cnicRaw = cnic.trim().replaceAll("-", "")
        // console.log('NIC', cnicRaw);
        data.append('check_cnic', cnic.trim().replaceAll("-", ""));

        api.verifyCitizen(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    setNicResp(respData)
                    // if (!respData.citizen) {
                    //     Alert.alert("Message", respData.title)
                    // }
                    // else if (!respData.eligible) {
                    //     Alert.alert("Message", respData.title)
                    // }
                    // else {
                    //     Alert.alert("Message", respData.title || "This user is found eligible for purchase, do you want to continue?", [
                    //         { text: "No" },
                    //         { text: "Continue", onPress: () => navigation.navigate(Routes.ShopSellForm, { citizen: respData.citizen }) }
                    //     ])
                    // }

                    // setCitizen(respData.citizen)
                    // setEligible(respData.eligible)
                }
                setIsLoading(false)
            })
            .catch(error => {
                handleError(error)
                setIsLoading(false)
            })
    }

    const getContent = () => {
        if (nicResp?.citizen && nicResp.eligible) {
            return <>
                <Icon type='Ionicons' name='checkmark-circle' color={Color.Green} size={30} />
                {/* <Text style={styles.label1}>معزز شہری، بے نظیر انکم سپورٹ پروگرام کے تحت آپ مفت آٹے کی حصولی کے لئے اہل ہیں</Text> */}
                <Text style={styles.label1}>{nicResp.title}</Text>
                <Button
                    mode="contained"
                    style={styles.btn1}
                    buttonColor={Color.Green}
                    onPress={() => {
                        const payload = { ...nicResp.citizen, remaining_qty: nicResp?.remaining_qty }
                        setNicResp(undefined)
                        // console.log('nicResp.citizen', );
                        // 

                        // setTimeout(() => navigation.navigate(Routes.ShopSellForm, { citizen: payload }), 100)
                        navigation.navigate(Routes.ShopSellForm, { citizen: payload })
                        setCnic('')
                    }}>
                    Continue
                </Button>
            </>
        }
        else if (nicResp?.citizen && !nicResp.eligible) {
            return <>
                <Icon type='Ionicons' name='ios-warning' color={Color.Yellow} size={30} />
                {/* <Text style={styles.label1}>مطلوبہ خاندان کے فرد کو مفت آٹا مہیا کیا جاچکا ہے۔</Text> */}
                <Text style={styles.label1}>{nicResp.title}</Text>
                <Button
                    mode="contained"
                    style={styles.btn1}
                    buttonColor={Color.Yellow}
                    onPress={() => {
                        setNicResp(undefined)
                    }}
                // onPress={() => {

                //     const payload = { ...nicResp.citizen[0] }
                //     setNicResp(undefined)
                //     // console.log('nicResp.citizen', );
                //     // 

                //     setTimeout(() => navigation.navigate(Routes.ShopSellForm, { citizen: payload }), 100)
                // }}
                >
                    Close
                </Button>
            </>
        }
        else if (nicResp) {
            return <>
                <Icon type='Ionicons' name='ios-warning' color={Color.Red} size={30} />
                {/* <Text style={styles.label1}>معزز شہری، بے نظیر انکم سپورٹ پروگرام کے تحت آپ مفت آٹے کی حصولی کے لئے اہل نہیں ہیں</Text> */}
                <Text style={styles.label1}>{nicResp.title}</Text>
                <Button
                    mode="contained"
                    style={styles.btn1}
                    buttonColor={Color.Red}
                    onPress={() => {
                        setNicResp(undefined)
                    }}>
                    Close
                </Button>
            </>
        }
    }

    const parseNic = (data: string) => {
        /**
         77000209782917301465846451

         */
        try {
            setCnic(data.substring(data.length - 14, data.length - 1))
        } catch (error) {
            setCnic(data)
        }
    }


    return (
        <Container>
            <Header title='Enter CNIC No' />
            <ScrollView>
                <View style={styles.container}>
                    <Text style={[styles.label, { alignSelf: 'center', textAlign: 'center' }]}>Please scan QR code from citizen smart card or enter CNIC number</Text>

                    <TouchableOpacity onPress={() => navigation.navigate(Routes.ScanScreen, {
                        onCompletion: (e) => {
                            parseNic(e?.toString())
                            navigation.goBack()
                        }
                    })} style={styles.iconWrapper}>
                        <View>
                            <Icon
                                type='MaterialCommunityIcons'
                                name='qrcode-scan'
                                color={Color.textLight}
                                size={70} />
                        </View>
                    </TouchableOpacity>

                    <TextInput
                        mode="flat"
                        label="CNIC No (12301-4567890-0)"
                        placeholder={"12301-4567890-0"}
                        value={cnic}
                        onChangeText={setCnic}
                        style={styles.input}
                        autoCapitalize='none'
                        keyboardType={'number-pad'}
                        // editable={false}
                        returnKeyType='go'
                        onSubmitEditing={submitData}
                        render={props =>
                            <MaskInput
                                {...props}
                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]}
                            />
                        }
                    />

                    <Button
                        mode="contained"
                        style={styles.btn}
                        loading={isLoading}
                        onPress={submitData}>
                        Continue
                    </Button>
                </View>
            </ScrollView>

            <Modal visible={nicResp != undefined} transparent={true}>
                <View style={styles.overly}>
                    <View style={styles.box}>
                        <View style={styles.content}>
                            {getContent()}

                            {/* <Icon type='Ionicons' name='ios-warning' color={Color.Yellow} size={30} />
                            <Text style={styles.label1}>مطلوبہ خاندان کے فرد کو مفت آٹا مہیا کیا جاچکا ہے۔</Text> */}

                            {/* <Icon type='Ionicons' name='ios-warning' color={Color.Red} size={30} />
                            <Text style={styles.label1}>معزز شہری، بے نظیر انکم سپورٹ پروگرام کے تحت آپ مفت آٹے کی حصولی کے لئے اہل نہیں ہیں</Text> */}
                            {/* <Button
                                mode="contained"
                                style={styles.btn1}
                                loading={isLoading}
                                buttonColor={Color.Red}
                                onPress={submitData}>
                                Close
                            </Button> */}
                        </View>
                    </View>
                </View>
            </Modal>
        </Container>
    );
};

export default NIC_Scanner;

const styles = StyleSheet.create({
    ...CommonStyle,
    container: {
        padding: 20
    },
    iconWrapper: {
        backgroundColor: "#cfcfcf",
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 40,
        marginBottom: 20
    },
    input: {
        marginTop: 25,
        backgroundColor: 'transparent',
    },
    overly: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: 300,
        // minHeight: 200,
        backgroundColor: Color.White,
        borderRadius: 20,
        padding: 20,
        // paddingVertical: 40
    },
    content: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label1: {
        color: Color.textDark,
        textAlign: 'center',
        fontFamily: Fonts.UniNeueRegular,
        marginTop: 20,
        fontSize: 16
    },
    btn1: {
        borderRadius: moderateScale(10),
        marginTop: 20,
        height: 40,
        width: 180,
        justifyContent: 'center',
    }
});
