-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "smashggid" TEXT NOT NULL,
    "pronouns" TEXT,
    "favoriteCharacter" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "ranking" INTEGER NOT NULL,
    "rankingPeriod" INTEGER,
    "points" INTEGER,
    "playerid" INTEGER,
    "leagueid" INTEGER,
    "extraInfo" TEXT,
    "character" TEXT,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "eventSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "online" BOOLEAN NOT NULL,
    "state" TEXT,
    "city" TEXT,
    "profileImage" TEXT,
    "bannerImage" TEXT,
    "startAt" INTEGER,
    "endAt" INTEGER,
    "timezone" TEXT,
    "rankingPeriod" INTEGER,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Standing" (
    "id" SERIAL NOT NULL,
    "placement" INTEGER,
    "seed" INTEGER,
    "playerid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,

    CONSTRAINT "Standing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "id" SERIAL NOT NULL,
    "smashggid" INTEGER NOT NULL,
    "winnerid" INTEGER NOT NULL,
    "loserid" INTEGER NOT NULL,
    "tournamentid" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "uf" INTEGER NOT NULL,
    "winnerGameCount" INTEGER NOT NULL,
    "loserGameCount" INTEGER NOT NULL,
    "phase" TEXT,
    "fullRoundText" TEXT,
    "completedAt" INTEGER NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "winnerid" INTEGER NOT NULL,
    "loserid" INTEGER NOT NULL,
    "setid" INTEGER NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "winnerChar" TEXT,
    "loserChar" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "externalUsername" TEXT,
    "playerid" INTEGER NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "iconImage" TEXT NOT NULL,
    "season" INTEGER NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accolade" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "playerid" INTEGER NOT NULL,
    "tournamentid" INTEGER,
    "opponentid" INTEGER,
    "leagueid" INTEGER,
    "setid" INTEGER,
    "count" INTEGER,

    CONSTRAINT "Accolade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineTournament" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "startAtISO" TEXT NOT NULL,
    "repeats" TEXT,
    "prize" TEXT,
    "discordUrl" TEXT NOT NULL,
    "region" TEXT,

    CONSTRAINT "OnlineTournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlayerToTournament" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PlayerToSet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GameToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LeagueToTournament" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_smashggid_key" ON "Player"("smashggid");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_slug_key" ON "Tournament"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_eventSlug_key" ON "Tournament"("eventSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_name_key" ON "Tournament"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Set_smashggid_key" ON "Set"("smashggid");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerToTournament_AB_unique" ON "_PlayerToTournament"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerToTournament_B_index" ON "_PlayerToTournament"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerToSet_AB_unique" ON "_PlayerToSet"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerToSet_B_index" ON "_PlayerToSet"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GameToPlayer_AB_unique" ON "_GameToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToPlayer_B_index" ON "_GameToPlayer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LeagueToTournament_AB_unique" ON "_LeagueToTournament"("A", "B");

-- CreateIndex
CREATE INDEX "_LeagueToTournament_B_index" ON "_LeagueToTournament"("B");

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_leagueid_fkey" FOREIGN KEY ("leagueid") REFERENCES "League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standing" ADD CONSTRAINT "Standing_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standing" ADD CONSTRAINT "Standing_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerid_fkey" FOREIGN KEY ("winnerid") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserid_fkey" FOREIGN KEY ("loserid") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_setid_fkey" FOREIGN KEY ("setid") REFERENCES "Set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accolade" ADD CONSTRAINT "Accolade_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accolade" ADD CONSTRAINT "Accolade_tournamentid_fkey" FOREIGN KEY ("tournamentid") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accolade" ADD CONSTRAINT "Accolade_opponentid_fkey" FOREIGN KEY ("opponentid") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accolade" ADD CONSTRAINT "Accolade_leagueid_fkey" FOREIGN KEY ("leagueid") REFERENCES "League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accolade" ADD CONSTRAINT "Accolade_setid_fkey" FOREIGN KEY ("setid") REFERENCES "Set"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToTournament" ADD CONSTRAINT "_PlayerToTournament_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToTournament" ADD CONSTRAINT "_PlayerToTournament_B_fkey" FOREIGN KEY ("B") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToSet" ADD CONSTRAINT "_PlayerToSet_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToSet" ADD CONSTRAINT "_PlayerToSet_B_fkey" FOREIGN KEY ("B") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToPlayer" ADD CONSTRAINT "_GameToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToPlayer" ADD CONSTRAINT "_GameToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeagueToTournament" ADD CONSTRAINT "_LeagueToTournament_A_fkey" FOREIGN KEY ("A") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeagueToTournament" ADD CONSTRAINT "_LeagueToTournament_B_fkey" FOREIGN KEY ("B") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
