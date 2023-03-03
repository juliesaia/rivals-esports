/*
  Warnings:

  - You are about to drop the column `season` on the `Ranking` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `leagueid` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `points` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "League" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "iconImage" TEXT NOT NULL,
    "season" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LeagueToTournament" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LeagueToTournament_A_fkey" FOREIGN KEY ("A") REFERENCES "League" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LeagueToTournament_B_fkey" FOREIGN KEY ("B") REFERENCES "Tournament" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rank" INTEGER NOT NULL,
    "top50" INTEGER,
    "points" INTEGER NOT NULL,
    "playerid" INTEGER NOT NULL,
    "leagueid" INTEGER NOT NULL,
    CONSTRAINT "Ranking_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ranking_leagueid_fkey" FOREIGN KEY ("leagueid") REFERENCES "League" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ranking" ("id", "playerid", "rank") SELECT "id", "playerid", "rank" FROM "Ranking";
DROP TABLE "Ranking";
ALTER TABLE "new_Ranking" RENAME TO "Ranking";
CREATE TABLE "new_Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "eventSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "profileImage" TEXT,
    "bannerImage" TEXT,
    "startAt" INTEGER,
    "endAt" INTEGER,
    "timezone" TEXT
);
INSERT INTO "new_Tournament" ("bannerImage", "city", "endAt", "eventSlug", "id", "name", "online", "profileImage", "slug", "startAt", "state", "timezone") SELECT "bannerImage", "city", "endAt", "eventSlug", "id", "name", "online", "profileImage", "slug", "startAt", "state", "timezone" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
CREATE UNIQUE INDEX "Tournament_slug_key" ON "Tournament"("slug");
CREATE UNIQUE INDEX "Tournament_eventSlug_key" ON "Tournament"("eventSlug");
CREATE UNIQUE INDEX "Tournament_name_key" ON "Tournament"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_LeagueToTournament_AB_unique" ON "_LeagueToTournament"("A", "B");

-- CreateIndex
CREATE INDEX "_LeagueToTournament_B_index" ON "_LeagueToTournament"("B");
