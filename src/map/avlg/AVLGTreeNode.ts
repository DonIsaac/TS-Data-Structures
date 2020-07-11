import { Map, Comparator } from "../map";


export interface Node<K, V> extends Map<K, V> {

}

export class AVLGTreeNode<K, V> implements Node<K, V> {
    /**
     * The default max imbalance value. This is the G in AVL-G.
     */
    public static G = 1;

    public maxImbalance: number;
    public key: K;
    public data: V;
    public left: AVLGTreeNode<K, V> | null;
    public right: AVLGTreeNode<K, V> | null;
    comparator: Comparator;

    constructor(key: K, data: V);
    constructor(key: K, data: V, maxImbalance: number);
    constructor(key: K, data: V, maxImbalance?: number) {
        this.maxImbalance = maxImbalance ?? AVLGTreeNode.G;
        this.key = key;
        this.data = data;
        this.left = null;
        this.right = null;
    }

    public get height(): number {
        // Height of left subtree
        let left: number = this.left ? this.left.height : -1;
        // Height of right subtree
        let right: number = this.right ? this.right.height : -1;

        return 1 + Math.max(left, right);
    }

    public get size(): number {
        // Size of left node
        let left: number = this.left ? this.left.size : 0;
        // Size of right node
        let right: number = this.right ? this.right.size : 0;

        return 1 + left + right;
    }

    public get isEmpty() {
        return !!this.key && !!this.data;
    }

    keys: K[];
    values: V[];
    contains(key: K): boolean {
        throw new Error("Method not implemented.");
    }
    get(key: K): V | null {
        throw new Error("Method not implemented.");
    }
    set(key: K, value: V): V | null {
        throw new Error("Method not implemented.");
    }
    setAll(entries: Iterable<import("../map").MapEntry<K, V>>): void {
        throw new Error("Method not implemented.");
    }
    setIfAbsent(key: K, value: V): V | null {
        throw new Error("Method not implemented.");
    }
    setAllIfAbsent(entries: Iterable<import("../map").MapEntry<K, V>>): void {
        throw new Error("Method not implemented.");
    }
    replace(key: K, value: V): V {
        throw new Error("Method not implemented.");
    }
    remove(key: K): V | null {
        throw new Error("Method not implemented.");
    }
    [Symbol.iterator]: Generator<import("../map").MapEntry<K, V>, void, boolean>;
    each(iterator: (key: K, value: V) => boolean): void {
        throw new Error("Method not implemented.");
    }
    forEach(iterator: (key: K, value: V) => boolean): void {
        throw new Error("Method not implemented.");
    }
    merge(other: Map<K, V>): Map<K, V> {
        throw new Error("Method not implemented.");
    }
    filter(predicate: (key: K, value: V) => boolean): Map<K, V> {
        throw new Error("Method not implemented.");
    }
    map<T>(callback: (key: K, value: V) => T): T[];
    map<T, U>(callback: (key: K, value: V) => import("../map").MapEntry<T, U>): Map<T, U>;
    map(callback: any) {
        throw new Error("Method not implemented.");

}