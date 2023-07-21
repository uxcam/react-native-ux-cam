import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import APIScreen from '../screen/api/APIScreen';

import UserDetailScreen from '../screen/api/userdetails';

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
      name={'UserDetailScreen'}
      component={UserDetailScreen}
      options={{
        headerShown: true,
        title: 'UserDetails',
      }}
    />
  </Stack.Navigator>
);

export default APIStackNavigator;
