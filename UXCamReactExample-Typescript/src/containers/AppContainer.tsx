import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Configuration} from 'react-native-ux-cam';

import {startUXCam} from '../utils/config';
import {useAppDispatch, useAppSelector} from '../hooks/appHooks';
import {start} from '../store/auth/reducer';
import AppTabNavigator from '../navigation/AppTabNavigator';
import AuthStackNavigator from '../navigation/AuthStackNavigator';

const AppContainer = () => {
  const [isStarted, setStarted] = useState<undefined | boolean>(undefined);
  const appkey = useAppSelector(state => state.auth.appkey);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const configuration = await AsyncStorage.getItem('configuration');
      const startInfo = await AsyncStorage.getItem('startInfo');

      if (configuration && startInfo) {
        const config: Configuration = await JSON.parse(configuration);
        const startInfoObj = await JSON.parse(startInfo);

        setStarted(true);
        startUXCam(config, startInfoObj.username);
        dispatch(
          start({
            appkey: startInfoObj.appkey,
            username: startInfoObj.username,
          }),
        );
      } else {
        setStarted(true);
      }
    })();
  }, [dispatch]);

 

  return appkey.length > 0 ? <AppTabNavigator /> : <AuthStackNavigator />;
};

export default AppContainer;
