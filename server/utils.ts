export function rounds_from_victory(x: number) {
    if (x === 1) {
        return 0;
    }
    return Math.floor(Math.log2(x - 1)) + Math.ceil(Math.log2((2 / 3) * x));
}

export const character_dict = {
    184: "Zetterburn",
    185: "Orcane",
    186: "Wrastor",
    187: "Kragg",
    188: "Forsburn",
    189: "Maypul",
    190: "Absa",
    191: "Etalus",
    1117: "Ori and Sein",
    1118: "Ranno",
    1119: "Clairen",
    1349: "Sylvanos",
    1350: "Elliana",
    1381: "Shovel Knight",
    1920: "Mollo",
    1921: "Hodan",
    1922: "Pomme",
    1923: "Olympia",
};

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function int_to_ord(i: number) {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}
