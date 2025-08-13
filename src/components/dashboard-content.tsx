"use client";

import { Copy, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { LinkForm } from "@/components/link-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LinkType {
  id: string;
  userId: string;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardContentProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  links: LinkType[];
}

export function DashboardContent({
  user,
  links: initialLinks,
}: DashboardContentProps) {
  const [links, setLinks] = useState(initialLinks);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deletingLinks, setDeletingLinks] = useState<Set<string>>(new Set());

  const handleLinkCreated = (newLink: LinkType) => {
    setLinks([newLink, ...links]);
    setIsCreateDialogOpen(false);
  };

  const handleLinkDeleted = async (linkId: string) => {
    setDeletingLinks((prev) => new Set([...prev, linkId]));

    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to delete link:", data.error);
        return;
      }

      // Remove the link from the local state
      setLinks(links.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setDeletingLinks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(linkId);
        return newSet;
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You might want to show a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome{user.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-muted-foreground">Manage your bookmarks</p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Bookmark</DialogTitle>
                <DialogDescription>
                  Save a new link to your bookmarks.
                </DialogDescription>
              </DialogHeader>
              <LinkForm
                userId={user.id}
                onSuccess={handleLinkCreated}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Bookmarks</h2>
        {links.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-medium">No bookmarks yet</h3>
                <p className="text-muted-foreground mb-4">
                  Save your first link to get started.
                </p>
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Bookmark</DialogTitle>
                      <DialogDescription>
                        Save a new link to your bookmarks.
                      </DialogDescription>
                    </DialogHeader>
                    <LinkForm
                      userId={user.id}
                      onSuccess={handleLinkCreated}
                      onCancel={() => setIsCreateDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-lg">
                        {link.title}
                      </CardTitle>
                      <CardDescription className="truncate">
                        {link.url}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLinkDeleted(link.id)}
                      disabled={deletingLinks.has(link.id)}
                      className="text-destructive hover:text-destructive flex-shrink-0 cursor-pointer">
                      <Trash2 />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted min-w-0 flex-1 rounded p-2">
                      <code className="block truncate text-sm">{link.url}</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(link.url)}
                      className="cursor-pointer">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(link.url, "_blank")}
                      className="cursor-pointer">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
