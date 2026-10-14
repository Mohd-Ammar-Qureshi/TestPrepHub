import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText, Avatar, Button, Card, Chip, Screen} from '../components';
import {useAuth} from '../context/AuthContext';
import {getCategoryById} from '../data/categories';
import type {RootScreenProps} from '../navigation/types';
import {useTheme, type Theme} from '../theme';
import {formatDate} from '../utils/format';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    back: {alignSelf: 'flex-start', paddingHorizontal: 0},
    header: {
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    title: {marginTop: theme.spacing.md},
    card: {marginBottom: theme.spacing.lg},
    row: {marginBottom: theme.spacing.lg},
    lastRow: {marginBottom: 0},
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.sm,
    },
  });

export default function StudentDetailsScreen({
  navigation,
}: RootScreenProps<'StudentDetails'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {student} = useAuth();

  if (!student) {
    return null;
  }

  const details: {label: string; value: string}[] = [
    {label: 'Full name', value: student.fullName},
    {label: 'Email address', value: student.email},
    {label: 'Mobile number', value: student.mobile},
    {label: 'Registration date', value: formatDate(student.registeredAt)},
  ];

  return (
    <Screen>
      <Button
        title="‹ Back"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.back}
      />

      <View style={styles.header}>
        <Avatar name={student.fullName} size={72} />
        <AppText variant="title" align="center" style={styles.title}>
          Student details
        </AppText>
      </View>

      <Card style={styles.card}>
        {details.map(item => (
          <View key={item.label} style={styles.row}>
            <AppText variant="caption" color="secondary">
              {item.label}
            </AppText>
            <AppText variant="body">{item.value}</AppText>
          </View>
        ))}
        <View style={styles.lastRow}>
          <AppText variant="caption" color="secondary">
            Selected categories
          </AppText>
          <View style={styles.chips}>
            {student.categories.map(id => {
              const category = getCategoryById(id);
              return category ? (
                <Chip key={id} label={`${category.emoji} ${category.name}`} />
              ) : null;
            })}
          </View>
        </View>
      </Card>

      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate('EditProfile')}
      />
    </Screen>
  );
}
