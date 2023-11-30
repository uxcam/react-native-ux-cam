import React, {useCallback} from 'react';
import {ScrollView} from 'react-native';
import BaseScreen from '../base_screen';
import {ButtonActionType, buttonActions} from './data/screen-actions';
import ButtonActionItem from './ButtonActionItem';

const ScreenActionScrollView = React.memo(() => {
  const renderItem = useCallback(
    ({item}: {item: ButtonActionType}) => <ButtonActionItem item={item} />,
    [],
  );

  return (
    <BaseScreen screenName="ScreenActionScrollView">
      <ScrollView>
        {buttonActions.map((item, _) => {
          return renderItem({item});
        })}
      </ScrollView>
    </BaseScreen>
  );
});

export default ScreenActionScrollView;
