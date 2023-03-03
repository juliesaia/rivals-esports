/*
  Warnings:

  - You are about to drop the column `startAt` on the `OnlineTournament` table. All the data in the column will be lost.
  - Added the required column `startAtISO` to the `OnlineTournament` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OnlineTournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT,
    "startAtISO" TEXT NOT NULL,
    "repeats" TEXT,
    "prize" TEXT,
    "discordUrl" TEXT NOT NULL,
    "region" TEXT
);
INSERT INTO "new_OnlineTournament" ("discordUrl", "id", "imageUrl", "prize", "region", "repeats") SELECT "discordUrl", "id", "imageUrl", "prize", "region", "repeats" FROM "OnlineTournament";
DROP TABLE "OnlineTournament";
ALTER TABLE "new_OnlineTournament" RENAME TO "OnlineTournament";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
