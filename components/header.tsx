import { Github } from "lucide-react";

import ModeToggle from "@/components/mode-toggle";
import NavLinks from "@/components/nav-links";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <NavLinks />
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
