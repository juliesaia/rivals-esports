export function rounds_from_victory(x: number) {
    if (x === 1) {
        return 0;
    }
    return Math.floor(Math.log2(x - 1)) + Math.ceil(Math.log2((2 / 3) * x));
}
