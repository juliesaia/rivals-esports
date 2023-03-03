/*
  Warnings:

  - Added the required column `loserGameCount` to the `Set` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerGameCount` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_PlayerToSet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PlayerToSet_A_fkey" FOREIGN KEY ("A") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PlayerToSet_B_fkey" FOREIGN KEY ("B") REFERENCES "Set" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
INSERT INTO "new_Set" ("completedAt", "id", "loserid", "tournamentid", "uf", "winnerid") SELECT "completedAt", "id", "loserid", "tournamentid", "uf", "winnerid" FROM "Set";
DROP TABLE "Set";
ALTER TABLE "new_Set" RENAME TO "Set";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerToSet_AB_unique" ON "_PlayerToSet"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerToSet_B_index" ON "_PlayerToSet"("B");
