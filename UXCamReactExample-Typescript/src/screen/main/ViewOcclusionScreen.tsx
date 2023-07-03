import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RNUxcam from 'react-native-ux-cam';

import BaseScreen from '../base_screen';

const ViewOcclusionScreen = React.memo(() => {
  return (
    <BaseScreen screenName="ViewOcclusionScreen">
      <View style={styles.container}>
        <View style={styles.button}>
          <Text
            ref={label => {
              RNUxcam.occludeSensitiveView(label);
            }}
            style={styles.label}>
            {' '}
            {'Label hidden from UXCam'}{' '}
          </Text>
        </View>
      </View>
    </BaseScreen>
  );
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    margin: 5,
  },
});

export default ViewOcclusionScreen;
