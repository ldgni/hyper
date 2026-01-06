import CopyBookmarkButton from "@/components/copy-bookmark-button";
import DeleteBookmarkDialog from "@/components/delete-bookmark-dialog";
import EditBookmarkDialog from "@/components/edit-bookmark-dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { bookmark } from "@/db/schema";

type Bookmark = typeof bookmark.$inferSelect;

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

export default function BookmarkList({ bookmarks }: BookmarkListProps) {
  return (
    <>
      {bookmarks.length === 0 ? (
        <div className="text-muted-foreground text-center text-sm sm:text-base">
          <p>No bookmarks yet.</p>
          <p>Add your first bookmark to get started!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <Item variant="outline">
                <ItemContent className="min-w-0">
                  <ItemTitle>{bookmark.name}</ItemTitle>
                  <ItemDescription className="truncate">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      className="hover:underline">
                      {bookmark.url}
                    </a>
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <CopyBookmarkButton url={bookmark.url} />
                  <EditBookmarkDialog bookmark={bookmark} />
                  <DeleteBookmarkDialog
                    bookmarkId={bookmark.id}
                    bookmarkName={bookmark.name}
                  />
                </ItemActions>
              </Item>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
