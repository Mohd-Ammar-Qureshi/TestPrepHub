import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AppText,
  Avatar,
  Button,
  Card,
  MenuItem,
  Screen,
  ThemeToggle,
} from '../components';
import {useAttempts} from '../context/AttemptsContext';
import {useAuth} from '../context/AuthContext';
import {useConfirmLogout} from '../hooks/useConfirmLogout';
import type {RootScreenProps} from '../navigation/types';
import {useTheme, type Theme} from '../theme';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    back: {alignSelf: 'flex-start', paddingHorizontal: 0},
    hero: {alignItems: 'center', marginVertical: theme.spacing.lg},
    name: {marginTop: theme.spacing.md},
    // Rows supply their own padding so dividers run edge to edge.
    menuCard: {padding: 0, overflow: 'hidden', marginBottom: theme.spacing.lg},
    section: {marginBottom: theme.spacing.lg},
    sectionTitle: {marginBottom: theme.spacing.md},
  });

export default function ProfileScreen({
  navigation,
}: RootScreenProps<'Profile'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {student} = useAuth();
  const {stats} = useAttempts();
  const confirmLogout = useConfirmLogout();

  if (!student) {
    return null;
  }

  const historySubtitle =
    stats.total === 0
      ? 'No tests taken yet'
      : `${stats.total} ${stats.total === 1 ? 'test' : 'tests'} taken`;

  return (
    <Screen>
      <Button
        title="‹ Back"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.back}
      />

      <View style={styles.hero}>
        <Avatar name={student.fullName} size={80} />
        <AppText variant="title" align="center" style={styles.name}>
          {student.fullName}
        </AppText>
      </View>

      <Card style={styles.menuCard}>
        <MenuItem
          icon="👤"
          title="Student details"
          subtitle="Name, email, mobile and more"
          onPress={() => navigation.navigate('StudentDetails')}
          showDivider
        />
        <MenuItem
          icon="✏️"
          title="Edit profile"
          subtitle="Change your details and categories"
          onPress={() => navigation.navigate('EditProfile')}
          showDivider
        />
        <MenuItem
          icon="🗂️"
          title="Update categories"
          subtitle="Choose the subjects you practise"
          onPress={() =>
            navigation.navigate('CategorySelection', {mode: 'edit'})
          }
          showDivider
        />
        <MenuItem
          icon="📊"
          title="Attempt history"
          subtitle={historySubtitle}
          onPress={() => navigation.navigate('AttemptHistory')}
        />
      </Card>

      <Card style={styles.section}>
        <AppText variant="heading" style={styles.sectionTitle}>
          Appearance
        </AppText>
        <ThemeToggle />
      </Card>

      <Button title="Log out" variant="danger" onPress={confirmLogout} />
    </Screen>
  );
}
