import React, {forwardRef, useMemo, useState, type ComponentRef} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import {useTheme, type Theme} from '../theme';
import {AppText} from './AppText';
import {useScreenKeyboard} from './Screen';

export interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  /** Masks the input and shows a Show/Hide toggle. */
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {marginBottom: theme.spacing.lg},
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 1.5,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
    },
    input: {
      flex: 1,
      minHeight: 48,
      color: theme.colors.text,
      fontSize: theme.typography.body.fontSize,
      paddingVertical: theme.spacing.sm,
    },
    message: {marginTop: theme.spacing.xs},
  });

export const TextField = forwardRef<
  ComponentRef<typeof TextInput>,
  TextFieldProps
>(
  (
    {
      label,
      error,
      helperText,
      isPassword = false,
      containerStyle,
      onFocus,
      onBlur,
      style,
      ...rest
    },
    ref,
  ) => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const screenKeyboard = useScreenKeyboard();
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(true);

    const borderColor = error
      ? theme.colors.error
      : focused
        ? theme.colors.inputBorderFocused
        : theme.colors.inputBorder;

    return (
      <View style={[styles.container, containerStyle]}>
        <AppText variant="label">{label}</AppText>
        <View style={[styles.row, {borderColor}]}>
          <TextInput
            ref={ref}
            accessibilityLabel={label}
            placeholderTextColor={theme.colors.placeholder}
            autoCapitalize="none"
            {...rest}
            secureTextEntry={isPassword && hidden}
            onFocus={e => {
              setFocused(true);
              screenKeyboard?.ensureFocusedVisible();
              onFocus?.(e);
            }}
            onBlur={e => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={[styles.input, style]}
          />
          {isPassword ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
              hitSlop={8}
              onPress={() => setHidden(h => !h)}>
              <AppText variant="label" color="primary">
                {hidden ? 'Show' : 'Hide'}
              </AppText>
            </Pressable>
          ) : null}
        </View>
        {error ? (
          <AppText
            variant="caption"
            color="error"
            style={styles.message}
            accessibilityLiveRegion="polite">
            {error}
          </AppText>
        ) : helperText ? (
          <AppText variant="caption" color="secondary" style={styles.message}>
            {helperText}
          </AppText>
        ) : null}
      </View>
    );
  },
);

TextField.displayName = 'TextField';
