import React from 'react';
import {View, TextInput} from 'react-native';
import {Keyboard} from 'react-native';

import AppButton from '../../../component/AppButton';
import {global_styles} from '../../../utils/globalStyles';
import {isEmpty} from '../../../utils/helper';

type Props = {
  onPressButton: (identity: string) => void;
};

const UserIdentity: React.FC<Props> = React.memo(({onPressButton}) => {
  const [identity, setIdentity] = React.useState<string>('');

  return (
    <View>
      <TextInput
        style={global_styles.input}
        onChangeText={setIdentity}
        placeholder="User Identity"
        value={identity}
      />

      <AppButton
        text="Identify User"
        containerStyle={global_styles.button}
        onPress={() => {
          Keyboard.dismiss();
          if (!isEmpty(identity)) {
            onPressButton(identity.trim());
          }
        }}
        textStyle={global_styles.buttontText}
      />
    </View>
  );
});

export default UserIdentity;
