import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {
  AppText,
  Button,
  FormTextField,
  MessageBanner,
  Screen,
} from '../components';
import {useAuth} from '../context/AuthContext';
import type {RootScreenProps} from '../navigation/types';
import {useTheme, type Theme} from '../theme';
import {
  validateEmail,
  validateFullName,
  validateMobile,
  validatePassword,
} from '../utils/validation';

interface RegisterForm {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {marginTop: theme.spacing.lg, marginBottom: theme.spacing.xl},
    subtitle: {marginTop: theme.spacing.xs},
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.md,
    },
  });

export default function RegisterScreen({
  navigation,
}: RootScreenProps<'Register'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {register} = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    getValues,
    formState: {isSubmitting},
  } = useForm<RegisterForm>({
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterForm) => {
    setFormError(null);
    const result = await register({
      fullName: values.fullName,
      email: values.email,
      mobile: values.mobile,
      password: values.password,
    });
    // On success the navigator switches screens automatically.
    if (!result.ok) {
      if (result.field === 'email' || result.field === 'mobile') {
        setError(result.field, {type: 'server', message: result.message});
        setFocus(result.field);
      } else {
        setFormError(result.message);
      }
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="title">Create account</AppText>
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          Register to start practising with test series.
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
        textContentType="name"
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
        textContentType="emailAddress"
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
        textContentType="telephoneNumber"
        maxLength={15}
        returnKeyType="next"
        onSubmitEditing={() => setFocus('password')}
        rules={{validate: validateMobile}}
      />
      <FormTextField
        control={control}
        name="password"
        label="Password"
        placeholder="Create a password"
        helperText="At least 8 characters, with a letter and a number"
        isPassword
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('confirmPassword')}
        rules={{validate: validatePassword, deps: ['confirmPassword']}}
      />
      <FormTextField
        control={control}
        name="confirmPassword"
        label="Confirm password"
        placeholder="Re-enter your password"
        isPassword
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={() => handleSubmit(onSubmit)()}
        rules={{
          validate: value => {
            if (!value) {
              return 'Please confirm your password';
            }
            return value === getValues('password') || 'Passwords do not match';
          },
        }}
      />

      <Button
        title="Register"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />

      <View style={styles.footer}>
        <AppText variant="body" color="secondary">
          Already have an account?
        </AppText>
        <Button
          title="Log in"
          variant="ghost"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </Screen>
  );
}
