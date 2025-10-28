import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../api';
import {Color, Fonts, Routes} from '../common/Constants';
import {UserProfile} from '../common/Type';
import {getDataFrom, handleError} from '../common/Utils';
import Container from '../components/Container';
import Header from '../components/Header';
import {RootState} from '../redux/store';
import {moderateScale, verticalScale} from 'react-native-size-matters';

const PrNotificationsList = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [history, setHistory] = React.useState<any[]>([]);
  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);
  const {params} = useRoute();
  const navigation = useNavigation<any>();

  let data = [
    {
      id: 1,
      from_company_title: 'Company A',
      to_company_title: 'Company B',
      dated: '2024-06-01',
      prc_notification_qty: 100,
      prc_stockout_qty: 20,
      prc_shipment_qty: 80,
    },
    {
      id: 2,
      from_company_title: 'Company C',
      to_company_title: 'Company D',
      dated: '2024-06-05',
      prc_notification_qty: 200,
      prc_stockout_qty: 50,
      prc_shipment_qty: 150,
    },
    {
      id: 3,
      from_company_title: 'Company E',
      to_company_title: 'Company F',
      dated: '2024-06-10',
      prc_notification_qty: 150,
      prc_stockout_qty: 30,
      prc_shipment_qty: 120,
    },
  ];

  const getHistory = () => {
    setIsLoading(true);
    api
      .getPR_NotificationsList()
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          setHistory(respData.notification_list);
        }
        setIsLoading(false);
      })
      .catch(error => {
        handleError(error);
        setIsLoading(false);
      });
  };

  React.useEffect(getHistory, []);

  const renderCard = ({item}: {item: any}) => {
    console.log('itemmmm', item);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate(Routes.SendStock, {...params, notification: item})
        }>
        <Card style={styles.parentCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Text style={styles.companyTitle}>{item.from_company_title}</Text>
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>
                  {moment(new Date(item.dated)).format('DD MMM YYYY')}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Destination : </Text>
              <Text style={styles.value}>{item.to_company_title}</Text>
            </View>

            <View style={styles.rowBetween}>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Notified Qty</Text>
                <Text style={styles.value}>
                  {item?.prc_notification_qty || '-'} MT
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Stockout Qty</Text>
                <Text style={styles.value}>
                  {item?.prc_stockout_qty || '-'} MT
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Shiped Qty</Text>
                <Text style={styles.value}>{item?.prc_shipment_qty} MT</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
      // <Card style={styles.parentCard}>
      //   <Card.Content>
      //     {/* === Parent Header === */}
      //     <View style={styles.headerRow}>
      //       <Text style={styles.companyTitle}>{item.from_company_title}</Text>
      //       <View style={styles.dateBadge}>
      //         <Text style={styles.dateText}>
      //           {moment(new Date(item.dated)).format('DD MMM YYYY')}
      //         </Text>
      //       </View>
      //     </View>

      //     <View style={styles.divider} />

      //     <View style={styles.row}>
      //       <Text style={styles.label}>Destination : </Text>
      //       <Text style={styles.value}>{item.to_company_title}</Text>
      //     </View>

      //     <View style={styles.rowBetween}>
      //       <View style={styles.infoBox}>
      //         <Text style={styles.label}>Notified Qty</Text>
      //         <Text style={styles.value}>
      //           {item.prc_notification_qty || '-'} MT
      //         </Text>
      //       </View>
      //       <View style={styles.infoBox}>
      //         <Text style={styles.label}>Stockout Qty</Text>
      //         <Text style={styles.value}>
      //           {item.prc_stockout_qty || '-'} MT
      //         </Text>
      //       </View>
      //       <View style={styles.infoBox}>
      //         <Text style={styles.label}>Shipped Qty</Text>
      //         <Text style={styles.value}>{item.prc_shipment_qty} MT</Text>
      //       </View>
      //     </View>

      //     {/* === Nested Clickable Cards === */}
      //     {data.length > 0 && (
      //       <View style={styles.nestedContainer}>
      //         {data.map((child: any, index: number) => (
      //           <TouchableOpacity
      //             key={index}
      //             activeOpacity={0.9}
      //             onPress={() =>
      //               navigation.navigate(Routes.SendStock, {
      //                 ...params,
      //                 notification: child,
      //               })
      //             }>
      //             <Card style={styles.nestedCard}>
      //               <Card.Content>
      //                 <View style={styles.rowBetween}>
      //                   <Text style={styles.companyTitle}>
      //                     {child.from_company_title}
      //                   </Text>
      //                   <View style={styles.dateBadge}>
      //                     <Text style={styles.dateText}>
      //                       {moment(new Date(child.dated)).format(
      //                         'DD MMM YYYY',
      //                       )}
      //                     </Text>
      //                   </View>
      //                 </View>

      //                 <View style={styles.divider} />

      //                 <View style={styles.row}>
      //                   <Text style={styles.label}>Destination : </Text>
      //                   <Text style={styles.value}>
      //                     {child.to_company_title}
      //                   </Text>
      //                 </View>

      //                 <View style={styles.rowBetween}>
      //                   <View style={styles.infoBox}>
      //                     <Text style={styles.label}>Notified Qty</Text>
      //                     <Text style={styles.value}>
      //                       {child.prc_notification_qty || '-'} MT
      //                     </Text>
      //                   </View>
      //                   <View style={styles.infoBox}>
      //                     <Text style={styles.label}>Stockout Qty</Text>
      //                     <Text style={styles.value}>
      //                       {child.prc_stockout_qty || '-'} MT
      //                     </Text>
      //                   </View>
      //                   <View style={styles.infoBox}>
      //                     <Text style={styles.label}>Shipped Qty</Text>
      //                     <Text style={styles.value}>
      //                       {child.prc_shipment_qty || '-'} MT
      //                     </Text>
      //                   </View>
      //                 </View>
      //               </Card.Content>
      //             </Card>
      //           </TouchableOpacity>
      //         ))}
      //       </View>
      //     )}
      //   </Card.Content>
      // </Card>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076549.png',
        }}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No notifications found</Text>
    </View>
  );

  return (
    <Container>
      <Header title="PRC Notifications" />
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={Color.Green} size="large" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          // data={[...history, ...history]}
          data={history}
          showsVerticalScrollIndicator={false}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{paddingVertical: 10}}
        />
      )}
    </Container>
  );
};

export default PrNotificationsList;

const styles = StyleSheet.create({
  parentCard: {
    marginVertical: verticalScale(8),
    marginHorizontal: verticalScale(10),
    borderRadius: moderateScale(12),
    backgroundColor: '#fff',
    elevation: 4,
    padding: 4,
  },
  nestedContainer: {
    marginTop: verticalScale(10),
  },
  nestedCard: {
    marginVertical: verticalScale(5),
    borderRadius: moderateScale(8),
    backgroundColor: '#f8f8f8',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateBadge: {
    backgroundColor: '#52d948ff',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(6),
    paddingVertical: 2,
  },
  dateText: {
    fontSize: moderateScale(12),
    color: '#ffffffff',
  },
  companyTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  value: {
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: verticalScale(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(2),
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(4),
  },
  infoBox: {
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: verticalScale(20),
  },

  loadingText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(16),
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
  },
});
