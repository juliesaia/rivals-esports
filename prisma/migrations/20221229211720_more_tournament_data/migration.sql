/*
  Warnings:

  - Added the required column `bannerImage` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `online` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImage` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "season" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL COLLATE NOCASE,
    "online" BOOLEAN NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL
);
INSERT INTO "new_Tournament" ("id", "name", "season", "slug") SELECT "id", "name", "season", "slug" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
CREATE UNIQUE INDEX "Tournament_slug_key" ON "Tournament"("slug");
CREATE UNIQUE INDEX "Tournament_name_key" ON "Tournament"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
