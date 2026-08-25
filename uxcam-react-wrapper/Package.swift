
import PackageDescription

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
