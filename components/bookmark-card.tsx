"use client";

import { Copy, Edit, Trash } from "lucide-react";
import { useActionState, useState } from "react";
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
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteBookmark, updateBookmark } from "@/db/actions";
import type { Bookmark } from "@/types";

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [, updateAction, isUpdating] = useActionState(
    async (_: unknown, formData: FormData) => {
      try {
        await updateBookmark(bookmark.id, formData);
        setIsEditDialogOpen(false);
        toast.success("Bookmark updated!");
        return { success: true };
      } catch {
        toast.error("Failed to update bookmark");
        return { success: false };
      }
    },
    null,
  );

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      toast.success("URL copied!");
    } catch {
      toast.error("Failed to copy URL");
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteBookmark(bookmark.id);
      toast.success("Bookmark deleted!");
    } catch {
      toast.error("Failed to delete bookmark");
    } finally {
      setIsDeleting(false);
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleCopyUrl}>
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Edit />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit bookmark</DialogTitle>
                <DialogDescription>
                  Update the details of your bookmark below.
                </DialogDescription>
              </DialogHeader>
              <form action={updateAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name2">Name</Label>
                  <Input
                    id="name2"
                    type="text"
                    name="name"
                    placeholder="Example"
                    defaultValue={bookmark.name}
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url2">URL</Label>
                  <Input
                    id="url2"
                    type="url"
                    name="url"
                    placeholder="https://example.com"
                    defaultValue={bookmark.url}
                    required
                    disabled={isUpdating}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash />
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
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
