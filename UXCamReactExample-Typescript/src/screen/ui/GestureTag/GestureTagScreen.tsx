import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import AppButton from '../../../component/AppButton';
import {palette} from '../../../utils/palette';
import BaseScreen from '../../base_screen';

const GestureTagScreen = () => {
  const {navigate} = useNavigation();

  return (
    <BaseScreen screenName="GestureTagScreen">
      <View style={styles.container}>
        <AppButton
          text="Corner Test"
          containerStyle={styles.button}
          onPress={() => {
            navigate('CornerTestScreen' as never);
          }}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  button: {paddingVertical: 15, backgroundColor: palette.skyBlue},
});

export default GestureTagScreen;
