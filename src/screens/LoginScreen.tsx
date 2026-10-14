import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {
  AppText,
  AuthHero,
  Button,
  Card,
  FormTextField,
  MessageBanner,
  Screen,
} from '../components';
import {useAuth} from '../context/AuthContext';
import type {RootScreenProps} from '../navigation/types';
import {useTheme, type Theme} from '../theme';
import {
  validateLoginIdentifier,
  validateRequiredPassword,
} from '../utils/validation';

interface LoginForm {
  identifier: string;
  password: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Centres the content vertically when it is shorter than the screen.
    content: {justifyContent: 'center', paddingVertical: theme.spacing.xl},
    card: {padding: theme.spacing.xl},
    heading: {marginBottom: theme.spacing.xs},
    subtitle: {marginBottom: theme.spacing.xl},
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.lg,
    },
  });

export default function LoginScreen({navigation}: RootScreenProps<'Login'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {login} = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: {isSubmitting},
  } = useForm<LoginForm>({
    mode: 'onTouched',
    defaultValues: {identifier: '', password: ''},
  });

  const onSubmit = async (values: LoginForm) => {
    setFormError(null);
    const result = await login(values.identifier, values.password);
    // On success the navigator switches screens automatically.
    if (!result.ok) {
      if (result.field === 'identifier' || result.field === 'password') {
        setError(result.field, {type: 'server', message: result.message});
      } else {
        setFormError(result.message);
      }
    }
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <AuthHero />

      <Card style={styles.card}>
        <AppText variant="heading" style={styles.heading}>
          Welcome back
        </AppText>
        <AppText variant="body" color="secondary" style={styles.subtitle}>
          Log in with your email or mobile number.
        </AppText>

        {formError ? <MessageBanner message={formError} /> : null}

        <FormTextField
          control={control}
          name="identifier"
          label="Email or mobile number"
          placeholder="you@example.com or 10-digit number"
          keyboardType="email-address"
          autoComplete="username"
          textContentType="username"
          returnKeyType="next"
          onSubmitEditing={() => setFocus('password')}
          rules={{validate: validateLoginIdentifier}}
        />
        <FormTextField
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          isPassword
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={() => handleSubmit(onSubmit)()}
          rules={{validate: validateRequiredPassword}}
        />

        <Button
          title="Log in"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </Card>

      <View style={styles.footer}>
        <AppText variant="body" color="secondary">
          New here?
        </AppText>
        <Button
          title="Create account"
          variant="ghost"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </Screen>
  );
}
