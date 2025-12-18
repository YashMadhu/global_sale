import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Set a value in AsyncStorage
 * @param {string} key - The key to store the value under
 * @param {any} value - The value to store, will be stringified
 * @returns {Promise<void>} - Returns a promise indicating success or failure
 */
const setItem = async (key:string, value:string) => {
  try {
    // Stringify the value if it's not a string (AsyncStorage only accepts strings)
    const stringValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error('Error setting item in AsyncStorage:', error);
  }
};

/**
 * Get a value from AsyncStorage
 * @param {string} key - The key to retrieve the value for
 * @returns {Promise<any>} - Returns the parsed value or null if not found
 */
const getItem = async (key:string) => {
  try {
    const stringValue = await AsyncStorage.getItem(key);
    return stringValue != null ? JSON.parse(stringValue) : null;
  } catch (error) {
    console.error('Error getting item from AsyncStorage:', error);
    return null;
  }
};

/**
 * Remove a value from AsyncStorage
 * @param {string} key - The key to remove from AsyncStorage
 * @returns {Promise<void>} - Returns a promise indicating success or failure
 */
const removeItem = async (key:string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from AsyncStorage:', error);
  }
};

/**
 * Clear all data in AsyncStorage
 * @returns {Promise<void>} - Clears all key-value pairs
 */
const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

/**
 * Get all keys stored in AsyncStorage
 * @returns {Promise<string[]>} - Returns an array of all keys in AsyncStorage
 */
const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error('Error getting all keys from AsyncStorage:', error);
    return [];
  }
};

export default {
  setItem,
  getItem,
  removeItem,
  clearStorage,
  getAllKeys,
};
