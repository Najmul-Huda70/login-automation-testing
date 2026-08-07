import { NextRequest, NextResponse } from "next/server";

// FR-12: /dashboard requires a valid session. FR-14b: /testing-guide stays
// public and is never redirected to /login. We check for Better Auth's
// session cookie rather than calling the DB here (edge-safe, and doesn't
// block on Mongo per NFR-3). The dashboard page itself does a full session
// check server-side as the source of truth. (Next 16 renamed this file
// convention from middleware.ts to proxy.ts; the API is unchanged.)
const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIE_NAMES.some((name) =>
    request.cookies.has(name)
  );

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
