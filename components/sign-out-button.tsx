"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.refresh();
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSignOut} variant="outline" disabled={isLoading}>
      {isLoading ? <Loader2 className="animate-spin" /> : <LogOut />}
      <span className="sr-only sm:not-sr-only">Sign out</span>
    </Button>
  );
}
