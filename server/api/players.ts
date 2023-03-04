// import { cache_promise } from "./cache";
import path from "path";
import fs from "fs";

const test = path.join(process.cwd(), "cache.json");

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    console.time();

    // if (query.min) {
    //     const cache = await cache_promise;
    //     const result = cache.players_min;
    //     return result;
    // }

    // const cache = await cache_promise;
    // const result = cache.players;

    const cache = JSON.parse(
        await fs.promises.readFile(
            path.join(process.cwd(), "cache.json"),
            "utf8"
        )
    );

    const result = cache.players;

    console.timeEnd();

    return result;
});
