/*
  Warnings:

  - You are about to drop the column `playerId` on the `Standing` table. All the data in the column will be lost.
  - Added the required column `playerid` to the `Standing` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Standing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "season" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "playerid" INTEGER NOT NULL,
    CONSTRAINT "Standing_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Standing" ("id", "rank", "season") SELECT "id", "rank", "season" FROM "Standing";
DROP TABLE "Standing";
ALTER TABLE "new_Standing" RENAME TO "Standing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
