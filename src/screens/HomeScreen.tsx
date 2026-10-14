import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AppLogo,
  AppText,
  Avatar,
  Button,
  Card,
  FilterChips,
  Screen,
  StatusView,
  TestSeriesCard,
  TestSeriesCardSkeleton,
  type FilterOption,
} from '../components';
import {useAttempts} from '../context/AttemptsContext';
import {APP_NAME} from '../constants/app';
import {useAuth} from '../context/AuthContext';
import {getCategoryById} from '../data/categories';
import {useTestSeries} from '../hooks/useTestSeries';
import type {RootScreenProps} from '../navigation/types';
import {useTheme, type Theme} from '../theme';

const ALL_FILTER = 'all';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    brand: {flexDirection: 'row', alignItems: 'center', flex: 1},
    brandName: {marginLeft: theme.spacing.md, flexShrink: 1},
    editRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    count: {marginVertical: theme.spacing.md},
    progressCard: {marginBottom: theme.spacing.lg},
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });

export default function HomeScreen({navigation}: RootScreenProps<'Home'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {student} = useAuth();
  const {stats, getTestStats} = useAttempts();

  const categoryIds = student?.categories ?? [];
  const {status, data, retry} = useTestSeries(categoryIds);
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);

  // If the selected categories change, drop a filter that no longer exists.
  useEffect(() => {
    if (activeFilter !== ALL_FILTER && !categoryIds.includes(activeFilter)) {
      setActiveFilter(ALL_FILTER);
    }
  }, [activeFilter, categoryIds]);

  const filterOptions: FilterOption[] = useMemo(
    () => [
      {id: ALL_FILTER, label: 'All'},
      ...categoryIds.flatMap(id => {
        const category = getCategoryById(id);
        return category
          ? [{id, label: `${category.emoji} ${category.name}`}]
          : [];
      }),
    ],
    // categoryIds is rebuilt each render; its content is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryIds.join(',')],
  );

  const visible = useMemo(
    () =>
      activeFilter === ALL_FILTER
        ? data
        : data.filter(item => item.categoryId === activeFilter),
    [data, activeFilter],
  );

  const openDetails = (testSeriesId: string) =>
    navigation.navigate('TestSeriesDetails', {testSeriesId});

  const openCategories = () =>
    navigation.navigate('CategorySelection', {mode: 'edit'});

  if (!student) {
    return null;
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.brand}>
          <AppLogo size={40} />
          <AppText
            variant="heading"
            accessibilityRole="header"
            style={styles.brandName}>
            {APP_NAME}
          </AppText>
        </View>
        <Avatar
          name={student.fullName}
          onPress={() => navigation.navigate('Profile')}
          accessibilityLabel="Open profile"
        />
      </View>

      {stats.total > 0 ? (
        <Card style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View>
              <AppText variant="label">Your progress</AppText>
              <AppText variant="caption" color="secondary">
                {stats.total} {stats.total === 1 ? 'test' : 'tests'} taken •
                Average {stats.averagePercentage}%
              </AppText>
            </View>
            <Button
              title="History"
              variant="secondary"
              onPress={() => navigation.navigate('AttemptHistory')}
            />
          </View>
        </Card>
      ) : null}

      <View style={styles.editRow}>
        <AppText variant="label" color="secondary">
          Your categories
        </AppText>
        <Button
          title="Edit"
          variant="ghost"
          onPress={openCategories}
          accessibilityLabel="Edit categories"
        />
      </View>
      <FilterChips
        options={filterOptions}
        activeId={activeFilter}
        onChange={setActiveFilter}
      />

      {status === 'loading' ? (
        <View
          accessible
          accessibilityLabel="Loading test series"
          accessibilityLiveRegion="polite">
          <TestSeriesCardSkeleton />
          <TestSeriesCardSkeleton />
        </View>
      ) : status === 'error' ? (
        <StatusView
          emoji="⚠️"
          title="Something went wrong"
          message="We couldn't load the test series. Please try again."
          actionLabel="Try again"
          onAction={retry}
        />
      ) : visible.length === 0 ? (
        <StatusView
          emoji="📭"
          title="No test series available"
          message="There are no test series for your selected categories yet. Try choosing more categories."
          actionLabel="Update categories"
          onAction={openCategories}
        />
      ) : (
        <>
          <AppText variant="label" color="secondary" style={styles.count}>
            {visible.length} test series available
          </AppText>
          {visible.map(item => (
            <TestSeriesCard
              key={item.id}
              testSeries={item}
              onPress={openDetails}
              progress={getTestStats(item.id) ?? undefined}
            />
          ))}
        </>
      )}
    </Screen>
  );
}
