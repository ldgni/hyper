import { headers } from "next/headers";
import { Suspense } from "react";

import BookmarkForm from "@/components/bookmark-form";
import BookmarkList from "@/components/bookmark-list";
import LoginButton from "@/components/login-button";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">Stash</h1>
        <p className="text-muted-foreground mb-4">Never lose your bookmarks</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Add a bookmark</h2>
        <BookmarkForm />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your bookmarks</h2>
        <Suspense fallback={<Spinner className="mx-auto" />}>
          <BookmarkList />
        </Suspense>
      </div>
    </div>
  );
}
