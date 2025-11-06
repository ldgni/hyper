"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function LoginButton() {
  const signInWithGithub = async () =>
    await authClient.signIn.social({
      provider: "github",
    });

  const signInWithGoogle = async () =>
    await authClient.signIn.social({
      provider: "google",
    });

  return (
    <>
      <Button onClick={signInWithGithub}>Login with GitHub</Button>
      <Button onClick={signInWithGoogle}>Login with Google</Button>
    </>
  );
}
