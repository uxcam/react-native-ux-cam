# react-native-ux-cam 6.0.22-webview.2 — WebView capture preview

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
| `react-native-ux-cam` | `6.0.22-webview.2` |
| UXCam iOS SDK | `3.10.9-webview.2` (preview, built from `develop`) |
| UXCam Android SDK | `3.10.9-webview.2` (preview, built from `develop`) |

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

## 2. iOS — no Podfile changes

```bash
cd ios && pod install
```

Nothing else. The plugin's podspec downloads the preview XCFramework into the
package during `pod install` and links it directly, so there is no `UXCam` pod to
resolve and no Podfile line to add.

`Podfile.lock` should show `RNUxcam (6.0.22-webview.2)` and **no** separate
`UXCam` entry — the SDK is vendored inside `RNUxcam` for this preview.

The download needs network access on the machine running `pod install`. If it is
behind a proxy that blocks GitHub release assets, fetch the archive manually and
unzip it to `node_modules/react-native-ux-cam/ios/UXCam.xcframework`; the podspec
skips the download when that directory already exists. This is the same
mechanism every released UXCam version uses (a GitHub Release on
`uxcam/uxcam-ios`); the preview is simply a prerelease there, so no released
integration can pick it up by accident.

## 3. Android — no build.gradle changes

The plugin pins `com.uxcam:uxcam:3.10.9-webview.2` and registers UXCam's public
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

## 4. Occluding native views — prefer `UXCamOccludedView`

For native (non-WebView) views, wrap the view instead of passing a ref to
`occludeSensitiveView`:

```jsx
import RNUxcam, { UXCamOccludedView } from 'react-native-ux-cam';

<UXCamOccludedView>
  <BalanceCard />
</UXCamOccludedView>
```

Pass `hideGestures` to also suppress taps inside the region:

```jsx
<UXCamOccludedView hideGestures>
  <PinPad />
</UXCamOccludedView>
```

This registers occlusion as part of the native view lifecycle, before the view
can be captured. The older `occludeSensitiveView(ref)` / `unOccludeSensitiveView(ref)`
pair registers after mount and is keyed on a ref, which can miss the first frames
and go stale when rows are recycled — so in a `FlatList` or any recycling list the
cover can end up on the wrong row. `UXCamOccludedView` has neither problem and is
the recommended API.

It does not replace WebView occlusion: content *inside* a WebView is still marked
with the `uxcam-occlude` class in the page (see below).

## 5. Enable improved WebView capture

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

## 6. Confirm you are running the preview build

With `enableIntegrationLogging: true`:

- **iOS** — confirm `node_modules/react-native-ux-cam/ios/UXCam.xcframework`
  exists after `pod install`. Do **not** look for a `WebView DOM capture has been
  enabled` console line: integration logging only becomes active when UXCam
  starts, which is after the configuration is built, so that particular message
  is always suppressed. Its absence says nothing about the flag.
- **Android** — logcat shows
  `improved webview capture true -> enableFrameSyncOcclusion(true)` under the
  `config` tag.

On the UXCam dashboard, sessions from this build report plugin version
`6.0.22-webview.2`. Use that to tell preview sessions apart from released ones —
the iOS native SDK still reports its base version `3.10.1`, so the plugin version
is the reliable marker.

## Reverting

Uninstall the preview and reinstall the released plugin:

```bash
npm install react-native-ux-cam@6.0.21
```

Then run `pod install --repo-update`. The released plugin resolves `UXCam` from
CocoaPods trunk in the normal way; nothing needs undoing in your Podfile because
the preview never asked you to change it.
