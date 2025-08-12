"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggle } from "./mode-toggle";

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2">
      <Link
        href="/admin"
        className={`${
          pathname === "/admin"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        } transition-colors`}>
        Admin
      </Link>
      <Link
        href="/login"
        className={`${
          pathname === "/login"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        } transition-colors`}>
        Login
      </Link>
      <ModeToggle />
    </nav>
  );
};

export default NavLinks;
