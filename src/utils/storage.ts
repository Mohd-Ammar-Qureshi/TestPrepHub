import AsyncStorage from '@react-native-async-storage/async-storage';

// All AsyncStorage keys live here. New keys are added in later phases.
export const STORAGE_KEYS = {
  themePreference: '@testprephub/themePreference',
  students: '@testprephub/students',
  session: '@testprephub/session',
  attempts: '@testprephub/attempts',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export async function getStoredItem<T>(key: StorageKey): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

export async function setStoredItem<T>(
  key: StorageKey,
  value: T,
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function removeStoredItem(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Ignore: nothing useful to do if removal fails.
  }
}
