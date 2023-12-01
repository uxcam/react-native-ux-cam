import React, {useCallback} from 'react';
import {StyleSheet, FlatList, Dimensions} from 'react-native';
import BaseScreen from '../base_screen';
import {ButtonActionType, buttonActions} from './data/screen-actions';
import ButtonActionItem from './ButtonActionItem';
import AppButton from '../../component/AppButton';
import {palette} from '../../utils/palette';

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

  const HeaderView = useCallback(
    () => (
      <AppButton
        text="Text"
        containerStyle={styles.leftButton}
        textStyle={styles.leftButtonText}
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
        ListHeaderComponent={HeaderView}
      />
    </BaseScreen>
  );
});

export default ScreenActionGridView;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 20,
  },
  headerButtonContainer: {justifyContent: 'space-between', marginVertical: 5},
  leftButton: {
    flexDirection: 'row',
    width: 60,
    backgroundColor: palette.transparent,
    marginVertical: 5,
  },
  leftButtonText: {color: palette.black, fontSize: 17, fontWeight: '500'},
  itemContainerView: {
    minWidth: (windowWidth - numColumns * 5 - 10) / numColumns,
    maxWidth: (windowWidth - numColumns * 5 - 10) / numColumns,
    marginHorizontal: 5,
  },
  itemButton: {minWidth: '90%'},
});
