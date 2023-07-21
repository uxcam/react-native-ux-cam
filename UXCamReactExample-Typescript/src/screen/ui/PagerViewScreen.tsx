import React from 'react';
import {StyleSheet, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import AppText from '../../component/AppText';
import {palette} from '../../utils/palette';
import BaseScreen from '../base_screen';

const PagerViewScreen = React.memo(() => {
  return (
    <BaseScreen screenName="PagerViewScreen">
      <PagerView style={styles.pagerView} initialPage={0}>
        <View key="1" style={[styles.page_one, styles.center]}>
          <AppText>First page</AppText>
        </View>
        <View key="2" style={[styles.page_second, styles.center]}>
          <AppText>Second page</AppText>
        </View>
        <View key="3" style={[styles.page_third, styles.center]}>
          <AppText>Third page</AppText>
        </View>
      </PagerView>
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  page_one: {
    backgroundColor: palette.pastelBlue,
  },
  page_second: {
    backgroundColor: palette.pastelGreen,
  },
  page_third: {
    backgroundColor: palette.pastelPurple,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PagerViewScreen;
