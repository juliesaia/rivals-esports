/*
  Warnings:

  - Added the required column `favoriteCharacter` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "smashggid" TEXT NOT NULL,
    "pronouns" TEXT,
    "favoriteCharacter" TEXT NOT NULL
);
INSERT INTO "new_Player" ("id", "name", "pronouns", "smashggid") SELECT "id", "name", "pronouns", "smashggid" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_smashggid_key" ON "Player"("smashggid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
