import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import {Button} from 'react-native-paper';
import ThermalPrinterModule from 'react-native-thermal-printer';
import {Color, Constants} from '../common/Constants';
import LogoStr from '../common/LogoStr';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

interface PrinterManagerProps {
  show: boolean;
  onClose: () => void;
  payload: string;
}

const PrinterManager = ({show, onClose, payload}: PrinterManagerProps) => {
  const [searchingDevices, setSearchingDevices] = React.useState(false);
  const [devicesList, setDevicesList] = React.useState([]);
  const [connectedPrinter, setConnectedPrinter] = React.useState<any>();

  const [label, setLabel] = React.useState('');
  const [status, setStatus] = React.useState('');

  const searchDevices = async () => {
    const result = await requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]);
    if (
      result['android.permission.BLUETOOTH_CONNECT'] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      setSearchingDevices(true);
      setLabel('Searching Printer...');
      setStatus('');
      ThermalPrinterModule.getBluetoothDeviceList()
        .then((d: any) => {
          console.log('Bluetooth Device Print', d);

          setDevicesList(d);
          setLabel('Choose Printer');
          setSearchingDevices(false);
        })
        .catch(error => {
          console.log('error', error);
          setLabel('Choose Printer');
          setSearchingDevices(false);
        });
    } else {
      setSearchingDevices(true);
      setLabel('Searching Printer...');
      setStatus('');
      ThermalPrinterModule.getBluetoothDeviceList()
        .then((d: any) => {
          console.log('Bluetooth Device Print', d);

          setDevicesList(d);
          setLabel('Choose Printer');
          setSearchingDevices(false);
        })
        .catch(error => {
          console.log('error', error);
          setLabel('Choose Printer');
          setSearchingDevices(false);
        });
    }
  };

  // const searchDevices = async () => {
  //   // Check for platform
  //   if (Platform.OS === 'android') {
  //     // Check if all required permissions are granted for Android
  //     const granted = await checkMultiplePermissionsAndroid([
  //       PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  //       PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  //       PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  //     ]);

  //     if (granted) {
  //       // Permission granted, proceed with device search
  //       proceedWithDeviceSearch();
  //     } else {
  //       Alert.alert(
  //         'Permission Required',
  //         'Please allow the application to access your bluetooth!',
  //       );
  //     }
  //   } else if (Platform.OS === 'ios') {
  //     // Check for iOS permissions
  //     const granted = await checkMultiplePermissionsIOS([
  //       PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
  //     ]);

  //     if (granted) {
  //       // Permission granted, proceed with device search
  //       proceedWithDeviceSearch();
  //     } else {
  //       Alert.alert(
  //         'Permission Required',
  //         'Please allow the application to access your bluetooth!',
  //       );
  //     }
  //   }
  // };
  // Helper function to check multiple permissions on Android
  // const checkMultiplePermissionsAndroid = async (permissions: any) => {
  //   const results = await requestMultiple(permissions);
  //   return permissions.every(
  //     (permission: any) =>
  //       results[permission] === PermissionsAndroid.RESULTS.GRANTED,
  //   );
  // };

  // // Helper function to check multiple permissions on iOS
  // const checkMultiplePermissionsIOS = async (permissions: any) => {
  //   const results = await requestMultiple(permissions);
  //   return permissions.every(
  //     (permission: any) => results[permission] === PERMISSIONS.IOS.AUTHORIZED,
  //   );
  // };

  // // Common function to proceed with device search
  // const proceedWithDeviceSearch = async () => {
  //   setSearchingDevices(true);
  //   setLabel('Searching Printer...');
  //   setStatus('');

  //   try {
  //     let devices = [];
  //     devices = await ThermalPrinterModule.getBluetoothDeviceList();
  //     console.log('Bluetooth Device Print', devices);
  //     setDevicesList(devices);
  //     setLabel('Choose Printer');
  //   } catch (error: any) {
  //     console.log('error', error);
  //     setStatus('Error: ' + error.message);
  //   } finally {
  //     setSearchingDevices(false);
  //   }
  // };

  React.useEffect(() => {
    // console.log('img', payload);
    // console.log('connectedPrinter', connectedPrinter);

    if (payload?.trim() != '' && show) {
      if (!connectedPrinter) {
        searchDevices();
        return;
      }

      startPrinting();
    }
  }, [show, payload, connectedPrinter]);

  const startPrinting = () => {
    setStatus('Printing on ' + connectedPrinter.macAddress);

    ThermalPrinterModule.printBluetooth({
      payload: payload,
      printerNbrCharactersPerLine: 38,
      // printerDpi: 203,
      mmFeedPaper: 20,
      printerWidthMM: 50, // 80       // width of invoice; effect center of content
      macAddress: connectedPrinter?.macAddress,
    })
      .then(response => {
        // console.log('response', response);
        setStatus('Done');
        onClose();
        // console.log('response', response);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        // console.log(err.message);
        setStatus('' + err);
      });
  };

  return (
    <Modal transparent visible={show}>
      <View style={styles.overly}>
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          {!searchingDevices && (
            <FlatList
              data={devicesList}
              style={{width: '100%'}}
              ListEmptyComponent={
                <Text style={{alignSelf: 'center', margin: 20}}>
                  Didn't find any Blutooth Printer
                </Text>
              }
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    if (connectedPrinter?.macAddress == item?.macAddress) {
                      startPrinting();
                    } else {
                      setConnectedPrinter(item);
                    }
                  }}>
                  <View style={styles.item}>
                    <Text style={styles.txtLg}>{item.deviceName}</Text>
                    <Text style={styles.txtSm}>{item.macAddress}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          <Text style={styles.txtLg}>{status}</Text>

          <Button onPress={searchDevices}>Refresh</Button>
          <Button onPress={onClose}>Close</Button>
        </View>
      </View>
    </Modal>
  );
};

export default PrinterManager;

const styles = StyleSheet.create({
  overly: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Color.White,
    width: '80%',
    minHeight: 200,
    maxHeight: 500,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
  },
  item: {
    padding: 10,
  },
  divider: {
    width: '100%',
    height: 0.7,
    backgroundColor: '#cfcfcf',
  },
  txtLg: {
    fontSize: 14,
  },
  txtSm: {
    fontSize: 11,
  },
});
