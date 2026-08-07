"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// Theme preference is intentionally NOT persisted beyond localStorage-driven
// paint-avoidance; per Section 6 "Out of Scope", cross-session persistence
// of theme/test-run history is not required in this version. We still read/
// write localStorage purely to avoid a flash of the wrong theme on load.
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border
                 text-text/80 transition-colors duration-200 hover:bg-surface
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
