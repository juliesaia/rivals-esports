/*
  Warnings:

  - Added the required column `seed` to the `Standing` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Standing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "placement" INTEGER NOT NULL,
    "seed" INTEGER NOT NULL,
    "playerid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,
    CONSTRAINT "Standing_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Standing_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Standing" ("id", "placement", "playerid", "tournamentid") SELECT "id", "placement", "playerid", "tournamentid" FROM "Standing";
DROP TABLE "Standing";
ALTER TABLE "new_Standing" RENAME TO "Standing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
