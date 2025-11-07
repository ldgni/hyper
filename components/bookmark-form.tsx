"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <Input type="url" name="url" placeholder="https://example.com" required />
      <Input type="text" name="title" placeholder="Example" required />
      <Button type="submit" className="w-full">
        <Plus />
      </Button>
    </form>
  );
}
