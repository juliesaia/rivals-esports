export default defineEventHandler((event) => {
    event.node.res.setHeader("Cache-Control", "s-maxage=86400");
});
