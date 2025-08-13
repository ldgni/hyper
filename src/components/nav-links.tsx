"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

type CustomSession = {
  expires: string;
  user?: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
    id?: string;
    isAdmin?: boolean;
  };
} | null;

interface NavLinksProps {
  session: CustomSession;
}

const NavLinks = ({ session }: NavLinksProps) => {
  return (
    <nav className="flex items-center gap-2">
      {session?.user ? (
        <>
          {(session.user as { isAdmin?: boolean })?.isAdmin && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground cursor-pointer">
              <Link href="/admin">Admin</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-muted-foreground hover:text-foreground cursor-pointer">
            Sign Out
          </Button>
        </>
      ) : (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground cursor-pointer">
          <Link href="/login">Login</Link>
        </Button>
      )}
      <ModeToggle />
    </nav>
  );
};

export default NavLinks;
