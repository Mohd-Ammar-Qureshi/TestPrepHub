/** Student data exposed to the app (never includes the password). */
export interface Student {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  /** ISO date string set at registration. */
  registeredAt: string;
  /** Selected category ids. Filled in by the Category Selection screen. */
  categories: string[];
}

/**
 * Shape saved in AsyncStorage. DEMO ONLY: the password is stored as plain
 * text because this app has no backend. Do not treat this as secure auth.
 */
export interface StoredStudent extends Student {
  password: string;
}

export interface StudentSession {
  studentId: string;
}
