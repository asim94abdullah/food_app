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
import {ActivityIndicator, Divider, Text, TextInput} from 'react-native-paper';
import {Color, Fonts} from '../common/Constants';
import Icon from './Icon';

interface DropdownProps {
  data: any[];
  onItemSelect: (i: any) => void;
  label: string;
  value: any;
  status?: boolean;
  style?: StyleProp<ViewProps>;
  onBeforeOpen?: () => boolean; // 👈 new optional prop
}

const Dropdown = ({
  data,
  onItemSelect,
  label,
  value,
  style,
  status,
  onBeforeOpen,
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
      const trimmedQuery = t?.trim().toLowerCase();
      if (trimmedQuery === '') {
        setShownItemNames(data);
        return;
      }

      setIsWaiting(true);
      setTimeout(() => {
        try {
          const _shownItemNames = data.filter(item => {
            return (
              (item?.license_number &&
                item.license_number.toLowerCase().includes(trimmedQuery)) ||
              (item?.title && item.title.toLowerCase().includes(trimmedQuery))
            );
          });
          setShownItemNames(_shownItemNames);
          setIsWaiting(false);
        } catch (error) {
          console.error('Error searching:', error);
          setIsWaiting(false);
        }
      }, 100);
    } catch (error) {
      setIsWaiting(false);
      console.error('Error in search function:', error);
    }
  };

  useEffect(() => {
    setShownItemNames(data);
  }, [data]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          // ✅ Only open modal if allowed by parent
          if (typeof onBeforeOpen === 'function') {
            const canOpen = onBeforeOpen();
            if (!canOpen) return;
          }
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
            }}>
            <Text
              style={{
                color: '#59565F',
                fontSize: 16,
                flex: 1,
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
              <View style={styles.loadingView}>
                <ActivityIndicator />
              </View>
            )}

            <FlatList
              data={shownItemNames}
              style={{marginTop: 20}}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setShowModel(false);
                    onItemSelect(item);
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
                        {/* your icon logic here */}
                      </View>
                    )}

                    {item?.license_number && <Text>{item.license_number}</Text>}
                  </View>
                </TouchableOpacity>
              )}
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
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Dropdown;
