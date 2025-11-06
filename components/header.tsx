import { Archive, Github } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

import LogoutButton from "@/components/logout-button";
import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="mb-8 flex items-center justify-between">
      <nav>
        <ul className="flex gap-4">
          <li>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Archive />
              </Link>
            </Button>
          </li>
          {session && (
            <li>
              <LogoutButton />
            </li>
          )}
        </ul>
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
