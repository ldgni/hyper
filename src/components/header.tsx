import { Link2 } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

import NavLinks from "./nav-links";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <div className="mb-8 flex justify-between">
      <Link href="/" className="flex items-center gap-2 text-lg font-bold">
        <Link2 />
        Hyper
      </Link>
      <NavLinks session={session} />
    </div>
  );
}
