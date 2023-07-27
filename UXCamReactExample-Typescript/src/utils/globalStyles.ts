import {StyleSheet} from 'react-native';
import {palette} from './palette';

export const global_styles = StyleSheet.create({
  input: {
    height: 46,
    marginVertical: 12,
    padding: 10,
    backgroundColor: palette.alto,
    borderRadius: 6,
    color: palette.black,
    fontSize: 16,
  },
  button: {
    backgroundColor: palette.black,
    height: 50,
    marginVertical: 12,
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttontText: {
    color: palette.white,
    fontSize: 18,
  },
});
