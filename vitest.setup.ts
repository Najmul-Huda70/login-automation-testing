import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollTo; framer-motion calls it during layout
// measurement. Stub it so tests don't print spurious "not implemented" noise.
if (typeof window !== "undefined") {
  window.scrollTo = () => {};
}
