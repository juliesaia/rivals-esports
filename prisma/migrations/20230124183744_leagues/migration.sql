/*
  Warnings:

  - You are about to drop the column `rank` on the `Ranking` table. All the data in the column will be lost.
  - You are about to drop the column `top50` on the `Ranking` table. All the data in the column will be lost.
  - Added the required column `ranking` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "ranking" INTEGER NOT NULL,
    "rankingPeriod" INTEGER,
    "points" INTEGER,
    "playerid" INTEGER,
    "leagueid" INTEGER,
    CONSTRAINT "Ranking_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ranking_leagueid_fkey" FOREIGN KEY ("leagueid") REFERENCES "League" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ranking" ("id", "leagueid", "playerid", "points") SELECT "id", "leagueid", "playerid", "points" FROM "Ranking";
DROP TABLE "Ranking";
ALTER TABLE "new_Ranking" RENAME TO "Ranking";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
