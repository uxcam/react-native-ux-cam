import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import StartScreen from '../screen/auth/Start';

const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => (
  <Stack.Navigator initialRouteName={'Start'}>
    <Stack.Screen
      name={'Start'}
      component={StartScreen}
      options={{
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

export default AuthStackNavigator;
