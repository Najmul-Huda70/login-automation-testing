"use client";

import { motion } from "framer-motion";
import { ListChecks, CheckCircle2, XCircle } from "lucide-react";

export default function StatCards({
  total,
  passed,
  failed,
}: {
  total: number;
  passed: number;
  failed: number;
}) {
  const stats = [
    { label: "Total tests", value: total, icon: ListChecks, tone: "text-text" },
    { label: "Passed", value: passed, icon: CheckCircle2, tone: "text-success" },
    { label: "Failed", value: failed, icon: XCircle, tone: "text-fail" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: i * 0.06 }}
          className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4"
        >
          <stat.icon className={stat.tone} size={22} />
          <div>
            <p className="text-2xl font-semibold text-text">{stat.value}</p>
            <p className="text-xs text-text/60">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
