import RNUxcam, {UXCamConfiguration} from 'react-native-ux-cam';

export const startUXCam = (
  configuration: UXCamConfiguration,
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
  configuration: UXCamConfiguration,
  username: string,
) => {
  RNUxcam.updateConfiguration(configuration);
  RNUxcam.setUserIdentity(username);

  console.log('Updated UXCam configuration ====>> ', configuration);
};
