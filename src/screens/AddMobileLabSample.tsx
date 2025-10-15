import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../api';
import { DummyItem } from '../common/Constants';
import { CommonStyle } from '../common/Theme';
import { TypeDropdownItem, UserProfile } from '../common/Type';
import { getDataFrom, handleError } from '../common/Utils';
import Container from '../components/Container';
import Dropdown from '../components/Dropdown';
import Header from '../components/Header';
import { RootState } from '../redux/store';

interface AddMobileLabSampleProps { }

const AddMobileLabSample = (props: AddMobileLabSampleProps) => {

    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const mobileLabCategories = useSelector<RootState, TypeDropdownItem[]>(state => state.data.mobileLabCategories);
    const mobileLabItems = useSelector<RootState, TypeDropdownItem[]>(state => state.data.mobileLabItems);
    const mobileLabs = useSelector<RootState, TypeDropdownItem[]>(state => state.data.mobileLabs);

    const [category, setCategory] = React.useState<TypeDropdownItem | undefined>()
    const [item, setItem] = React.useState<TypeDropdownItem | undefined>()
    const [lab, setLab] = React.useState<TypeDropdownItem | undefined>()
    const [details, setDetails] = React.useState('')
    const [sendingData, setSendingData] = React.useState(false)

    const { step1Response, updateList } = useRoute().params || {}
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const saveSample = () => {
        if (!category) {
            Alert.alert("Message", "Please select a category")
            return
        }
        else if (!item) {
            Alert.alert("Message", "Please select an item")
            return
        }
        else if (!lab) {
            Alert.alert("Message", "Please select a mobile lab")
            return
        }
        else if (details.trim() == "") {
            Alert.alert("Message", "Please select enter some details")
            return
        }

        setSendingData(true)

        const data = new FormData()
        data.append('inspection_id', step1Response.id);
        data.append('business_id', step1Response.businessId);

        data.append('item_category_id', category.id);
        data.append('item_id', item.id);
        data.append('mobile_lab_id', lab.id);
        data.append('description', details.trim());

        api.sendMobileLabSample(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    navigation.goBack()
                    updateList({
                        item: item.title,
                        category: category.title,
                        code: '--',
                        collectionDate: "--",
                        mobileLab: lab.title
                    })
                }
                setSendingData(false)
            })
            .catch(error => {
                handleError(error)
                setSendingData(false)
            })
    }

    return (
        <Container>
            <Header title='Mobile Lab Sample' />

            <ScrollView>
                <View style={styles.container}>
                    <Dropdown
                        label='Select a category'
                        data={mobileLabCategories}
                        value={category}
                        onItemSelect={setCategory}
                        style={styles.input}
                    />

                    <Dropdown
                        label='Select an Item'
                        data={mobileLabItems}
                        value={item}
                        onItemSelect={setItem}
                        style={styles.input}
                    />

                    <Dropdown
                        label='Choose Mobile Lab'
                        data={mobileLabs}
                        value={lab}
                        onItemSelect={setLab}
                        style={styles.input}
                    />

                    <TextInput
                        mode="flat"
                        label="Details"
                        placeholder="Some details / remarks "
                        value={details}
                        onChangeText={setDetails}
                        multiline={true}
                        style={styles.input}
                        returnKeyType='done'
                    />

                    <Button
                        mode="contained"
                        style={styles.btn}
                        loading={sendingData}
                        onPress={saveSample}>
                        Save Sample
                    </Button>
                </View>
            </ScrollView>
        </Container>
    );
};

export default AddMobileLabSample;

const styles = StyleSheet.create({
    ...CommonStyle,
    container: {
        flex: 1,
        padding: 20
    },
    input: {
        marginBottom: 40,
        backgroundColor: 'transparent'
    }
});
