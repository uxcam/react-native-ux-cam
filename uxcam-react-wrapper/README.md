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

### Migrating an existing app from CocoaPods to SPM

If you already use this package via CocoaPods and want to move the UXCam SDK over to Swift Package
Manager, follow these steps in your **app** (not in this package):

**Prerequisites**

- React Native **0.75+** (for the `spm_dependency` helper).
- You are willing to enable `use_frameworks! :linkage => :dynamic`. This is project-wide and may
  require fixing other native modules that don't support dynamic frameworks.

**Steps**

1. Add dynamic frameworks to `ios/Podfile`:

   ```ruby
   # ios/Podfile
   use_frameworks! :linkage => :dynamic
   ```

2. Clear the existing CocoaPods state so the old `UXCam` pod is removed:

   ```sh
   cd ios
   rm -rf Pods Podfile.lock
   ```

3. Reinstall pods **with the opt-in flag**:

   ```sh
   UXCAM_USE_SPM=1 pod install
   cd ..
   ```

4. Verify the migration:
   - `UXCam` no longer appears in `ios/Podfile.lock` (it is no longer a pod).
   - The pod install log shows `[SPM] Adding SPM dependency on product ["UXCam"]`.
   - On first build, Xcode resolves the package: `Resolved source packages: UXCam`.

> ⚠️ The `UXCAM_USE_SPM=1` flag must be present on **every** `pod install`. If you run `pod install`
> without it, the package falls back to the CocoaPods `UXCam` pod. To make the opt-in permanent for
> your team, set the variable in your CI and local build scripts (for example, export it in your
> shell profile or prefix your `pod install` step), since CocoaPods has no per-project way to persist
> an environment variable.

**Reverting back to CocoaPods**

Run `pod install` again **without** `UXCAM_USE_SPM` set (after clearing `Pods`/`Podfile.lock`), and
the UXCam SDK returns to being a CocoaPods pod. You can also remove the `use_frameworks!` line if no
other dependency needs it.

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
