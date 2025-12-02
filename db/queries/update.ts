import { eq } from "drizzle-orm";

import { db } from "@/db";
import { bookmark } from "@/db/schema";

export type UpdateBookmark = Partial<
  Omit<typeof bookmark.$inferInsert, "id" | "userId" | "createdAt">
>;

export async function updateBookmark(id: string, data: UpdateBookmark) {
  return db.update(bookmark).set(data).where(eq(bookmark.id, id)).returning();
}
