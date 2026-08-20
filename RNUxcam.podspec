package = JSON.parse(File.read(File.join(__dir__, "package.json")))

folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
  s.name         = "RNUxcam"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  RNUxcam - React Native wrapper for uxcam.com.
                   DESC
  s.homepage     = "https://github.com/uxcam/react-native-ux-cam"
  s.license      = "MIT"
  s.author       = { "author" => "author@uxcam.com" }
  s.platform     = :ios, "12.0"
  s.source       = { :git => "https://github.com/uxcam/react-native-ux-cam", :tag => "v#{s.version}" }
  s.source_files = "ios/RNUxcam/**/*.{h,m,mm}"
  s.requires_arc = true
  s.static_framework = true

  # PREVIEW BUILD -- improved WebView capture.
  #
  # The UXCam build carrying `enableImprovedWebViewCapture` is not on CocoaPods
  # trunk, so `s.dependency 'UXCam'` cannot reach it. Rather than make every
  # integrator add a Podfile override, this pod fetches the XCFramework itself
  # and links it directly: `prepare_command` runs for path pods (which is how
  # React Native autolinks this module), so a plain `pod install` is enough.
  #
  # The archive is NOT committed -- it is downloaded into ios/ on first install
  # and gitignored. Settings below are copied from the published UXCam podspec.
  #
  # Before merging back to develop: drop prepare_command/vendored_frameworks and
  # restore `s.dependency 'UXCam', '~> 3.10.1'`.
  s.preserve_paths      = 'ios/UXCam.xcframework'
  s.vendored_frameworks = 'ios/UXCam.xcframework'
  s.libraries           = 'z', 'iconv', 'c++'
  s.frameworks          = 'AVFoundation', 'CoreGraphics', 'CoreMedia', 'CoreVideo', 'CoreTelephony', 'MobileCoreServices', 'QuartzCore', 'SystemConfiguration', 'Security', 'WebKit'
  s.user_target_xcconfig = {
    'LIBRARY_SEARCH_PATHS' => '$(inherited) "$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)" "/usr/lib/swift"'
  }

  s.prepare_command = <<-CMD
    set -e
    UXCAM_PREVIEW_URL="https://github.com/uxcam/uxcam-ios/releases/download/3.10.9-webview.2/UXCam.xcframework.zip"
    if [ ! -d "ios/UXCam.xcframework" ]; then
      echo "[RNUxcam] downloading preview UXCam SDK 3.10.9-webview.2..."
      curl -fsSL --retry 3 "$UXCAM_PREVIEW_URL" -o "ios/UXCam.xcframework.zip"
      unzip -q -o "ios/UXCam.xcframework.zip" "UXCam.xcframework/*" -d "ios/"
      rm -f "ios/UXCam.xcframework.zip"
      echo "[RNUxcam] preview UXCam SDK ready at ios/UXCam.xcframework"
    fi
  CMD

  if defined? install_modules_dependencies
    # Default React Native dependencies for 0.71 and above (new and legacy architecture)
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'

    if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
      # New Architecture on React Native 0.70 and older
      s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
      s.pod_target_xcconfig    = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
      }

      s.dependency "React-Codegen"
      s.dependency "RCT-Folly"
      s.dependency "RCTRequired"
      s.dependency "RCTTypeSafety"
      s.dependency "ReactCommon/turbomodule/core"
    end
  end

end
