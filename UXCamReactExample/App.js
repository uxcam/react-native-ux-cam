/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import RNUxcam from 'react-native-ux-cam';
import {UXCamOcclusionType} from 'react-native-ux-cam/UXCamOcclusion';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VideoScreen} from './screens/VideoScreen.js';
import {HomeScreen} from './screens/HomeScreen.js';

type Props = {};

const Stack = createNativeStackNavigator();

export default class App extends Component<Props> {
  componentDidMount() {
    RNUxcam.optIntoSchematicRecordings();
    const overlay = {
      type: UXCamOcclusionType.Overlay,
      color: 0x000000,
    };
    const configuration = {
      userAppKey: 'YOUR UXCAM API KEY GOES HERE',
      enableImprovedScreenCapture: true, // for improved screen capture on Android
      /*
        disable advanced gestures if you're having issues with
        swipe gestures and touches during app interaction
      */
      // enableAdvancedGestureRecognition: false,
      //occlusions: [overlay]
    };

    RNUxcam.startWithConfiguration(configuration);
    RNUxcam.addVerificationListener((result) =>
      console.log(`UXCam: verificationResult: ${JSON.stringify(result)}`),
    );
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Video Screen" component={VideoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}