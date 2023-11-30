import React from 'react';
import {ScrollView} from 'react-native';
import BaseScreen from '../base_screen';
import {buttonActions} from './data/screen-actions';
import ButtonActionItem from './ButtonActionItem';

const ScreenActionScrollView = React.memo(() => {
  return (
    <BaseScreen screenName="ScreenActionScrollView">
      <ScrollView>
        {buttonActions.map((item, index) => {
          return <ButtonActionItem item={item} key={index} />;
        })}
      </ScrollView>
    </BaseScreen>
  );
});

export default ScreenActionScrollView;
