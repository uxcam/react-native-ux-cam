import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapView from 'react-native-maps';

import BaseScreen from '../base_screen';

const MapScreen = React.memo(() => {
  return (
    <BaseScreen screenName="MapScreen">
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
