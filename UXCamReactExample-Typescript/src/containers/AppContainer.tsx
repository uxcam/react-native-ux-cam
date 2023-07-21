import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    AsyncStorage.getItem('startInfo').then(starInfo => {
      if (starInfo) {
        const data = JSON.parse(starInfo);
        setStarted(true);
        startUXCam(data.appkey, data.username);
        dispatch(start({appkey: data.appkey, username: data.username}));
      } else {
        setStarted(false);
      }
    });
  }, [dispatch]);

  if (isStarted === undefined) {
    return <View style={{flex: 1}} />;
  }

  return appkey.length > 0 ? <AppTabNavigator /> : <AuthStackNavigator />;
};

export default AppContainer;
