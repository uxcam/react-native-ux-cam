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
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Video from 'react-native-video';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// Used to toggle the screen hiding
var hideScreen = true;

type Props = {};

function HomeScreen({navigation}) {
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
      <Button
        onPress={() => {
          navigation.navigate('Video Screen');
        }}
        title="Video Screen"
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
        onPress={_handlePress()}
      />
      <Button
        ref={(x) => {
          RNUxcam.occludeSensitiveViewWithoutGesture(x);
        }}
        title="Gestures on this hidden button not recorded"
        onPress={_handleEmptyPress()}
      />
    </View>
  );
}

function VideoScreen() {
  return (
    <Video
      source={{uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'}}
      controls={true}
      style={{width: 400, height: 400}}
      muted={false}
      repeat={false}
      resizeMode={'cover'}
      volume={1.0}
      rate={1.0}
      ignoreSilentSwitch={'ignore'}
      playWhenInactive={true}
      playInBackground={true}
    />
  );
}

const Stack = createNativeStackNavigator();

export default class App extends Component<Props> {
  componentDidMount() {
    RNUxcam.optIntoSchematicRecordings();
    const overlay = {
      type: UXCamOcclusionType.Overlay,
      color: 0x000000
    }
    const configuration = {
      userAppKey: 'YOUR UXCAM API KEY GOES HERE',
      enableImprovedScreenCapture: true, // for improved screen capture on Android
      /*
        disable advanced gestures if you're having issues with
        swipe gestures and touches during app interaction
      */
      // enableAdvancedGestureRecognition: false,
      //occlusions: [overlay]
    }

    
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
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
});
