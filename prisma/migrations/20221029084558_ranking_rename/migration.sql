/*
  Warnings:

  - You are about to drop the `Standing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Standing";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Ranking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "season" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "playerid" INTEGER NOT NULL,
    CONSTRAINT "Ranking_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
