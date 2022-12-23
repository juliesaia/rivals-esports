-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Standing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "placement" INTEGER,
    "seed" INTEGER,
    "playerid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,
    CONSTRAINT "Standing_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Standing_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Standing" ("id", "placement", "playerid", "seed", "tournamentid") SELECT "id", "placement", "playerid", "seed", "tournamentid" FROM "Standing";
DROP TABLE "Standing";
ALTER TABLE "new_Standing" RENAME TO "Standing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
