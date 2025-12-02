import { ExternalLink } from "lucide-react";

import { AddBookmarkDialog } from "@/components/add-bookmark-dialog";
import { DeleteBookmarkDialog } from "@/components/delete-bookmark-dialog";
import { EditBookmarkDialog } from "@/components/edit-bookmark-dialog";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

export function BookmarkList({ bookmarks }: BookmarkListProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        <AddBookmarkDialog />
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          <p>No bookmarks yet.</p>
          <p className="text-sm">Add your first bookmark to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="gap-1 p-4">
              <div className="flex items-start justify-between gap-2">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 flex-1 items-center gap-1">
                  <CardTitle className="truncate group-hover:underline">
                    {bookmark.title}
                  </CardTitle>
                  <ExternalLink className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
                <div className="flex shrink-0">
                  <EditBookmarkDialog bookmark={bookmark} />
                  <DeleteBookmarkDialog
                    bookmarkId={bookmark.id}
                    bookmarkTitle={bookmark.title}
                  />
                </div>
              </div>
              <CardDescription className="truncate text-xs">
                {bookmark.url}
              </CardDescription>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
