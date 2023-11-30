import React, {useCallback} from 'react';
import {StyleSheet, FlatList, Dimensions} from 'react-native';
import BaseScreen from '../base_screen';
import {ButtonActionType, buttonActions} from './data/screen-actions';
import ButtonActionItem from './ButtonActionItem';

const windowWidth = Dimensions.get('window').width;
const numColumns = 2;

const ScreenActionGridView = React.memo(() => {
  const renderItem = useCallback(
    ({item}: {item: ButtonActionType}) => (
      <ButtonActionItem
        item={item}
        containerStyle={styles.itemContainerView}
        buttonStyle={styles.itemButton}
      />
    ),
    [],
  );

  return (
    <BaseScreen screenName="ScreenActionGridView">
      <FlatList
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        removeClippedSubviews
        data={buttonActions}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </BaseScreen>
  );
});

export default ScreenActionGridView;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 20,
  },
  itemContainerView: {
    minWidth: (windowWidth - numColumns * 5 - 10) / numColumns,
    maxWidth: (windowWidth - numColumns * 5 - 10) / numColumns,
    marginHorizontal: 5,
  },
  itemButton: {minWidth: '90%'},
});
