import { RenderResponse } from "nitropack";

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook("render:response", (response: RenderResponse) => {
        response.headers["Cache-Control"] = "s-maxage=86400";
    });
});
