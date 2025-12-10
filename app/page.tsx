import { headers } from "next/headers";

import AddBookmarkDialog from "@/components/add-bookmark-dialog";
import BookmarkList from "@/components/bookmark-list";
import SignInButtons from "@/components/sign-in-buttons";
import SignOutButton from "@/components/sign-out-button";
import { getBookmarksByUserId } from "@/db/queries/select";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const bookmarks = await getBookmarksByUserId(session.user.id);

    return (
      <>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
          <div className="flex gap-2">
            <AddBookmarkDialog />
            <SignOutButton />
          </div>
        </div>
        <BookmarkList bookmarks={bookmarks} />
      </>
    );
  }

  return (
    <div className="grid place-items-center gap-2">
      <h1 className="text-4xl font-bold sm:text-6xl">Hyper</h1>
      <p className="text-muted-foreground mb-2 italic">
        Never lose your bookmarks
      </p>
      <SignInButtons />
    </div>
  );
}
