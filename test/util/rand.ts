export type PRNG = Generator<number, void, number>;

/**
 * Mulberry32 PRNG function
 *
 * @param a Starting seed value
 *
 * @author Tommy Ettinger <tommy.ettinger@gmail.com>
 * @see https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
 */
export function* mulberry32(a: number, iters = 64): PRNG {
    for (let i = 0; i < iters; i++) {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        yield ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    return;
}

/**
 * Constructs a test string from a psudorandom 32-bit unsigned integer
 * @param n A 32-bit unsigned integer
 */
export function numToString(n: number): string {
    const chars: number[] = [];
    chars.push(n & 0x0000007F);
    chars.push(n & 0x00007F00 >> 2);
    chars.push(n & 0x007F0000 >> 4);
    chars.push(n & 0x7F000000 >> 6);
    return String.fromCharCode(...chars);
}
