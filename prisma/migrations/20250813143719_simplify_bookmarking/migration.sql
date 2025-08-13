/*
  Warnings:

  - You are about to drop the column `clicks` on the `links` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `links` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `links` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_links" ("createdAt", "id", "title", "updatedAt", "url", "userId") SELECT "createdAt", "id", "title", "updatedAt", "url", "userId" FROM "links";
DROP TABLE "links";
ALTER TABLE "new_links" RENAME TO "links";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
