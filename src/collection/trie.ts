import { Collection } from './collection';

export enum BufferSize {
    ASCII = 128, // 7 bits
    UTF_8 = 256, // 8 bits, 1 byte
    UTF_16 = 65536 // 16 bits
}
/**
 * A `Trie` is a search tree for storing strings.
 * 
 * @author Donald Isaac
 * @see https://en.wikipedia.org/wiki/Trie
 */
export class Trie implements Collection<string> {
    private root: TrieNode;
    /**
     * The buffer size for each node.
     * 
     * The buffer size determines what characters can be encoded. A bigger buffer
     * means that a higher variety of characters may be encoded, but the `Trie`
     * will take up significantly more space.
     * 
     * ASCII only requires 7 bits to encode, so the buffer size to support
     * ASCII is 128. This is also the default value.
     */ 
    private readonly buffSize: number;

    /**
     * Creates an empty `Trie`.
     * 
     * @param buffSize The size of the alphabet to support. Defaults to `128`,
     *                 the buffer size needed to support ASCII. `buffSize` must
     *                 be strictly positive.
     */
    constructor(buffSize?: BufferSize) {
        if (buffSize && buffSize <= 0) {
            throw new Error("Buffer size must be strictly positive.");
        }

        this.buffSize = buffSize ?? BufferSize.ASCII;
        this.root = new TrieNode(this.buffSize);
    }

    public insert(key: string): this {
        this.root = this._insert(this.root, key, 0);

        return this;
    }

    public insertAll(keys: string[]): this {
        if (keys == null) throw new Error(`Element list is null or undefined.`);
        for (let key of keys) {
            this.insert(key);
        }

        return this;
    }

    public contains(key: string): boolean {
        if (key?.length === 0) {
            return this.root.endOfString;
        }

        return this._contains(this.root, key, 0);
    }

    public delete(key: string): string | null {
        return key;
    }

    /**
     * Finds the longest string stored in this Trie that is a prefix of `key`.
     * If there are no prefixes for `key` stored in the Trie, an empty string
     * is returned.
     * 
     * @param key the `key` to find the longest prefix of
     * 
     * @returns the longest prefix of `key` stored in this Trie, or an empty string.
     * 
     * @throws if `key` is null or undefined.
     */
    public longestPrefix(key: string): string {
        if (key == null) throw new Error("Key cannot be null");
        if (key.length === 0) return "";

        let idx: number = 0;
        let prefix: string = "";
        let currStr: string = "";
        let curr: TrieNode = this.root;

        while (idx < key.length) {
            let index: number = key.charCodeAt(idx);
            currStr += key.charAt(idx);
            curr = curr.next[idx];
            if (!curr) break;

            if (curr.endOfString) {
                prefix = currStr; // JS strings aren't mutable; this is ok
            }

            idx++;
        }

        return prefix;
    }

    /**
     * Gets all of the stored strings in this `Trie` that start with `prefix`.
     * If the string `prefix` is also in the `Trie`, it is included.
     * 
     * @param prefix The `prefix` string to use.
     * 
     * @returns An array of strings with `prefix` as their prefix, or an empty
     *          array if no such strings exist.
     */
    public keysWithPrefix(prefix: string): string[] {
        let nodeAtPrefix: TrieNode | null = this._get(this.root, prefix, 0);
        if (!nodeAtPrefix) return [] as string[];

        let keysWithPrefix: string[] = [];
        this._keysWithPrefix(nodeAtPrefix, prefix, keysWithPrefix);

        return keysWithPrefix;
    }

    // =========================================================================
    // ============================ PRIVATE METHODS ============================
    // =========================================================================

    private _insert(node: TrieNode, key: string, idx: number): TrieNode {
        if (key == null || idx > key.length ) {
            throw new Error("Key is null or too short.");
        }
        if (node == null) {
            node = new TrieNode(this.buffSize);
        }
        if (idx === key.length) {
            node.endOfString = true;
        } else { 
            let index: number = key.charCodeAt(idx);
            node.next[index] = this._insert(node.next[index], key, ++idx);
        }

        return node;
    }

    private _contains(node: TrieNode, key: string, idx: number): boolean {
        let search: TrieNode | null = this._get(node, key, idx);
        return search == null ? false : search.endOfString;
    }

    /**
     * Gets the `TrieNode` under a `key`. This node is not guaranteed to be
     * a stored string, i.e. `node.endOfString` is not garunteed to be `true`.
     * 
     * @param node The node to start searching at. Also used for recursive calls.
     * @param key The key of the node to get
     * @param idx Index of the key's current character being checked
     * 
     * @returns The desired `TrieNode`, or `null` if none exists under `key`.
     */
    private _get(node: TrieNode, key: string, idx: number): TrieNode | null {
        if (key == null || idx > key.length) {
            throw new Error("key is null or is too short")
        } 
        // No node means key is not stored
        if (node == null) {
            return null;
        // Node has been found
        } else if (idx === key.length) {
            return node;
        // Still have more searching to do
        } else {
            let index: number = key.charCodeAt(idx);
            let next: TrieNode = node.next[index];

            return this._get(next, key, ++idx);
        }
    }

    private _delete(node: TrieNode, key: string, idx: number) {

    }

    private _keysWithPrefix(node: TrieNode, prefix: string, res: string[]): void {
        if (node == null) return;

        // If node is also a stored word, include it in the result array
        if (node.endOfString) res.push(prefix);

        // Recurse down each 'next' node, adding results to current results
        for (let i = 0; i < node.next.length; ++i) {
            let n: TrieNode = node.next[i];
            // not needed, but merging emtpy arrays over and over again is expensive
            if (n == null) continue; 

            this._keysWithPrefix(n, prefix + String.fromCharCode(i), res);
        }

    }
}

/**
 * Represents a single node in the `Trie`.
 */
class TrieNode {
    /** This `Node`'s children. Each index represents a character code. */
    next: TrieNode[];
    endOfString: boolean;

    constructor(buffSize: number, endOfString?: boolean) {
       this.next = new Array<TrieNode>(buffSize); 
       this.endOfString = endOfString ?? false;
    }
}