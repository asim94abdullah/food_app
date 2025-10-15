import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

// ⚠️ Replace with your Mac's IP (same Wi-Fi as your phone/emulator)
const host = '10.0.20.44';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'FoodApp',
    host, // Important for physical device
  })
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate|generate_204/,
    },
  })
  .connect();

Reactotron.clear();

// 🔥 Forward all console logs to Reactotron too
// const yeOldeConsoleLog = console.log;
// console.log = (...args) => {
//   yeOldeConsoleLog(...args);
//   Reactotron.log(...args);
// };

console.tron = Reactotron;

export default reactotron;
