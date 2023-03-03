-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "winnerid" INTEGER NOT NULL,
    "loserid" INTEGER NOT NULL,
    "setid" INTEGER NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "winnerChar" TEXT,
    "loserChar" TEXT,
    CONSTRAINT "Game_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_setid_fkey" FOREIGN KEY ("setid") REFERENCES "Set" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("gameNumber", "id", "loserChar", "loserid", "setid", "winnerChar", "winnerid") SELECT "gameNumber", "id", "loserChar", "loserid", "setid", "winnerChar", "winnerid" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
