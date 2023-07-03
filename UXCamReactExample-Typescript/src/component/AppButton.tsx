import React from 'react';
import {
  Pressable,
  TextStyle,
  StyleProp,
  StyleSheet,
  ViewStyle,
  PressableProps,
} from 'react-native';
import AppText from './AppText';
import {palette} from '../utils/palette';

export interface ButtonProps extends PressableProps {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  text?: string;
}

const AppButton: React.FC<ButtonProps> = ({
  containerStyle,
  textStyle,
  text,
  children,
  ...rest
}) => {
  const content = children || <AppText style={textStyle}>{text}</AppText>;

  return (
    <Pressable style={[styles.button, containerStyle]} {...rest}>
      {content}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: palette.black,
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
