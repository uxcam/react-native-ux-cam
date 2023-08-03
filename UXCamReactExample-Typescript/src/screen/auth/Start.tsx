import React, {useCallback, useEffect, useMemo} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import {UXCamConfiguration} from 'react-native-ux-cam';

import EnvironmentDropdown from './EnvironmentDropdown';
import ConfigurationsView, {
  UXConfiguration,
} from '../settings/ConfigurationsView';
import BaseScreen from '../base_screen';

import {start} from '../../store/auth/reducer';
import {EnvironmentType} from '../../types/environment';
import {startUXCam} from '../../utils/config';
import {useAppDispatch} from '../../hooks/appHooks';
import {isEmpty, setStorage} from '../../utils/helper';
import {global_styles} from '../../utils/globalStyles';

const StartScreen: React.FC = React.memo(() => {
  const [key, setKey] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [environment, setEnvironment] = React.useState<string>(
    EnvironmentType.production,
  );
  const [configuration, setConfiguration] =
    React.useState<UXCamConfiguration>();

  const dispatch = useAppDispatch();

  const isValid = useMemo(() => {
    return !(isEmpty(key) || isEmpty(username));
  }, [key, username]);

  const updateAllValue = useCallback(() => {
    const startInfo = {appkey: key, username: username};
    dispatch(start(startInfo));
    setStorage('startInfo', startInfo).then();
    setStorage('configuration', configuration).then();

    setLoading(false);
  }, [key, username, configuration, dispatch]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }
    const timer = setInterval(() => {
      clearInterval(timer);
      updateAllValue();
    }, 5000);
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onPressStart = useCallback(
    (config: UXConfiguration) => {
      Keyboard.dismiss();

      const updatedConfig = {
        userAppKey: key,
        enableMultiSessionRecord: config.multiSessionRecord,
        enableCrashHandling: config.crashHandling,
        enableAutomaticScreenNameTagging: config.automaticScreenNameTagging,
        enableAdvancedGestureRecognition: config.advancedGestureRecognition,
        enableNetworkLogging: false,
      };

      setConfiguration(updatedConfig);
      setLoading(true);

      startUXCam(updatedConfig, username);
    },
    [key, username],
  );

  return (
    <BaseScreen screenName={''}>
      <View style={styles.container}>
        <TextInput
          style={global_styles.input}
          onChangeText={setUsername}
          placeholder="Enter username"
          value={username}
        />

        <TextInput
          style={global_styles.input}
          onChangeText={setKey}
          placeholder="Enter app key"
          value={key}
        />

        <EnvironmentDropdown
          environment={environment}
          onSelect={setEnvironment}
        />

        <ConfigurationsView
          title="Start"
          isValid={isValid}
          isLoading={isLoading}
          onPress={onPressStart}
        />
      </View>
    </BaseScreen>
  );
});

export default StartScreen;

const styles = StyleSheet.create({
  container: {flex: 1, margin: 12},
});
