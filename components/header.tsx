import { Archive, Github } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

import ModeToggle from "@/components/mode-toggle";
import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="mb-8 flex items-center justify-between">
      <nav className="flex gap-2 sm:gap-4">
        <Button variant="ghost" asChild>
          <Link href="/">
            <Archive />
            <span className="sr-only sm:not-sr-only">Stash</span>
          </Link>
        </Button>
        {session && <SignOutButton />}
      </nav>
      <div className="flex h-4 items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a
            href="https://github.com/ldgni/stash"
            target="_blank"
            aria-label="View source on GitHub">
            <Github />
          </a>
        </Button>
        <Separator orientation="vertical" />
        <ModeToggle />
      </div>
    </header>
  );
}
