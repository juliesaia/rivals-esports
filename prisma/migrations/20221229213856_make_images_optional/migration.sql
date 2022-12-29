-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "season" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "eventSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL COLLATE NOCASE,
    "online" BOOLEAN NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "profileImage" TEXT,
    "bannerImage" TEXT
);
INSERT INTO "new_Tournament" ("bannerImage", "city", "eventSlug", "id", "name", "online", "profileImage", "season", "slug", "state") SELECT "bannerImage", "city", "eventSlug", "id", "name", "online", "profileImage", "season", "slug", "state" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
CREATE UNIQUE INDEX "Tournament_slug_key" ON "Tournament"("slug");
CREATE UNIQUE INDEX "Tournament_eventSlug_key" ON "Tournament"("eventSlug");
CREATE UNIQUE INDEX "Tournament_name_key" ON "Tournament"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
