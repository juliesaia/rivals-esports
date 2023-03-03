/*
  Warnings:

  - Added the required column `pronouns` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "season" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Standing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "placement" INTEGER NOT NULL,
    "playerid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,
    CONSTRAINT "Standing_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Standing_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "winnerid" INTEGER NOT NULL,
    "loserid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,
    CONSTRAINT "Set_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Set_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Set_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "service" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "playerid" INTEGER NOT NULL,
    CONSTRAINT "Social_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PlayerToTournament" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PlayerToTournament_A_fkey" FOREIGN KEY ("A") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PlayerToTournament_B_fkey" FOREIGN KEY ("B") REFERENCES "Tournament" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "smashggid" TEXT NOT NULL,
    "pronouns" TEXT NOT NULL
);
INSERT INTO "new_Player" ("id", "name", "smashggid") SELECT "id", "name", "smashggid" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_smashggid_key" ON "Player"("smashggid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerToTournament_AB_unique" ON "_PlayerToTournament"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerToTournament_B_index" ON "_PlayerToTournament"("B");
