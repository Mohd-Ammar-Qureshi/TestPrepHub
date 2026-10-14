import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AppText,
  Button,
  CategoryCard,
  MessageBanner,
  Screen,
} from '../components';
import {useAuth} from '../context/AuthContext';
import {CATEGORIES} from '../data/categories';
import {useConfirmLogout} from '../hooks/useConfirmLogout';
import type {RootScreenProps} from '../navigation/types';
import {useTheme, type Theme} from '../theme';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {marginTop: theme.spacing.lg, marginBottom: theme.spacing.lg},
    subtitle: {marginTop: theme.spacing.xs},
    back: {alignSelf: 'flex-start', paddingHorizontal: 0},
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    counter: {marginBottom: theme.spacing.md},
    hint: {marginBottom: theme.spacing.md},
    secondary: {marginTop: theme.spacing.sm},
  });

type CategoryScreenProps =
  RootScreenProps<'CategorySetup'> | RootScreenProps<'CategorySelection'>;

export default function CategorySelectionScreen({
  navigation,
  route,
}: CategoryScreenProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {student, updateCategories} = useAuth();
  const confirmLogout = useConfirmLogout();

  const isOnboarding = route.name === 'CategorySetup';
  const [selected, setSelected] = useState<string[]>(student?.categories ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setError(null);
    setSelected(current =>
      current.includes(id) ? current.filter(c => c !== id) : [...current, id],
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      return;
    }
    setSaving(true);
    setError(null);
    const result = await updateCategories(selected);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    // Onboarding: the navigator switches to Home automatically once saved.
    if (!isOnboarding) {
      navigation.goBack();
    }
  };

  return (
    <Screen>
      {!isOnboarding ? (
        <Button
          title="‹ Back"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={styles.back}
        />
      ) : null}

      <View style={styles.header}>
        <AppText variant="title">
          {isOnboarding ? 'Choose your categories' : 'Update categories'}
        </AppText>
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          Pick one or more subjects. We'll show test series that match.
        </AppText>
      </View>

      {error ? <MessageBanner message={error} /> : null}

      <AppText variant="label" color="secondary" style={styles.counter}>
        {selected.length} of {CATEGORIES.length} selected
      </AppText>

      <View style={styles.grid}>
        {CATEGORIES.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            selected={selected.includes(category.id)}
            onToggle={toggle}
          />
        ))}
      </View>

      {selected.length === 0 ? (
        <AppText variant="caption" color="secondary" style={styles.hint}>
          Select at least one category to continue.
        </AppText>
      ) : null}

      <Button
        title={isOnboarding ? 'Continue' : 'Save changes'}
        disabled={selected.length === 0}
        loading={saving}
        onPress={handleSave}
      />

      {isOnboarding ? (
        <Button
          title="Log out"
          variant="ghost"
          onPress={confirmLogout}
          style={styles.secondary}
        />
      ) : null}
    </Screen>
  );
}
