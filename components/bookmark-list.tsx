import BookmarkCard from "@/components/bookmark-card";
import { getBookmarks } from "@/db/actions";

export default async function BookmarkList() {
  const bookmarks = await getBookmarks();

  if (bookmarks.length === 0) {
    return (
      <p className="text-muted-foreground text-center">
        No bookmarks yet. Add your first one above!
      </p>
    );
  }

  return (
    <div className="grid items-start gap-4 sm:grid-cols-2">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
