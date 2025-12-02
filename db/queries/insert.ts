import { db } from "@/db";
import { bookmark } from "@/db/schema";

export type NewBookmark = typeof bookmark.$inferInsert;

export async function insertBookmark(data: NewBookmark) {
  return db.insert(bookmark).values(data).returning();
}
