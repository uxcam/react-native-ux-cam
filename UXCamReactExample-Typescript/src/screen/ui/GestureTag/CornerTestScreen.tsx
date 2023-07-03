import React from 'react';
import {View, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';

import AppButton from '../../../component/AppButton';
import {palette} from '../../../utils/palette';
import BaseScreen from '../../base_screen';

const CornerTestScreen = React.memo(() => {
  const showToast = (message: string) => {
    Toast.show({
      type: 'customToast',
      text1: message,
      position: 'bottom',
    });
  };

  return (
    <BaseScreen screenName="CornerTestScreen">
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <AppButton
            text="Top Left"
            containerStyle={[styles.button, styles.blueColor]}
            onPress={() => {
              showToast('Top Left tapped');
            }}
          />
          <AppButton
            text="Top Right"
            containerStyle={[styles.button, styles.blueColor]}
            onPress={() => {
              showToast('Top Right tapped');
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            text="Center Left"
            containerStyle={[styles.button, styles.greenColor]}
            onPress={() => {
              showToast('Center Left tapped');
            }}
          />

          <AppButton
            text="Center"
            containerStyle={[styles.button, styles.greenColor]}
            onPress={() => {
              showToast('Center tapped');
            }}
          />

          <AppButton
            text="Center Right"
            containerStyle={[styles.button, styles.greenColor]}
            onPress={() => {
              showToast('Center Right tapped');
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            text="Bottom Left"
            containerStyle={[styles.button, styles.yellowColor]}
            onPress={() => {
              showToast('Bottom Left');
            }}
          />
          <AppButton
            text="Bottom Right"
            containerStyle={[styles.button, styles.yellowColor]}
            onPress={() => {
              showToast('Bottom Right');
            }}
          />
        </View>
      </View>
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  button: {
    paddingVertical: 15,
    backgroundColor: palette.skyBlue,
    width: 115,
    borderRadius: 0,
  },
  greenColor: {backgroundColor: palette.pastelPurple},
  yellowColor: {backgroundColor: palette.pastelPink},
  blueColor: {backgroundColor: palette.pastelBlue},
});

export default CornerTestScreen;
