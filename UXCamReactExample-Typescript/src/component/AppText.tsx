import React from 'react';

import {
  TextStyle,
  TextProps as TextProperties,
  Text as RNText,
  StyleProp,
  StyleSheet,
} from 'react-native';
import {palette} from '../utils/palette';

export interface TextProps extends TextProperties {
  style?: StyleProp<TextStyle>;
}

const AppText: React.FC<TextProps> = ({children, ...props}) => {
  const {style: styleOverride, ...rest} = props;

  return (
    <RNText {...rest} style={[styles.default, styleOverride]}>
      {children}
    </RNText>
  );
};

export default AppText;

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: palette.white,
  },
});
