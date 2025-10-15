import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../api';
import {Color, Routes} from '../../common/Constants';
import {StackNavigationProp} from '@react-navigation/stack';
import {TypeDropdownItem, UserProfile} from '../../common/Type';
import BreadCrumb from '../../components/BreadCrumb';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {RootState} from '../../redux/store';
import BasicInfo from '../MillsInspection/BasicInfo';
import ShopVoilations from './ShopVoilations';

interface ShopsInspectionProps {
  route: any;
}

const ShopsInspection = (props: ShopsInspectionProps) => {
  const {params} = props.route;
  // console.log('ShopsInspectionProps', params);
  const pagerView = React.useRef<any>(null);

  // const pagerView = React.useRef();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [commonData, setCommonData] = React.useState(1);
  const [step1Response, setStep1Response] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(!true);
  // const navigation = useNavigation();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  React.useEffect(() => {
    if (params != undefined) {
      setCommonData(params.commanData);
      setStep1Response(params.inspection);
      pagerView.current?.setPage(1);
      setCurrentPage(2);
    }
  }, []);

  const gotoStep2 = ({_commonData, _step1Response}: any) => {
    console.log('_commonData', _commonData);
    console.log('_step1Response', _step1Response);
    setCommonData(_commonData);
    setStep1Response(_step1Response);

    pagerView.current?.setPage(1);
    setCurrentPage(2);
  };
  const submitForm = (
    data: any,
    amount: string,
    shop: TypeDropdownItem,
    voilationStatus: any,
  ) => {
    let trackid = null;
    if (params != undefined) {
      trackid = data?.inspection_id.toString();
    } else {
      trackid = step1Response?.inspection?.id.toString();
    }
    if (
      voilationStatus === 'Warning' ||
      voilationStatus === '' ||
      voilationStatus === 'Imprison'
    ) {
      navigation.navigate(Routes.Home);
    } else if (voilationStatus === 'Marasla') {
      navigation.navigate(Routes.CourtNotice, {
        data: data,
        trackingId: trackid + '-' + data.id.toString(),
        shop: shop,
        shopInspection: true,
        inspection: Routes.ShopsInspection,
        text: 'Marasla',
      });
    } else if (voilationStatus === 'Notice') {
      navigation.navigate(Routes.CourtNotice, {
        data: data,
        trackingId: trackid + '-' + data.id.toString(),
        shop: shop,
        shopInspection: true,
        inspection: Routes.ShopsInspection,
        text: 'Notice',
      });
    } else if (voilationStatus === 'Fine') {
      navigation.navigate(Routes.Echallan, {
        data: data,
        trackingId: trackid + '-' + data.id.toString(),
        shop: shop,
        shopInspection: true,
        inspection: Routes.ShopsInspection,
      });
    } else {
      navigation.navigate(Routes.Home);
    }
  };

  console.log('Step1 data', step1Response);

  return (
    <Container>
      <Header title="Shop Inspection" />
      <BreadCrumb step={params != undefined ? 2 : currentPage} />
      <PagerView
        ref={pagerView}
        style={styles.pagerView}
        initialPage={params != undefined ? 1 : 0}
        scrollEnabled={false}
        onPageSelected={e =>
          setCurrentPage(parseInt(e.nativeEvent.position) + 1)
        }>
        <View key="1" style={{flex: 1}}>
          <BasicInfo inspection={Routes.ShopsInspection} onNext={gotoStep2} />
        </View>
        <View key="2">
          <ShopVoilations
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

export default ShopsInspection;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
