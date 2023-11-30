import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import APIStackNavigator from './APIStackNavigator';
import UIStackNavigator from './UIStackNavigator';
import ScreenActionNavigator from './ScreenActionNavigator';
import SettingNavigator from './SettingNavigator';

import {palette} from '../utils/palette';

const Tab = createBottomTabNavigator();

const AppTabNavigator = () => (
  <Tab.Navigator
    initialRouteName={'HomeScreenNavigator'}
    screenOptions={{
      tabBarActiveTintColor: palette.black,
      tabBarInactiveTintColor: palette.darkGray,
      headerShown: false,
    }}>
    <Tab.Screen
      name={'HomeScreenNavigator'}
      component={HomeStackNavigator}
      options={{
        title: 'Home',
      }}
    />

    <Tab.Screen
      name={'UIStackNavigator'}
      component={UIStackNavigator}
      options={{
        title: 'UI',
      }}
    />

    <Tab.Screen
      name={'APIStackNavigator'}
      component={APIStackNavigator}
      options={{
        title: 'API',
      }}
    />

    <Tab.Screen
      name={'ScreenActionNavigator'}
      component={ScreenActionNavigator}
      options={{
        title: 'Screen Actions',
      }}
    />

    <Tab.Screen
      name={'SettingNavigator'}
      component={SettingNavigator}
      options={{
        title: 'Settings',
      }}
    />
  </Tab.Navigator>
);

export default AppTabNavigator;
