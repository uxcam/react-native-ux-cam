import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppButton from '../../component/AppButton';
import {useNavigation} from '@react-navigation/native';
import BaseScreen from '../base_screen';

const SystemElementsScreen = React.memo(() => {
  const navigate = useNavigation();
  return (
    <BaseScreen screenName="SystemElementsScreen">
      <View style={styles.container}>
        <AppButton
          text="Simple Type"
          containerStyle={styles.button}
          onPress={() => {
            navigate.navigate('SimpleComponentScreen' as never);
          }}
        />
        <AppButton
          text="FlatList"
          containerStyle={styles.button}
          onPress={() => {
            navigate.navigate('SectionListScreen' as never);
          }}
        />
      </View>
    </BaseScreen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
  },
  button: {padding: 15, marginVertical: 10},
});

export default SystemElementsScreen;
