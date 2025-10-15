import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from '../../api';
import { Color, Fonts, Routes } from '../../common/Constants';
import { UserProfile } from '../../common/Type';
import { getDataFrom, handleError } from '../../common/Utils';
import { RootState } from '../../redux/store';

interface MillInspectionHistoryProps { }

const MillInspectionHistory = (props: MillInspectionHistoryProps) => {
  const User = useSelector<RootState, UserProfile>(state => state.data.user);

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const api = new Api(User, dispatch)

  const [isLoaing, setIsLoading] = React.useState(true)
  const [inspectionsList, setInspectionsList] = React.useState([])

  React.useEffect(() => {
    api.getMillInspectionHistory()
      .then(response => {
        const respData = getDataFrom(response)
        if (respData) {
          // console.log('respDataXX -', respData);
          setInspectionsList(respData.inspections)
        }
        setIsLoading(false)
      })
      .catch(error => {
        handleError(error)
        setIsLoading(false)
      })
  }, [])

  const renderItem = ({ item }) => <Card style={styles.card} onPress={() => navigation.navigate(Routes.Echallan,
    {
      data: { ...item, id: item.inspection_mills[0]?.id },
      trackingId: '',//step1Response?.inspection?.id.toString() + data.id.toString(),
      shop: item.inspection_mills[0]?.mills[0],
      shopInspection: false,
      inspection: Routes.ShopsInspection
    })}>
    <Card.Content>
      {/* <View style={[styles.row, { marginBottom: 0, }]}> */}
      {/* <Text>{item.inspection?.title}</Text>
    <Text>{item.inspection?.description}</Text> */}
      <Card.Title title={item.title} style={styles.cell} />
      {/* <Text style={styles.txtBold}>No of Bags: {item.no_of_bags} of {item.title}</Text> */}
      {/* </View> */}
      <Card.Content>
        {/* <Text style={styles.txtSmall}>{item.description}</Text> */}

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.txtBold}>Mill Name:{' '}</Text>
            <Text style={styles.txtSmall}>{item.inspection_mills[0]?.mills[0]?.name}</Text>
          </View>

          <View style={styles.cell}>
            <Text style={styles.txtBold}>Owner Name:{' '}</Text>
            <Text style={styles.txtSmall}>{item.inspection_mills[0]?.mills[0]?.owner_name}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.txtBold}>Owner Contact #</Text>
            <Text style={styles.txtSmall}>{item.inspection_mills[0]?.mills[0]?.owner_contact}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.txtBold}>Fine:</Text>
            <Text style={styles.txtSmall}>{' ' + item.inspection_mills[0]?.fine}</Text>

          </View>
        </View>

        <View style={styles.row}>
          {/* <View style={styles.cell}> */}
          <Text style={styles.txtBold}>Date:{' '}</Text>
          <Text style={styles.txtSmall}>{moment(item.created_at).format("DD MMM YYYY hh:mm a")}</Text>
          {/* </View> */}

          {/* <View style={styles.cell}>
            <Text style={styles.txtBold}>Contact No.</Text>
            <Text style={styles.txtSmall}>{item.contact_no || "-"}</Text>
          </View> */}
        </View>

        <View style={styles.row}>
          <Text style={styles.txtBold}>Mill Address:{' '}</Text>
          <Text style={styles.txtSmall}>{item.inspection_mills[0]?.mills[0]?.address}</Text>
        </View>
      </Card.Content>
    </Card.Content>
  </Card>


  return (
    <View style={styles.container}>
      {isLoaing ?
        <ActivityIndicator color={Color.Green} size='large' style={{ alignSelf: 'center', margin: 40 }} /> :
        <FlatList
          data={inspectionsList}
          renderItem={renderItem} />}
    </View>
  );
};

export default MillInspectionHistory;

const styles = StyleSheet.create({
  container: {},
  card: {
    marginHorizontal: 20,
    marginVertical: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cell: {
    flex: 1
  },
  txtBold: {
    fontFamily: Fonts.UniNeueBold,
    color: Color.textDark,
    fontSize: 10,
  },
  txtSmall: {
    fontFamily: Fonts.UniNeueRegular,
    color: Color.textLight,
    fontSize: 10
  }
});
