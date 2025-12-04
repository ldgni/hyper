import AddBookmarkDialog from "@/components/add-bookmark-dialog";
import CopyBookmarkButton from "@/components/copy-bookmark-button";
import DeleteBookmarkDialog from "@/components/delete-bookmark-dialog";
import EditBookmarkDialog from "@/components/edit-bookmark-dialog";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Bookmark {
  id: string;
  name: string;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

export default function BookmarkList({ bookmarks }: BookmarkListProps) {
  return (
    <div className="px-3">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <AddBookmarkDialog />
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-muted-foreground text-center text-sm sm:text-base">
          <p>No bookmarks yet.</p>
          <p>Add your first bookmark to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id}>
              <CardHeader>
                <CardTitle>{bookmark.name}</CardTitle>
                <CardDescription className="truncate">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    className="hover:text-foreground transition-colors">
                    {bookmark.url}
                  </a>
                </CardDescription>
                <CardAction>
                  <CopyBookmarkButton url={bookmark.url} />
                  <EditBookmarkDialog bookmark={bookmark} />
                  <DeleteBookmarkDialog
                    bookmarkId={bookmark.id}
                    bookmarkName={bookmark.name}
                  />
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
