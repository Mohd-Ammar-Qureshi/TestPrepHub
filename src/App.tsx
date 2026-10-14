import React, {useMemo} from 'react';
import {StatusBar} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AttemptsProvider} from './context/AttemptsContext';
import {AuthProvider} from './context/AuthContext';
import {DialogProvider} from './context/DialogContext';
import {RootNavigator} from './navigation/RootNavigator';
import {ThemeProvider, useTheme} from './theme';

function AppContent() {
  const {theme} = useTheme();

  // Map our centralized theme onto React Navigation's theme.
  const navigationTheme = useMemo(() => {
    const base = theme.isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
      },
    };
  }, [theme]);

  return (
    <>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DialogProvider>
          <AuthProvider>
            <AttemptsProvider>
              <AppContent />
            </AttemptsProvider>
          </AuthProvider>
        </DialogProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
