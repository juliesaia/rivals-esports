/*
  Warnings:

  - You are about to drop the column `platform` on the `OnlineTournament` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `OnlineTournament` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OnlineTournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT,
    "startAt" INTEGER NOT NULL,
    "repeats" TEXT,
    "prize" TEXT,
    "discordUrl" TEXT NOT NULL,
    "region" TEXT
);
INSERT INTO "new_OnlineTournament" ("discordUrl", "id", "prize", "region", "repeats", "startAt") SELECT "discordUrl", "id", "prize", "region", "repeats", "startAt" FROM "OnlineTournament";
DROP TABLE "OnlineTournament";
ALTER TABLE "new_OnlineTournament" RENAME TO "OnlineTournament";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
