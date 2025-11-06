import { headers } from "next/headers";

import LoginButton from "@/components/login-button";
import LogoutButton from "@/components/logout-button";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">Stash</h1>
        <p className="text-muted-foreground mb-4">Save your favorite links</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <p>Welcome {session.user.name}!</p>
      <LogoutButton />
    </div>
  );
}
