import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearSession,
  loginStudent,
  registerStudent,
  restoreSession,
  updateStudentCategories,
  updateStudentProfile,
  type UpdateProfileInput,
  type AuthResult,
  type RegisterInput,
} from '../services/authService';
import type {Student} from '../types/student';

interface AuthContextValue {
  student: Student | null;
  /** True once the saved session has been checked on app start. */
  isReady: boolean;
  register: (input: RegisterInput) => Promise<AuthResult>;
  login: (identifier: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateCategories: (categories: string[]) => Promise<AuthResult>;
  updateProfile: (input: UpdateProfileInput) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const restored = await restoreSession();
      if (active) {
        setStudent(restored);
        setIsReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const result = await registerStudent(input);
    if (result.ok) {
      setStudent(result.student);
    }
    return result;
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const result = await loginStudent(identifier, password);
    if (result.ok) {
      setStudent(result.student);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setStudent(null);
  }, []);

  const updateCategories = useCallback(
    async (categories: string[]): Promise<AuthResult> => {
      if (!student) {
        return {ok: false, message: 'You are not logged in.'};
      }
      const result = await updateStudentCategories(student.id, categories);
      if (result.ok) {
        setStudent(result.student);
      }
      return result;
    },
    [student],
  );

  const updateProfile = useCallback(
    async (input: UpdateProfileInput): Promise<AuthResult> => {
      if (!student) {
        return {ok: false, message: 'You are not logged in.'};
      }
      const result = await updateStudentProfile(student.id, input);
      if (result.ok) {
        setStudent(result.student);
      }
      return result;
    },
    [student],
  );

  const value = useMemo(
    () => ({
      student,
      isReady,
      register,
      login,
      logout,
      updateCategories,
      updateProfile,
    }),
    [
      student,
      isReady,
      register,
      login,
      logout,
      updateCategories,
      updateProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
