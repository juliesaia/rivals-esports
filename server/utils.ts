import {
    compress as compressjson,
    decompress as decompressjson,
} from "compress-json";
import JSONH from "jsonh";

export function rounds_from_victory(x: number) {
    if (x === 1) {
        return 0;
    }
    return Math.floor(Math.log2(x - 1)) + Math.ceil(Math.log2((2 / 3) * x));
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function int_to_ord(i: number) {
    if (i == null) {
        return "";
    }
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

export function isScrolledIntoView(el: Element) {
    let { top: top1, bottom: bottom1 } = el.getBoundingClientRect();
    const { top: top2, bottom: bottom2 } = document
        .getElementsByClassName("v-popper__popper")[0]
        .getBoundingClientRect();

    top1 += 1;
    bottom1 -= 1;

    return (
        (top2 < top1 && bottom2 > top1) || (top2 < bottom1 && bottom2 > bottom1)
    );
}

export function winrate(wins: number, games: number) {
    if (games === 0) {
        return "0%";
    }
    return Math.round((wins / games) * 100) + "%";
}

export function compress(data: any[]) {
    return compressjson(JSONH.pack(data));
}

export function decompress(data) {
    return JSONH.unpack(decompressjson(data));
}

export function compress_one(data) {
    // const copy = structuredClone(data);
    const copy = JSON.parse(JSON.stringify(data));
    for (const key in copy) {
        if (Array.isArray(copy[key])) {
            copy[key] = JSONH.pack(copy[key]);
        }
    }
    return compressjson(copy);
}

export function decompress_one(data) {
    // const copy = structuredClone(data);
    const copy = JSON.parse(JSON.stringify(data));
    const decompressed = decompressjson(copy);
    for (const key in decompressed) {
        if (Array.isArray(decompressed[key])) {
            decompressed[key] = JSONH.unpack(decompressed[key]);
        }
    }
    return decompressed;
}

export function resizeSGG(raw_url, width, height) {
    const url = new URL(raw_url);
    const ehk = url.searchParams.get("ehkOptimized");
    const href =
        url.origin +
        url.pathname
            .replace(".png", "-optimized.png")
            .replace(".jpg", "-optimized.jpg")
            .replace(".jpeg", "-optimized.jpeg");
    return `https://www.bing.com/th?pid=Sgg&qlt=100&u=${encodeURIComponent(
        href
    )}&ehk=${encodeURIComponent(ehk)}&w=${width}&h=${height}`;
}
