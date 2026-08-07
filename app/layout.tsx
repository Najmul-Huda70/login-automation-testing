import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (not fetched from Google Fonts at build time) so the build
// never depends on external network access — same principle as NFR-3 for
// the database. Variable fonts, so all weights (400/500/600/700 for Inter
// per the spec's type scale) come from one file each.
const inter = localFont({
  src: "../public/fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const jbMono = localFont({
  src: "../public/fonts/JetBrainsMono-Variable.ttf",
  variable: "--font-jbmono",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  title: "Login System",
  description: "Email + password login built with Next.js, Better Auth, and MongoDB.",
};

// Runs before paint so the correct theme class is applied immediately (no flash).
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jbMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased min-h-screen transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
