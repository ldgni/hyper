"use client";

import { Home, LogIn, LogOut, UserStar } from "lucide-react";
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
          <Button asChild variant="outline" size="icon">
            <Link href="/">
              <Home />
            </Link>
          </Button>
          {(session.user as { isAdmin?: boolean })?.isAdmin && (
            <Button asChild variant="outline" size="icon">
              <Link href="/admin">
                <UserStar />
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            onClick={() => signOut()}>
            <LogOut />
          </Button>
        </>
      ) : (
        <Button asChild variant="outline" size="icon">
          <Link href="/login">
            <LogIn />
          </Link>
        </Button>
      )}
      <ModeToggle />
    </nav>
  );
};

export default NavLinks;
