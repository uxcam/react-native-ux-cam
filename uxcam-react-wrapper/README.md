# react-native-ux-cam

## Installation
`$yarn add file:/path-to-the-uxcam-react-wrapper`

For iOS, you will need to update pod as well:

`cd ios && pod update && cd ..`

### Android

The Android SDK is distributed from UXCam's Maven repository. Autolinking normally picks it up, but if your build fails with
`Could not find com.uxcam:uxcam:<version>` (common with Expo and some Gradle setups) add the repository to your app:

**Bare React Native** — `android/build.gradle`:

```groovy
allprojects {
    repositories {
        // ...
        maven { url 'https://sdk.uxcam.com/android/' }
    }
}
```

**Expo** — `app.json` / `app.config.js`, then run `npx expo prebuild`:

```json
[
  "expo-build-properties",
  {
    "android": {
      "extraMavenRepos": ["https://sdk.uxcam.com/android/"]
    }
  }
]
```

>Starting from 5.3.0, we no longer support project with react native version <0.60.0. Use manual linking for older version to add [UXCam](https://github.com/uxcam/ios-sdk/raw/main/UXCam.xcframework.zip) to your project.

>iOS 10 is the lowest version supported for recording sessions, which matches the default minimum version for new React Native projects.

## Usage
```javascript
import RNUxcam from 'react-native-ux-cam';
RNUxcam.optIntoVideoRecording(); // Add this line to enable screen recordings
 const configuration = {
    userAppKey: 'YOUR API KEY',
    /*
        disable advanced gestures if you're having issues with
        swipe gestures and touches during app interaction
    */
    // enableAdvancedGestureRecognition: false
 }
RNUxcam.startWithConfiguration(configuration);
```
# For testing example app
## Setup
`yarn install`

`yarn add react-native-ux-cam`
### or if adding locally
`yarn add file:/path-to-uxcam-plugin`

## Add the key from UXCam to App.js file

## Running
`react-native run-android`

`react-native run-ios`


## History
This is an updated way of integrating the UXCam SDK react-native following on from the original work by Mark Miyashita (https://github.com/negativetwelve) without whom this would have all been much harder!
