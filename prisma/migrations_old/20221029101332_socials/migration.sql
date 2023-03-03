/*
  Warnings:

  - You are about to drop the column `name` on the `Social` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `Social` table. All the data in the column will be lost.
  - Added the required column `externalUsername` to the `Social` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Social` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "externalUsername" TEXT NOT NULL,
    "playerid" INTEGER NOT NULL,
    CONSTRAINT "Social_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Social" ("id", "playerid") SELECT "id", "playerid" FROM "Social";
DROP TABLE "Social";
ALTER TABLE "new_Social" RENAME TO "Social";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
