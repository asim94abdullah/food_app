import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../api';
import {Color, Routes} from '../../common/Constants';
import {UserProfile} from '../../common/Type';
import {getDataFrom} from '../../common/Utils';
import BreadCrumb from '../../components/BreadCrumb';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {RootState} from '../../redux/store';
import BasicInfo from '../MillsInspection/BasicInfo';
import DealerVoilations from './DealerVoilations';
import {StackNavigationProp} from '@react-navigation/stack';

interface DealersInspectionProps {}

const DealersInspection = (props: DealersInspectionProps) => {
  const pagerView = React.useRef();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [commonData, setCommonData] = React.useState(1);
  const [step1Response, setStep1Response] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(!true);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const gotoStep2 = ({_commonData, _step1Response}: any) => {
    setCommonData(_commonData);
    setStep1Response(_step1Response);
    // console.log('_step1Response', _step1Response);

    pagerView.current?.setPage(1);
    setCurrentPage(2);
  };
  const submitForm = (data: any, amount: string) => {
    // console.log('dealer-step1Response', step1Response);
    // console.log('dealer-data', data);
    // navigation.navigate(parseInt(amount) > 0 ?
    //   Routes.Echallan :
    //   Routes.Home, {
    //   data: data,
    //   trackingId: step1Response?.inspection?.id.toString() + data.id.toString(),
    //   // shopInspection: true,
    //   inspection: Routes.DealersInspection
    // })

    navigation.navigate(Routes.Echallan, {
      data: data,
      trackingId:
        step1Response?.inspection?.id.toString() + '-' + data.id.toString(),
      // shopInspection: true,
      inspection: Routes.DealersInspection,
    });
  };

  return (
    <Container>
      <Header title="Dealer Inspection" />
      <BreadCrumb step={currentPage} />
      {/* {isLoading ?
        <ActivityIndicator color={Color.Green} style={{ alignSelf: 'center', margin: 20 }} /> : */}
      <PagerView
        ref={pagerView}
        style={styles.pagerView}
        initialPage={0}
        scrollEnabled={false}
        onPageSelected={e =>
          setCurrentPage(parseInt(e.nativeEvent.position) + 1)
        }>
        <View key="1">
          <BasicInfo inspection={Routes.DealersInspection} onNext={gotoStep2} />
        </View>
        <View key="2">
          <DealerVoilations
            onNext={submitForm}
            _commonData={commonData}
            _step1Response={step1Response}
          />
        </View>
      </PagerView>
      {/* } */}
    </Container>
  );
};

export default DealersInspection;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
