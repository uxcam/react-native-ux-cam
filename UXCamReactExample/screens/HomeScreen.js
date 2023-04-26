import React from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import RNUxcam from 'react-native-ux-cam';
import {launchImageLibrary} from 'react-native-image-picker';
import {styles} from '../App.js';

// Used to toggle the screen hiding
var hideScreen = true;

export function HomeScreen({navigation}) {
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

  function _handlePress(event) {
    // Toggle the whole screen being hidden
    // RNUxcam.occludeSensitiveScreen(hideScreen, hideScreen);
    hideScreen = !hideScreen;
  }

  function _handleEmptyPress(event) {
    // Just a placeholder button handler
    console.log('A button was pressed');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to UXCAm React Native Demo!</Text>
      <View style={styles.button}>
        <Button
          onPress={() => {
            navigation.navigate('View Occlusion Screen');
          }}
          title="View Occlusion Screen"
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={() => {
            RNUxcam.allowShortBreakForAnotherApp(true);
            launchImageLibrary(options, (response) => {
              RNUxcam.allowShortBreakForAnotherApp(false);
            });
          }}
          title="Open Gallery"
        />
      </View>
      <View style={styles.button}>
        <Button
          style={styles.button}
          onPress={() => {
            console.log(ram);
          }}
          title="Crash"
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={() => {
            navigation.navigate('Video Screen');
          }}
          title="Video Screen"
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Press here to toggle hiding whole screen"
          onPress={_handlePress()}
        />
      </View>
      <View style={styles.button}>
        <Button
          ref={(x) => {
            RNUxcam.occludeSensitiveViewWithoutGesture(x);
          }}
          title="Gestures on this hidden button not recorded"
          onPress={_handleEmptyPress()}
        />
      </View>
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
