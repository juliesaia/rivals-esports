import { prisma } from "../prisma";

export default defineEventHandler(async (_event) => {
    // return await prisma.onlineTournament.findMany();
    return [
        {
            name: "Rivals Amateur Series",
            imageUrl:
                "https://images-ext-1.discordapp.net/external/Yk62yTvYEybYTr3x83cepLVaeXvql6HXjjuE5A12las/%3F1639082583/https/s3.amazonaws.com/challonge_app/organizations/images/000/079/286/hdpi/borc.png",
            startAtISO: "2023-03-02 20:00",
            repeats: "weekly",
            discordUrl: "http://discord.me/mentor",
        },
        {
            name: "Go to School",
            imageUrl:
                "https://images-ext-1.discordapp.net/external/Yk62yTvYEybYTr3x83cepLVaeXvql6HXjjuE5A12las/%3F1639082583/https/s3.amazonaws.com/challonge_app/organizations/images/000/079/286/hdpi/borc.png",
            startAtISO: "2023-03-01 20:00",
            repeats: "weekly",
            discordUrl: "http://discord.me/mentor",
        },
        {
            name: "SSSS",
            imageUrl:
                "https://images-ext-2.discordapp.net/external/_GhYptya5gWd2huZNvlu4kcabJwBnlrMXeO64CC6Wdw/%3F1606349302/https/s3.amazonaws.com/challonge_app/organizations/images/000/118/774/hdpi/Small-1.png",
            startAtISO: "2023-02-28 20:00",
            repeats: "weekly",
            discordUrl: "https://discord.com/invite/rivalsrecess",
        },
        {
            name: "The Hunt",
            imageUrl:
                "https://images-ext-2.discordapp.net/external/xLwnYDwoPnB2WqdCoA3rOeqqgll3oAKGarDc149oVbo/%3F1676936808/https/s3.amazonaws.com/challonge_app/organizations/images/000/147/016/hdpi/WP_Logo_2_%2528with_Text%2529.png",
            startAtISO: "2023-02-26 20:00",
            repeats: "weekly",
            discordUrl: "https://discord.gg/fbYBZCUDGN",
        },
        {
            name: "Aether to Go",
            imageUrl:
                "https://www.bing.com/th?pid=Sgg&qlt=100&u=https%3A%2F%2Fimages.start.gg%2Fimages%2Ftournament%2F523553%2Fimage-6eb218e6a6c11b9d744ec98aeb2c4cc4-optimized.png&ehk=JiLsM9WyYwayt%2BHo7fyAKy1fKAV9L6pVw8Jip7O8T5c%3D&w=280&h=280&r=0",
            startAtISO: "2023-02-24 19:00",
            repeats: "weekly",
            discordUrl: "https://discord.gg/499qKPPBcp",
        },
        {
            name: "Mojo Dojo",
            imageUrl:
                "https://s3.amazonaws.com/challonge_app/organizations/images/000/159/307/hdpi/Eh4E9w4WkAcVj5Y.png?1676023775",
            startAtISO: "2023-03-20 20:00",
            discordUrl: "https://discord.gg/4F44ZPyCpX",
        },
    ];
});
