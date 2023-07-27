import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import UXCam from 'react-native-ux-cam';

import BaseScreen from '../../base_screen';
import AppButton from '../../../component/AppButton';
import {global_styles} from '../../../utils/globalStyles';
import {palette} from '../../../utils/palette';
import KeyValueEvents from './KeyValueEvents';
import TagScreenName from './TagScreenName';
import Spacer from '../../../component/Spacer';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const CustomEventsScreen = React.memo(() => {
  const showToast = (message: string) => {
    Toast.show({
      type: 'customToast',
      text1: message,
      position: 'bottom',
    });
  };

  const data = [
    {
      id: 0,
      title: 'Event without properties',
      onPress: () => {
        sendEventWithProperties('Event_withoutProperties');
      },
    },
    {
      id: 1,
      title: 'Event with Map properties',
      onPress: () => {
        const map = {withMap: true, 'content-type': 'text', noOfProperties: 3};
        sendEventWithProperties('Event_withMap', map);
      },
    },
    {
      id: 2,
      title: 'Event with Empty Map',
      onPress: () => {
        sendEventWithProperties('Event_withEmptyMap', {});
      },
    },
    {
      id: 3,
      title: 'Event with Nil Map',
      onPress: () => {
        sendEventWithProperties('Event_withNullMap', null);
      },
    },
    {
      id: 4,
      title: 'Event with JSON properties',
      onPress: () => {
        let json = {
          json: "{ withMap: true, content-type: 'json', noOfProperties: 3 }",
        };
        sendEventWithProperties('Event_withJSONProperties', json);
      },
    },
    {
      id: 5,
      title: 'Event with Empty JSON',
      onPress: () => {
        sendEventWithProperties('Event_withEmptyJSON', {json: ''});
      },
    },
  ];

  // Sending Events and Properties
  const sendEventWithProperties = (name: string, properties?: any) => {
    if (properties === undefined) {
      UXCam.logEvent(name);
    } else {
      UXCam.logEvent(name, properties);
    }

    showToast(
      `Event sent for '${name}' with value ${JSON.stringify(properties)}`,
    );
  };

  return (
    <BaseScreen screenName="CustomEventsScreen">
      <ScrollView style={styles.container}>
        {data.map(item => {
          return (
            <AppButton
              testID={item.title.trim()}
              key={item.id}
              text={item.title}
              containerStyle={styles.button}
              onPress={item.onPress}
              textStyle={global_styles.buttontText}
            />
          );
        })}

        <Spacer height={20} />
        <KeyValueEvents
          onPressButton={(name, params) => {
            sendEventWithProperties(name, params);
          }}
        />

        <Spacer height={20} />
        <TagScreenName
          onPressButton={screenName => {
            UXCam.tagScreenName(screenName);
            showToast(`Tagged New Screen = ${screenName}`);
          }}
        />

        <Spacer height={20} />
      </ScrollView>
    </BaseScreen>
  );
});

export default CustomEventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    ...global_styles.button,
    marginVertical: 5,
    backgroundColor: palette.seaSerpent,
  },
  marginTop_20: {marginTop: 20},
});
