import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {UXCamConfiguration} from 'react-native-ux-cam';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

import AppText from '../../component/AppText';
import TitleAndSwitchView from './TitleAndSwitchView';
import AppButton from '../../component/AppButton';

import {global_styles} from '../../utils/globalStyles';
import {palette} from '../../utils/palette';

export interface UXConfiguration {
  multiSessionRecord: boolean;
  crashHandling: boolean;
  automaticScreenNameTagging: boolean;
  advancedGestureRecognition: boolean;
}

type ConfigurationType = 'Start' | 'Apply Settings';

type Props = {
  title: ConfigurationType;
  isLoading: boolean;
  isValid: boolean;
  onPress: (configuration: UXConfiguration) => void;
};

const ConfigurationsView: React.FC<Props> = React.memo(
  ({title, isLoading, isValid, onPress}) => {
    const isFocused = useIsFocused();

    const [multiSession, setMultiSession] = useState<boolean>(true);
    const [crashHandling, setCrashHandling] = useState<boolean>(true);
    const [autoScreenTagging, setAutoScreenTagging] = useState<boolean>(true);
    const [gestureRecognition, setgGestureRecognition] =
      useState<boolean>(true);

    useEffect(() => {
      if (isFocused) {
        AsyncStorage.getItem('configuration').then(configuration => {
          if (configuration) {
            const data: UXCamConfiguration = JSON.parse(configuration);

            setMultiSession(data.enableMultiSessionRecord ?? true);
            setCrashHandling(data.enableCrashHandling ?? true);
            setAutoScreenTagging(data.enableAutomaticScreenNameTagging ?? true);
            setgGestureRecognition(
              data.enableAdvancedGestureRecognition ?? true,
            );
          }
        });
      }
    }, [isFocused]);

    return (
      <View style={styles.container}>
        {title !== 'Start' && (
          <AppText style={styles.text}>Your configurations</AppText>
        )}

        <View style={styles.configView}>
          <TitleAndSwitchView
            isEnabled={multiSession}
            title="Multi session recording"
            onPressSwitch={setMultiSession}
          />
          <TitleAndSwitchView
            isEnabled={crashHandling}
            title="Crash Handling"
            onPressSwitch={setCrashHandling}
          />
          <TitleAndSwitchView
            isEnabled={autoScreenTagging}
            title="Automatic Screen Name Tagging"
            onPressSwitch={setAutoScreenTagging}
          />
          <TitleAndSwitchView
            isEnabled={gestureRecognition}
            title="Advanced Gesture Recognition"
            onPressSwitch={setgGestureRecognition}
          />
        </View>

        <AppButton
          disabled={!isValid || isLoading}
          onPress={() => {
            onPress({
              multiSessionRecord: multiSession,
              crashHandling: crashHandling,
              automaticScreenNameTagging: autoScreenTagging,
              advancedGestureRecognition: gestureRecognition,
            });
          }}
          containerStyle={[
            global_styles.button,
            {
              backgroundColor: isValid ? palette.black : palette.gray,
            },
          ]}>
          {isLoading ? (
            <ActivityIndicator color={palette.white} size={18} />
          ) : (
            <AppText>{title}</AppText>
          )}
        </AppButton>
      </View>
    );
  },
);

export default ConfigurationsView;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  text: {
    color: palette.black,
    fontSize: 18,
  },
  configView: {
    backgroundColor: palette.alto,
    borderRadius: 8,
    marginTop: 12,
  },
});
