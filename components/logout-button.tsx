"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();

  const signOut = async () =>
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.refresh(),
      },
    });

  return (
    <Button onClick={signOut} variant="ghost">
      <LogOut />
      <span className="sr-only sm:not-sr-only">Logout</span>
    </Button>
  );
}
