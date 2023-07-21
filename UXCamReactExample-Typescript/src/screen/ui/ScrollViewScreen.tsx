import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import RNUxcam from 'react-native-ux-cam';

import {palette} from '../../utils/palette';
import AppText from '../../component/AppText';
import BaseScreen from '../base_screen';

const ScrollViewScreen = React.memo(() => {
  const colors = [
    palette.pastelBlue,
    palette.pastelGreen,
    palette.pastelPink,
    palette.pastelPurple,
    palette.pastelYellow,
    palette.customBlue,
  ];
  return (
    <BaseScreen screenName="ScrollViewScreen">
      <ScrollView
        style={styles.container}
        showsHorizontalScrollIndicator={false}>
        {colors.map((color, index) => {
          return (
            <View
              key={index}
              style={[styles.view, {backgroundColor: color}]}
              ref={label => {
                if (index === 3) {
                  RNUxcam.occludeSensitiveView(label);
                }
              }}>
              <AppText style={styles.text}>{`View ${index + 1}`}</AppText>
            </View>
          );
        })}
      </ScrollView>
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {fontSize: 18, fontWeight: '700'},
});

export default ScrollViewScreen;
