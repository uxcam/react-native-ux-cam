import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, StyleSheet, View} from 'react-native';

import {palette} from '../../utils/palette';
import AppButton from '../../component/AppButton';
import BaseScreen from '../base_screen';
import AppText from '../../component/AppText';

const APIScreen = React.memo(() => {
  const {navigate} = useNavigation();
  return (
    <BaseScreen screenName="APIScreen">
      <FlatList
        style={styles.container}
        data={[
          {
            title: 'User Details',
            screen: 'UserDetailsScreen',
            desc: 'Collect data of property of user with key value pair list',
          },
          {
            title: 'Custom events',
            screen: 'CustomEventsScreen',
            desc: 'Trigger different event for data collection in app',
          },
        ]}
        renderItem={({item}) => {
          return (
            <>
              <AppButton
                containerStyle={styles.button}
                onPress={() => {
                  navigate(item.screen as never);
                }}>
                <AppText style={styles.title}>{item.title}</AppText>
                <AppText style={styles.desc}>{item.desc}</AppText>
              </AppButton>
              <View style={styles.line} />
            </>
          );
        }}
      />
    </BaseScreen>
  );
});

export default APIScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 16,
    backgroundColor: palette.background,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    color: palette.black,
  },
  desc: {
    fontSize: 13,
    color: palette.gray,
    marginTop: 3,
  },
  line: {
    height: 0.8,
    backgroundColor: palette.darkGray,
  },
});
