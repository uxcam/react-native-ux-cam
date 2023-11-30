import React, {useCallback} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import BaseScreen from '../base_screen';
import {palette} from '../../utils/palette';
import {useNavigation} from '@react-navigation/native';
import AppButton from '../../component/AppButton';

type ScreenActionType = {
  title: string;
  screenName: string;
};

const ScreenActionsView = React.memo(() => {
  const {navigate} = useNavigation();

  const options: ScreenActionType[] = [
    {
      title: 'List Tab',
      screenName: 'ScreenActionListView',
    },
    {
      title: 'Grid Tab',
      screenName: 'ScreenActionGridView',
    },
  ];

  const renderItem = useCallback(
    ({item}: {item: ScreenActionType}) => {
      return (
        <AppButton
          containerStyle={styles.button}
          text={item.title}
          textStyle={styles.title}
          onPress={() => {
            navigate(item.screenName as never);
          }}
        />
      );
    },
    [navigate],
  );

  return (
    <BaseScreen screenName="ScreenActionsView">
      <View style={styles.container}>
        <FlatList
          removeClippedSubviews
          data={options}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    </BaseScreen>
  );
});

export default ScreenActionsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    alignSelf: 'center',
    width: '80%',
    marginVertical: 12,
    backgroundColor: palette.black,
  },
  title: {fontSize: 17, fontWeight: '500', marginVertical: 5},
  contentContainerStyle: {paddingBottom: 20},
});
