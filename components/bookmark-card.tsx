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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Bookmark = {
  id: string;
  url: string;
  name: string;
  createdAt: Date;
};

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
      setIsEditDialogOpen(false);
      toast.success("Bookmark updated!");
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      toast.error("Failed to update bookmark. Please try again.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{bookmark.name}</CardTitle>
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
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Edit2 />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Bookmark</DialogTitle>
                <DialogDescription>
                  Update the URL and name for your bookmark.
                </DialogDescription>
              </DialogHeader>
              <form action={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium">
                    URL
                  </label>
                  <Input
                    id="url"
                    type="url"
                    name="url"
                    defaultValue={bookmark.url}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    defaultValue={bookmark.name}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                  bookmark &ldquo;{bookmark.name}&rdquo;.
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
