import { AsyncStorage } from "react-native";

export const persist = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw Error(error);
  }
};

export const persistMany = async pairs => {
  const stringifiedPairs = pairs.map((val, i, arr) => [
    arr[i][0],
    JSON.stringify(arr[i][1])
  ]);
  try {
    await AsyncStorage.multiSet(stringifiedPairs);
  } catch (error) {
    throw Error(error);
  }
};

export const retrieve = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return undefined;
    }
    return JSON.parse(value);
  } catch (error) {
    throw Error(error);
  }
};

export const retrieveMany = async keys => {
  try {
    const many = await AsyncStorage.multiGet(keys);
    return many;
  } catch (error) {
    throw Error(error);
  }
};

export const retrieveAll = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const all = await AsyncStorage.multiGet(keys);
    return all;
  } catch (error) {
    throw Error(error);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    throw Error(error);
  }
};

export const remove = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw Error(error);
  }
};
