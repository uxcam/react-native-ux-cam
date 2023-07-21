import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import EnvironmentDropdown from './EnvironmentDropdown';

import {start} from '../../store/auth/reducer';
import {EnvironmentType} from '../../types/environment';
import {startUXCam} from '../../utils/config';
import {useAppDispatch, useAppSelector} from '../../hooks/appHooks';
import {palette} from '../../utils/palette';
import AppButton from '../../component/AppButton';
import AppText from '../../component/AppText';
import {stop} from '../../store/auth/reducer';
import BaseScreen from '../base_screen';

type Props = {
  appKey?: string;
  name?: string;
  environment?: EnvironmentType;
};

const StartScreen: React.FC<Props> = React.memo(
  ({appKey = '', name = '', environment = EnvironmentType.production}) => {
    const [key, setKey] = React.useState<string>(appKey);
    const [username, setUsername] = React.useState<string>(name);
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [, setEnvironment] = React.useState<string>(environment);
    const appkey = useAppSelector(state => state.auth.appkey);

    const navigation = useNavigation();

    const dispatch = useAppDispatch();
    const isValid = !(isEmpty(key) || isEmpty(username));

    useEffect(() => {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () =>
          appkey.length > 0 ? (
            <AppButton
              text="Logout"
              textStyle={{color: palette.black}}
              containerStyle={styles.logout}
              onPress={() => {
                removeStorageValue('startInfo');
                dispatch(stop());
              }}
            />
          ) : (
            <></>
          ),
      });
    }, [appkey, dispatch, navigation]);

    useEffect(() => {
      if (!isLoading) {
        return;
      }
      const timer = setInterval(() => {
        clearInterval(timer);
        const startInfo = {appkey: key, username: username};
        dispatch(start(startInfo));
        setStorage('startInfo', startInfo).then();
      }, 5000);
      return () => {
        clearInterval(timer);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    function isEmpty(string: string) {
      return typeof string === 'string' && string.trim().length === 0;
    }

    const setStorage = async (akey: string, value: any) => {
      return await AsyncStorage.setItem(akey, JSON.stringify(value));
    };

    const removeStorageValue = async (akey: string) => {
      await AsyncStorage.removeItem(akey);
    };

    const initUXCam = () => {
      setLoading(true);
      startUXCam(key, username);
    };

    return (
      <BaseScreen screenName={appkey.length > 0 ? 'StartScreen' : ''}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            placeholder="Enter username"
            value={username}
          />

          <TextInput
            style={styles.input}
            onChangeText={setKey}
            placeholder="Enter app key"
            value={key}
          />

          <EnvironmentDropdown
            environment={environment}
            onSelect={setEnvironment}
          />

          <AppButton
            onPress={initUXCam}
            disabled={!isValid || isLoading}
            containerStyle={[
              styles.startButton,
              {backgroundColor: isValid ? palette.black : palette.gray},
            ]}>
            {isLoading ? (
              <ActivityIndicator color={palette.white} size={18} />
            ) : (
              <AppText>Start</AppText>
            )}
          </AppButton>
        </View>
      </BaseScreen>
    );
  },
);

export default StartScreen;

const styles = StyleSheet.create({
  container: {flex: 1, margin: 12},
  input: {
    height: 46,
    marginVertical: 12,
    padding: 10,
    backgroundColor: palette.alto,
    borderRadius: 6,
    color: palette.black,
    fontSize: 16,
  },
  startButton: {
    backgroundColor: palette.black,
    height: 50,
    marginVertical: 12,
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    color: palette.white,
    fontSize: 18,
  },
  logout: {backgroundColor: palette.transparent, width: 80},
});
