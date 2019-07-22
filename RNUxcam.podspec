package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNUxcam"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  RNUxcam - React Native wrapper for uxcam.com.
                   DESC
  s.homepage     = "https://github.com/negativetwelve/react-native-ux-cam"
  s.license      = "MIT"
  s.author       = { "author" => "author@domain.cn" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/negativetwelve/react-native-ux-cam.git", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "UXCam"
end

