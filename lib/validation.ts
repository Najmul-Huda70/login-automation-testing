// Pure, framework-independent validation logic (FR-9).
// No React, no DOM — safe to unit test in isolation.

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

// Simple, pragmatic email shape check — not a full RFC 5322 validator,
// which is intentionally out of scope here.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (trimmed.length === 0) return "Email is required.";
  if (!EMAIL_RE.test(trimmed)) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (password.length === 0) return "Password is required.";
  return undefined;
}

// FR-5, FR-6, FR-7, FR-8: validates both fields and returns all applicable
// errors at once so blank-email + blank-password can be shown simultaneously.
export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function isLoginFormValid(values: LoginFormValues): boolean {
  const errors = validateLoginForm(values);
  return Object.keys(errors).length === 0;
}
