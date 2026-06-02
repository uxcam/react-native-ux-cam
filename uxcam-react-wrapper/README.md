# react-native-ux-cam

## Installation
`$yarn add file:/path-to-the-uxcam-react-wrapper`

For iOS, you will need to update pod as well:

`cd ios && pod update && cd ..`

### iOS integration (Swift Package Manager)

Starting with **6.1.0**, the UXCam iOS SDK is delivered through **Swift Package Manager**
(the [`uxcam-ios-sdk`](https://github.com/uxcam/uxcam-ios-sdk) package) instead of being
vendored as a CocoaPods pod. CocoaPods still autolinks this module's React Native glue, but
the UXCam SDK binary itself now comes from SPM. The podspec wires the SPM dependency in for
you automatically via React Native's `spm_dependency` helper — you don't add the package in
Xcode manually.

#### Requirements

| Requirement | Why |
| --- | --- |
| **React Native 0.75+** | Provides the `spm_dependency` Podfile helper. On older versions `pod install` fails fast with a clear error from the podspec. |
| **Dynamic frameworks** | The UXCam SDK ships as a dynamic `xcframework`. The host app **must** link frameworks dynamically, otherwise the `UXCam` module cannot be resolved or embedded. |

#### Configure the Podfile

Add `use_frameworks!` to `ios/Podfile` and make it **unconditional** — do not gate it behind an
environment variable:

```ruby
# ios/Podfile
target 'YourApp' do
  use_frameworks! :linkage => :dynamic
  # ...the rest of your config (use_react_native!, etc.)
end
```

> ⚠️ **Common mistake:** A default React Native Podfile often contains a snippet like:
> ```ruby
> linkage = ENV['USE_FRAMEWORKS']
> if linkage != nil
>   use_frameworks! :linkage => linkage.to_sym
> end
> ```
> This only enables frameworks when the `USE_FRAMEWORKS` env var is set, so a plain
> `pod install` falls back to **static libraries** and the build fails with
> `'UXCam/UXCam.h' file not found` or undefined-symbol link errors. Replace it with the
> unconditional `use_frameworks! :linkage => :dynamic` line shown above (or always export
> `USE_FRAMEWORKS=dynamic` before installing).

#### Fresh install

```bash
yarn add react-native-ux-cam   # or: yarn add file:/path-to-uxcam-plugin
cd ios
pod install
cd ..
react-native run-ios
```

#### Migrating from a previous (CocoaPods-pod) version of UXCam

If you are upgrading from **6.0.x or earlier**, where UXCam was a CocoaPods pod, the old
static-pod artifacts must be cleared so the SPM integration regenerates cleanly. A normal
`pod install` on top of the old setup is **not** enough.

```bash
# 1. Bump the package
yarn add react-native-ux-cam

# 2. Make sure use_frameworks! :linkage => :dynamic is in ios/Podfile (see above)

# 3. Clean the old pod install + caches
cd ios
rm -rf Pods Podfile.lock build
rm -rf ~/Library/Developer/Xcode/DerivedData/YourApp-*

# 4. Reinstall — SPM dependency is wired in by the podspec
pod install
cd ..

# 5. Build from the .xcworkspace (Xcode) or:
react-native run-ios
```

In Xcode, the first build resolves the package from the network. If resolution hangs,
use *File ▸ Packages ▸ Reset Package Caches*.

#### Verify it worked

After `pod install`, the pods should build as **dynamic frameworks**. Confirm with:

```bash
grep -c "com.apple.product-type.framework" ios/Pods/Pods.xcodeproj/project.pbxproj
```

A result **greater than `0`** means `use_frameworks!` was applied correctly. A result of `0`
means CocoaPods is still using static libraries — re-check the Podfile (see the common
mistake above) and reinstall.

#### Troubleshooting

| Symptom | Cause / Fix |
| --- | --- |
| `'UXCam/UXCam.h' file not found` or undefined symbols for `UXCam` | `use_frameworks! :linkage => :dynamic` was not applied. Fix the Podfile and do a clean reinstall (migration steps above). |
| `pod install` raises a `react-native-ux-cam requires React Native 0.75+` error | Your RN version predates the `spm_dependency` helper. Upgrade RN, or pin to wrapper 6.0.x. |
| SPM package fails to resolve / Xcode hangs fetching `uxcam-ios-sdk` | Network/cache issue — *File ▸ Packages ▸ Reset Package Caches*, then rebuild. |
| Build fails only when Hermes is enabled with `use_frameworks!` | Known RN limitation with dynamic frameworks + Hermes; set `:hermes_enabled => false` in `use_react_native!`, or apply the relevant RN workaround for your version. |

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
