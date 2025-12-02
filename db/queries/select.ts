import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { bookmark } from "@/db/schema";

export async function getBookmarksByUserId(userId: string) {
  return db
    .select()
    .from(bookmark)
    .where(eq(bookmark.userId, userId))
    .orderBy(desc(bookmark.createdAt));
}

export async function getBookmarkById(id: string) {
  const results = await db
    .select()
    .from(bookmark)
    .where(eq(bookmark.id, id))
    .limit(1);
  return results[0] ?? null;
}
