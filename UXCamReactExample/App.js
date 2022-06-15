/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import RNUxcam from 'react-native-ux-cam';
import {UXCamOcclusionType} from 'react-native-ux-cam/UXCamOcclusion';
import {launchImageLibrary} from 'react-native-image-picker';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// Used to toggle the screen hiding
var hideScreen = true;

type Props = {};
export default class App extends Component<Props> {
  componentDidMount() {
    RNUxcam.optIntoSchematicRecordings();
    const blur = {
      type: UXCamOcclusionType.Blur,
      blurRadius: 10,
    };
    const occludeTextFields = {
      type: UXCamOcclusionType.OccludeAllTextFields
    }
    const configuration = {
      userAppKey: 'flfqcjxcg4q0f85',
      occlusions: [blur, occludeTextFields],
      enableImprovedScreenCapture: true,
    };

    RNUxcam.startWithConfiguration(configuration);
    RNUxcam.addVerificationListener((result) =>
      console.log(`UXCam: verificationResult: ${JSON.stringify(result)}`),
    );
  }

  render() {
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

    // Basic instructions and then some examples of occluding views from the UXCam recording
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>

        <Button
          onPress={() => {
            RNUxcam.allowShortBreakForAnotherApp(true);
            launchImageLibrary(options, (response) => {
              RNUxcam.allowShortBreakForAnotherApp(false);
            });
          }}
          title="Open Gallery"
        />
        <Button
          onPress={() => {
            console.log(ram);
          }}
          title="Crash"
        />
        <Text
          ref={(label) => {
            RNUxcam.occludeSensitiveView(label);
          }}
          style={styles.label}>
          {' '}
          {'Label hidden from UXCam'}{' '}
        </Text>
        <Button
          title="Press here to toggle hiding whole screen"
          onPress={this._handlePress}
        />
        <Button
          ref={(x) => {
            RNUxcam.occludeSensitiveViewWithoutGesture(x);
          }}
          title="Gestures on this hidden button not recorded"
          onPress={this._handleEmptyPress}
        />
      </View>
    );
  }

  _handlePress(event) {
    // Toggle the whole screen being hidden
    RNUxcam.occludeSensitiveScreen(hideScreen, hideScreen);
    hideScreen = !hideScreen;
  }

  _handleEmptyPress(event) {
    // Just a placeholder button handler
    console.log('A button was pressed');
  }
}

const styles = StyleSheet.create({
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
});
