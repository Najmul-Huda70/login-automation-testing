import Link from "next/link";

export const metadata = {
  title: "Run login tests locally — Login System",
};

export default function TestingGuidePage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/login"
        className="text-sm text-accent underline-offset-4 hover:underline focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-accent rounded"
      >
        ← Back to login
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-text">Run login tests locally</h1>
      <p className="mt-2 text-sm text-text/70">
        This page is documentation only — viewing it does not run anything or require a database
        connection.
      </p>

      <ol className="mt-6 space-y-6">
        <li>
          <h2 className="font-medium text-text">1. Get the project</h2>
          <p className="mt-1 text-sm text-text/70">Open the project folder, then install dependencies:</p>
          <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-surface p-3 font-mono text-xs text-text">
npm install
          </pre>
        </li>

        <li>
          <h2 className="font-medium text-text">2. Set up environment variables</h2>
          <p className="mt-1 text-sm text-text/70">
            Copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env</code> and fill
            in the values it references.
          </p>
          <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-surface p-3 font-mono text-xs text-text">
cp .env.example .env
          </pre>
        </li>

        <li>
          <h2 className="font-medium text-text">3. Run the test suite</h2>
          <p className="mt-1 text-sm text-text/70">Single run (CI-friendly, exits non-zero on failure):</p>
          <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-surface p-3 font-mono text-xs text-text">
npm test
          </pre>
          <p className="mt-3 text-sm text-text/70">Watch mode, while iterating:</p>
          <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-surface p-3 font-mono text-xs text-text">
npm run test:watch
          </pre>
          <p className="mt-2 text-xs text-text/50">
            Tests don't need a live MongoDB connection — the auth client is mocked at the
            component-test layer, and validation logic is tested directly as pure functions.
          </p>
        </li>

        <li>
          <h2 className="font-medium text-text">4. What's covered</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text/70">
            <li>Blank email, blank password, and both blank (client-side validation, no API call)</li>
            <li>Malformed email format</li>
            <li>Correct email with a wrong password (API returns an error)</li>
            <li>Correct email and password, run last (successful login and redirect)</li>
          </ul>
        </li>
      </ol>
    </main>
  );
}
