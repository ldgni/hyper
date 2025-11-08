"use client";

import { Plus } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookmark } from "@/db/actions";

export default function BookmarkForm() {
  const [, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      try {
        await createBookmark(formData);
        toast.success("Bookmark added!");
        return { success: true };
      } catch {
        toast.error("Failed to create bookmark");
        return { success: false };
      }
    },
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Example"
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          type="url"
          name="url"
          id="url"
          placeholder="https://example.com"
          required
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        <Plus />
        {isPending ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
