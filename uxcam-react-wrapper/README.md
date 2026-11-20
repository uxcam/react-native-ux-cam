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

## JavaScript crash symbolication
Release builds ship minified JavaScript, so a crash's stack trace points into the bundle rather than your source. Upload the bundle's source map with each release build and UXCam shows the crash against your original files, lines and function names.

### Setup
From your app's root folder, run:

```sh
npx uxcam-sourcemaps-setup
```

It asks for your UXCam app key and sets up the project. For CI, or to skip the prompt, pass the key: `npx uxcam-sourcemaps-setup --app-key <key>`. Use `--dry-run` to see what would change without writing anything.

If npx answers `404 Not Found - GET https://registry.npmjs.org/uxcam-sourcemaps-setup`, your installed `react-native-ux-cam` doesn't link the command yet: reinstall your dependencies (`yarn install` or `npm install`), or run the script directly with `node node_modules/react-native-ux-cam/sourcemaps/setup.js`.

| File | Change |
|---|---|
| `metro.config.js` | Wraps the config in `withUXCamDebugId`, which stamps a debug ID into every bundle and its source map. Crash reports carry the ID, and UXCam uses it to find the map of that exact build. |
| `ios/<App>.xcodeproj` | Runs the *Bundle React Native code and images* build phase through `uxcam-xcode.sh`, which writes the source map and uploads it. Sets `ENABLE_USER_SCRIPT_SANDBOXING` to `NO` if it was on, as the dSYM upload also requires. |
| `ios/.xcode.env` | `export UXCAM_APP_KEY=<key>` |
| `android/app/build.gradle` | `apply from: ".../react-native-ux-cam/sourcemaps/uxcam.gradle"`, after the React Native plugin |
| `android/gradle.properties` | `uxcam.appKey=<key>` |
| `.gitignore` | Ignores `.uxcam/`, where Metro keeps the debug ID of the last bundle |

Run it again any time: it changes only what is missing, and a new key replaces the old one. No `pod install` is needed. If a file doesn't have the shape the script expects (a `metro.config.ts`, a `build.gradle.kts`, or an Expo-generated iOS build phase), it leaves that file alone and prints the change to make by hand.

### When maps are uploaded
- **iOS**: every build with a non-Debug configuration, including archives.
- **Android**: every release (non-debuggable) variant build, such as `assembleRelease` or `bundleRelease`.

Debug builds load JavaScript from Metro and upload nothing. A failed upload prints a warning and never fails the build. Source code is stripped from the map before upload; only file names, positions and function names are sent.

### Options
| iOS (`ios/.xcode.env` or `.xcode.env.local`) | Android (`gradle.properties` or environment) | |
|---|---|---|
| `export UXCAM_SOURCEMAP_UPLOAD=false` | `uxcam.sourcemapUpload=false` / `UXCAM_SOURCEMAP_UPLOAD=false` | Skip the upload |
| `export UXCAM_SOURCEMAP_DRY_RUN=true` | `uxcam.sourcemapDryRun=true` / `UXCAM_SOURCEMAP_DRY_RUN=true` | Prepare the upload, send nothing |

### Over-the-air updates
Bundles shipped over the air (CodePush, EAS Update) are not built by Xcode or Gradle, so upload their maps yourself after exporting the bundle:

```sh
npx uxcam-sourcemaps --app-key <key> --platform ios --map <path/to/bundle.map> --bundle <path/to/bundle>
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
