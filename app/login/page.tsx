"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import FieldError from "@/components/FieldError";
import LoadingModal from "@/components/LoadingModal";
import { validateLoginForm } from "@/lib/validation";
import { authClient } from "@/lib/auth-client";
import { TEST_CASES, runTestCase, type TestResult } from "@/lib/testRunner";

export default function LoginPage() {
  const router = useRouter();

  // --- Manual login form state (FR-1..FR-3, FR-5..FR-9, FR-13, FR-14) ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(undefined);

    const fieldErrors = validateLoginForm({ email, password });
    setErrors(fieldErrors);
    // FR-4: never call the auth API if client-side validation fails.
    if (fieldErrors.email || fieldErrors.password) return;

    setSubmitting(true);
    const { error } = await authClient.signIn.email({ email, password });
    setSubmitting(false);

    if (error) {
      setAuthError("Invalid email or password.");
      return;
    }

    sessionStorage.setItem("lastLoginPassword", password);
    router.push("/dashboard");
  }

  // --- Automated demo sequence (FR-17..FR-19b) ---
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [modal, setModal] = useState<{ scenario: string; message: string } | null>(null);

  const runDemo = useCallback(async () => {
    setRunning(true);
    setResults([]);
    const collected: TestResult[] = [];

    for (const testCase of TEST_CASES) {
      const result = await runTestCase(testCase);
      collected.push(result);
      setResults([...collected]);

      const isLast = testCase.id === "T-6";
      if (!isLast) {
        // FR-19b: show the failure reason briefly before continuing.
        setModal({ scenario: `${result.id} — ${result.scenario}`, message: result.message });
        await new Promise((r) => setTimeout(r, 1600));
        setModal(null);
      } else {
        // Final successful case skips the modal and goes straight through.
        sessionStorage.setItem("testResults", JSON.stringify(collected));
        sessionStorage.setItem("lastLoginPassword", testCase.password);
        router.push("/dashboard");
      }
    }
    setRunning(false);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-text">Sign in</h1>
          <p className="mt-1 text-sm text-text/60">Use your email and password to continue.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-lg border border-border bg-surface p-6"
        >
          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
              Email
            </label>
            <input
              id="email"
              type="text"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text
                         placeholder:text-text/40 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="you@example.com"
            />
            <FieldError id="email-error" message={errors.email} />
          </div>

          <div className="mb-2">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              error={errors.password}
              placeholder="••••••••"
            />
            <FieldError id="password-error" message={errors.password} />
          </div>

          <FieldError id="auth-error" message={authError} />

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white
                       transition-colors duration-200 hover:bg-accent/90 disabled:opacity-60
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <button
            type="button"
            onClick={runDemo}
            disabled={running || submitting}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-border
                       bg-bg px-4 py-2 text-sm font-medium text-text/80 transition-colors duration-200
                       hover:bg-surface disabled:opacity-60
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <PlayCircle size={16} />
            {running ? "Running test sequence…" : "Run automated test demo"}
          </button>

          {results.length > 0 && (
            <p className="mt-3 text-center text-xs text-text/50">
              {results.length} / {TEST_CASES.length} scenarios run
            </p>
          )}
        </form>

        <div className="mt-4 flex flex-col items-center gap-1.5 text-sm">
          <a
            href="/testing-guide"
            className="text-accent underline-offset-4 hover:underline focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            How to run login tests locally
          </a>
          <a
            href="https://najmul-huda-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text/50 underline-offset-4 hover:text-text/80 hover:underline
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            Built by Najmul Huda — view portfolio
          </a>
        </div>
      </motion.div>

      <LoadingModal
        open={!!modal}
        scenario={modal?.scenario ?? ""}
        message={modal?.message ?? ""}
      />
    </main>
  );
}
