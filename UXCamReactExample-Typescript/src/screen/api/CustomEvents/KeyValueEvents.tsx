import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {Keyboard} from 'react-native';

import AppButton from '../../../component/AppButton';
import {global_styles} from '../../../utils/globalStyles';
import {isEmpty} from '../../../utils/helper';
import {palette} from '../../../utils/palette';
import AppText from '../../../component/AppText';
import Line from '../../../component/Line';

type Props = {
  onPressButton: (event: string, params: any) => void;
};

const KeyValueEvents: React.FC<Props> = React.memo(({onPressButton}) => {
  const [customEventKey, setCustomEventKey] = React.useState<string>('');
  const [key, setKey] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');

  return (
    <View>
      <Line height={1} />

      <AppText style={styles.titleText}>
        Create custom events with key-value pair
      </AppText>

      <TextInput
        style={global_styles.input}
        onChangeText={setCustomEventKey}
        placeholder="Custom event key"
        value={customEventKey}
      />

      <View style={styles.row}>
        <TextInput
          style={[global_styles.input, styles.keyValueInputWidth]}
          onChangeText={setKey}
          placeholder="Key"
          value={key}
        />

        <TextInput
          style={[global_styles.input, styles.keyValueInputWidth]}
          onChangeText={setValue}
          placeholder="Value"
          value={value}
        />
      </View>
      <AppButton
        text="Save custom event property"
        containerStyle={[
          global_styles.button,
          {backgroundColor: palette.customBlue},
        ]}
        onPress={() => {
          Keyboard.dismiss();

          if (isEmpty(customEventKey)) {
            return;
          }

          if (!isEmpty(key)) {
            onPressButton(customEventKey, {[key]: value ?? ''});

            setCustomEventKey('');
            setKey('');
            setValue('');
          }
        }}
        textStyle={global_styles.buttontText}
      />
    </View>
  );
});

export default KeyValueEvents;

const styles = StyleSheet.create({
  titleText: {
    color: palette.darkGray,
    fontSize: 17,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyValueInputWidth: {
    width: '47%',
  },
  button: {
    ...global_styles.button,
    marginVertical: 5,
    backgroundColor: palette.seaSerpent,
  },
});
