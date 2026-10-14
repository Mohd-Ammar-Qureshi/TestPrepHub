import {useCallback} from 'react';
import {useAuth} from '../context/AuthContext';
import {useDialog} from '../context/DialogContext';

/** Returns a function that asks for confirmation, then logs out. */
export function useConfirmLogout() {
  const {logout} = useAuth();
  const {confirm} = useDialog();

  return useCallback(async () => {
    const confirmed = await confirm({
      emoji: '👋',
      title: 'Log out?',
      message: 'You will need to log in again to continue.',
      confirmLabel: 'Log out',
      cancelLabel: 'Cancel',
      destructive: true,
    });
    if (confirmed) {
      await logout();
    }
  }, [confirm, logout]);
}
