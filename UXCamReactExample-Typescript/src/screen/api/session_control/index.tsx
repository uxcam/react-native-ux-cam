import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import UXCam from 'react-native-ux-cam';

import SchematicRecordingView from './SchematicRecordingView';
import BaseScreen from '../../base_screen';
import AppText from '../../../component/AppText';
import AppButton from '../../../component/AppButton';
import Line from '../../../component/Line';
import Spacer from '../../../component/Spacer';

import {useAppSelector} from '../../../hooks/appHooks';
import {palette} from '../../../utils/palette';
import {global_styles} from '../../../utils/globalStyles';

const SessionControlScreen = React.memo(() => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [userUrl, setUserUrl] = useState<string>('');
  const [sessionUrl, setSessionUrl] = useState<string>('');
  const [isReoad, setIsReoad] = useState<boolean>(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);

  const appkey = useAppSelector(state => state.auth.appkey);

  useEffect(() => {
    const recordTimer = setTimeout(() => {
      fetchRecordingStatus();
    }, 1500);

    const urlTimer = setTimeout(() => {
      fetchUrls();
    }, 5000);

    return () => {
      clearTimeout(recordTimer);
      clearTimeout(urlTimer);
    };
  }, [isReoad]);

  async function fetchRecordingStatus() {
    try {
      const record = await UXCam.isRecording();
      setIsRecording(record);
    } catch (error) {
      console.error(`Could not get Recording Status: ${error}`);
    }
  }

  async function fetchUrls() {
    try {
      const url = await UXCam.urlForCurrentUser();
      const sUrl = await UXCam.urlForCurrentSession();

      setUserUrl(url ?? '');
      setSessionUrl(sUrl ?? '');
    } catch (error) {
      console.error(`Could not get urls: ${error}`);
    }
  }

  const sessionInfo = () => {
    return (
      <>
        <AppText style={styles.apiKeyText}>API Key: {appkey}</AppText>
        <View style={styles.row}>
          <AppText style={styles.recordingText}>Is Recording:</AppText>
          <View
            style={[
              styles.recordingStatus,
              {backgroundColor: isRecording ? palette.green : palette.orange},
            ]}
          />
        </View>
        <AppText numberOfLines={1} style={styles.userUrl}>
          User URL: {userUrl}
        </AppText>
        <AppText numberOfLines={1} style={styles.sessionUrl}>
          Session URL: {sessionUrl}
        </AppText>
      </>
    );
  };

  return (
    <BaseScreen screenName="SessionControlScreen">
      <ScrollView style={styles.container}>
        {sessionInfo()}

        <Spacer height={10} />
        <Line height={1} />
        <Spacer height={10} />

        <AppButton
          text="Allow Short Break For Another App"
          containerStyle={styles.button}
          onPress={() => {
            UXCam.allowShortBreakForAnotherApp(true);
            setIsReoad(!isReoad);
          }}
        />

        <AppButton
          text="Start New Session"
          containerStyle={styles.button}
          onPress={() => {
            UXCam.startNewSession();
            setIsReoad(!isReoad);
          }}
        />

        <AppButton
          text="Stop Session And Upload Data"
          containerStyle={styles.button}
          onPress={() => {
            UXCam.stopSessionAndUploadData();
            setIsReoad(!isReoad);
          }}
        />

        <AppButton
          text="Cancel Current Session"
          containerStyle={styles.button}
          onPress={() => {
            UXCam.cancelCurrentSession();
            setIsReoad(!isReoad);
          }}
        />

        <AppButton
          text="Delete Pending Uploads"
          containerStyle={styles.button}
          onPress={() => {
            UXCam.deletePendingUploads();
            setIsReoad(!isReoad);
          }}
        />

        <AppButton
          text={
            isRecordingPaused
              ? 'Resume Screen Recording'
              : 'Pause Screen Recording'
          }
          containerStyle={styles.button}
          onPress={() => {
            if (isRecordingPaused) {
              UXCam.resumeScreenRecording();
            } else {
              UXCam.pauseScreenRecording();
            }
            setIsRecordingPaused(!isRecordingPaused);
            setIsReoad(!isReoad);
          }}
        />

        <Spacer height={10} />
        <Line height={1} />

        <SchematicRecordingView />
      </ScrollView>
    </BaseScreen>
  );
});

export default SessionControlScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  apiKeyText: {
    color: palette.black,
    fontWeight: '600',
    fontSize: 18,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingText: {
    color: palette.black,
    fontSize: 18,
  },
  recordingStatus: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginLeft: 6,
  },
  userUrl: {
    color: palette.black,
    fontSize: 18,
    marginTop: 10,
  },
  sessionUrl: {
    color: palette.black,
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    ...global_styles.button,
    marginVertical: 6,
    backgroundColor: palette.customBlue,
  },
  title: {
    fontSize: 18,
    color: palette.black,
  },
});
