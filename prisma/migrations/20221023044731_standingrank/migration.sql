/*
  Warnings:

  - Added the required column `rank` to the `Standing` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Standing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "season" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    CONSTRAINT "Standing_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Standing" ("id", "playerId", "season") SELECT "id", "playerId", "season" FROM "Standing";
DROP TABLE "Standing";
ALTER TABLE "new_Standing" RENAME TO "Standing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
