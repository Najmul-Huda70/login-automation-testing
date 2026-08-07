"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { TestResult } from "@/lib/testRunner";

export default function TestResultList({ results }: { results: TestResult[] }) {
  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center text-sm text-text/60">
        No test results yet. Run the automated test demo from the login page to populate this list.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full min-w-[640px] border-collapse font-mono text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-border text-left text-text/50">
            <th className="px-4 py-2 font-medium">ID</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Password</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">Message</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <motion.tr
              key={r.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="border-b border-border last:border-0"
            >
              <td className="px-4 py-2 text-text/80">{r.id}</td>
              <td className="px-4 py-2 text-text/80">{r.email || "(blank)"}</td>
              <td className="px-4 py-2 text-text/80">{r.password ? "•".repeat(Math.min(r.password.length, 10)) : "(blank)"}</td>
              <td className="px-4 py-2">
                <span
                  className={
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-sans font-medium " +
                    (r.status === "pass"
                      ? "bg-success/10 text-success"
                      : "bg-fail/10 text-fail")
                  }
                >
                  {r.status === "pass" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {r.status === "pass" ? "Pass" : "Fail"}
                </span>
              </td>
              <td className="px-4 py-2 text-text/60">{r.message}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
