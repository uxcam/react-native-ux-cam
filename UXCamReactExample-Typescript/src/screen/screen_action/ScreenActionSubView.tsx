import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';

import BaseScreen from '../base_screen';
import {buttonActions} from './data/screen-actions';
import ButtonActionItem from './ButtonActionItem';
import {palette} from '../../utils/palette';

const windowWidth = Dimensions.get('window').width;
const numColumns = 2;

const ScreenActionSubView = React.memo(() => {
  const rowCount = Math.round(buttonActions.length / numColumns);

  let subViews = [];
  for (let i = 0; i < rowCount; i++) {
    subViews.push(
      <>
        <View
          key={i}
          style={[
            styles.containerRow,
            {
              backgroundColor: i % 2 === 0 ? palette.alto : palette.white,
            },
          ]}>
          <ButtonActionItem
            key={i * numColumns}
            item={buttonActions[i * numColumns]}
            containerStyle={styles.itemContainerView}
            buttonStyle={styles.itemButton}
          />
          {i * numColumns + 1 < buttonActions.length && (
            <ButtonActionItem
              key={i * numColumns + 1}
              item={buttonActions[i * numColumns + 1]}
              containerStyle={styles.itemContainerView}
              buttonStyle={styles.itemButton}
            />
          )}
        </View>
        <View style={styles.line} />
      </>,
    );
  }
  return (
    <BaseScreen screenName="ScreenActionScrollView">
      <ScrollView>
        <View style={styles.container}>{subViews}</View>
      </ScrollView>
    </BaseScreen>
  );
});

export default ScreenActionSubView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: palette.background,
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
  },
  itemContainerView: {
    minWidth: (windowWidth - numColumns * 5 - 10) / numColumns,
    maxWidth: (windowWidth - numColumns * 5 - 10) / numColumns,
    marginHorizontal: 5,
  },
  itemButton: {minWidth: '90%'},
  line: {
    backgroundColor: palette.black,
    width: '100%',
    paddingVertical: 1,
  },
});
