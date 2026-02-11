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
  s.source       = { :git => "https://github.com/uxcam/react-native-ux-cam", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m,mm}"
  s.requires_arc = true
  s.static_framework = true

  s.dependency 'UXCam' , '~> 3.7.9'

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
