import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ConfirmDialog} from '../components/ConfirmDialog';

export interface ConfirmOptions {
  title: string;
  message?: string;
  emoji?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export interface NoticeOptions {
  title: string;
  message?: string;
  emoji?: string;
  okLabel?: string;
}

interface DialogContextValue {
  /** Shows a two-button dialog. Resolves true when confirmed, false otherwise. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Shows a one-button message. Resolves when dismissed. */
  notify: (options: NoticeOptions) => Promise<void>;
  /** Closes any open dialog (it counts as cancelled). */
  hideDialog: () => void;
}

interface DialogContent {
  title: string;
  message?: string;
  emoji?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function DialogProvider({children}: {children: React.ReactNode}) {
  const [content, setContent] = useState<DialogContent | null>(null);
  const [visible, setVisible] = useState(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const settle = useCallback((value: boolean) => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setVisible(false);
    resolve?.(value);
  }, []);

  const open = useCallback(
    (next: DialogContent) =>
      new Promise<boolean>(resolve => {
        // A new dialog replaces any open one, which counts as cancelled.
        resolveRef.current?.(false);
        resolveRef.current = resolve;
        setContent(next);
        setVisible(true);
      }),
    [],
  );

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      open({
        title: options.title,
        message: options.message,
        emoji: options.emoji,
        confirmLabel: options.confirmLabel ?? 'Confirm',
        cancelLabel: options.cancelLabel ?? 'Cancel',
        destructive: options.destructive,
      }),
    [open],
  );

  const notify = useCallback(
    async (options: NoticeOptions) => {
      await open({
        title: options.title,
        message: options.message,
        emoji: options.emoji,
        confirmLabel: options.okLabel ?? 'OK',
      });
    },
    [open],
  );

  const hideDialog = useCallback(() => settle(false), [settle]);

  const value = useMemo(
    () => ({confirm, notify, hideDialog}),
    [confirm, notify, hideDialog],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      {content ? (
        <ConfirmDialog
          visible={visible}
          title={content.title}
          message={content.message}
          emoji={content.emoji}
          confirmLabel={content.confirmLabel}
          cancelLabel={content.cancelLabel}
          destructive={content.destructive}
          onConfirm={() => settle(true)}
          onCancel={() => settle(false)}
        />
      ) : null}
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error('useDialog must be used inside a DialogProvider');
  }
  return ctx;
}
