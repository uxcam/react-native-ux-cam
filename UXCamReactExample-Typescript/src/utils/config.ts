import RNUxcam from 'react-native-ux-cam';
import {UXCamOcclusionType} from 'react-native-ux-cam/UXCamOcclusion';

export const startUXCam = (key: string, username: string) => {
  RNUxcam.optIntoSchematicRecordings();
  const overlay = {
    type: UXCamOcclusionType.Overlay,
    color: 0x000000,
  };

  const configuration = {
    userAppKey: key,
    enableImprovedScreenCapture: true,
    enableCrashHandling: true,
    enableMultiSessionRecord: true,
    enableAutomaticScreenNameTagging: false,
    enableAdvancedGestureRecognition: true,
    enableNetworkLogging: false,
    // occlusions: [overlay],
    // for improved screen capture on Android
    /*
      disable advanced gestures if you're having issues with
      swipe gestures and touches during app interaction
    */
    // enableAdvancedGestureRecognition: false,
  };

  console.log('Start UXCam API With configuration ====>> ', configuration);

  RNUxcam.startWithConfiguration(configuration);

  RNUxcam.setUserIdentity(username);

  RNUxcam.addVerificationListener(result =>
    console.log(`UXCam: verificationResult: ${JSON.stringify(result)}`),
  );
};
