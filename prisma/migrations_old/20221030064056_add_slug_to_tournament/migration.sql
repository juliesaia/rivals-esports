/*
  Warnings:

  - Added the required column `slug` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "season" INTEGER NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_Tournament" ("id", "season") SELECT "id", "season" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
