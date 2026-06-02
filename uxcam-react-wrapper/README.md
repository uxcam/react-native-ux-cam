# react-native-ux-cam

## Installation
`$yarn add file:/path-to-the-uxcam-react-wrapper`

For iOS, you will need to update pod as well:

`cd ios && pod update && cd ..`

>Starting from 5.3.0, we no longer support project with react native version <0.60.0. Use manual linking for older version to add [UXCam](https://github.com/uxcam/ios-sdk/raw/main/UXCam.xcframework.zip) to your project.

>iOS 10 is the lowest version supported for recording sessions, which matches the default minimum version for new React Native projects.

## iOS — Swift Package Manager (optional)

By default the UXCam iOS SDK is pulled through CocoaPods and **no extra steps are required**.

If your app sources its iOS dependencies through Swift Package Manager, you can have the UXCam
SDK pulled via SPM instead of CocoaPods (the React Native glue still autolinks through CocoaPods).
This uses React Native's `spm_dependency` helper, available since **React Native 0.75**:

1. Enable dynamic frameworks in your `ios/Podfile` (required by SPM integration), e.g.
   `use_frameworks! :linkage => :dynamic`.
2. Install pods with the opt-in flag set:

   ```sh
   cd ios && UXCAM_USE_SPM=1 pod install && cd ..
   ```

CocoaPods then resolves the [`uxcam-ios-sdk`](https://github.com/uxcam/uxcam-ios-sdk) Swift Package
instead of the `UXCam` pod. Leaving `UXCAM_USE_SPM` unset keeps the default CocoaPods behaviour.

> A standalone `Package.swift` is also included as a future-facing scaffold, but it is **not
> consumable yet** — React Native does not currently publish its core as a Swift Package, so the
> native module cannot be autolinked purely through SPM. This is expected to become possible around
> React Native 0.84.

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
