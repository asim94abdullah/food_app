import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, Alert, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../api';
import Background from '../assets/svg/Background';
import Logo from '../assets/svg/Logo';
import SplashBg from '../components/SplashBg';
import { UserProfile } from '../common/Type';
import Container from '../components/Container';
import { saveUser } from '../redux/slices/dataSlice';
import { RootState } from '../redux/store';
import Footer from '../components/Footer';
import { moderateScale } from 'react-native-size-matters';
import { Color, Fonts } from '../common/Constants';


interface SplashProps {
    bootstrapped: boolean,
    dataLoaded: (b: boolean) => void
}
const { height } = Dimensions.get('screen')
const Splash = ({ bootstrapped, dataLoaded }: SplashProps) => {
    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (bootstrapped) {
            // console.log('session', User);
            if (User) {
                refreshToken();
            } else {
                setTimeout(() => dataLoaded(true), 2000);
            }

        }
    }, [bootstrapped]);

    const refreshToken = () => {
        const data = new FormData()
        data.append('username', User.username)
        data.append('password', User.password)
        data.append('role', User._role)

        new Api(User, dispatch).login(data)
            .then(response => {
                const { data } = response
                if (data.status == "success") {
                    dispatch(saveUser({
                        ...data.user,
                        ...data.authorisation,
                        username: User.username?.trim(),
                        password: User.password?.trim(),
                        user_type: data.user_type,
                        _role: User._role
                    }))
                }
                dataLoaded(true)
            })
            .catch(error => {
                dispatch(saveUser(undefined))
                dataLoaded(true)
            })
    }
    return (
        <Container>
            <View style={{ flex: 1, justifyContent: 'flex-end', position: 'absolute', height: height }}>
                <SplashBg />
            </View>
            <View style={styles.container}>
                <StatusBar backgroundColor={'transparent'} translucent barStyle={'dark-content'} />
                <Logo
                    width={'70%'}
                    height={'70%'} />
            </View>
            <View style={styles.footer}>
                {/* <Text style={styles.version}>Version 2.1</Text> */}
                <Footer />
            </View>
        </Container>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    version: {
        alignSelf: 'center',
        color: Color.textLight,
        fontFamily: Fonts.UniNeueRegular,
        marginBottom: moderateScale(10),
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: moderateScale(20),
    }
});
