"use client";

import { AnimatePresence, motion } from "framer-motion";
import { XCircle, Loader2 } from "lucide-react";

export default function LoadingModal({
  open,
  scenario,
  message,
}: {
  open: boolean;
  scenario: string;
  message: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="alertdialog"
          aria-modal="true"
          aria-live="assertive"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 shrink-0 text-fail" size={20} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text">{scenario}</p>
                <p className="mt-1 text-sm text-text/70">{message}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-text/50">
              <Loader2 size={14} className="animate-spin text-accent/60" />
              <span>Continuing to next test&hellip;</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
