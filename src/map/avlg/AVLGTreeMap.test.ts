import { uniq, remove } from "lodash";
import { AVLGTreeMap } from "./AVLGTreeMap";
import { PRNG, mulberry32, numToString } from "../../../test/util/rand";

// universalMapTests(AVLGTreeMap);
describe("AVLGTreeMap", () => {


    const SEED = 98502; // RNG seed
    let rand: PRNG;
    let map: AVLGTreeMap<any, any>;

    beforeEach(() => {
        rand = mulberry32(SEED);
        map = new AVLGTreeMap();
    });

    describe("General Map Interface Tests", () => {
        describe("Insertion", () => {
            test("Basic inserting", () => {
                expect(map.size).toEqual(0);
                expect(map.isEmpty, "Map should be empty before insertion").toBeTrue();
                expect(map.set("foo", "bar")).toBeFalsy();
                expect(map.size).toEqual(1);
                expect(map.isEmpty, "Map should not be empty after insertion").toBeFalse();
                expect(map.set("baz", "bang")).toBeFalsy();
                expect(map.size).toEqual(2);
                expect(map.get("foo")).toEqual("bar");
                expect(map.set("foo", "boom")).toEqual("bar");
                expect(map.size).toEqual(2);
            }); // !basic inserting

            test("Stress test", () => {
                let arr: number[] = uniq(Array.from(rand as Iterable<number>));
                arr.forEach((n, i) => {
                    let val = numToString(n);
                    map.set(n, val);
                    expect(map.size, `Incorrect size after map.set(${n}, ${val}) on ${i}th iteration.`).toEqual(i + 1);
                });

                expect(map.size).toEqual(arr.length);
                for (let [k] of map) {
                    expect(arr.includes(k), `Array should contain value ${JSON.stringify(k)}`).toBeTruthy();
                    remove(arr, el => Object.is(el, k));
                }
                expect(arr.length).toEqual(0);
            }); // !stress test
        });

        describe("Deletion", () => {
            test("Deletion on an empty map", () => {
                expect(map.remove("foo")).toBeFalsy();
                expect(map.size).toEqual(0);
                expect(map.isEmpty).toBeTrue();
            });
        });
    });
});
