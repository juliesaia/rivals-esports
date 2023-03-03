import { cache_promise } from "./cache";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.name) {
        throw new Error("not found");
    }

    const tournament_name = query.name.toString().toLowerCase();

    // tournament_names.push(tournament_names[0].replaceAll("-", " "));

    // for (const tournament_name of tournament_names) {

    const cache = await cache_promise;
    const tournament = cache.tournament[tournament_name];

    if (tournament) {
        for (const standing of tournament.standings) {
            Object.assign(standing, standing.player);
            delete standing.player;
        }

        if (!tournament.timezone) {
            tournament.timezone = "America/New_York";
        }

        return tournament;
    }
    // }
    throw new Error("Tournament not found.");
});
