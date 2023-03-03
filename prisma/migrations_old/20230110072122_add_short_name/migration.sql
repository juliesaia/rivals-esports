/*
  Warnings:

  - Added the required column `shortName` to the `League` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_League" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "iconImage" TEXT NOT NULL,
    "season" INTEGER NOT NULL
);
INSERT INTO "new_League" ("iconImage", "id", "name", "season") SELECT "iconImage", "id", "name", "season" FROM "League";
DROP TABLE "League";
ALTER TABLE "new_League" RENAME TO "League";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
