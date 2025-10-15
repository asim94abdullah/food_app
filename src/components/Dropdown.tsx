import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  TouchableOpacity,
} from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import {ActivityIndicator, Divider, Text, TextInput} from 'react-native-paper';
import {Color, Fonts} from '../common/Constants';
import Icon from './Icon';

interface DropdownProps {
  data: any[];
  onItemSelect: (i: any) => void;
  label: string;
  // placeholder: string,
  value: any;
  status?: boolean;
  style?: StyleProp<ViewProps>;
}
const Dropdown = ({
  data,
  onItemSelect,
  label,
  value,
  style,
  status,
}: DropdownProps) => {
  const [shownItemNames, setShownItemNames] = useState(data);
  const [showModel, setShowModel] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onTextChange = (t: string) => {
    try {
      setSearchQuery(t);
      search(t);
    } catch (error) {}
  };

  const search = (t: string) => {
    try {
      // if (isWaiting) {
      //   return;
      // }

      console.log('asimmm', t);

      const trimmedQuery = t?.trim().toLowerCase();
      if (trimmedQuery === '') {
        setShownItemNames(data);
        return;
      }

      setIsWaiting(true);

      setTimeout(() => {
        try {
          const _shownItemNames = [];

          for (const item of data) {
            if (
              item &&
              item?.license_number &&
              item?.license_number.toLowerCase().includes(trimmedQuery)
            ) {
              _shownItemNames.push(item);
            } else if (
              item &&
              item?.title.toLowerCase().includes(trimmedQuery)
            ) {
              _shownItemNames.push(item);
            }
            setShownItemNames(_shownItemNames);
            setIsWaiting(false);
            // console.log('_shownItemNames', _shownItemNames);
          }
        } catch (error) {
          // Handle errors gracefully
          console.error('Error searching:', error);
          setIsWaiting(false);
        }
      }, 100);
    } catch (error) {
      // Handle errors gracefully
      setIsWaiting(false);
      console.error('Error in search function:', error);
    }
  };

  useEffect(() => {
    setShownItemNames(data);
  }, [data]);

  // console.log('statussss', status);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShowModel(true);
        }}>
        <View style={style}>
          <Text
            style={{
              fontSize: 10,
              flex: 1,
              fontFamily: Fonts.UniNeueRegular,
              marginLeft: 15,
            }}>
            {value ? label : ''}
          </Text>
          <View
            style={{
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingBottom: 15,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#BFBFC0',
              // backgroundColor: 'red',
            }}>
            <Text
              style={{
                color: '#59565F',
                fontSize: 16,
                flex: 1,
                // fontFamily: Fonts.UniNeueRegular,
              }}>
              {value?.title || label}
            </Text>

            <Icon
              name="down"
              type="AntDesign"
              style={{fontSize: 16, color: '#afafaf'}}
            />
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={showModel} transparent>
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <View style={styles.row}>
              <Text style={styles.title}>Choose an option</Text>
              <Icon
                name="close"
                type="AntDesign"
                size={20}
                onPress={() => setShowModel(false)}
              />
            </View>

            <TextInput
              mode="outlined"
              outlineColor="#cfcfcf"
              placeholder="Search"
              value={searchQuery}
              onChangeText={onTextChange}
            />

            {isWaiting && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <ActivityIndicator />
              </View>
            )}
            <FlatList
              data={shownItemNames}
              style={{marginTop: 20}}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({item}) => {
                // console.log('ittttem', item.license_number);

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setShowModel(false);
                      onItemSelect(item);
                      // console.log(item);
                    }}>
                    <View style={styles.row}>
                      <Text
                        numberOfLines={1}
                        style={{
                          ...styles.item,
                          width: status ? '50%' : '70%',
                        }}>
                        {item.title}
                      </Text>
                      {status && (
                        <View
                          style={{
                            width: '30%',
                            marginRight: 30,
                            alignItems: 'flex-end',
                          }}>
                          {item.title === 'Warning' && (
                            <Icon
                              type="Entypo"
                              name="warning"
                              color={'black'}
                              size={20}
                              onPress={() => {}}
                            />
                          )}
                          {item.title === 'Fine' && (
                            <Icon
                              type="Entypo"
                              name="credit"
                              color={'black'}
                              size={20}
                              onPress={() => {}}
                            />
                          )}
                          {item.title === 'Imprison' && (
                            <Icon
                              type="Entypo"
                              name="man"
                              color={'black'}
                              size={20}
                              onPress={() => {}}
                            />
                          )}
                          {item.title === 'Marasla' && (
                            <Icon
                              type="FontAwesome"
                              name="address-book"
                              color={'black'}
                              size={20}
                              onPress={() => {}}
                            />
                          )}
                          {item.title === 'Notice' && (
                            <Icon
                              type="MaterialCommunityIcons"
                              name="book-open-page-variant-outline"
                              color={'black'}
                              size={20}
                              onPress={() => {}}
                            />
                          )}
                        </View>
                      )}

                      {item?.license_number && (
                        <Text>{item.license_number}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: Color.White,
    borderRadius: 10,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 18,
  },
  item: {
    padding: 15,
    width: '50%',
  },
});

export default Dropdown;
