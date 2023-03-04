// import { cache_promise } from "./cache";
import path from "path";
import { readFileSync } from "fs";

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

    // const cache = JSON.parse(
    //     await fs.promises.readFile(
    //         path.join(process.cwd(), "cache.json"),
    //         "utf8"
    //     )
    // );

    const file = path.join(process.cwd(), "cache.json");
    const stringified = readFileSync(file, "utf8");

    const result = JSON.parse(stringified).players;

    console.timeEnd();

    return result;
});
