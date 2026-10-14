import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useColorScheme} from 'react-native';
import {getStoredItem, setStoredItem, STORAGE_KEYS} from '../utils/storage';
import {buildTheme, type Theme, type ThemePreference} from './theme';

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  /** True once the saved preference has been read from AsyncStorage. */
  isReady: boolean;
  setPreference: (next: ThemePreference) => Promise<void>;
}

const VALID_PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await getStoredItem<ThemePreference>(
        STORAGE_KEYS.themePreference,
      );
      if (!active) {
        return;
      }
      if (stored && VALID_PREFERENCES.includes(stored)) {
        setPreferenceState(stored);
      }
      setIsReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const setPreference = useCallback(async (next: ThemePreference) => {
    setPreferenceState(next);
    await setStoredItem(STORAGE_KEYS.themePreference, next);
  }, []);

  const isDark =
    preference === 'system' ? systemScheme === 'dark' : preference === 'dark';

  const theme = useMemo(() => buildTheme(isDark), [isDark]);

  const value = useMemo(
    () => ({theme, preference, isReady, setPreference}),
    [theme, preference, isReady, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return ctx;
}
