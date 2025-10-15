import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../api';
import { Color, Routes } from '../../common/Constants';
import { UserProfile } from '../../common/Type';
import { Log, formatDropdownData, getDataFrom, handleError } from '../../common/Utils';
import BreadCrumb from '../../components/BreadCrumb';
import Container from '../../components/Container';
import Header from '../../components/Header';
import HFABreadCrumb from '../../components/HFABreadCrumb';
import { setMobileLabCategories, setMobileLabItems, setMobileLabs, setSamplePackingOptions, setStaticLabCategories } from '../../redux/slices/dataSlice';
import { RootState } from '../../redux/store';
import HFAActions from './HFAActions';
import HFABasicInfo from './HFABasicInfo';
import HFASamplesTests from './HFASamplesTests';
import HFAVoilations from './HFAVoilations';

interface HFAInspectionProps { }

const HFAInspection = (props: HFAInspectionProps) => {

    const pagerView = React.useRef()
    const [currentPage, setCurrentPage] = React.useState(1)
    const [commonData, setCommonData] = React.useState(1)
    const [step1Response, setStep1Response] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(true)
    const navigation = useNavigation()

    const User = useSelector<RootState, UserProfile>(state => state.data.user);
    const dispatch = useDispatch()
    const api = new Api(User, dispatch)

    const getCommonData = () => {
        api.getHFACommenData()
            .then(response => {
                const respData = getDataFrom(response)
                if (respData) {
                    setCommonData(respData)

                    dispatch(setStaticLabCategories(formatDropdownData(respData.sl_item_cats)))
                    dispatch(setMobileLabCategories(formatDropdownData(respData.ml_item_cats)))
                    dispatch(setMobileLabItems(formatDropdownData(respData.ml_item)))
                    dispatch(setMobileLabs(formatDropdownData(respData.mobile_labs)))
                    dispatch(setSamplePackingOptions(formatDropdownData(respData.sample_packings)))
                }
                setIsLoading(false)
            })
            .catch(error => {
                handleError(error)
                setIsLoading(false)
            })
    }

    const gotoStep2 = (_step1Response: any) => {
        // setCommonData(_commonData)
        setStep1Response(_step1Response)
        console.log('_step1Response', _step1Response);


        pagerView.current?.setPage(1)
        setCurrentPage(2)
    }

    const gotoStep3 = () => {

        pagerView.current?.setPage(2)
        setCurrentPage(3)
    }

    const gotoStep4 = (data: any) => {
        // setCommonData(_commonData)
        // setStep1Response(_step1Response)
        // console.log('_step1Response', _step1Response);

        // Log('step1Resp', step1Response)
        // Log('step3Resp', data)
        try {
            setStep1Response(d => {
                return { ...d, ...data }
            })

            pagerView.current?.setPage(3)
            setCurrentPage(4)
        } catch (error) {
            console.log("error", error)
            Alert.alert("Error", "Unexpected error, please try later")
        }
    }

    const onCompletion = (data) => {
        // setCommonData(_commonData)
        // setStep1Response(_step1Response)
        // Log('insp-data', data);


        const nextRoute = data.fine != "" && parseInt(data.fine) > 0 ? Routes.Echallan : Routes.Home
        // pagerView.current?.setPage(1)
        // navigation.goBack()
        // TODO: got chanllen screen
        // navigation.navigate(nextRoute,
        //     {
        //         data: data,
        //         trackingId: data?.inspection?.id.toString() + data.id.toString(),
        //         inspection: Routes.HFA_Inspection
        //     })
    }

    React.useEffect(getCommonData, [])

    return (
        <Container>
            <Header title='New Inspection' />
            {/* Create another breadcrumb */}
            <HFABreadCrumb step={currentPage} />

            {isLoading ?
                <ActivityIndicator
                    color={Color.Green}
                    size='large'
                />
                :
                <PagerView
                    ref={pagerView}
                    style={styles.pagerView}
                    initialPage={0}
                    scrollEnabled={false}
                    onPageSelected={e => setCurrentPage(parseInt(e.nativeEvent.position) + 1)}>
                    <View key="1">
                        <HFABasicInfo
                            // inspection={Routes.ShopsInspection}
                            onNext={gotoStep2} />
                    </View>

                    <View key="2">
                        <HFAVoilations onNext={gotoStep3} _commonData={commonData} _step1Response={step1Response} />
                    </View>

                    <View key="3">
                        <HFASamplesTests onNext={gotoStep4} _commonData={commonData} _step1Response={step1Response} />
                    </View>

                    <View key="4">
                        <HFAActions onNext={onCompletion} _commonData={commonData} _step1Response={step1Response} />
                    </View>
                </PagerView>}
        </Container>
    );
};

export default HFAInspection;

const styles = StyleSheet.create({
    pagerView: {
        flex: 1
    }
});
