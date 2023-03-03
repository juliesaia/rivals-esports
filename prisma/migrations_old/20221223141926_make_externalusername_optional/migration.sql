-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "externalUsername" TEXT,
    "playerid" INTEGER NOT NULL,
    CONSTRAINT "Social_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Social" ("externalUsername", "id", "playerid", "type") SELECT "externalUsername", "id", "playerid", "type" FROM "Social";
DROP TABLE "Social";
ALTER TABLE "new_Social" RENAME TO "Social";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
