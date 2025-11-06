import BookmarkCard from "@/components/bookmark-card";
import { getBookmarks } from "@/db/actions";

export default async function BookmarkList() {
  const bookmarks = await getBookmarks();

  if (bookmarks.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        <p>No bookmarks yet. Add your first one above!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
