/*
  Warnings:

  - Added the required column `uf` to the `Set` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spr` to the `Standing` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "winnerid" INTEGER NOT NULL,
    "loserid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,
    "completedAt" INTEGER NOT NULL,
    "uf" INTEGER NOT NULL,
    CONSTRAINT "Set_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Set_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Set_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Set" ("completedAt", "id", "loserid", "tournamentid", "winnerid") SELECT "completedAt", "id", "loserid", "tournamentid", "winnerid" FROM "Set";
DROP TABLE "Set";
ALTER TABLE "new_Set" RENAME TO "Set";
CREATE TABLE "new_Standing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "placement" INTEGER NOT NULL,
    "seed" INTEGER NOT NULL,
    "playerid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,
    "spr" INTEGER NOT NULL,
    CONSTRAINT "Standing_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Standing_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Standing" ("id", "placement", "playerid", "seed", "tournamentid") SELECT "id", "placement", "playerid", "seed", "tournamentid" FROM "Standing";
DROP TABLE "Standing";
ALTER TABLE "new_Standing" RENAME TO "Standing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
