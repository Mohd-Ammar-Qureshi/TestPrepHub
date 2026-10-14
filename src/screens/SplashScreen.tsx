import React, {useMemo} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {AppLogo, AppText, Screen} from '../components';
import {APP_NAME, APP_TAGLINE} from '../constants/app';
import {useTheme, type Theme} from '../theme';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    logo: {marginBottom: theme.spacing.xl},
    tagline: {marginTop: theme.spacing.sm},
    loader: {marginTop: theme.spacing.xxl},
  });

// The root navigator shows this screen while the saved theme and
// login session are being restored, then switches automatically.
export default function SplashScreen() {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <View style={styles.logo}>
          <AppLogo size={96} />
        </View>
        <AppText variant="title">{APP_NAME}</AppText>
        <AppText variant="body" color="secondary" style={styles.tagline}>
          {APP_TAGLINE}
        </AppText>
        <ActivityIndicator
          style={styles.loader}
          size="small"
          color={theme.colors.primary}
        />
      </View>
    </Screen>
  );
}
