import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, StyleSheet, ScrollView, FlatList} from 'react-native';
import {Button, Card, Divider} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../api';
import {Color, Fonts, Routes} from '../../common/Constants';
import {CommonStyle} from '../../common/Theme';
import {TypeLabTest, UserProfile} from '../../common/Type';
import {getDataFrom, handleError} from '../../common/Utils';
import {RootState} from '../../redux/store';

interface HFASamplesTestsProps {
  _commonData: any;
  _step1Response: any;
  onNext: (data: any) => void;
}

const HFASamplesTests = ({
  _commonData,
  _step1Response,
  onNext,
}: HFASamplesTestsProps) => {
  const [sendingData, setSendingData] = React.useState(false);
  const [staticLabTests, setStaticLabTests] = React.useState<TypeLabTest[]>([]);
  const [mobileLabTests, setMobileLabTests] = React.useState<TypeLabTest[]>([]);
  const navigation = useNavigation();

  const renderDivider = () => <Divider style={{marginTop: 10, height: 1}} />;

  const updateStaticTests = (newTest: TypeLabTest) =>
    setStaticLabTests(t => {
      const _t = [...t];
      _t.push(newTest);
      return _t;
    });

  const updateMobileTests = (newTest: TypeLabTest) =>
    setMobileLabTests(t => {
      const _t = [...t];
      _t.push(newTest);
      return _t;
    });

  const newStaticLabTest = () =>
    navigation.navigate(Routes.AddStaticLabSample, {
      step1Response: _step1Response,
      updateList: updateStaticTests,
    });
  const newMobileLabTest = () =>
    navigation.navigate(Routes.AddMobileLabSample, {
      step1Response: _step1Response,
      updateList: updateMobileTests,
    });

  const noTestMsg = () => (
    <Text style={styles.txtLight}>
      {'\n'}All tests will list here,{'\n'}please start adding new tests.{'\n'}
    </Text>
  );

  const User = useSelector<RootState, UserProfile>(state => state.data.user);
  const dispatch = useDispatch();
  const api = new Api(User, dispatch);

  const saveData = () => {
    // if (!selectedBusiness) {
    //     Alert.alert("Message", "Please select a business first")
    //     return
    // }
    // else if (title.trim() == "") {
    //     Alert.alert("Message", "Please enter title")
    //     return
    // }

    setSendingData(true);
    const data = new FormData();
    data.append('inspection_id', _step1Response.id);

    api
      .hfaInspectionStep3(data)
      .then(response => {
        const respData = getDataFrom(response);
        if (respData) {
          // console.log('respData', respData)
          onNext(respData.data);
        }
        setSendingData(false);
      })
      .catch(error => {
        handleError(error);
        setSendingData(false);
        // onNext({})
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Card>
          <Card.Title
            title={'Inspection Samples for Static Lab'}
            titleStyle={styles.title1}
          />

          <Card.Content>
            <FlatList
              data={staticLabTests}
              scrollEnabled={false}
              ItemSeparatorComponent={renderDivider}
              ListEmptyComponent={noTestMsg}
              ListFooterComponent={() => (
                <Button
                  mode="contained"
                  style={styles.btn1}
                  onPress={newStaticLabTest}>
                  Add New
                </Button>
              )}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <View style={styles.row}>
                    <Text style={styles.title2}>{item.item}</Text>
                    <Text style={styles.status}>Pending</Text>
                  </View>
                  <View style={styles.row1}>
                    <Text style={styles.label}>
                      Category: {'\n' + item.category}
                    </Text>
                    <Text style={styles.label}>
                      Code: {'\n' + item.category}
                    </Text>
                  </View>

                  <View style={styles.row1}>
                    <Text style={styles.label}>
                      Collected on:{'\n' + item.collectionDate}
                    </Text>
                    <Text style={styles.label}>
                      Received on:{'\n' + item.receivedDate}
                    </Text>
                  </View>
                </View>
              )}
            />
          </Card.Content>
        </Card>

        <Card style={{marginVertical: 30}}>
          <Card.Title
            title={'Sample Collection for Mobile Lab'}
            titleStyle={styles.title1}
          />

          <Card.Content>
            <FlatList
              data={mobileLabTests}
              scrollEnabled={false}
              ListEmptyComponent={noTestMsg}
              ItemSeparatorComponent={renderDivider}
              ListFooterComponent={() => (
                <Button
                  mode="contained"
                  style={styles.btn1}
                  onPress={newMobileLabTest}>
                  Add New
                </Button>
              )}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <View style={styles.row}>
                    <Text style={styles.title2}>{item.item}</Text>
                    <Text style={styles.status}>Pending</Text>
                  </View>
                  <View style={styles.row1}>
                    <Text style={styles.label}>Category: {item.category}</Text>
                    <Text style={styles.label}>Code: {item.code}</Text>
                  </View>

                  <View style={styles.row1}>
                    <Text style={styles.label}>Lab: {item.mobileLab}</Text>
                    <Text style={styles.label}>
                      Collected on:{'\n' + item.collectionDate}
                    </Text>
                  </View>
                </View>
              )}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          style={[styles.btn, {marginBottom: 30}]}
          loading={sendingData}
          onPress={saveData}>
          Save & Next
        </Button>
      </View>
    </ScrollView>
  );
};

export default HFASamplesTests;

const styles = StyleSheet.create({
  ...CommonStyle,
  container: {
    flex: 1,
    padding: moderateScale(20),
  },
  title1: {
    fontWeight: 'bold',
    fontFamily: Fonts.UniNeueBlack,
    fontSize: 16,
  },
  title2: {
    fontWeight: 'bold',
    fontFamily: Fonts.UniNeueBlack,
    fontSize: 14,
    // color: "#000"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row1: {
    flexDirection: 'row',
    marginTop: 5,
  },
  status: {
    backgroundColor: Color.Orange,
    borderRadius: 3,
    padding: 5,
    color: Color.White,
    fontSize: 12,
    overflow: 'hidden',
  },
  label: {
    flex: 1,
    fontFamily: Fonts.UniNeueRegular,
    color: '#333',
  },
  item: {
    marginTop: 20,
  },
  btn1: {
    width: 200,
    alignSelf: 'center',
    marginTop: 30,
  },
});
