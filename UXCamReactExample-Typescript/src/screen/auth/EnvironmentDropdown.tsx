import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {EnvironmentType} from '../../types/environment';
import {palette} from '../../utils/palette';

export interface DropDownProps {
  environment: string;
  onSelect: (string: string) => void;
}

const EnvironmentDropdown: React.FC<DropDownProps> = React.memo(
  ({environment, onSelect}) => {
    const [value, setValue] = useState<string | null | undefined>(environment);
    const [isFocus, setIsFocus] = useState<boolean>(false);

    const data = [
      {label: EnvironmentType.production, value: EnvironmentType.production},
      {label: EnvironmentType.staging, value: EnvironmentType.staging},
    ];

    return (
      <View style={styles.container}>
        <Dropdown
          style={[styles.dropdown, isFocus && styles.blackBorderColor]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          maxHeight={120}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select Environment' : '...'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            onSelect(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    );
  },
);

export default EnvironmentDropdown;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  dropdown: {
    height: 50,
    borderColor: palette.gray,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: palette.white,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: palette.black,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  blackBorderColor: {borderColor: 'black'},
});
