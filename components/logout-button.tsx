"use client";

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

  return <Button onClick={signOut}>Logout</Button>;
}
