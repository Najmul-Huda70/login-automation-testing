import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    sessionStorage.removeItem("lastLoginPassword");
    sessionStorage.removeItem("testResults");
    router.push("/login");
  }
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur transition-colors duration-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="https://najmul-huda-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-text underline-offset-4 hover:underline
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Najmul Huda
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border
                       text-text/80 transition-colors duration-200 hover:bg-surface hover:text-fail
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
