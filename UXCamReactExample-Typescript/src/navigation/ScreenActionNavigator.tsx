import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ScreenActionsView from '../screen/screen_action/ScreenActionsView';
import ScreenActionListView from '../screen/screen_action/ScreenActionListView';
import ScreenActionGridView from '../screen/screen_action/ScreenActionGridView';

const Stack = createNativeStackNavigator();

const ScreenActionNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={'ScreenActionsView'}>
      <Stack.Screen
        name={'ScreenActionsView'}
        component={ScreenActionsView}
        options={{
          headerShown: true,
          title: 'Screen Actions',
        }}
      />
      <Stack.Screen
        name="ScreenActionListView"
        component={ScreenActionListView}
        options={{
          headerShown: true,
          title: 'List View',
        }}
      />
      <Stack.Screen
        name="ScreenActionGridView"
        component={ScreenActionGridView}
        options={{
          headerShown: true,
          title: 'Grid View',
        }}
      />
    </Stack.Navigator>
  );
};

export default ScreenActionNavigator;
