const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_REGEX = /^\d{10}$/;

export const normalizeEmail = (value: string): string =>
  value.trim().toLowerCase();

/** Removes spaces and dashes so "98765 43210" equals "9876543210". */
export const normalizeMobile = (value: string): string =>
  value.replace(/[\s-]/g, '');

export const isValidEmail = (value: string): boolean =>
  EMAIL_REGEX.test(normalizeEmail(value));

export const isValidMobile = (value: string): boolean =>
  MOBILE_REGEX.test(normalizeMobile(value));

// Validators return `true` when valid, or an error message string.
// This is the format React Hook Form's `validate` rule expects.
type Validator = (value: string) => true | string;

export const validateFullName: Validator = value => {
  const name = value.trim();
  if (!name) {
    return 'Full name is required';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (/\d/.test(name)) {
    return 'Name cannot contain numbers';
  }
  return true;
};

export const validateEmail: Validator = value => {
  if (!value.trim()) {
    return 'Email address is required';
  }
  return isValidEmail(value) || 'Enter a valid email address';
};

export const validateMobile: Validator = value => {
  if (!value.trim()) {
    return 'Mobile number is required';
  }
  return isValidMobile(value) || 'Enter a valid 10-digit mobile number';
};

export const validatePassword: Validator = value => {
  if (!value) {
    return 'Password is required';
  }
  if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Password must include a letter and a number';
  }
  return true;
};

export const validateLoginIdentifier: Validator = value => {
  const text = value.trim();
  if (!text) {
    return 'Email or mobile number is required';
  }
  if (text.includes('@')) {
    return isValidEmail(text) || 'Enter a valid email address';
  }
  return isValidMobile(text) || 'Enter a valid email or 10-digit mobile number';
};

export const validateRequiredPassword: Validator = value =>
  value ? true : 'Password is required';
