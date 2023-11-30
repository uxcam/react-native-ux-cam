import React from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import RNUxcam from 'react-native-ux-cam';

import {ButtonActionType} from './data/screen-actions';
import {images} from '../../utils/images';
import AppText from '../../component/AppText';
import {palette} from '../../utils/palette';

type ButtonActionItemType = {
  item: ButtonActionType;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
};

const ButtonActionItem: React.FC<ButtonActionItemType> = React.memo(
  ({item, buttonStyle = {}, containerStyle = {}}) => {
    const accessibilityLabelID = () => {
      let id = '';

      if (item.title) {
        id = 'Title-';
      }
      if (item.isImage) {
        id += 'Image-';
      }
      if (item.isOcclusion) {
        id += 'Occlusion-';
      }
      if (item.isUserInteractionEnabled) {
        id += 'isUserInteraction';
      }
      return id;
    };

    const commonText = () => {
      let buttonState =
        item.title && item.isImage
          ? 'With Title And Image'
          : item.title
          ? 'Only With Title'
          : item.isImage
          ? 'Only With Image'
          : '';

      return `Button ${buttonState} -
Occlusion ${item.isOcclusion ? 'On' : 'Off'} -
User Interaction ${item.isUserInteractionEnabled ? 'Enabled' : 'Disabled'} -
${
  item.accessibilityIdentifier ? 'With' : 'No'
} With accessibility identifier (id)`;
    };

    return (
      <View key={commonText()} style={[styles.container, containerStyle]}>
        <AppText style={styles.commonText}>{commonText()}</AppText>
        <Pressable
          ref={button => {
            if (item.isOcclusion) {
              RNUxcam.occludeSensitiveView(button);
            }
          }}
          disabled={!item.isUserInteractionEnabled}
          style={[
            styles.button,
            buttonStyle,
            {
              backgroundColor: item.isUserInteractionEnabled
                ? palette.black
                : palette.gray,
            },
          ]}
          accessibilityLabel={
            item.accessibilityIdentifier ? accessibilityLabelID() : undefined
          }>
          {item.isImage ? (
            <Image
              source={images.bug}
              style={styles.bug}
              resizeMode="contain"
            />
          ) : (
            <></>
          )}
          {item.title ? (
            <AppText style={styles.title}>{item.title}</AppText>
          ) : (
            <></>
          )}
        </Pressable>
      </View>
    );
  },
);

export default ButtonActionItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '70%',
    maxWidth: '80%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: palette.black,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 5,
  },
  button: {
    minWidth: '60%',
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  bug: {width: 30, height: 30, marginRight: 5},
  title: {fontSize: 16, fontWeight: '500'},
  commonText: {
    fontSize: 14,
    fontWeight: '400',
    color: palette.black,
    marginHorizontal: 8,
    marginTop: 8,
  },
});
