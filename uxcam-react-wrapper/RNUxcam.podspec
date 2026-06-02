package = JSON.parse(File.read(File.join(__dir__, "package.json")))

folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

# Version of the UXCam iOS SDK this wrapper depends on. Shared by both the
# CocoaPods (default) and the opt-in Swift Package Manager integration paths.
uxcam_version = '3.8.2'

# Opt in to sourcing the UXCam iOS SDK via Swift Package Manager instead of
# CocoaPods by exporting UXCAM_USE_SPM=1 before `pod install`. This relies on
# React Native's `spm_dependency` helper (available since RN 0.75) and requires
# the host app to use `use_frameworks! :linkage => :dynamic`. CocoaPods stays
# the default so existing integrations are unaffected.
uxcam_use_spm = ENV['UXCAM_USE_SPM'] == '1' && defined?(spm_dependency) != nil

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
  s.source       = { :git => "https://github.com/uxcam/react-native-ux-cam", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m,mm}"
  s.requires_arc = true
  # The SPM path forces dynamic frameworks in the host app, where a static
  # framework declaration is contradictory; only set it on the CocoaPods path.
  s.static_framework = true unless uxcam_use_spm

  if uxcam_use_spm
    spm_dependency(s,
      url: 'https://github.com/uxcam/uxcam-ios-sdk.git',
      requirement: { kind: 'upToNextMajorVersion', minimumVersion: uxcam_version },
      products: ['UXCam']
    )
  else
    s.dependency 'UXCam', "~> #{uxcam_version}"
  end

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
