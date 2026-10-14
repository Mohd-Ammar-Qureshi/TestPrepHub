import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {APP_NAME} from '../constants/app';
import {useTheme, type Theme} from '../theme';
import {AppLogo} from './AppLogo';
import {AppText} from './AppText';


const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {alignItems: 'center', marginBottom: theme.spacing.xl},
    halo: {
      width: 112,
      height: 112,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
  });

/** Logo, name, tagline and a few highlights, shown above the login form. */
export function AuthHero() {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.halo}>
        <AppLogo size={72} />
      </View>
      <AppText variant="title" align="center" accessibilityRole="header">
        {APP_NAME}
      </AppText>
    </View>
  );
}
