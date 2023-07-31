import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

import {palette} from '../../../utils/palette';
import AppButton from '../../../component/AppButton';
import AppText from '../../../component/AppText';
import {global_styles} from '../../../utils/globalStyles';

type Props = {
  onPressButton: (property: string, value: string) => void;
};

const UserCustomProperty: React.FC<Props> = React.memo(({onPressButton}) => {
  const [property, setProperty] = React.useState<string>('');
  const [propertyValue, setPropertyValue] = React.useState<string>('');

  const isValid = !(isEmpty(property) || isEmpty(propertyValue));

  function isEmpty(string: string) {
    return typeof string === 'string' && string.trim().length === 0;
  }

  return (
    <View>
      <AppText style={styles.titleText}>Create custom user property</AppText>
      <TextInput
        style={global_styles.input}
        onChangeText={setProperty}
        placeholder="Custom Property"
        value={property}
      />

      <TextInput
        style={global_styles.input}
        onChangeText={setPropertyValue}
        placeholder="Custom Value"
        value={propertyValue}
      />

      <AppButton
        disabled={!isValid}
        text="Tag Custom User Property"
        containerStyle={[
          global_styles.button,
          {backgroundColor: isValid ? palette.black : palette.gray},
        ]}
        onPress={() => {
          onPressButton(property.trim(), propertyValue.trim());
        }}
        textStyle={global_styles.buttontText}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  titleText: {
    color: palette.black,
    fontSize: 17,
    paddingVertical: 20,
  },
  input: {
    height: 46,
    marginVertical: 12,
    padding: 10,
    backgroundColor: palette.alto,
    borderRadius: 6,
    color: palette.black,
    fontSize: 16,
  },
  button: {
    backgroundColor: palette.black,
    height: 50,
    marginVertical: 12,
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttontText: {
    color: palette.white,
    fontSize: 18,
  },
});

export default UserCustomProperty;
