import { headers } from "next/headers";

import BookmarkList from "@/components/bookmark-list";
import SignInButtons from "@/components/sign-in-buttons";
import { getBookmarksByUserId } from "@/db/queries/select";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const bookmarks = await getBookmarksByUserId(session.user.id);

    return <BookmarkList bookmarks={bookmarks} />;
  }

  return (
    <div className="grid place-items-center">
      <h1 className="text-4xl font-bold sm:text-6xl">Stash</h1>
      <p className="text-muted-foreground mb-4">Never lose your bookmarks</p>
      <SignInButtons />
    </div>
  );
}
