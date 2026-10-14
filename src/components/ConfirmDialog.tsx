import React, {useMemo} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {useTheme, type Theme} from '../theme';
import {AppText} from './AppText';
import {Button} from './Button';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  emoji?: string;
  confirmLabel: string;
  /** When omitted, only the confirm button is shown (a notice). */
  cancelLabel?: string;
  /** Styles the confirm button as a warning (red). */
  destructive?: boolean;
  onConfirm: () => void;
  /** Called for the cancel button, a tap outside, or the Android back button. */
  onCancel: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.shadow,
      opacity: 0.6,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
      padding: theme.spacing.xl,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      elevation: 8,
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 6},
    },
    emojiCircle: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    emoji: {fontSize: 30, lineHeight: 38},
    message: {marginTop: theme.spacing.sm},
    actions: {alignSelf: 'stretch', marginTop: theme.spacing.xl},
    gap: {height: theme.spacing.sm},
  });

/** Themed replacement for the system alert dialog. */
export function ConfirmDialog({
  visible,
  title,
  message,
  emoji,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable
          accessibilityLabel="Close dialog"
          style={styles.backdrop}
          onPress={onCancel}
        />
        <View style={styles.card} accessibilityViewIsModal>
          {emoji ? (
            <View style={styles.emojiCircle}>
              <AppText style={styles.emoji}>{emoji}</AppText>
            </View>
          ) : null}
          <AppText variant="heading" align="center" accessibilityRole="header">
            {title}
          </AppText>
          {message ? (
            <AppText
              variant="body"
              color="secondary"
              align="center"
              style={styles.message}>
              {message}
            </AppText>
          ) : null}

          <View style={styles.actions}>
            <Button
              title={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
            />
            {cancelLabel ? (
              <>
                <View style={styles.gap} />
                <Button
                  title={cancelLabel}
                  variant="ghost"
                  onPress={onCancel}
                />
              </>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}
