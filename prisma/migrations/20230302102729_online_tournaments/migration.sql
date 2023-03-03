-- CreateTable
CREATE TABLE "OnlineTournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "startAt" INTEGER NOT NULL,
    "repeats" TEXT,
    "prize" TEXT,
    "discordUrl" TEXT NOT NULL,
    "region" TEXT
);
