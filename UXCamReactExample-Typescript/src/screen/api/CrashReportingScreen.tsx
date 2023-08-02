import React from 'react';
import {FlatList, StyleSheet} from 'react-native';

import BaseScreen from '../base_screen';
import AppButton from '../../component/AppButton';
import {palette} from '../../utils/palette';
import AppText from '../../component/AppText';
import {capitalizeFLetter} from '../../utils/helper';

enum CrashType {
  stackOverflow = 'stackOverflow',
  divideByZero = 'divideByZero',
  outOfMemory = 'outOfMemory',
  nullPointer = 'nullPointer',
  assertFail = 'assertFail',
}

const CrashReportingScreen = React.memo(() => {
  const crashTypes = [
    CrashType.stackOverflow,
    CrashType.divideByZero,
    CrashType.outOfMemory,
    CrashType.nullPointer,
    CrashType.assertFail,
  ];

  const onPressItem = (crashType: CrashType) => {
    switch (crashType) {
      case CrashType.stackOverflow:
        const fixedArray = Array(3).fill('1');
        console.log(fixedArray[7]!);

        for (var i = 0; i < 10; i++) {
          fixedArray[i] = i * 10;
        }

        console.log(fixedArray);
        break;

      case CrashType.divideByZero:
        const x = 1n;
        const y = 0n;
        const quotient = x / y;
        console.log(quotient);
        break;

      case CrashType.outOfMemory:
        var wastedMemory: Array<any> = [0];
        let data = Array(900000000).fill(0);
        wastedMemory.push(...data);
        wastedMemory.push(...data);
        wastedMemory.push(...data);
        break;

      case CrashType.nullPointer:
        const key = 'name';
        let object: any = {[key]: 'Rohit'};
        object = null;
        console.log(object[key]!);
        break;

      case CrashType.assertFail:
        assert(1 === 0);
    }
  };

  const assert = function (condition: boolean, message: string = '') {
    if (!condition) {
      throw Error('Assert failed: ' + (message || ''));
    }
  };

  return (
    <BaseScreen screenName="CrashReportingScreen">
      <FlatList
        style={styles.container}
        data={crashTypes}
        renderItem={({item}: {item: CrashType}) => {
          return (
            <AppButton
              containerStyle={styles.button}
              onPress={() => {
                onPressItem(item);
              }}>
              <AppText>{capitalizeFLetter(item)}</AppText>
            </AppButton>
          );
        }}
      />
    </BaseScreen>
  );
});

export default CrashReportingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: palette.orange,
    marginVertical: 6,
    padding: 15,
  },
});
