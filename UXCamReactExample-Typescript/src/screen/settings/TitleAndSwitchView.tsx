import React from 'react';
import {View, StyleSheet, Switch} from 'react-native';

import AppText from '../../component/AppText';
import {palette} from '../../utils/palette';

type Props = {
  isEnabled?: boolean;
  title: string;
  onPressSwitch: (isEnabled: boolean) => void;
};

const TitleAndSwitchView: React.FC<Props> = React.memo(
  ({title, onPressSwitch, isEnabled = true}) => {
    return (
      <View style={styles.container}>
        <AppText style={styles.text} numberOfLines={0}>
          {title}
        </AppText>

        <Switch
          accessibilityLabel={title}
          trackColor={{false: palette.alto, true: palette.green}}
          thumbColor={palette.white}
          ios_backgroundColor={palette.alto}
          onValueChange={onPressSwitch}
          value={isEnabled}
        />
      </View>
    );
  },
);

export default TitleAndSwitchView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 12,
  },
  text: {
    color: palette.black,
    fontSize: 18,
  },
});
