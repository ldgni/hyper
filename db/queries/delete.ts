import { eq } from "drizzle-orm";

import { db } from "@/db";
import { bookmark } from "@/db/schema";

export async function deleteBookmark(id: string) {
  return db.delete(bookmark).where(eq(bookmark.id, id)).returning();
}
