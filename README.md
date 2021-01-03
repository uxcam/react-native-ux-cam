# react-native-ux-cam

## Installation
`$yarn add file:/path-to-the-uxcam-react-wrapper`

For iOS, you will need to update pod as well:

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
