"use client";

import { Check, Copy, Edit, ExternalLink, Plus, Trash2 } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [deletingLinks, setDeletingLinks] = useState<Set<string>>(new Set());
  const [copiedLinks, setCopiedLinks] = useState<Set<string>>(new Set());

  const handleLinkCreated = (newLink: LinkType) => {
    setLinks([newLink, ...links]);
    setIsCreateDialogOpen(false);
  };

  const handleLinkUpdated = (updatedLink: LinkType) => {
    setLinks(
      links.map((link) => (link.id === updatedLink.id ? updatedLink : link)),
    );
    setEditingLink(null);
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

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);

      // Mark as copied
      setCopiedLinks((prev) => new Set([...prev, linkId]));

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedLinks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(linkId);
          return newSet;
        });
      }, 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold sm:text-2xl">
            Welcome{user.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-muted-foreground">Manage your bookmarks</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
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
                <DialogTitle>Add new bookmark</DialogTitle>
                <DialogDescription>
                  Save a new link to your bookmarks
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
                      <DialogTitle>Add new bookmark</DialogTitle>
                      <DialogDescription>
                        Save a new link to your bookmarks
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
              <Card key={link.id} className="relative">
                <CardHeader>
                  <div className="pr-20">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-lg">
                        {link.title}
                      </CardTitle>
                      <CardDescription className="truncate break-all">
                        {link.url}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingLink(link)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer transition duration-500 hover:scale-105">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLinkDeleted(link.id)}
                          disabled={deletingLinks.has(link.id)}
                          className="text-destructive hover:text-destructive cursor-pointer transition duration-500 hover:scale-105">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="bg-muted min-w-0 flex-1 overflow-hidden rounded p-2">
                      <code className="block truncate text-sm break-all">
                        {link.url}
                      </code>
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(link.url, link.id)}
                            className={`cursor-pointer hover:scale-105 ${
                              copiedLinks.has(link.id)
                                ? "border-green-600 text-green-600 transition-all duration-500 hover:border-green-700 hover:text-green-700"
                                : ""
                            }`}>
                            {copiedLinks.has(link.id) ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copiedLinks.has(link.id) ? "Copied!" : "Copy"}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(link.url, "_blank")}
                            className="cursor-pointer transition duration-500 hover:scale-105">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingLink}
        onOpenChange={(open) => !open && setEditingLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit bookmark</DialogTitle>
            <DialogDescription>
              Update your bookmark information
            </DialogDescription>
          </DialogHeader>
          {editingLink && (
            <LinkForm
              userId={user.id}
              initialData={{
                id: editingLink.id,
                title: editingLink.title,
                url: editingLink.url,
              }}
              onSuccess={handleLinkUpdated}
              onCancel={() => setEditingLink(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
