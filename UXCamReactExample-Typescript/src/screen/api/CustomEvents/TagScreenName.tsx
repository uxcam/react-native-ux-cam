import React from 'react';
import {View, TextInput} from 'react-native';
import {Keyboard} from 'react-native';

import AppButton from '../../../component/AppButton';
import {global_styles} from '../../../utils/globalStyles';
import {isEmpty} from '../../../utils/helper';
import Line from '../../../component/Line';
import Spacer from '../../../component/Spacer';

type Props = {
  onPressButton: (screenName: string) => void;
};

const TagScreenName: React.FC<Props> = React.memo(({onPressButton}) => {
  const [name, setName] = React.useState<string>('');

  return (
    <View>
      <Line height={1} />

      <Spacer height={10} />

      <TextInput
        style={global_styles.input}
        onChangeText={setName}
        placeholder="Screen name"
        value={name}
      />

      <AppButton
        text="Tag screen name"
        containerStyle={global_styles.button}
        onPress={() => {
          Keyboard.dismiss();
          if (!isEmpty(name)) {
            onPressButton(name.trim());
            setName('');
          }
        }}
        textStyle={global_styles.buttontText}
      />
    </View>
  );
});

export default TagScreenName;
