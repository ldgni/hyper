"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";

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
    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
      <Button onClick={signInWithGithub}>
        <FaGithub />
        Login with GitHub
      </Button>
      <Button onClick={signInWithGoogle}>
        <FaGoogle />
        Login with Google
      </Button>
    </div>
  );
}
