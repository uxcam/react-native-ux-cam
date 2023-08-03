import AsyncStorage from '@react-native-async-storage/async-storage';

export function isEmpty(string: string) {
  return typeof string === 'string' && string.trim().length === 0;
}
export const setStorage = async (akey: string, value: any) => {
  return await AsyncStorage.setItem(akey, JSON.stringify(value));
};

export const removeStorageValue = async (akey: string) => {
  await AsyncStorage.removeItem(akey);
};

export function capitalizeFLetter(string: string) {
  return string.replace(/^./, string[0].toUpperCase());
}
