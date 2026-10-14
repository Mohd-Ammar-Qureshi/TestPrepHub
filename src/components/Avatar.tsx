import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTheme} from '../theme';
import {AppText} from './AppText';

interface AvatarProps {
  name: string;
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '?';
  const second = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${second}`.toUpperCase();
}

/** Circle showing the student's initials. Tappable when onPress is given. */
export function Avatar({
  name,
  size = 44,
  onPress,
  accessibilityLabel,
}: AvatarProps) {
  const {theme} = useTheme();

  const circle = (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.primary,
        },
      ]}>
      <AppText
        variant="label"
        style={{
          color: theme.colors.primaryText,
          fontSize: Math.round(size * 0.38),
          lineHeight: Math.round(size * 0.5),
        }}>
        {getInitials(name)}
      </AppText>
    </View>
  );

  if (!onPress) {
    return circle;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? 'Open profile'}
      hitSlop={8}
      onPress={onPress}
      style={({pressed}) => ({opacity: pressed ? 0.8 : 1})}>
      {circle}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {alignItems: 'center', justifyContent: 'center'},
});
