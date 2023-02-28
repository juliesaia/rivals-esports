import { cache_promise } from "./cache";

export default defineEventHandler(async (_event) => {
    // const query = getQuery(event);

    const cache = await cache_promise;
    const result = cache.tournaments;

    return result;
});
