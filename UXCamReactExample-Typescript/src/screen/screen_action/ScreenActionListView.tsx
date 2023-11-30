import React, {useCallback} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import BaseScreen from '../base_screen';
import {ButtonActionType, buttonActions} from './data/screen-actions';
import ButtonActionItem from './ButtonActionItem';

const ScreenActionListView = React.memo(() => {
  const renderItem = useCallback(
    ({item}: {item: ButtonActionType}) => <ButtonActionItem item={item} />,
    [],
  );

  return (
    <BaseScreen screenName="ScreenActionListView">
      <FlatList
        removeClippedSubviews
        data={buttonActions}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </BaseScreen>
  );
});

export default ScreenActionListView;

const styles = StyleSheet.create({
  contentContainerStyle: {paddingBottom: 20},
});
