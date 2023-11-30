import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';

import BaseScreen from '../base_screen';
import {buttonActions} from './data/screen-actions';
import ButtonActionItem from './ButtonActionItem';

const windowWidth = Dimensions.get('window').width;
const numColumns = 2;

const ScreenActionViewGroup = React.memo(() => {
  return (
    <BaseScreen screenName="ScreenActionScrollView">
      <ScrollView>
        <View style={styles.container}>
          {buttonActions.map((item, index) => {
            return (
              <ButtonActionItem
                key={index}
                item={item}
                containerStyle={styles.itemContainerView}
                buttonStyle={styles.itemButton}
              />
            );
          })}
        </View>
      </ScrollView>
    </BaseScreen>
  );
});

export default ScreenActionViewGroup;

const styles = StyleSheet.create({
  container: {flexDirection: 'row', flexWrap: 'wrap'},
  itemContainerView: {
    minWidth: (windowWidth - numColumns * 5 - 10) / numColumns,
    maxWidth: (windowWidth - numColumns * 5 - 10) / numColumns,
    marginHorizontal: 5,
  },
  itemButton: {minWidth: '90%'},
});
