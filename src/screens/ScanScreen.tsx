import * as React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    View,
    Alert,
    ScrollView,
    Image
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import Container from '../components/Container';
import Header from '../components/Header';

interface ScanScreenProps { }

const ScanScreen = (props: ScanScreenProps) => {

    const navigation = useNavigation()
    const { onCompletion } = useRoute().params || {}
    // const onCompletion = (d) => Alert.alert("Message", d)

    const onSuccess = (e) => {
        // Linking.openURL(e.data).catch(err =>
        //     console.error('An error occured', err)
        // );
        // console.log('data', e);

        onCompletion(e.data)
    };


    return (
        <Container>
            <Header title='Scan CNIC' />
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <QRCodeScanner
                        onRead={onSuccess}
                        // flashMode={RNCamera.Constants.FlashMode.torch}
                        cameraContainerStyle={{ marginTop: '20%' }}
                    // bottomContent={
                    //     <Text style={styles.centerText}>
                    //         Go to{' '}
                    //         <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
                    //         your computer and scan the QR code.
                    //     </Text>
                    // }
                    // bottomContent={
                    //     <Image
                    //         source={require('../assets/images/cnic.png')}
                    //         resizeMode='center'
                    //         style={styles.img}
                    //     />
                    // }
                    />

                    {/* <Image
                        source={require('../assets/images/cnic.png')}
                        resizeMode='center'
                        style={styles.img} /> */}
                </View>

            </ScrollView>
        </Container>
    );
};

export default ScanScreen;

const styles = StyleSheet.create({
    img: {
        width: 250,
        height: 200,
        // backgroundColor: 'red',
        alignSelf: 'center',
        marginTop: 20
    },
});
