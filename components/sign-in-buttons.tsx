"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignInButtons() {
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setIsGitHubLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
      });
    } finally {
      setIsGitHubLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        onClick={handleGitHubLogin}
        variant="outline"
        disabled={isGitHubLoading || isGoogleLoading}>
        {isGitHubLoading ? <Loader2 className="animate-spin" /> : <FaGithub />}
        Sign in with GitHub
      </Button>
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        disabled={isGitHubLoading || isGoogleLoading}>
        {isGoogleLoading ? <Loader2 className="animate-spin" /> : <FaGoogle />}
        Sign in with Google
      </Button>
    </div>
  );
}
