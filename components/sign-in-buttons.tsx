"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignInButtons() {
  const handleGitHubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
    });
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button onClick={handleGitHubLogin} variant="outline">
        <FaGithub />
        Sign in with GitHub
      </Button>
      <Button onClick={handleGoogleLogin} variant="outline">
        <FaGoogle />
        Sign in with Google
      </Button>
    </div>
  );
}
