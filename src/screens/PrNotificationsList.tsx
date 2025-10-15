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

const PrNotificationsList = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [history, setHistory] = React.useState<any[]>([]);
  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);
  const {params} = useRoute();
  const navigation = useNavigation();

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

  const renderCard = ({item}: {item: any}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate(Routes.SendStock, {...params, notification: item})
      }>
      <Card style={styles.card}>
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
                {item.prc_notification_qty || '-'} MT
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Issued Qty</Text>
              <Text style={styles.value}>
                {item.prc_shipment_qty || '-'} MT
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

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
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyTitle: {
    fontFamily: Fonts.UniNeueBold,
    color: Color.textDark,
    fontSize: 14,
  },
  dateBadge: {
    backgroundColor: Color.Green,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dateText: {
    color: '#fff',
    fontFamily: Fonts.UniNeueRegular,
    fontSize: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoBox: {
    flex: 1,
  },
  label: {
    fontFamily: Fonts.UniNeueBold,
    color: Color.textDark,
    fontSize: 11,
  },
  value: {
    fontFamily: Fonts.UniNeueBold,
    color: Color.textLight,
    fontSize: 11,
    marginTop: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: Color.textLight,
    fontFamily: Fonts.UniNeueRegular,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 80,
  },
  emptyImage: {
    width: 120,
    height: 120,
    opacity: 0.7,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: Color.textLight,
    fontFamily: Fonts.UniNeueRegular,
  },
});
