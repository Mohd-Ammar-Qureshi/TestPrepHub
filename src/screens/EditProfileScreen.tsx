import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {
  AppText,
  Button,
  CategoryChipPicker,
  FormTextField,
  MessageBanner,
  Screen,
} from '../components';
import {useAuth} from '../context/AuthContext';
import {useDialog} from '../context/DialogContext';
import type {RootScreenProps} from '../navigation/types';
import {useTheme, type Theme} from '../theme';
import {
  validateEmail,
  validateFullName,
  validateMobile,
} from '../utils/validation';

interface EditProfileForm {
  fullName: string;
  email: string;
  mobile: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    back: {alignSelf: 'flex-start', paddingHorizontal: 0},
    header: {marginTop: theme.spacing.md, marginBottom: theme.spacing.xl},
    subtitle: {marginTop: theme.spacing.xs},
    categories: {marginBottom: theme.spacing.xl},
    label: {marginBottom: theme.spacing.sm},
    error: {marginTop: theme.spacing.xs},
  });

export default function EditProfileScreen({
  navigation,
}: RootScreenProps<'EditProfile'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {student, updateProfile} = useAuth();
  const {notify} = useDialog();

  const [categories, setCategories] = useState<string[]>(
    student?.categories ?? [],
  );
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: {isSubmitting, isDirty},
  } = useForm<EditProfileForm>({
    mode: 'onTouched',
    defaultValues: {
      fullName: student?.fullName ?? '',
      email: student?.email ?? '',
      mobile: student?.mobile ?? '',
    },
  });

  if (!student) {
    return null;
  }

  const categoriesChanged =
    categories.length !== student.categories.length ||
    categories.some(id => !student.categories.includes(id));
  const noCategories = categories.length === 0;
  const canSave = (isDirty || categoriesChanged) && !noCategories;

  const toggleCategory = (id: string) => {
    setFormError(null);
    setCategories(current =>
      current.includes(id) ? current.filter(c => c !== id) : [...current, id],
    );
  };

  const onSubmit = async (values: EditProfileForm) => {
    if (noCategories) {
      return;
    }
    setFormError(null);
    const result = await updateProfile({...values, categories});
    if (!result.ok) {
      if (result.field === 'email' || result.field === 'mobile') {
        setError(result.field, {type: 'server', message: result.message});
        setFocus(result.field);
      } else {
        setFormError(result.message);
      }
      return;
    }
    await notify({
      emoji: '✅',
      title: 'Profile updated',
      message: 'Your changes have been saved.',
      okLabel: 'OK',
    });
    navigation.goBack();
  };

  return (
    <Screen>
      <Button
        title="‹ Back"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.back}
      />

      <View style={styles.header}>
        <AppText variant="title">Edit profile</AppText>
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          Update your details and categories.
        </AppText>
      </View>

      {formError ? <MessageBanner message={formError} /> : null}

      <FormTextField
        control={control}
        name="fullName"
        label="Full name"
        placeholder="Your full name"
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('email')}
        rules={{validate: validateFullName}}
      />
      <FormTextField
        control={control}
        name="email"
        label="Email address"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('mobile')}
        rules={{validate: validateEmail}}
      />
      <FormTextField
        control={control}
        name="mobile"
        label="Mobile number"
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        autoComplete="tel"
        maxLength={15}
        returnKeyType="done"
        onSubmitEditing={() => handleSubmit(onSubmit)()}
        rules={{validate: validateMobile}}
      />

      <View style={styles.categories}>
        <AppText variant="label" style={styles.label}>
          Selected categories
        </AppText>
        <CategoryChipPicker
          selectedIds={categories}
          onToggle={toggleCategory}
        />
        {noCategories ? (
          <AppText variant="caption" color="error" style={styles.error}>
            Select at least one category
          </AppText>
        ) : null}
      </View>

      <Button
        title="Save changes"
        disabled={!canSave}
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </Screen>
  );
}
