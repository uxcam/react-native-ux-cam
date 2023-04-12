import React from 'react';
import {Text, View} from 'react-native';
import RNUxcam from 'react-native-ux-cam';
import {styles} from '../App';

export function ViewOcclusionScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Text
          ref={(label) => {
            RNUxcam.occludeSensitiveView(label);
          }}
          style={styles.label}>
          {' '}
          {'Label hidden from UXCam'}{' '}
        </Text>
      </View>
    </View>
  );
}
