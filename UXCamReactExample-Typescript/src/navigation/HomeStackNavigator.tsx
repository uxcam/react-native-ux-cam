import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screen/main/HomeScreen';
import ViewOcclusionScreen from '../screen/main/ViewOcclusionScreen';
import VideoScreen from '../screen/main/VideoScreen';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator initialRouteName={'Home'}>
    <Stack.Screen
      name={'Home'}
      component={HomeScreen}
      options={{
        headerShown: false,
        title: 'Home',
      }}
    />
    <Stack.Screen
      name="ViewOcclusionScreen"
      component={ViewOcclusionScreen}
      options={{
        headerShown: true,
        title: 'ViewOcclusion',
      }}
    />
    <Stack.Screen
      name="VideoScreen"
      component={VideoScreen}
      options={{
        headerShown: true,
        title: 'Video',
      }}
    />
  </Stack.Navigator>
);

export default HomeStackNavigator;
