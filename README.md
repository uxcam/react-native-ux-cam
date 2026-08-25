# react-native-ux-cam

## Installation

```bash
# Yarn
yarn add react-native-ux-cam

# NPM
npm i react-native-ux-cam
```

For iOS, you will need to `pod update`  as well:

`cd ios && pod update && cd ..`

> Starting from 5.3.0, we no longer support project with react native version <0.60.0. Use manual linking for older version to add [UXCam](https://github.com/uxcam/ios-sdk/raw/main/UXCam.xcframework.zip) to your project.

> iOS 10 is the lowest version supported for recording sessions, which matches the default minimum version for new React Native projects.

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

# Example apps

A simple Javascript based example app is in the [UXCamReactExample](UXCamReactExample/) folder.  
A very simple Typescript example is in the [UXCamReactExample-Typescript](UXCamReactExample-Typescript/) folder.

For more detailed example using react-navigation, see [UXCam-demo-chat-app](https://github.com/uxcam/UXCam-demo-app)

## Setup

`yarn install`

`yarn add react-native-ux-cam`

### or if adding locally

`yarn add file:/path-to-uxcam-plugin`

## Add the key from UXCam to App.js file
`const configuration = {
    userAppKey: 'YOUR API KEY',
}
RNUxcam.startWithConfiguration(configuration);
`

## Running

### Android

`react-native run-android`

### iOS

To install the Cocoapod:
`cd iOS && pod update && cd ..`

Then to run the app:
`react-native run-ios`

# Manual Installation

## Setup

```bash
# Yarn
yarn add react-native-ux-cam

# NPM
npm i react-native-ux-cam
```

### iOS with react-native and Cocoapods

Add the following to your Podfile:

```ruby
pod 'RNUxcam', :path => '../node_modules/react-native-ux-cam'
```

and edit the minimum version of iOS to be >=10.0

Then run:

```bash
pod install
```

### Android

1. Go to `android/settings.gradle` add `include ':react-native-ux-cam'`
   and on the following line
   add `project(':react-native-ux-cam').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-ux-cam/android')`

2. Go to `android/app/build.gradle`
   add `compile project(':react-native-ux-cam')` under dependencies.

3. Go to `android/app/src/main/java/<path-to-main-application>/MainApplication.java` and
   add `import com.uxcam.RNUxcamPackage;`

4. Add `packages.add(new RNUxcamPackage());` inside `getPackages()` before return statement.

## Usage

```js
// Import UXCam.
import RNUxcam from 'react-native-ux-cam';

// Add this line to enable screen recordings
RNUxcam.optIntoVideoRecording();

// Initialize using your app key.

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

## Release

1. Create a release branch from `develop` named `release/v<version>`, for example `release/v6.0.18`.
2. Update Android SDK version on `uxcam-react-wrapper/android/build.gradle`.
3. Update iOS SDK version on `uxcam-react-wrapper/RNUxcam.podspec`.
4. Update plugin version on `uxcam-react-wrapper/package.json`, `uxcam-react-wrapper/android/src/main/java/com/uxcam/RNUxcamModuleImpl.java` and `uxcam-react-wrapper/ios/RNUxcam/RNUxcam.mm`.
5. Update `uxcam-react-wrapper/CHANGELOG.md`.
6. Open a PR from `release/v<version>` into `main`; the release-readiness workflow validates npm, Git tag and GitHub Release availability.
7. Merge the PR into `main`; the workflow automatically merges the release commit back into `develop`.
8. Tag the `main` merge commit as `v<version>` and push the tag.
9. The tag workflow publishes to npm, creates the GitHub Release and notifies Slack.
10. NB: If publishing a beta version then update the GitHub Action publish command to use the intended npm dist-tag.

## History

This is an updated way of integrating the UXCam SDK react-native following on from the original work by Mark
Miyashita (https://github.com/negativetwelve) without whom this would have all been much harder!
