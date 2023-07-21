import React from 'react';
import {View, StyleSheet, Image, TextInput, ScrollView} from 'react-native';
import RNUxcam from 'react-native-ux-cam';

import {images} from '../../utils/images';
import {palette} from '../../utils/palette';
import AppButton from '../../component/AppButton';
import BaseScreen from '../base_screen';

const OccludeScreen = React.memo(() => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  return (
    <BaseScreen screenName="OccludeScreen">
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          <Image
            source={images.creditCard}
            style={styles.card}
            resizeMode="stretch"
          />

          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            placeholder="Enter username"
            value={username}
          />

          <TextInput
            ref={input => {
              RNUxcam.occludeSensitiveView(input);
            }}
            style={styles.input}
            onChangeText={setPassword}
            placeholder="Enter password"
            value={password}
            secureTextEntry
          />

          <AppButton text="Login" containerStyle={styles.button} />

          <View style={styles.line} />

          <AppButton
            text="Go to occluded screen without gesture"
            containerStyle={[
              styles.button,
              styles.marginBottom,
              {backgroundColor: palette.orange},
            ]}
          />

          <AppButton
            text="Go to occluded screen with gesture"
            containerStyle={[
              styles.button,
              styles.marginBottom,
              {backgroundColor: palette.green},
            ]}
          />

          <AppButton
            text="Pause screnn recording"
            containerStyle={[
              styles.button,
              styles.marginBottom,
              {backgroundColor: palette.green},
            ]}
          />
        </View>
      </ScrollView>
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  input: {
    height: 46,
    marginVertical: 6,
    padding: 10,
    backgroundColor: palette.alto,
    borderRadius: 6,
    color: palette.black,
    fontSize: 16,
  },
  card: {
    width: '100%',
    height: 220,
    alignSelf: 'center',
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: palette.customBlue,
    marginTop: 5,
    padding: 12,
  },
  line: {
    backgroundColor: palette.darkGray,
    height: 2,
    marginVertical: 15,
  },
  marginBottom: {
    marginBottom: 10,
  },
});

export default OccludeScreen;
