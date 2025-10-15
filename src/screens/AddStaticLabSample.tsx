import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../api';
// import { DummyItem } from '../common/Constants';
import { CommonStyle } from '../common/Theme';
import { TypeDropdownItem, UserProfile } from '../common/Type';
import { getDataFrom, handleError } from '../common/Utils';
import Container from '../components/Container';
import DateTimePickerInput from '../components/DateTimePickerInput';
import Dropdown from '../components/Dropdown';
import Header from '../components/Header';
import { RootState } from '../redux/store';

interface AddStaticLabSampleProps { }

const AddStaticLabSample = (props: AddStaticLabSampleProps) => {

    const [category, setCategory] = React.useState<TypeDropdownItem | undefined>()
    const [categoryItems, setCategoryItems] = React.useState<TypeDropdownItem[]>([])
    const [item, setItem] = React.useState<TypeDropdownItem | undefined>()
    const [collectionDate, setCollectionDate] = React.useState<Date | undefined>()
    const [details, setDetails] = React.useState('')
    const [customerName, setCustomerName] = React.useState('')
    const [customerNo, setCustomerNo] = React.useState('')
    const [customerAddress, setCustomerAddress] = React.useState('')
    const [sampleCondition, setSampleCondition] = React.useState('')
    const [samplePacking, setSamplePacking] = React.useState<TypeDropdownItem | undefined>()
    const [noOfSample, setNoOfSample] = React.useState('')
    const [samplePlan, setSamplePlan] = React.useState('')
    const [sendingData, setSendingData] = React.useState(false)
    const [loadingItem, setLoadingItem] = React.useState(false)

    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const staticLabCategories = useSelector<RootState, TypeDropdownItem[]>(state => state.data.staticLabCategories);
    const samplePackingOptions = useSelector<RootState, TypeDropdownItem[]>(state => state.data.samplePackingOptions);
    // console.log('staticLabCategories', staticLabCategories);



    const navigation = useNavigation()
    const { step1Response, updateList } = useRoute().params || {}
    // console.log('step1Response', step1Response);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const saveSample = () => {
        // TODO: complete validation, complete payload & send this sample to previous screen
        if (!category) {
            Alert.alert("Message", "Please select a category")
            return
        }
        else if (!item) {
            Alert.alert("Message", "Please select an item")
            return
        }
        else if (!collectionDate) {
            Alert.alert("Message", "Please select sample collection date")
            return
        }
        else if (details.trim() == "") {
            Alert.alert("Message", "Please enter some details in description")
            return
        }
        else if (sampleCondition.trim() == "") {
            Alert.alert("Message", "Please enter sample condition")
            return
        }
        else if (!samplePacking) {
            Alert.alert("Message", "Please select sample packing")
            return
        }
        else if (noOfSample.trim() == "") {
            Alert.alert("Message", "Please enter No. of sample")
            return
        }
        else if (samplePlan.trim() == "") {
            Alert.alert("Message", "Please enter sample plan/procedure")
            return
        }


        const data = new FormData()
        // TODO: change these
        data.append('inspection_id', step1Response.id);
        data.append('business_id', step1Response.businessId);
        data.append('labtest[]', "1");
        data.append('labtest[]', "1");
        data.append('mobile_lab_id', "1");

        data.append('item_category_id', category.id);
        data.append('item_id', item.id);
        data.append('number_of_samples', noOfSample);
        data.append('sample_packing_id', samplePacking?.id);
        data.append('collection_date', moment(collectionDate).format("YYYY-MM-DD"));
        data.append('description', details);

        setSendingData(true)
        api.sendStatisLabSample(data)
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    navigation.goBack()
                    updateList({
                        item: item.title,
                        category: category.title,
                        code: '--',
                        collectionDate: moment(collectionDate).format("DD-MMM-YYYY"),
                        receivedDate: "--"
                    })
                }
                setSendingData(false)
            })
            .catch(error => {
                handleError(error)
                setSendingData(false)
            })
    }

    React.useEffect(() => {
        if (category) {
            setLoadingItem(true)
            setCategoryItems([])
            setItem(undefined)
            const data = new FormData()
            data.append("category_id", category.id)
            api.getSlItems(data)
                .then(response => {
                    const respData = getDataFrom(response)
                    if (respData) {
                        setCategoryItems(respData.items)
                    }
                    setLoadingItem(false)
                })
                .catch(error => {
                    handleError(error)
                    setLoadingItem(false)
                })
        }
    }, [category])

    return (
        <Container>
            <Header title='Static Lab Sample' />

            <ScrollView>
                <View style={styles.container}>
                    <Dropdown
                        label='Select a category *'
                        data={staticLabCategories}
                        value={category}
                        onItemSelect={setCategory}
                        style={styles.input}
                    />

                    <Dropdown
                        label={loadingItem ? "Loading..." : 'Select an Item *'}
                        data={categoryItems}
                        value={item}
                        onItemSelect={setItem}
                        style={styles.input}
                    />

                    <DateTimePickerInput
                        label='Sample Collection Date *'
                        mode='date'
                        format='DD-MMM-YYYY'
                        style={styles.input}
                        date={collectionDate}
                        onChange={setCollectionDate} />

                    {/* <TextInput
                        mode="flat"
                        label="Customer Name *"
                        placeholder="Full Name"
                        value={customerName}
                        onChangeText={setCustomerName}
                        style={styles.input}
                        returnKeyType='done'
                    />

                    <TextInput
                        mode="flat"
                        label="Customer Contact # *"
                        placeholder="0300 1234567"
                        value={customerNo}
                        onChangeText={setCustomerNo}
                        style={styles.input}
                        keyboardType='phone-pad'
                        returnKeyType='done'
                    />

                    <TextInput
                        mode="flat"
                        label="Customer Address *"
                        placeholder="Enter address"
                        value={customerAddress}
                        onChangeText={setCustomerAddress}
                        multiline={true}
                        style={styles.input}
                        returnKeyType='done'
                    /> */}

                    <TextInput
                        mode="flat"
                        label="Desciption"
                        placeholder="Some details / remarks "
                        value={details}
                        onChangeText={setDetails}
                        multiline={true}
                        style={styles.input}
                        returnKeyType='done'
                    />

                    <TextInput
                        mode="flat"
                        label="Sample Condition"
                        placeholder="Some details "
                        value={sampleCondition}
                        onChangeText={setSampleCondition}
                        multiline={true}
                        style={styles.input}
                        returnKeyType='done'
                    />

                    <Dropdown
                        label='Select sample packing'
                        data={samplePackingOptions}
                        value={samplePacking}
                        onItemSelect={setSamplePacking}
                        style={styles.input}
                    />

                    <TextInput
                        mode="flat"
                        label="No./Size of Samples"
                        placeholder=""
                        value={noOfSample}
                        onChangeText={setNoOfSample}
                        style={styles.input}
                        returnKeyType='done'
                    />

                    <TextInput
                        mode="flat"
                        label="Sample Plan / Procedure"
                        placeholder="Some details "
                        value={samplePlan}
                        onChangeText={setSamplePlan}
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

export default AddStaticLabSample;

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
