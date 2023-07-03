import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from '../component/AppText';
import {palette} from './palette';
import {ToastConfig} from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  customToast: props => {
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>{props.text1}</AppText>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: palette.pastelPink,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
  text: {color: palette.black, fontSize: 16},
});
