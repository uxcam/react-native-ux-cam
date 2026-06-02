// swift-tools-version: 5.9
//
// ⚠️  NOT YET CONSUMABLE — future-facing scaffold.
//
// This manifest exists to prepare react-native-ux-cam for the day React Native
// supports Swift Package Manager autolinking of community native modules
// (expected around RN 0.84). It is NOT usable today because the iOS module in
// `ios/RNUxcam` imports React Native headers (e.g. <React/RCTBridgeModule.h>,
// <React/RCTEventEmitter.h>) which React Native does not yet publish as a Swift
// Package product. Until that lands, SwiftPM cannot resolve those imports.
//
// HOW TO INTEGRATE TODAY:
//   • Default: CocoaPods via RNUxcam.podspec (UXCam pulled as a CocoaPods pod).
//   • Opt-in SPM-sourced UXCam SDK: export UXCAM_USE_SPM=1 (and use
//     `use_frameworks! :linkage => :dynamic`) before `pod install`. The podspec
//     then pulls the UXCam SDK via SwiftPM through React Native's
//     `spm_dependency` helper while CocoaPods still handles the RN glue.
//
// When RN ships full SPM autolinking, revisit the target's React dependency
// below and remove this notice.

import PackageDescription

// Keep in sync with `uxcam_version` in RNUxcam.podspec.
let uxcamVersion = "3.8.2"

let package = Package(
    name: "RNUxcam",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "RNUxcam",
            targets: ["RNUxcam"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/uxcam/uxcam-ios-sdk.git", from: Version(stringLiteral: uxcamVersion))
        // TODO: add the React Native core SwiftPM package here once RN publishes
        // it (required for <React/...> headers used by ios/RNUxcam).
    ],
    targets: [
        .target(
            name: "RNUxcam",
            dependencies: [
                .product(name: "UXCam", package: "uxcam-ios-sdk")
            ],
            path: "ios/RNUxcam"
        )
    ]
)
