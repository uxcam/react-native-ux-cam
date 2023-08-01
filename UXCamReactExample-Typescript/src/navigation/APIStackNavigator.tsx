import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import APIScreen from '../screen/api/APIScreen';
import CustomEventsScreen from '../screen/api/custom_events';
import UserDetailsScreen from '../screen/api/user_details';
import SessionControlScreen from '../screen/api/session_control';

const Stack = createNativeStackNavigator();

const APIStackNavigator = () => (
  <Stack.Navigator initialRouteName={'APIScreen'}>
    <Stack.Screen
      name={'APIScreen'}
      component={APIScreen}
      options={{
        headerShown: true,
        title: 'APIs',
      }}
    />

    <Stack.Screen
      name={'UserDetailsScreen'}
      component={UserDetailsScreen}
      options={{
        headerShown: true,
        title: 'User Details',
      }}
    />

    <Stack.Screen
      name={'CustomEventsScreen'}
      component={CustomEventsScreen}
      options={{
        headerShown: true,
        title: 'Custom Events',
      }}
    />

    <Stack.Screen
      name={'SessionControlScreen'}
      component={SessionControlScreen}
      options={{
        headerShown: true,
        title: 'Session Control',
      }}
    />
  </Stack.Navigator>
);

export default APIStackNavigator;
