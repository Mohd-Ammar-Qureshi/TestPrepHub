import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../theme';

interface AppLogoProps {
  /** Width and height of the logo in pixels. */
  size?: number;
}

/**
 * TestPrep Hub logo: a check mark on a rounded square, drawn with plain
 * views so it needs no image file and follows the active theme.
 */
export function AppLogo({size = 40}: AppLogoProps) {
  const {theme} = useTheme();
  const stroke = Math.max(2, Math.round(size * 0.11));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="TestPrep Hub logo"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: size * 0.32,
          height: size * 0.54,
          marginTop: -size * 0.08,
          borderRightWidth: stroke,
          borderBottomWidth: stroke,
          borderColor: theme.colors.primaryText,
          borderBottomRightRadius: stroke / 2,
          transform: [{rotate: '45deg'}],
        }}
      />
    </View>
  );
}
