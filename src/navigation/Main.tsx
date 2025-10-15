import * as React from 'react';
// import { Text, View, StyleSheet } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
  TransitionSpecs,
} from '@react-navigation/stack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import Splash from '../screens/Splash';
import {Routes} from '../common/Constants';
import Login from '../screens/Login';
import Home from '../screens/Home';
import SendStock from '../screens/SendStock';
import VehiclesList from '../screens/VehiclesList';
import DriversList from '../screens/DriversList';
import MillsInspection from '../screens/MillsInspection';
import ShipmentDetails from '../screens/SendStock/ShipmentDetails';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {UserProfile} from '../common/Type';
import Echallan from '../screens/Echallan';
import ShopsInspection from '../screens/ShopsInspection';
import AddShop from '../screens/AddShop';
import DealersInspection from '../screens/DealersInspection';
import CourtNotice from '../screens/CourtNotice';
import DealerSellForm from '../screens/DealerSellForm';
import MyInspections from '../screens/MyInspections';
import DealerSellHistory from '../screens/DealerSellHistory';
import DealerPendingStock from '../screens/DealerPendingStock';
import DealerReceivingForm from '../screens/DealerReceivingForm';
import DealerReceivedStock from '../screens/DealerReceivedStock';
import PrNotificationsList from '../screens/PrNotificationsList';
import HFAInspection from '../screens/HFAInspection';
import AddMobileLabSample from '../screens/AddMobileLabSample';
import AddStaticLabSample from '../screens/AddStaticLabSample';
import AddBags from '../screens/ShopDealerModule/AddBags';
import CloseBalance from '../screens/ShopDealerModule/CloseBalance';
import ShopSellForm from '../screens/ShopDealerModule/ShopSellForm';
import NIC_Scanner from '../screens/ShopDealerModule/NIC_Scanner';
import ScanScreen from '../screens/ScanScreen';
import ChangePassword from '../screens/ChangePassword';
import ForgotPassword from '../screens/ForgotPassword';
import Analytics from 'appcenter-analytics';
import WheatClosing from '../screens/Checkpost/WheatClosing';
import AttaClosing from '../screens/Checkpost/AttaClosing';
import TrackWheat from '../screens/Checkpost/TrackWheat';
import TrackAtta from '../screens/Checkpost/TrackAtta';
import AttaReceiving from '../screens/Checkpost/AttaReceiving';
import CheckpostSummary from '../screens/Checkpost/CheckpostSummary';
import DealerAttaActiveList from '../screens/DealerAttaActiveList';
import CheckPostActiveList from '../screens/Checkpost/CheckPostActiveList';
import PendingShopVoilation from '../screens/PendingShopVoilation';

interface MainProps {}

const Stack = createStackNavigator();
const Main = (props: MainProps) => {
  const User = useSelector<RootState, UserProfile>(state => state.data.user);

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef<string | undefined>();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        try {
          routeNameRef.current = navigationRef.getCurrentRoute().name;
        } catch (error) {
          console.log('nav-err-1', error);
        }
      }}
      onStateChange={async () => {
        try {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            // Save the current route name for later comparison
            routeNameRef.current = currentRouteName;

            // Replace the line below to add the tracker from a mobile analytics SDK
            Analytics.trackEvent('Screen', {name: currentRouteName});
          }
        } catch (error) {
          console.log('nav-err-2', error);
        }
      }}>
      <Stack.Navigator
        // initialRouteName={Routes.HFAInspection}
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {/* <Stack.Screen component={Login} name={"_"} /> */}
        {!User ? (
          <Stack.Screen component={Login} name={Routes.Login} />
        ) : (
          <>
            <Stack.Screen component={Home} name={Routes.Home} />
            <Stack.Screen component={SendStock} name={Routes.SendStock} />
            <Stack.Screen
              component={ShipmentDetails}
              name={Routes.ShipmentDetails}
            />
            <Stack.Screen component={VehiclesList} name={Routes.VehiclesList} />
            <Stack.Screen component={DriversList} name={Routes.DriversList} />
            <Stack.Screen
              component={MillsInspection}
              name={Routes.MillsInspection}
            />
            <Stack.Screen
              component={ShopsInspection}
              name={Routes.ShopsInspection}
            />
            <Stack.Screen component={Echallan} name={Routes.Echallan} />
            <Stack.Screen component={AddShop} name={Routes.AddShop} />
            <Stack.Screen
              component={DealersInspection}
              name={Routes.DealersInspection}
            />
            <Stack.Screen component={CourtNotice} name={Routes.CourtNotice} />
            <Stack.Screen
              component={DealerSellForm}
              name={Routes.DealerSellForm}
            />
            <Stack.Screen
              component={MyInspections}
              name={Routes.MyInspections}
            />
            <Stack.Screen
              component={DealerSellHistory}
              name={Routes.SellHsitory}
            />
            <Stack.Screen
              component={DealerPendingStock}
              name={Routes.PendingStock}
            />
            <Stack.Screen
              component={DealerReceivedStock}
              name={Routes.RecievedStock}
            />
            <Stack.Screen
              component={DealerReceivingForm}
              name={Routes.RecievingForm}
            />
            <Stack.Screen
              component={PrNotificationsList}
              name={Routes.PrNotificationsList}
            />
            <Stack.Screen
              component={HFAInspection}
              name={Routes.HFAInspection}
            />

            <Stack.Screen component={AddBags} name={Routes.AddBags} />
            <Stack.Screen component={CloseBalance} name={Routes.CloseBalance} />
            <Stack.Screen component={NIC_Scanner} name={Routes.NIC_Scanner} />
            <Stack.Screen component={ShopSellForm} name={Routes.ShopSellForm} />
            <Stack.Screen component={ScanScreen} name={Routes.ScanScreen} />

            <Stack.Screen component={WheatClosing} name={Routes.WheatClosing} />
            <Stack.Screen component={AttaClosing} name={Routes.AttaClosing} />
            <Stack.Screen component={TrackWheat} name={Routes.TrackWheat} />
            <Stack.Screen component={TrackAtta} name={Routes.TrackAtta} />
            <Stack.Screen
              component={AttaReceiving}
              name={Routes.AttaReceiving}
            />
            <Stack.Screen
              component={CheckpostSummary}
              name={Routes.CheckpostSummary}
            />
            <Stack.Screen
              component={DealerAttaActiveList}
              name={Routes.DealerAttaActiveList}
            />
            <Stack.Screen
              component={CheckPostActiveList}
              name={Routes.CheckPostActiveList}
            />
            <Stack.Screen
              component={PendingShopVoilation}
              name={Routes.PendingShopList}
            />
          </>
        )}

        <Stack.Screen
          component={AddMobileLabSample}
          name={Routes.AddMobileLabSample}
        />
        <Stack.Screen
          component={AddStaticLabSample}
          name={Routes.AddStaticLabSample}
        />
        <Stack.Screen component={ChangePassword} name={Routes.ChangePassword} />
        <Stack.Screen component={ForgotPassword} name={Routes.ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
