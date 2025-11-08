"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookmark } from "@/db/actions";

export default function BookmarkForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    try {
      await createBookmark(formData);
      formRef.current?.reset();
      toast.success("Bookmark added!");
    } catch (error) {
      console.error("Failed to create bookmark:", error);
      toast.error("Failed to create bookmark. Please try again.");
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name2">Name</Label>
        <Input
          type="text"
          name="name"
          id="name2"
          placeholder="Example"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url2">URL</Label>
        <Input
          type="url"
          name="url"
          id="url2"
          placeholder="https://example.com"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        <Plus />
      </Button>
    </form>
  );
}
