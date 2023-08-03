import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Keyboard} from 'react-native';

import AppButton from '../../../component/AppButton';
import {global_styles} from '../../../utils/globalStyles';
import AppText from '../../../component/AppText';
import {palette} from '../../../utils/palette';
import Spacer from '../../../component/Spacer';
import {images} from '../../../utils/images';
import UXCam from 'react-native-ux-cam';

const SchematicRecordingView: React.FC = React.memo(() => {
  const [isOptInto, setIsOptInto] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecordingStatus();
    }, 2000);
    return () => clearTimeout(timer);
  }, [reload]);

  async function fetchRecordingStatus() {
    try {
      const record = await UXCam.optInSchematicRecordingStatus();
      setIsOptInto(record);
    } catch (error) {
      console.error(`Could not get urls: ${error}`);
    }
  }

  return (
    <View>
      <AppText style={styles.title}>Schematic recording</AppText>

      <View style={styles.row}>
        <AppButton
          containerStyle={[
            global_styles.button,
            styles.button,
            {
              borderColor: palette.green,
            },
          ]}
          onPress={() => {
            Keyboard.dismiss();
            UXCam.optIntoSchematicRecordings();
            setReload(load => !load);
          }}>
          {isOptInto && (
            <Image
              source={images.tick}
              style={[styles.tick, {tintColor: palette.green}]}
              resizeMode="contain"
            />
          )}
          <AppText numberOfLines={1} style={styles.optInText}>
            Opted In
          </AppText>
        </AppButton>
        <AppButton
          containerStyle={[
            global_styles.button,
            styles.button,
            {
              borderColor: palette.orange,
            },
          ]}
          onPress={() => {
            Keyboard.dismiss();
            UXCam.optOutOfSchematicRecordings();
            setReload(load => !load);
          }}>
          {!isOptInto && (
            <Image
              source={images.tick}
              style={[styles.tick, {tintColor: palette.orange}]}
              resizeMode="contain"
            />
          )}
          <AppText style={styles.optOutText}>Opt Out</AppText>
        </AppButton>
      </View>
      <Spacer height={20} />
    </View>
  );
});

export default SchematicRecordingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  button: {
    marginVertical: 6,
    width: '48%',
    backgroundColor: palette.transparent,
    borderWidth: 1,
    marginTop: 15,
    flexDirection: 'row',
  },
  tick: {width: 25, height: 25, marginRight: 5},
  title: {
    color: palette.black,
    fontSize: 18,
    marginTop: 16,
  },
  optOutText: {
    color: palette.orange,
    fontSize: 18,
  },
  optInText: {
    color: palette.green,
    fontSize: 18,
  },
});
