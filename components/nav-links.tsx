"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex gap-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Button
              variant="ghost"
              asChild
              className={pathname === item.href ? "bg-accent" : ""}>
              <Link href={item.href}>
                <item.icon />
                {item.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
