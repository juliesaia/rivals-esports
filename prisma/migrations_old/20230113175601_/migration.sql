-- CreateTable
CREATE TABLE "Accolade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "playerid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,
    "opponentid" INTEGER NOT NULL,
    CONSTRAINT "Accolade_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Accolade_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Accolade_opponentid_fkey" FOREIGN KEY ("opponentid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
