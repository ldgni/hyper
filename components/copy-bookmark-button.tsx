"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CopyBookmarkButtonProps {
  url: string;
}

export default function CopyBookmarkButton({ url }: CopyBookmarkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  }

  return (
    <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
      {copied ? <Check /> : <Copy />}
      <span className="sr-only">Copy URL</span>
    </Button>
  );
}
