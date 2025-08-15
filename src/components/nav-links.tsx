"use client";

import { Home, LogIn, LogOut, UserStar } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

import { ROUTES } from "@/lib/constants";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

interface NavLinksProps {
  session: Session | null;
}

const NavLinks = ({ session }: NavLinksProps) => {
  return (
    <nav className="flex items-center gap-2">
      {session?.user ? (
        <>
          <Button asChild variant="outline" size="icon">
            <Link href={ROUTES.HOME}>
              <Home />
            </Link>
          </Button>
          {session.user.isAdmin && (
            <Button asChild variant="outline" size="icon">
              <Link href={ROUTES.ADMIN}>
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
          <Link href={ROUTES.LOGIN}>
            <LogIn />
          </Link>
        </Button>
      )}
      <ModeToggle />
    </nav>
  );
};

export default NavLinks;
