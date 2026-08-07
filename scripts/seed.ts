/**
 * One-time setup script (FR-4a). Provisions the single fixed demo account
 * used for all testing/demo purposes. Not a sign-up form — run manually:
 *
 *   npx tsx scripts/seed.ts
 *
 * Safe to re-run: it checks whether the account already exists first.
 */
import "dotenv/config";
import { auth } from "../lib/auth";

const DEMO_EMAIL = "contact.najmulhuda@gmail.com";
const DEMO_PASSWORD = "secrete_password";

async function main() {
  try {
    await auth.api.signUpEmail({
      body: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        name: "Najmul Huda",
      },
    });
    console.log(`Seeded demo account: ${DEMO_EMAIL}`);
  } catch (err: any) {
    if (String(err?.message ?? err).toLowerCase().includes("already")) {
      console.log("Demo account already exists — nothing to do.");
    } else {
      console.error("Failed to seed demo account:", err);
      process.exitCode = 1;
    }
  }
}

main();
