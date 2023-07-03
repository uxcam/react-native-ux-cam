import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, View, ViewProps} from 'react-native';
import RNUxcam from 'react-native-ux-cam';

import {palette} from '../../utils/palette';
import {useFocusEffect} from '@react-navigation/native';

interface Props extends ViewProps {
  screenName: string;
  isTransparent?: boolean;
  hasSafeArea?: boolean;
}

const BaseScreen: FC<Props> = ({
  screenName,
  isTransparent,
  hasSafeArea,
  children,
}) => {
  useFocusEffect(() => {
    if (screenName.trim().length > 0) {
      RNUxcam.tagScreenName(screenName);
    }
  });

  return (
    <View
      style={[
        styles.container,
        isTransparent && {backgroundColor: palette.transparent},
      ]}>
      {hasSafeArea && <SafeAreaView />}
      {children}
    </View>
  );
};

export default BaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
