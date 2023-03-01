import { cache_promise } from "./cache";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    console.time();

    if (query.min) {
        const cache = await cache_promise;
        const result = cache.players_min;
        return result;
    }

    const cache = await cache_promise;
    const result = cache.players;

    console.timeEnd();

    return result;
});
