import {sanitizeCategoryIds} from '../data/categories';
import type {Student, StoredStudent, StudentSession} from '../types/student';
import {
  getStoredItem,
  removeStoredItem,
  setStoredItem,
  STORAGE_KEYS,
} from '../utils/storage';
import {generateId} from '../utils/id';
import {
  isValidEmail,
  normalizeEmail,
  normalizeMobile,
} from '../utils/validation';

export interface RegisterInput {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}

export type AuthField = 'email' | 'mobile' | 'identifier' | 'password';

export type AuthResult =
  | {ok: true; student: Student}
  | {ok: false; message: string; field?: AuthField};

const SAVE_ERROR = 'Could not save your details. Please try again.';

async function readStudents(): Promise<StoredStudent[]> {
  const students = await getStoredItem<StoredStudent[]>(STORAGE_KEYS.students);
  return Array.isArray(students) ? students : [];
}

/** Removes the password before a student is handed to the UI. */
function toPublicStudent({
  password: _password,
  ...student
}: StoredStudent): Student {
  return student;
}

export async function registerStudent(
  input: RegisterInput,
): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  const mobile = normalizeMobile(input.mobile);
  const students = await readStudents();

  if (students.some(s => s.email === email)) {
    return {
      ok: false,
      field: 'email',
      message: 'An account with this email already exists',
    };
  }
  if (students.some(s => s.mobile === mobile)) {
    return {
      ok: false,
      field: 'mobile',
      message: 'An account with this mobile number already exists',
    };
  }

  const newStudent: StoredStudent = {
    id: generateId(),
    fullName: input.fullName.trim(),
    email,
    mobile,
    password: input.password,
    registeredAt: new Date().toISOString(),
    categories: [],
  };

  const saved = await setStoredItem(STORAGE_KEYS.students, [
    ...students,
    newStudent,
  ]);
  if (!saved) {
    return {ok: false, message: SAVE_ERROR};
  }

  const sessionSaved = await saveSession(newStudent.id);
  if (!sessionSaved) {
    return {ok: false, message: SAVE_ERROR};
  }
  return {ok: true, student: toPublicStudent(newStudent)};
}

export async function loginStudent(
  identifier: string,
  password: string,
): Promise<AuthResult> {
  const text = identifier.trim();
  const students = await readStudents();

  const match = isValidEmail(text)
    ? students.find(s => s.email === normalizeEmail(text))
    : students.find(s => s.mobile === normalizeMobile(text));

  if (!match) {
    return {
      ok: false,
      field: 'identifier',
      message: 'No account found with this email or mobile number',
    };
  }
  if (match.password !== password) {
    return {
      ok: false,
      field: 'password',
      message: 'Incorrect password. Please try again.',
    };
  }

  const sessionSaved = await saveSession(match.id);
  if (!sessionSaved) {
    return {ok: false, message: SAVE_ERROR};
  }
  return {ok: true, student: toPublicStudent(match)};
}

export function saveSession(studentId: string): Promise<boolean> {
  const session: StudentSession = {studentId};
  return setStoredItem(STORAGE_KEYS.session, session);
}

export function clearSession(): Promise<void> {
  return removeStoredItem(STORAGE_KEYS.session);
}

/** Returns the logged-in student saved on this device, or null. */
export async function restoreSession(): Promise<Student | null> {
  const session = await getStoredItem<StudentSession>(STORAGE_KEYS.session);
  if (!session?.studentId) {
    return null;
  }
  const students = await readStudents();
  const match = students.find(s => s.id === session.studentId);
  if (!match) {
    await clearSession();
    return null;
  }
  return toPublicStudent(match);
}

export async function updateStudentCategories(
  studentId: string,
  categories: string[],
): Promise<AuthResult> {
  const students = await readStudents();
  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) {
    return {ok: false, message: 'Student account not found.'};
  }

  const updated: StoredStudent = {
    ...students[index],
    categories: sanitizeCategoryIds(categories),
  };
  const next = [...students];
  next[index] = updated;

  const saved = await setStoredItem(STORAGE_KEYS.students, next);
  if (!saved) {
    return {ok: false, message: SAVE_ERROR};
  }
  return {ok: true, student: toPublicStudent(updated)};
}

export interface UpdateProfileInput {
  fullName: string;
  email: string;
  mobile: string;
  categories: string[];
}

export async function updateStudentProfile(
  studentId: string,
  input: UpdateProfileInput,
): Promise<AuthResult> {
  const students = await readStudents();
  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) {
    return {ok: false, message: 'Student account not found.'};
  }

  const email = normalizeEmail(input.email);
  const mobile = normalizeMobile(input.mobile);
  const others = students.filter(s => s.id !== studentId);

  if (others.some(s => s.email === email)) {
    return {
      ok: false,
      field: 'email',
      message: 'Another account already uses this email',
    };
  }
  if (others.some(s => s.mobile === mobile)) {
    return {
      ok: false,
      field: 'mobile',
      message: 'Another account already uses this mobile number',
    };
  }

  const updated: StoredStudent = {
    ...students[index],
    fullName: input.fullName.trim(),
    email,
    mobile,
    categories: sanitizeCategoryIds(input.categories),
  };
  const next = [...students];
  next[index] = updated;

  const saved = await setStoredItem(STORAGE_KEYS.students, next);
  if (!saved) {
    return {ok: false, message: SAVE_ERROR};
  }
  return {ok: true, student: toPublicStudent(updated)};
}
