"use server";

import { and, desc, eq } from "drizzle-orm";
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
  const name = formData.get("name") as string;

  if (!url || !name) {
    throw new Error("URL and name are required");
  }

  const id = crypto.randomUUID();

  await db.insert(bookmark).values({
    id,
    url,
    name,
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
    .orderBy(desc(bookmark.createdAt));

  return bookmarks;
}

// Update a bookmark
export async function updateBookmark(id: string, formData: FormData) {
  const user = await getCurrentUser();

  const url = formData.get("url") as string;
  const name = formData.get("name") as string;

  if (!url || !name) {
    throw new Error("URL and name are required");
  }

  const [updated] = await db
    .update(bookmark)
    .set({ url, name })
    .where(and(eq(bookmark.id, id), eq(bookmark.userId, user.id)))
    .returning();

  if (!updated) {
    throw new Error("Bookmark not found or unauthorized");
  }

  revalidatePath("/");
  return { success: true };
}

// Delete a bookmark
export async function deleteBookmark(id: string) {
  const user = await getCurrentUser();

  const [deleted] = await db
    .delete(bookmark)
    .where(and(eq(bookmark.id, id), eq(bookmark.userId, user.id)))
    .returning();

  if (!deleted) {
    throw new Error("Bookmark not found or unauthorized");
  }

  revalidatePath("/");
  return { success: true };
}
