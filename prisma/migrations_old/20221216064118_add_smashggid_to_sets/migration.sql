/*
  Warnings:

  - Added the required column `smashggid` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "smashggid" INTEGER NOT NULL,
    "winnerid" INTEGER NOT NULL,
    "loserid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,
    "completedAt" INTEGER NOT NULL,
    "uf" INTEGER NOT NULL,
    "winnerGameCount" INTEGER NOT NULL,
    "loserGameCount" INTEGER NOT NULL,
    CONSTRAINT "Set_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Set_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Set_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Set" ("completedAt", "id", "loserGameCount", "loserid", "tournamentid", "uf", "winnerGameCount", "winnerid") SELECT "completedAt", "id", "loserGameCount", "loserid", "tournamentid", "uf", "winnerGameCount", "winnerid" FROM "Set";
DROP TABLE "Set";
ALTER TABLE "new_Set" RENAME TO "Set";
CREATE UNIQUE INDEX "Set_smashggid_key" ON "Set"("smashggid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
