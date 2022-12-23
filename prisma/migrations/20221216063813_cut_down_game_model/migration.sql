/*
  Warnings:

  - You are about to drop the `_GameToPlayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `loserid` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winnerid` on the `Game` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_GameToPlayer_B_index";

-- DropIndex
DROP INDEX "_GameToPlayer_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_GameToPlayer";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setid" INTEGER NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "winnerChar" TEXT NOT NULL,
    "loserChar" TEXT NOT NULL,
    CONSTRAINT "Game_setid_fkey" FOREIGN KEY ("setid") REFERENCES "Set" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("gameNumber", "id", "loserChar", "setid", "winnerChar") SELECT "gameNumber", "id", "loserChar", "setid", "winnerChar" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
