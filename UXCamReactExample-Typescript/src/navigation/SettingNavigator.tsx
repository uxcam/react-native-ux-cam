import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SettingsScreen from '../screen/settings/SettingsScreen';

const Stack = createNativeStackNavigator();

const SettingNavigator = () => (
  <Stack.Navigator initialRouteName={'SettingsScreen'}>
    <Stack.Screen
      name={'Settings'}
      component={SettingsScreen}
      options={{
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

export default SettingNavigator;
