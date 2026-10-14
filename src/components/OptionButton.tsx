import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTheme, type Theme} from '../theme';
import {AppText} from './AppText';

interface OptionButtonProps {
  /** Letter shown in the marker, e.g. "A". */
  letter: string;
  text: string;
  selected: boolean;
  onPress: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.radius.md,
      borderWidth: 2,
      minHeight: 56,
    },
    marker: {
      width: 30,
      height: 30,
      borderRadius: theme.radius.pill,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    text: {flex: 1},
  });

/** One selectable answer option (radio style). */
export function OptionButton({
  letter,
  text,
  selected,
  onPress,
}: OptionButtonProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {colors} = theme;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`Option ${letter}: ${text}`}
      accessibilityState={{selected}}
      onPress={onPress}
      style={({pressed}) => [
        styles.option,
        {
          backgroundColor: selected ? colors.primaryMuted : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <View
        style={[
          styles.marker,
          {
            borderColor: selected ? colors.primary : colors.inputBorder,
            backgroundColor: selected ? colors.primary : 'transparent',
          },
        ]}>
        <AppText
          variant="label"
          style={{color: selected ? colors.primaryText : colors.textSecondary}}>
          {letter}
        </AppText>
      </View>
      <AppText variant="body" style={styles.text}>
        {text}
      </AppText>
    </Pressable>
  );
}
