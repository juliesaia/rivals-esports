/*
  Warnings:

  - Added the required column `loserid` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerid` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_GameToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GameToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GameToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "winnerid" INTEGER NOT NULL,
    "loserid" INTEGER NOT NULL,
    "setid" INTEGER NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "winnerChar" TEXT NOT NULL,
    "loserChar" TEXT NOT NULL,
    CONSTRAINT "Game_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_setid_fkey" FOREIGN KEY ("setid") REFERENCES "Set" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("gameNumber", "id", "loserChar", "setid", "winnerChar") SELECT "gameNumber", "id", "loserChar", "setid", "winnerChar" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_GameToPlayer_AB_unique" ON "_GameToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToPlayer_B_index" ON "_GameToPlayer"("B");
