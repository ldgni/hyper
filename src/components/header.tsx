import { Link2 } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="mb-8 flex justify-between">
      <Link href="/" className="flex items-center gap-2 text-lg font-bold">
        <Link2 />
        Path
      </Link>
      <Link href="/auth/login">Login</Link>
    </div>
  );
}
