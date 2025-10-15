import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../api';
import { CommonStyle } from '../common/Theme';
import { UserProfile } from '../common/Type';
import { getDataFrom, handleError } from '../common/Utils';
import Container from '../components/Container';
import Header from '../components/Header';
import { saveUser } from '../redux/slices/dataSlice';
import { RootState } from '../redux/store';

interface ChangePasswordProps { }

const ChangePassword = (props: ChangePasswordProps) => {

    const [isLoading, setIsLoading] = React.useState(false)
    const [oldPassword, setOldPassword] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')
    const [newPassword1, setNewPassword1] = React.useState('')
    const [hidePassword1, setHidePassword1] = React.useState(true)
    const [hidePassword2, setHidePassword2] = React.useState(true)
    const [hidePassword3, setHidePassword3] = React.useState(true)

    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    // console.log('user', User);


    const navigation = useNavigation()
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const savePass = () => {
        if (oldPassword.trim() == "") {
            Alert.alert("Message", "Please enter your current password")
            return
        }
        else if (newPassword.trim().length < 7) {
            Alert.alert("Message", "New password should be  at-least 7 characters long")
            return
        }
        else if (newPassword.trim() != newPassword1.trim()) {
            Alert.alert("Message", "New password didn't match confirm password")
            return
        }
        setIsLoading(true)
        const data = new FormData()
        data.append('old_password', oldPassword.trim())
        data.append('new_password', newPassword.trim())
        // data.append('role', userType.id)
        // console.log('data', data);
        api.changePassword(data)
            .then(response => {
                // const respData = getDataFrom(response)
                const { data } = response
                if (data.status) {
                    // console.log('sucess');

                    Alert.alert("Message", "Password updated successfully.")
                    dispatch(saveUser({
                        ...User,
                        password: newPassword.trim(),

                    }))
                    navigation.goBack()
                }
                setIsLoading(false)
            })
            .catch(error => {
                handleError(error)
                // Alert.alert("Sorry", "Something went wrong please later")
                setIsLoading(false)
            })
    }

    return (
        <Container>
            <Header title='Change Password' />
            <View style={styles.content}>
                {/* <Text>Change Password</Text> */}

                <TextInput
                    mode="flat"
                    label="Current Password"
                    placeholder="Enter your current/old password"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    style={styles.input}
                    secureTextEntry={hidePassword1}
                    autoCapitalize='none'
                    returnKeyType='next'
                    right={<TextInput.Icon icon={hidePassword1 ? "eye" : "eye-off"} onPress={() => setHidePassword1(!hidePassword1)} />}
                />

                <TextInput
                    mode="flat"
                    label="New Password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={styles.input}
                    secureTextEntry={hidePassword2}
                    autoCapitalize='none'
                    returnKeyType='next'
                    right={<TextInput.Icon icon={hidePassword2 ? "eye" : "eye-off"} onPress={() => setHidePassword2(!hidePassword2)} />}
                />

                <TextInput
                    mode="flat"
                    label="Confirm Password"
                    placeholder="Enter new password againa"
                    value={newPassword1}
                    onChangeText={setNewPassword1}
                    style={styles.input}
                    secureTextEntry={hidePassword3}
                    autoCapitalize='none'
                    returnKeyType='done'
                    onSubmitEditing={savePass}
                    right={<TextInput.Icon icon={hidePassword3 ? "eye" : "eye-off"} onPress={() => setHidePassword3(!hidePassword3)} />}
                />

                <Button
                    mode="contained"
                    style={styles.btn}
                    loading={isLoading}
                    onPress={savePass}>
                    Save
                </Button>
            </View>
        </Container>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    ...CommonStyle,
    content: {
        padding: 30,
        marginTop: '10%',
        // backgroundColor: 'white',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    input: {
        marginTop: 40,
        backgroundColor: 'transparent',
    },
});
