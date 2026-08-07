"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: 6 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden text-sm text-fail"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
