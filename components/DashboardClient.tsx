"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import StatCards from "./StatCards";
import TestResultList from "./TestResultList";
import type { TestResult } from "@/lib/testRunner";

export default function DashboardClient({ email }: { email: string }) {
  // FR-16: the real password is never retrievable from the DB (Better Auth
  // hashes it) — it's captured client-side at the moment of successful
  // login and handed to the dashboard via sessionStorage, per the spec's
  // note in Section 5. This is a documented demo convenience only.
  const [password, setPassword] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    setPassword(sessionStorage.getItem("lastLoginPassword"));
    const raw = sessionStorage.getItem("testResults");
    if (raw) {
      try {
        setResults(JSON.parse(raw));
      } catch {
        setResults([]);
      }
    }
  }, []);

  const total = results.length;
  const passed = results.filter((r) => r.status === "pass").length;
  const failed = total - passed;

  return (
    <div className="min-h-screen bg-bg transition-colors duration-200">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="mb-6 rounded-lg border border-border bg-surface p-5"
        >
          <h1 className="text-lg font-semibold text-text">Welcome back</h1>
          <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-text/50">Logged in as</dt>
              <dd className="mt-0.5 font-mono text-sm text-text">{email}</dd>
            </div>
            <div>
              <dt className="text-xs text-text/50">Password used to log in</dt>
              <dd className="mt-0.5 font-mono text-sm text-text">
                {password ?? "—"}
              </dd>
            </div>
          </dl>
          {password === null && (
            <p className="mt-3 text-xs text-text/50">
              No password was captured in this browser session — sign in again via the login
              page (or run the automated test demo) to populate this field.
            </p>
          )}
        </motion.div>

        <h2 className="mb-3 text-sm font-medium text-text/70">Test summary</h2>
        <StatCards total={total} passed={passed} failed={failed} />

        <h2 className="mb-3 mt-8 text-sm font-medium text-text/70">Test results</h2>
        <TestResultList results={results} />
      </main>
    </div>
  );
}
