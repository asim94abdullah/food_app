import * as React from 'react';
import {Text, View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {Fonts} from '../common/Constants';
import {CommonStyle} from '../common/Theme';
import RadioButton from './RadioButton';

interface RadioButtonsYesNoProps {
  title: string;
  value: boolean;
  onChange: (v: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

const RadioButtonsYesNo = ({
  title,
  value,
  onChange,
  style,
}: RadioButtonsYesNoProps) => {
  return (
    <View style={[styles.input, style]}>
      <Text
        style={{
          ...styles.label,
          marginBottom: 10,
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        {title}
      </Text>
      {/* {this.getRadioButtons(field.options, field.id, val)} */}
      <View style={styles.row}>
        <RadioButton
          label={'Yes'}
          checked={value}
          style={styles.radioBtn}
          // it save id in state; to save value (Yes/No) use option.title
          onPress={() => onChange(true)}
        />

        <RadioButton
          label={'No'}
          checked={!value}
          style={{...styles.radioBtn}}
          // it save id in state; to save value (Yes/No) use option.title
          onPress={() => onChange(false)}
        />
      </View>
    </View>
  );
};

export default RadioButtonsYesNo;

const styles = StyleSheet.create({
  ...CommonStyle,
  input: {
    marginBottom: moderateScale(40),
    backgroundColor: 'transparent',
    fontFamily: Fonts.UniNeueRegular,
  },
  radioBtn: {
    // justifyContent: 'flex-start',
    marginTop: 8,
    marginRight: '20%',
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
  },
});
