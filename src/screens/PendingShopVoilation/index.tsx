//import liraries
import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {UserProfile} from '../../common/Type';
import {Color, Fonts, Routes, UserType} from '../../common/Constants';
import {
  getDataFrom,
  getDataFrom1,
  handleError,
  TrackEvent,
} from '../../common/Utils';
import Api from '../../api';
import {Card} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../components/Icon';
import {StackNavigationProp} from '@react-navigation/stack';

// create a component
const PendingShopVoilation = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  // console.log('Pendig office data', User);

  const [isLoaing, setIsLoading] = React.useState(true);
  const [pendingData, setPendingData] = React.useState([]);
  const [commonData, setCommonData] = React.useState(undefined);

  useEffect(() => {
    GetPendigData();
    getCommonData();
  }, []);

  const getCommonData = () => {
    api
      .getShopInspectionData()
      .then(response => {
        const respData = getDataFrom(response);
        // console.log('Data officer', JSON.stringify(respData));

        if (respData) {
          setCommonData(respData);
        }
        setIsLoading(false);
      })
      .catch(error => {
        handleError(error);
        setIsLoading(false);
      });
  };

  const GetPendigData = () => {
    // const payload = new FormData();
    // payload.append('user_id', User.id);

    // console.log('payload', payload);
    setIsLoading(true);
    api
      .getInspectionPending(User.id)
      .then(response => {
        const respData = getDataFrom1(response);
        console.log('respData', respData);
        if (respData.success) {
          setPendingData(respData?.data?.pendingShopInspections);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log('Error', error);
        setIsLoading(false);
      });
  };

  const refreshData = () => {
    if (!isLoaing) {
      TrackEvent('refresh-btn-clicked');
      //   getDealerData();
    }
  };

  const clickPending = (inspection: any) => {
    navigation.navigate(Routes.ShopsInspection, {
      inspection: inspection,
      commanData: commonData,
    });
  };
  const clickDeleteInspection = (inspection: any) => {
    setIsLoading(true);
    api
      .deleteInspection(inspection.id)
      .then(response => {
        const respData = getDataFrom1(response);
        console.log('respData', respData);
        if (respData.success) {
          GetPendigData();
        }
      })
      .catch(error => {});
  };

  // console.log('commanData', commonData);

  return (
    <Container>
      <Header
        title={'Pending Shop Inspections'}
        handleRefresh={
          User?.user_type == UserType.Dealer ||
          User?.user_type == UserType.Shop_Seller
            ? refreshData
            : undefined
        }
      />
      <View style={{flex: 1, paddingHorizontal: 20, marginVertical: 20}}>
        {isLoaing ? (
          <View style={styles.indicatorview}>
            <ActivityIndicator style={{alignSelf: 'center'}} />
          </View>
        ) : (
          <View style={{flex: 1, paddingHorizontal: 20, paddingVertical: 10}}>
            <View style={styles.headerview}>
              <Text style={styles.headertxt}>Title</Text>
              <Text style={styles.headertxt}>Date</Text>
              <Text style={styles.headertxt}>Actions</Text>
            </View>
            <FlatList
              data={pendingData}
              showsVerticalScrollIndicator={false}
              renderItem={(item: any) => {
                // console.log('item', item.item.id);

                return (
                  <View style={styles.flatListContianer}>
                    <View style={styles.flatListmainview}>
                      <View style={styles.flatListtitleview}>
                        <Text numberOfLines={1} style={styles.flatListtitletxt}>
                          {item.item.title}
                        </Text>
                      </View>
                      <Text style={styles.flatListdatetxt}>
                        {item.item.inspection_date}
                      </Text>
                      <View style={styles.actionview}>
                        <TouchableOpacity
                          onPress={() => clickPending(item.item)}>
                          <Icon
                            type="AntDesign"
                            name="edit"
                            size={15}
                            color={Color.textLight}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => clickDeleteInspection(item.item)}>
                          <Icon
                            type="AntDesign"
                            name="delete"
                            size={15}
                            color={Color.textLight}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    </Container>
  );
};

//make this component available to the app
export default PendingShopVoilation;
// define your styles
const styles = StyleSheet.create({
  indicatorview: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  headerview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Color.Blue,
    padding: 10,
    borderRadius: 10,
  },
  headertxt: {fontSize: 14, fontWeight: '700', color: Color.White},
  flatListContianer: {
    flex: 1,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Color.Blue,
  },
  flatListmainview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  flatListtitleview: {
    width: '35%',
  },
  flatListtitletxt: {
    fontSize: 14,
    color: Color.textLight,
  },
  flatListdatetxt: {
    minWidth: '30%',
    fontSize: 14,
    color: Color.textLight,
  },
  actionview: {
    minWidth: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
