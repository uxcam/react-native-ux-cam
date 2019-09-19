# react-native-ux-cam

## Installation
`$yarn add file:/path-to-the-uxcam-react-wrapper`

`$react-native link react-native-ux-cam`


For react-native version 0.60 if using iOS you then need to:

`cd ios && pod update && cd ..`

## Usage
```javascript
import RNUxcam from 'react-native-ux-cam';

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
