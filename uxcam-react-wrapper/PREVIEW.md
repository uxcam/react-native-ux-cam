# react-native-ux-cam 6.0.22-webview.1 — WebView capture preview

A preview build for verifying improved WebView capture. It uses UXCam native
SDK builds that are **not published** to CocoaPods trunk or Maven Central.
They are served from UXCam's regular distribution channels — GitHub Releases on
`uxcam/uxcam-ios` for iOS and `sdk.uxcam.com` for Android — as prerelease
versions that only resolve when pinned explicitly. No credentials are needed.

**Do not ship this build to the App Store or Play Store.** It is for a debug or
internal-distribution build used to confirm the fix, and it will be replaced by a
normal release.

| Component | Version |
| --- | --- |
| `react-native-ux-cam` | `6.0.22-webview.1` |
| UXCam iOS SDK | `3.10.9-webview.1` (preview, built from `develop`) |
| UXCam Android SDK | `3.10.9-webview.1` (preview, built from `develop`) |

## 1. Install the plugin

```bash
npm install github:uxcam/react-native-ux-cam#preview/webview-capture-pkg
```

Yarn works the same way — pass the same ref to `yarn add`.

Note the `-pkg` suffix. npm installs from a repository root, and in this
repository the package lives in the `uxcam-react-wrapper/` subdirectory, so the
`preview/webview-capture-pkg` branch is a `git subtree split` of that
subdirectory — its root is the package. Installing
`#preview/webview-capture` (without the suffix) fails, because npm finds no
`package.json` at the repository root.

## 2. iOS — pin the preview pod in the Podfile

Add one line to `ios/Podfile`, inside your app target:

```ruby
pod 'UXCam', :podspec => 'https://github.com/uxcam/uxcam-ios/releases/download/3.10.9-webview.1/UXCam.podspec'
```

Then:

```bash
cd ios && pod update UXCam
```

Use `pod update UXCam`, not plain `pod install`. If `Podfile.lock` already pins a
released `UXCam`, `pod install` keeps that pin and silently ignores the line you
just added — verified while testing this build, where it stayed on `UXCam
(3.10.1)` until `pod update UXCam` re-resolved it.

`Podfile.lock` should then show `UXCam (3.10.9-webview.1)`. This is the same
mechanism every released UXCam version uses (a GitHub Release on
`uxcam/uxcam-ios`); the preview is simply a prerelease there, so no released
integration can pick it up by accident.

## 3. Android — no build.gradle changes

The plugin pins `com.uxcam:uxcam:3.10.9-webview.1` and registers UXCam's public
Maven repository (`https://sdk.uxcam.com/android`) itself, so your app's
`build.gradle` does not change.

If your project sets `repositoriesMode = RepositoriesMode.FAIL_ON_PROJECT_REPOS`
in `settings.gradle`, that registration is rejected and `com.uxcam` fails to
resolve. In that case add the repository to `settings.gradle` yourself:

```gradle
dependencyResolutionManagement {
    repositories {
        maven { url 'https://sdk.uxcam.com/android' }
    }
}
```

## 4. Enable improved WebView capture

```js
import RNUxcam from 'react-native-ux-cam';

RNUxcam.optIntoSchematicRecordings();
RNUxcam.startWithConfiguration({
  userAppKey: '<your app key>',
  enableIntegrationLogging: true,
  enableImprovedWebViewCapture: true,
});
```

`enableImprovedWebViewCapture` must be set in the `startWithConfiguration` call —
it is read when the session starts and changing it later has no effect.

### What the flag does per platform

- **iOS** — opts the session into DOM-based WebView capture. Without it, WebViews
  are captured with the previous rectangle-based occlusion. This is the flag
  under test.
- **Android** — maps to `UXConfig.enableFrameSyncOcclusion`, which is what
  carries DOM-based WebView capture on Android. It is already on by default, so
  passing `true` changes nothing and the fix under test is active either way.
  Passing `false` turns it off, which also reverts non-WebView occlusion to the
  legacy path — useful for an A/B comparison, but it is a wider switch than the
  iOS one.

## 5. Confirm you are running the preview build

With `enableIntegrationLogging: true`:

- **iOS** — check `ios/Podfile.lock` for `UXCam (3.10.9-webview.1)`. Do **not**
  look for a `WebView DOM capture has been enabled` console line: integration
  logging only becomes active when UXCam starts, which is after the
  configuration is built, so that particular message is always suppressed. Its
  absence says nothing about the flag.
- **Android** — logcat shows
  `improved webview capture true -> enableFrameSyncOcclusion(true)` under the
  `config` tag.

On the UXCam dashboard, sessions from this build report plugin version
`6.0.22-webview.1`. Use that to tell preview sessions apart from released ones —
the iOS native SDK still reports its base version `3.10.1`, so the plugin version
is the reliable marker.

## Reverting

Uninstall the preview and reinstall the released plugin:

```bash
npm install react-native-ux-cam@6.0.21
```

Then run `pod install --repo-update`. The released plugin resolves `UXCam` from
CocoaPods trunk in the normal way.
