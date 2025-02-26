import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import UIOptionScreen from '../screen/ui/UIOptionScreen';
import GestureTagScreen from '../screen/ui/GestureTag/GestureTagScreen';
import CornerTestScreen from '../screen/ui/GestureTag/CornerTestScreen';
import ScrollViewScreen from '../screen/ui/ScrollViewScreen';
import OccludeScreen from '../screen/ui/OccludeScreen';
import AnimationScreen from '../screen/ui/AnimationScreen';
import MapScreen from '../screen/ui/MapScreen';
import WebViewScreen from '../screen/ui/WebViewScreen';
import PagerViewScreen from '../screen/ui/PagerViewScreen';
import SystemElementsScreen from '../screen/ui/SystemElementsScreen';
import SectionListScreen from '../screen/ui/SectionListScreen';
import SimpleComponentScreen from '../screen/ui/SimpleComponentScreen';

const Stack = createNativeStackNavigator();

const UIStackNavigator = () => (
  <Stack.Navigator initialRouteName={'UIOptionScreen'}>
    <Stack.Screen
      name={'UIOptionScreen'}
      component={UIOptionScreen}
      options={{
        headerShown: true,
      }}
    />

    <Stack.Screen
      name={'GestureTagScreen'}
      component={GestureTagScreen}
      options={{
        headerShown: true,
        title: 'Gesture/Tag',
      }}
    />

    <Stack.Screen
      name={'CornerTestScreen'}
      component={CornerTestScreen}
      options={{
        headerShown: true,
        title: 'Corner Tests',
      }}
    />

    <Stack.Screen
      name={'ScrollViewScreen'}
      component={ScrollViewScreen}
      options={{
        headerShown: true,
        title: 'ScrollView',
      }}
    />

    <Stack.Screen
      name={'OccludeScreen'}
      component={OccludeScreen}
      options={{
        headerShown: true,
        title: 'Occlude',
      }}
    />

    <Stack.Screen
      name={'AnimationScreen'}
      component={AnimationScreen}
      options={{
        headerShown: true,
        title: 'Animation',
      }}
    />

    <Stack.Screen
      name={'MapScreen'}
      component={MapScreen}
      options={{
        headerShown: true,
        title: 'Map',
      }}
    />

    <Stack.Screen
      name={'WebViewScreen'}
      component={WebViewScreen}
      options={{
        headerShown: true,
        title: 'WebView',
      }}
    />

    <Stack.Screen
      name={'PagerViewScreen'}
      component={PagerViewScreen}
      options={{
        headerShown: true,
        title: 'Pager View',
      }}
    />

    <Stack.Screen
      name={'SystemElementsScreen'}
      component={SystemElementsScreen}
      options={{
        headerShown: true,
        title: 'System Elements',
      }}
    />

    <Stack.Screen
      name={'SectionListScreen'}
      component={SectionListScreen}
      options={{
        headerShown: true,
        title: 'Section List',
      }}
    />

    <Stack.Screen
      name={'SimpleComponentScreen'}
      component={SimpleComponentScreen}
      options={{
        headerShown: true,
        title: 'Simple Components',
      }}
    />
  </Stack.Navigator>
);

export default UIStackNavigator;
