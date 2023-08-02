import React from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';

import BaseScreen from '../base_screen';
import AppButton from '../../component/AppButton';
import {global_styles} from '../../utils/globalStyles';
import {useNavigation} from '@react-navigation/native';

const ANREventScreen = React.memo(() => {
  const [freezeTime, setFreezeTime] = React.useState<string>('');
  const navigate = useNavigation();
  const freezeAction = async () => {
    const time = freezeTime.length === 0 ? 10 : Number(freezeTime);
    for (let i = 0; i < time; i++) {
      for (let j = 0; j < 100000000; j++) {}
    }
  };

  return (
    <BaseScreen screenName="ANREventScreen">
      <View style={styles.container}>
        <TextInput
          style={global_styles.input}
          onChangeText={setFreezeTime}
          placeholder="Enter time to freeze UI (default 10s)"
          value={freezeTime}
          keyboardType="number-pad"
        />

        <AppButton
          text="Freeze UI"
          containerStyle={global_styles.button}
          onPress={() => {
            Keyboard.dismiss();
            freezeAction();
          }}
          textStyle={global_styles.buttontText}
        />

        <AppButton
          text="Back"
          containerStyle={global_styles.button}
          onPress={() => {
            navigate.goBack();
          }}
          textStyle={global_styles.buttontText}
        />
      </View>
    </BaseScreen>
  );
});

export default ANREventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});
