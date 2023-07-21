import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {store} from './src/store/store';
import AppContainer from './src/containers/AppContainer';
import {toastConfig} from './src/utils/toastConfig';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContainer />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </Provider>
  );
};

export default App;
