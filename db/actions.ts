"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db/drizzle";
import { bookmark } from "@/db/schema";
import { auth } from "@/lib/auth";

// Helper to get current user
async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

// Create a new bookmark
export async function createBookmark(formData: FormData) {
  const user = await getCurrentUser();

  const url = formData.get("url") as string;
  const title = formData.get("title") as string;

  if (!url || !title) {
    throw new Error("URL and title are required");
  }

  const id = crypto.randomUUID();

  await db.insert(bookmark).values({
    id,
    url,
    title,
    userId: user.id,
  });

  revalidatePath("/");
  return { success: true };
}

// Get all bookmarks for current user
export async function getBookmarks() {
  const user = await getCurrentUser();

  const bookmarks = await db
    .select()
    .from(bookmark)
    .where(eq(bookmark.userId, user.id))
    .orderBy(bookmark.createdAt);

  return bookmarks;
}

// Update a bookmark
export async function updateBookmark(id: string, formData: FormData) {
  const user = await getCurrentUser();

  const url = formData.get("url") as string;
  const title = formData.get("title") as string;

  if (!url || !title) {
    throw new Error("URL and title are required");
  }

  // Verify the bookmark belongs to the user
  const existingBookmark = await db
    .select()
    .from(bookmark)
    .where(eq(bookmark.id, id))
    .limit(1);

  if (!existingBookmark.length || existingBookmark[0].userId !== user.id) {
    throw new Error("Bookmark not found or unauthorized");
  }

  await db.update(bookmark).set({ url, title }).where(eq(bookmark.id, id));

  revalidatePath("/");
  return { success: true };
}

// Delete a bookmark
export async function deleteBookmark(id: string) {
  const user = await getCurrentUser();

  // Verify the bookmark belongs to the user
  const existingBookmark = await db
    .select()
    .from(bookmark)
    .where(eq(bookmark.id, id))
    .limit(1);

  if (!existingBookmark.length || existingBookmark[0].userId !== user.id) {
    throw new Error("Bookmark not found or unauthorized");
  }

  await db.delete(bookmark).where(eq(bookmark.id, id));

  revalidatePath("/");
  return { success: true };
}
