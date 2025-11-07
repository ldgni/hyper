"use client";

import { Copy, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteBookmark, updateBookmark } from "@/db/actions";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
  const [isCopied, setIsCopied] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      setIsCopied(true);
      setShowCopyTooltip(true);
      setTimeout(() => {
        setIsCopied(false);
        setShowCopyTooltip(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Failed to copy URL. Please try again.");
    }
  }

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
      <Card>
        <CardContent>
          <form action={handleUpdate} className="space-y-4">
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{bookmark.title}</CardTitle>
        <CardDescription className="truncate">
          <a
            href={bookmark.url}
            target="_blank"
            className="hover:text-primary transition-colors">
            {bookmark.url}
          </a>
        </CardDescription>
        <CardAction>
          <Tooltip open={showCopyTooltip} onOpenChange={setShowCopyTooltip}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleCopyUrl}>
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isCopied ? "Copied!" : "Copy"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}>
                <Edit2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={isDeleting}>
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
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
        </CardAction>
      </CardHeader>
    </Card>
  );
}
