export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("render:response", (response, { event }) => {
        response.headers["Cache-Control"] = "s-maxage=86400";
    });
});
