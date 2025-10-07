import React from 'react';
import {StyleSheet, Text, View, SectionList, StatusBar, Image} from 'react-native';

import {palette} from '../../utils/palette';
import AppText from '../../component/AppText';
import {images} from '../../utils/images';
import BaseScreen from '../base_screen';
import RNUxcam from 'react-native-ux-cam';

const DATA = [
  {
    title: 'Main dishes',
    data: [
      {title: 'Pizza', image: images.pizza},
      {title: 'Burger', image: images.burger},
      {title: 'Risotto', image: images.risotto},
    ],
  },
  {
    title: 'Sides',
    data: [
      {title: 'French Fries', image: images.frenchFries},
      {title: 'Onion Rings', image: images.onionRings},
      {title: 'Fried Shrimps', image: images.friedShrimp},
    ],
  },
  {
    title: 'Desserts',
    data: [
      {title: 'Cheese Cake', image: images.cheeseCake},
      {title: 'Ice Cream', image: images.iceCream},
    ],
  },
];

const SectionListScreen = React.memo(() => (
  <BaseScreen screenName="SectionListScreen">
    <View style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="stretch"
            />
            <Text 
            style={styles.title}
            ref={label => {
              RNUxcam.occludeSensitiveView(label);
            }}
            >{item.title}</Text>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <AppText style={styles.header}>{title}</AppText>
        )}
      />
    </View>
  </BaseScreen>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  item: {
    backgroundColor: palette.alto,
    padding: 16,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    backgroundColor: palette.black,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: palette.black,
  },
});

export default SectionListScreen;
