import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, StyleSheet} from 'react-native';

import {palette} from '../../utils/palette';
import AppButton from '../../component/AppButton';
import BaseScreen from '../base_screen';

const APIScreen = React.memo(() => {
  const {navigate} = useNavigation();
  return (
    <BaseScreen screenName="APIScreen">
      <FlatList
        style={styles.container}
        data={[{title: 'User Details', value: 'UserDetailScreen'}]}
        renderItem={({item}) => {
          return (
            <AppButton
              containerStyle={styles.button}
              textStyle={styles.buttonText}
              text={item.title}
              onPress={() => {
                navigate(item.value as never);
              }}
            />
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
    marginHorizontal: 12,
  },
  button: {
    padding: 16,
    backgroundColor: palette.alto,
    marginVertical: 12,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 16,
    color: palette.black,
  },
});
