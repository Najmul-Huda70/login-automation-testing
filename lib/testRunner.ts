import { validateLoginForm } from "./validation";
import { authClient } from "./auth-client";

export const DEMO_EMAIL = "contact.najmulhuda@gmail.com";
export const DEMO_PASSWORD = "secrete_password";

export type TestStatus = "pending" | "pass" | "fail";

export interface TestCase {
  id: string;
  scenario: string;
  email: string;
  password: string;
}

export interface TestResult extends TestCase {
  status: TestStatus;
  message: string;
}

// TR-4: wrong/invalid cases first, valid case (T-6) last — matches the
// required on-screen demo order and Section 5's table.
export const TEST_CASES: TestCase[] = [
  { id: "T-1", scenario: "Blank email, password filled", email: "", password: DEMO_PASSWORD },
  { id: "T-2", scenario: "Blank password, email filled", email: DEMO_EMAIL, password: "" },
  { id: "T-3", scenario: "Both fields blank", email: "", password: "" },
  { id: "T-4", scenario: "Malformed email", email: "not-an-email", password: DEMO_PASSWORD },
  { id: "T-5", scenario: "Correct email, wrong password", email: DEMO_EMAIL, password: "wrong_password" },
  { id: "T-6", scenario: "Correct email and password", email: DEMO_EMAIL, password: DEMO_PASSWORD },
];

// Runs a single case: validation first (matching FR-4 — no API call if
// client-side validation fails), then, only if valid, the real Better Auth
// sign-in call. This is the same logic path the real login form uses.
export async function runTestCase(testCase: TestCase): Promise<TestResult> {
  const { id, scenario, email, password } = testCase;
  const errors = validateLoginForm({ email, password });

  if (errors.email || errors.password) {
    const message = [errors.email, errors.password].filter(Boolean).join(" ");
    // T-1..T-4 are expected to fail at validation, i.e. this IS the pass condition
    // for those scenarios; T-6 must never hit this branch.
    const expectedToFailValidation = id !== "T-6" && id !== "T-5";
    return {
      ...testCase,
      status: expectedToFailValidation ? "pass" : "fail",
      message,
    };
  }

  const { error } = await authClient.signIn.email({ email, password });

  if (error) {
    // T-5 is expected to fail authentication — that's a "pass" for the scenario.
    const expectedAuthFailure = id === "T-5";
    return {
      ...testCase,
      status: expectedAuthFailure ? "pass" : "fail",
      message: expectedAuthFailure
        ? "Invalid email or password."
        : error.message ?? "Invalid email or password.",
    };
  }

  // Successful auth — only expected/correct for T-6.
  return {
    ...testCase,
    status: id === "T-6" ? "pass" : "fail",
    message: id === "T-6" ? "Login succeeded." : "Unexpectedly succeeded.",
  };
}
