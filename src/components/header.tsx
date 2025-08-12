import { Link2 } from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <div className="mb-8 flex justify-between">
      <Link href="/" className="flex items-center gap-2 text-lg font-bold">
        <Link2 />
        Path
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground transition-colors">
          Login
        </Link>
        <ModeToggle />
      </div>
    </div>
  );
}
