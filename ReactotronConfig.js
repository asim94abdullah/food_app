import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

// ⚠️ Replace with your Mac's local IP address (same Wi-Fi as your device/emulator)
const host = '10.0.20.170';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'FoodApp',
    host,
  })
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate|generate_204/,
    },
  })
  .connect();

if (__DEV__) {
  Reactotron.clear();

  // Forward all console logs to Reactotron
  const yeOldeConsoleLog = console.log;
  console.log = (...args) => {
    yeOldeConsoleLog(...args);
    Reactotron.log(...args);
  };

  console.tron = Reactotron;
}

export default reactotron;
