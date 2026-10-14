import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {getAttemptsForStudent, saveAttempt} from '../services/attemptService';
import type {Attempt, TestResult} from '../types/test';
import {useAuth} from './AuthContext';

export interface AttemptStats {
  total: number;
  averagePercentage: number;
  bestPercentage: number;
}

export interface TestStats {
  attempts: number;
  bestPercentage: number;
  lastCompletedAt: string;
}

interface AttemptsContextValue {
  /** The current student's attempts, newest first. */
  attempts: Attempt[];
  isLoading: boolean;
  stats: AttemptStats;
  saveResult: (result: TestResult) => Promise<Attempt | null>;
  getTestStats: (testSeriesId: string) => TestStats | null;
}

const AttemptsContext = createContext<AttemptsContextValue | undefined>(
  undefined,
);

export function AttemptsProvider({children}: {children: React.ReactNode}) {
  const {student} = useAuth();
  const studentId = student?.id ?? null;
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setAttempts([]);
      return;
    }
    let active = true;
    setIsLoading(true);
    getAttemptsForStudent(studentId).then(list => {
      if (active) {
        setAttempts(list);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [studentId]);

  const saveResult = useCallback(
    async (result: TestResult) => {
      if (!studentId) {
        return null;
      }
      const attempt = await saveAttempt(studentId, result);
      if (attempt) {
        setAttempts(current => [attempt, ...current]);
      }
      return attempt;
    },
    [studentId],
  );

  const stats = useMemo<AttemptStats>(() => {
    if (attempts.length === 0) {
      return {total: 0, averagePercentage: 0, bestPercentage: 0};
    }
    const sum = attempts.reduce((acc, a) => acc + a.percentage, 0);
    return {
      total: attempts.length,
      averagePercentage: Math.round(sum / attempts.length),
      bestPercentage: Math.max(...attempts.map(a => a.percentage)),
    };
  }, [attempts]);

  const getTestStats = useCallback(
    (testSeriesId: string): TestStats | null => {
      const forTest = attempts.filter(a => a.testSeriesId === testSeriesId);
      if (forTest.length === 0) {
        return null;
      }
      return {
        attempts: forTest.length,
        bestPercentage: Math.max(...forTest.map(a => a.percentage)),
        lastCompletedAt: forTest[0].completedAt,
      };
    },
    [attempts],
  );

  const value = useMemo(
    () => ({attempts, isLoading, stats, saveResult, getTestStats}),
    [attempts, isLoading, stats, saveResult, getTestStats],
  );

  return (
    <AttemptsContext.Provider value={value}>
      {children}
    </AttemptsContext.Provider>
  );
}

export function useAttempts(): AttemptsContextValue {
  const ctx = useContext(AttemptsContext);
  if (!ctx) {
    throw new Error('useAttempts must be used inside an AttemptsProvider');
  }
  return ctx;
}
