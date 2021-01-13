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

>Starting from 5.3.0, we no longer support project with react native version <0.60.0. Use manual linking for older version to add [UXCam](https://github.com/uxcam/ios-sdk/raw/main/UXCam.xcframework.zip) to your project.

>iOS 10 is the lowest version supported for recording sessions, which matches the default minimum version for new React Native projects.

## Usage
```javascript
import RNUxcam from 'react-native-ux-cam';
RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
RNUxcam.startWithKey('YOUR API KEY');
```

# For testing example app
For more detailed example using react-navigation, see [UXCam-demo-chat-app](https://github.com/samin20/UXCam-demo-app)
## Setup
`yarn install`

`yarn add react-native-ux-cam`
### or if adding locally
`yarn add file:/path-to-uxcam-plugin`

## Add the key from UXCam to App.js file
`RNUxcam.startWithKey('YOUR UXCAM API KEY GOES HERE');`

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
and on the following line add `project(':react-native-ux-cam').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-ux-cam/android')` 

2. Go to `android/app/build.gradle`
add `compile project(':react-native-ux-cam')` under dependencies.

3. Go to `android/app/src/main/java/<path-to-main-application>/MainApplication.java` and add `import com.uxcam.RNUxcamPackage;`

4. Add `packages.add(new RNUxcamPackage());` inside `getPackages()` before return statement.

## Usage

```js
// Import UXCam.
import UXCam from 'react-native-ux-cam';

// Add this line to enable iOS screen recordings
UXCam.optIntoSchematicRecordings(); 

// Initialize using your app key.
UXCam.startWithKey(key);
```

## History
This is an updated way of integrating the UXCam SDK react-native following on from the original work by Mark Miyashita (https://github.com/negativetwelve) without whom this would have all been much harder!
