import * as React from 'react';
import 'react-native-gesture-handler';
// import { PersistGate } from 'redux-persist/integration/react';
import {
  configureFonts,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider
} from 'react-native-paper';
import Main from './src/navigation/Main';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { Color, Fonts } from './src/common/Constants';
import { Fonts as TypeFonts } from 'react-native-paper/lib/typescript/types';
import store, { persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Splash from './src/screens/Splash';
import firebase from '@react-native-firebase/app';

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

LogBox.ignoreAllLogs()

const fonts: TypeFonts = {
  regular: {
    fontFamily: Fonts.UniNeueLight,
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: Fonts.UniNeueRegular,
    fontWeight: 'normal',
  },
  light: {
    fontFamily: Fonts.UniNeueBook,
    fontWeight: 'normal',
  },
  thin: {
    fontFamily: Fonts.UniNeueThin,
    fontWeight: 'normal',
  },
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Color.Green,
    secondary: '#000',
  },
  fonts: configureFonts({ ios: fonts, android: fonts })
};

var firebaseConfig = {

  name: 'FoodApp',
  apiKey: "AIzaSyDbgwDgOTl5NJgKNr8Hk4wYxpPhTGNaFT0",
  authDomain: "food-app-4a45f.firebaseapp.com",
  projectId: "food-app-4a45f",
  storageBucket: "food-app-4a45f.appspot.com",
  messagingSenderId: "329023627712",
  appId:
    // Platform.OS == 'ios'
    //   ? '1:256127077414:ios:ee0590170181fa9e086ae7'
    '1:329023627712:android:70f94c7fbb63ea2ebd2825',
  measurementId: "G-048VD6QCHR",

  databaseURL: 'https://food-app-4a45f-default-rtdb.firebaseio.com',
};

const App = () => {

  const [dataLoaded, setDataLoaded] = React.useState(false)
  // console.log('dataLoaded', dataLoaded);

  React.useEffect(() => {
    if (!firebase.apps.length) {
      firebase
        .initializeApp(firebaseConfig, firebaseConfig.name)
        .then(app => {
          // console.log('fb-app', app);
        })
        .catch(error => console.log('fb-app-error', error));
    }
  }, [])

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {bootstrapped =>
          dataLoaded ?
            <PaperProvider theme={theme}>
              <Main />
            </PaperProvider>
            :
            <Splash
              dataLoaded={setDataLoaded}
              bootstrapped={bootstrapped} />
        }
      </PersistGate>
    </Provider>
  );
};

/*
1. Invalid resposne format in "/hfa-inspections/business_search" for licno = 12345

*/

export default App;

