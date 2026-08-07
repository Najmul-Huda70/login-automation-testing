import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  // FR-12: server-side source of truth — even if the middleware's cookie
  // check were bypassed, this still blocks unauthenticated access.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return <DashboardClient email={session.user.email} />;
}
