import { Trie } from "../../src/collection/trie";
// import _ from "lodash";

describe("trie", ()=> {
    let trie: Trie;

    beforeEach(() => {
        trie = new Trie();
    });

    it("Contains nothing when first created", () => {
        expect(trie).toBeDefined();
        expect(trie.contains("string")).toBeFalsy();
        expect(trie.contains("another string")).toBeFalsy();
        expect(trie.contains("a")).toBeFalsy();
        expect(trie.contains("")).toBeFalsy();
        try {
            trie.contains(null as unknown as string);
            fail("Contains should throw when passed key is null");
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    // it("Contains strings after insertion", () => {
    //     trie.insert("hi");
    //     trie.insert("hello");
    //     trie.insert("heya");
    //     trie.insert("");
    //     trie.insert("be");
    //     trie.insert("bean");
    //     trie.insert("beans");


    //     expect(trie.contains("hi")).toBeTruthy();
    //     expect(trie.contains("hello")).toBeTruthy();
    //     expect(trie.contains("heya")).toBeTruthy();
    //     expect(trie.contains("")).toBeTruthy();
    //     expect(trie.contains("be")).toBeTruthy();
    //     expect(trie.contains("bean")).toBeTruthy();
    //     expect(trie.contains("beans")).toBeTruthy();
    // });

    // it("Does not contain removed keys after delete()", () => {
    //     let toInsert = ["a", "app", "apple", "apples", "applesauce", "be", "beck", "beckon", "becker","bacon", "because", "became"];
    //     let toDelete = ["app", "applesauce", "beck", "bacon", "became"];
    //     let remaining = _.difference(toInsert, toDelete);

    //     toInsert.forEach(str => trie.insert(str));

    //     toInsert.forEach(str => {
    //         expect(trie.contains(str), `Trie should contain key "${str}".`).toBeTruthy();
    //     });

    //     toDelete.forEach(str => trie.delete(str));
    //     toDelete.forEach(str => expect(trie.contains(str), `Should not contain deleted key "${str}"`).toBeFalsy());

    //     remaining.forEach(str => expect(trie.contains(str), `Trie no longer contains unremoved key "${str}"`).toBeTruthy());
    // });

    // it("longestPrefix works as expected", () => {
    //     let toInsert = ["app", "applicable", "apple", "apples", "beck", "be", "bees", "became"];

    //     toInsert.forEach(str => trie.insert(str));




    //     expect(trie.longestPrefix("application")).toBe("app");
    //     expect(trie.longestPrefix("a")).toBe("");
    //     expect(trie.longestPrefix("beast")).toBe("be");
    //     expect(trie.longestPrefix("beckon")).toBe("beck");
    //     expect(trie.longestPrefix("applesauce")).toBe("apples");
    //     expect(trie.longestPrefix("became")).toBe("became");
    // });
});
