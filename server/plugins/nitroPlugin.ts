export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("server:response", (response) => {
        response.headers["Cache-Control"] = "s-maxage=86400";
    });
});
