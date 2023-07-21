import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import RNUxcam from 'react-native-ux-cam';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

import BaseScreen from '../base_screen';

// Used to toggle the screen hiding
var hideScreen = true;

export const HomeScreen: React.FC = React.memo(() => {
  const navigation = useNavigation();

  let options = {
    title: 'Select Image',
    customButtons: [
      {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
    ],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const _handlePress = () => {
    // Toggle the whole screen being hidden
    // RNUxcam.occludeSensitiveScreen(hideScreen, hideScreen);
    hideScreen = !hideScreen;
  };

  const _handleEmptyPress = () => {
    // Just a placeholder button handler
    console.log('A button was pressed');
  };

  return (
    <BaseScreen screenName="HomeScreen">
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to UXCAm React Native Demo!</Text>
        <View style={styles.button}>
          <Button
            onPress={() => {
              navigation.navigate('ViewOcclusionScreen' as never);
            }}
            title="View Occlusion Screen"
          />
        </View>
        <View style={styles.button}>
          <Button
            onPress={() => {
              RNUxcam.allowShortBreakForAnotherApp(true);
              launchImageLibrary(options as any, _ => {
                RNUxcam.allowShortBreakForAnotherApp(false);
              });
            }}
            title="Open Gallery"
          />
        </View>
        <View style={styles.button}>
          <Button
            onPress={() => {
              console.log('On press Crash');
            }}
            title="Crash"
          />
        </View>
        <View style={styles.button}>
          <Button
            onPress={() => {
              navigation.navigate('VideoScreen' as never);
            }}
            title="Video Screen"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Press here to toggle hiding whole screen"
            onPress={_handlePress}
          />
        </View>
        <View style={styles.button}>
          <Button
            ref={x => {
              RNUxcam.occludeSensitiveViewWithoutGesture(x);
            }}
            title="Gestures on this hidden button not recorded"
            onPress={_handleEmptyPress}
          />
        </View>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
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
