import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import {palette} from '../utils/palette';
import APIStackNavigator from './APIStackNavigator';
import UIStackNavigator from './UIStackNavigator';

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
      name={'AuthStackNavigator'}
      component={AuthStackNavigator}
      options={{
        title: 'Setting',
      }}
    />
  </Tab.Navigator>
);

export default AppTabNavigator;
