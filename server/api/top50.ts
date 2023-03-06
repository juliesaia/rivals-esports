import { top50 } from "../lists/top50";

export default defineEventHandler(async (event) => {
    return top50;
});
