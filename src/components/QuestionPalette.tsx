import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTheme} from '../theme';
import {AppText} from './AppText';

interface QuestionPaletteProps {
  /** One entry per question: true when it has been answered. */
  answered: boolean[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

/** Numbered buttons for jumping between questions. */
export function QuestionPalette({
  answered,
  currentIndex,
  onSelect,
}: QuestionPaletteProps) {
  const {theme} = useTheme();
  const {colors} = theme;

  return (
    <View style={styles.wrap}>
      {answered.map((isAnswered, index) => {
        const isCurrent = index === currentIndex;
        const background = isCurrent
          ? colors.primary
          : isAnswered
            ? colors.primaryMuted
            : colors.surface;
        const border = isCurrent || isAnswered ? colors.primary : colors.border;
        const textColor = isCurrent
          ? colors.primaryText
          : isAnswered
            ? colors.primary
            : colors.textSecondary;

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityLabel={`Question ${index + 1}, ${
              isAnswered ? 'answered' : 'not answered'
            }`}
            accessibilityState={{selected: isCurrent}}
            onPress={() => onSelect(index)}
            style={[
              styles.item,
              {
                backgroundColor: background,
                borderColor: border,
                borderRadius: theme.radius.pill,
                marginRight: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
              },
            ]}>
            <AppText variant="label" style={{color: textColor}}>
              {index + 1}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {flexDirection: 'row', flexWrap: 'wrap'},
  item: {
    width: 40,
    height: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
