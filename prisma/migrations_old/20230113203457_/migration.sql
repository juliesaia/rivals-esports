-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Accolade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "playerid" INTEGER NOT NULL,
    "tournamentid" INTEGER,
    "opponentid" INTEGER,
    "leagueid" INTEGER,
    "count" INTEGER,
    CONSTRAINT "Accolade_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Accolade_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Accolade_opponentid_fkey" FOREIGN KEY ("opponentid") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Accolade_leagueid_fkey" FOREIGN KEY ("leagueid") REFERENCES "League" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Accolade" ("count", "description", "id", "opponentid", "playerid", "rarity", "shortName", "title", "tournamentid", "type") SELECT "count", "description", "id", "opponentid", "playerid", "rarity", "shortName", "title", "tournamentid", "type" FROM "Accolade";
DROP TABLE "Accolade";
ALTER TABLE "new_Accolade" RENAME TO "Accolade";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
