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
      <>
        <p>Please log in to continue.</p>
        <LoginButton />
      </>
    );
  }

  return (
    <>
      <p>Welcome {session.user.name}!</p>
      <LogoutButton />
    </>
  );
}
