import React, {useCallback} from 'react';
import {StyleSheet, FlatList, View, Image} from 'react-native';
import BaseScreen from '../base_screen';
import {ButtonActionType, buttonActions} from './data/screen-actions';
import ButtonActionItem from './ButtonActionItem';
import AppButton from '../../component/AppButton';
import AppText from '../../component/AppText';
import {palette} from '../../utils/palette';
import {images} from '../../utils/images';

const ScreenActionListView = React.memo(() => {
  const renderItem = useCallback(
    ({item}: {item: ButtonActionType}) => <ButtonActionItem item={item} />,
    [],
  );

  const HeaderView = useCallback(
    () => (
      <View style={[styles.row, styles.headerButtonContainer]}>
        <AppButton containerStyle={[styles.row, styles.leftButton]}>
          <Image
            source={images.stack}
            style={styles.image}
            resizeMode="contain"
          />
          <AppText style={styles.headerButtonText}>{'Text'}</AppText>
        </AppButton>
        <AppButton containerStyle={[styles.row, styles.rightButton]}>
          <Image
            source={images.menu}
            style={styles.image}
            resizeMode="contain"
          />
        </AppButton>
      </View>
    ),
    [],
  );

  return (
    <BaseScreen screenName="ScreenActionListView">
      <FlatList
        removeClippedSubviews
        data={buttonActions}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ListHeaderComponent={HeaderView}
      />
    </BaseScreen>
  );
});

export default ScreenActionListView;

const styles = StyleSheet.create({
  contentContainerStyle: {paddingBottom: 20},
  headerButtonContainer: {justifyContent: 'space-between', marginVertical: 5},
  headerButtonText: {color: palette.black},
  image: {width: 30, height: 30, marginRight: 5},
  row: {flexDirection: 'row'},
  leftButton: {width: 100, backgroundColor: palette.transparent},
  rightButton: {width: 60, backgroundColor: palette.transparent},
});
