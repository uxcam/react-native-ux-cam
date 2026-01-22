import RNUxcam, {Configuration} from 'react-native-ux-cam';

export const startUXCam = (
  configuration: Configuration,
  username: string,
) => {
  RNUxcam.optIntoSchematicRecordings();

  console.log('Start UXCam API With configuration ====>> ', configuration);

  RNUxcam.startWithConfiguration(configuration);

  RNUxcam.setUserIdentity(username);

  RNUxcam.addVerificationListener(result =>
    console.log(`UXCam: verificationResult: ${JSON.stringify(result)}`),
  );
};

export const updateConfiguration = (
  configuration: Configuration,
  username: string,
) => {
  RNUxcam.setUserIdentity(username);

  console.log('Updated UXCam configuration ====>> ', configuration);
};
