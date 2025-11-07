"use client";

import { useState } from "react";
import { FiEdit2, FiExternalLink, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteBookmark, updateBookmark } from "@/db/actions";

type Bookmark = {
  id: string;
  url: string;
  title: string;
  createdAt: Date;
};

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    setShowDeleteDialog(false);
    try {
      await deleteBookmark(bookmark.id);
      toast.success("Bookmark deleted!");
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
      toast.error("Failed to delete bookmark. Please try again.");
      setIsDeleting(false);
    }
  }

  async function handleUpdate(formData: FormData) {
    try {
      await updateBookmark(bookmark.id, formData);
      setIsEditing(false);
      toast.success("Bookmark updated!");
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      toast.error("Failed to update bookmark. Please try again.");
    }
  }

  if (isEditing) {
    return (
      <div className="border-border bg-card rounded-lg border p-4">
        <form action={handleUpdate} className="space-y-3">
          <Input type="url" name="url" defaultValue={bookmark.url} required />
          <Input
            type="text"
            name="title"
            defaultValue={bookmark.title}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="group border-border bg-card rounded-lg border p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{bookmark.title}</h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 truncate text-sm">
            <span className="truncate">{bookmark.url}</span>
            <FiExternalLink className="shrink-0" size={14} />
          </a>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0">
            <FiEdit2 size={16} />
          </Button>
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                className="text-destructive hover:text-destructive h-8 w-8 p-0">
                <FiTrash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete bookmark?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  bookmark &ldquo;{bookmark.title}&rdquo;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
