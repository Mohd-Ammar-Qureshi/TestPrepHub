import type {Attempt, TestResult} from '../types/test';
import {generateId} from '../utils/id';
import {getStoredItem, setStoredItem, STORAGE_KEYS} from '../utils/storage';

async function readAllAttempts(): Promise<Attempt[]> {
  const stored = await getStoredItem<Attempt[]>(STORAGE_KEYS.attempts);
  return Array.isArray(stored) ? stored : [];
}

/** Returns one student's attempts, newest first. */
export async function getAttemptsForStudent(
  studentId: string,
): Promise<Attempt[]> {
  const all = await readAllAttempts();
  return all
    .filter(attempt => attempt.studentId === studentId)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}

/** Saves a finished test. Returns the saved attempt, or null if saving failed. */
export async function saveAttempt(
  studentId: string,
  result: TestResult,
): Promise<Attempt | null> {
  const all = await readAllAttempts();
  const attempt: Attempt = {
    ...result,
    id: generateId(),
    studentId,
    completedAt: new Date().toISOString(),
  };
  const saved = await setStoredItem(STORAGE_KEYS.attempts, [...all, attempt]);
  return saved ? attempt : null;
}
