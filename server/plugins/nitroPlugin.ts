export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("render:response", (response, { event }) => {
        // console.log("render:response", response);
        console.log("");
    });
});
