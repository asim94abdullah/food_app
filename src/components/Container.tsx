import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Background from '../assets/svg/Background';

interface ContainerProps {
  children?: React.ReactNode;
  hideBg?: boolean;
}
const {height} = Dimensions.get('screen');
const Container = ({hideBg, children}: ContainerProps) => {
  return (
    <View style={styles.container}>
      {!hideBg && (
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            position: 'absolute',
            height: height,
          }}>
          <Background />
        </View>
      )}
      <StatusBar barStyle={'light-content'} />
      <View style={styles.fill}>{children}</View>
    </View>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  fill: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
});
