import React, {useCallback} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import AppButton from '../../component/AppButton';
import AppText from '../../component/AppText';
import {palette} from '../../utils/palette';
import {useNavigation} from '@react-navigation/native';
import BaseScreen from '../base_screen';

type OptionType = {
  title: string;
  description: string;
  screenName: string;
};

const UIOptionScreen = React.memo(() => {
  const {navigate} = useNavigation();

  const options: OptionType[] = [
    {
      title: 'Gesture/Tag Screen',
      description: 'Emulate different gestures for collecting gestures data',
      screenName: 'GestureTagScreen',
    },
    {
      title: 'Scroll View',
      description: 'Show partial hide screen while scrolling',
      screenName: 'ScrollViewScreen',
    },
    {
      title: 'Occlude View',
      description: 'Hide view with different condition as per the APIs',
      screenName: 'OccludeScreen',
    },
    {
      title: 'Animation',
      description: 'Compute various animations to see it in UXCam session',
      screenName: 'AnimationScreen',
    },
    {
      title: 'Maps',
      description: 'Open Google map to view map and its affect on SDK',
      screenName: 'MapScreen',
    },
    {
      title: 'Web View',
      description: 'Open webView to check its scenario',
      screenName: 'WebViewScreen',
    },
    {
      title: 'Page View',
      description: 'Open page view with its children',
      screenName: 'PagerViewScreen',
    },
    {
      title: 'System Elements',
      description: 'Show different available system elements',
      screenName: 'SystemElementsScreen',
    },
  ];

  const renderItem = useCallback(
    ({item}: {item: OptionType}) => (
      <AppButton
        containerStyle={styles.button}
        onPress={() => {
          navigate(item.screenName as never);
        }}>
        <AppText style={styles.title}>{item.title}</AppText>
        <AppText style={styles.description}>{item.description}</AppText>
      </AppButton>
    ),
    [navigate],
  );

  return (
    <BaseScreen screenName="UIOptionScreen">
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  button: {
    maxWidth: '100%',
    marginTop: 12,
    alignItems: 'flex-start',
    backgroundColor: palette.green,
  },
  title: {fontSize: 17, fontWeight: '500', marginBottom: 5},
  description: {color: palette.darkGray},
  contentContainerStyle: {paddingBottom: 20},
});

export default UIOptionScreen;
