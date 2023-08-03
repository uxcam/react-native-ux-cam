import React, {useCallback, useEffect} from 'react';
import {Alert, Keyboard, StyleSheet, TextInput, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {UXCamConfiguration} from 'react-native-ux-cam';

import AppButton from '../../component/AppButton';
import AppText from '../../component/AppText';
import ConfigurationsView, {UXConfiguration} from './ConfigurationsView';
import BaseScreen from '../base_screen';

import {start} from '../../store/auth/reducer';
import {useAppDispatch} from '../../hooks/appHooks';
import {palette} from '../../utils/palette';
import {stop} from '../../store/auth/reducer';
import {global_styles} from '../../utils/globalStyles';
import {isEmpty, removeStorageValue, setStorage} from '../../utils/helper';
import {updateConfiguration} from '../../utils/config';

const SettingsScreen: React.FC = React.memo(() => {
  const [key, setKey] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [configuration, setConfiguration] =
    React.useState<UXCamConfiguration>();

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();

  const isValid = !(isEmpty(key) || isEmpty(username));

  useEffect(() => {
    if (isFocused) {
      AsyncStorage.getItem('startInfo').then(starInfo => {
        if (starInfo) {
          const data = JSON.parse(starInfo);
          setKey(data.appkey);
          setUsername(data.username);
        }
      });
    } else {
      Keyboard.dismiss();
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <AppButton
          text="Logout"
          textStyle={{color: palette.black}}
          containerStyle={styles.logout}
          onPress={() => {
            removeStorageValue('startInfo');
            removeStorageValue('configuration');
            dispatch(stop());
          }}
        />
      ),
    });
  }, [dispatch, navigation]);

  const updateAllValue = useCallback(() => {
    const startInfo = {appkey: key, username: username};
    dispatch(start(startInfo));
    setStorage('startInfo', startInfo).then();
    setStorage('configuration', configuration).then();
    if (configuration) {
      updateConfiguration(configuration, username);
    }

    setLoading(false);
  }, [key, username, configuration, dispatch]);

  const onPressApplySetting = useCallback(
    (config: UXConfiguration) => {
      Keyboard.dismiss();

      Alert.alert(
        'Confirm!',
        'Are you sure you want to apply these settings?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              const updatedConfig: UXCamConfiguration = {
                userAppKey: key,
                enableMultiSessionRecord: config.multiSessionRecord,
                enableCrashHandling: config.crashHandling,
                enableAutomaticScreenNameTagging:
                  config.automaticScreenNameTagging,
                enableAdvancedGestureRecognition:
                  config.advancedGestureRecognition,
                enableNetworkLogging: false,
              };

              setConfiguration(updatedConfig);
              setLoading(true);
            },
          },
        ],
      );
    },
    [key],
  );

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timer = setInterval(() => {
      clearInterval(timer);
      updateAllValue();
    }, 2000);
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <BaseScreen screenName={'SettingsScreen'}>
      <View style={styles.container}>
        <AppText style={styles.noteText}>
          Note: The changes on this page done will be applied in another
          session.
        </AppText>

        <TextInput
          style={global_styles.input}
          onChangeText={setUsername}
          placeholder="Enter username"
          value={username}
        />

        <AppText style={styles.text}>API Key</AppText>
        <TextInput
          style={global_styles.input}
          onChangeText={setKey}
          placeholder="Enter app key"
          value={key}
        />

        <ConfigurationsView
          title="Apply Settings"
          isValid={isValid}
          isLoading={isLoading}
          onPress={onPressApplySetting}
        />
      </View>
    </BaseScreen>
  );
});

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, margin: 12},
  noteText: {
    color: palette.gray,
    fontSize: 17,
    padding: 12,
    borderColor: palette.orange,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    color: palette.gray,
    fontSize: 18,
    marginTop: 12,
  },
  configView: {
    backgroundColor: palette.alto,
    borderRadius: 8,
    marginTop: 12,
  },
  logout: {backgroundColor: palette.transparent, width: 80},
});
