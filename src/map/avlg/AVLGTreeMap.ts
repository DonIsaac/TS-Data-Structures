import type { MapEntry, Map } from "../map";
import { AVLGNode } from "./AVLGNode";
import { Comparator, DEFAULT_COMPARATOR } from "../../lib/compare";
import type { Predicate, MapCallback } from "../../lib/types";
import { invariant } from "../../lib/util";

const DEFAULT_MAX_IMBALANCE = 1;

export class AVLGTreeMap<K, V> implements Map<K, V> {
    public comparator: Comparator<K>;

    private root: AVLGNode<K, V> | null;
    private _maxImbalance: number;

    constructor();
    constructor(other: Iterable<MapEntry<K, V>>);
    constructor(maxImbalance: number);
    constructor(comparator: Comparator<K>);
    constructor(maxImbalance: number, comparator: Comparator<K>);
    constructor(...args: any[]) {
        this.root = null;

        if (args?.length) {
            invariant(args[0] != null, "Got null as a parameter, expected a number, comparator function, or iterable object.");

            // constructor(maxImbalance, comparator?)
            if (typeof args[0] === "number") {
                this._maxImbalance = args[0];
                this.comparator = args[1] ?? DEFAULT_COMPARATOR;

            // constructor(comparator)
            } else if (typeof args[0] == "function") {
                this._maxImbalance = DEFAULT_MAX_IMBALANCE;
                this.comparator = args[0];

            // constructor(iterable)
            } else if (arguments.length === 1) {
                const m = args[0] as Iterable<MapEntry<K, V>>;
                invariant(m[Symbol.iterator], "Target object must be iterable.");
                this._maxImbalance = DEFAULT_MAX_IMBALANCE;
                this.comparator = DEFAULT_COMPARATOR;
                for (let entry of m) {
                    invariant(entry instanceof Array, "Target iterable must be a collection of MapEntries.");
                    let [k, v] = entry as unknown as MapEntry<K, V>;
                    invariant(!!k && !!v, "Target iterable cannot contain entries with null keys or values.");
                    this.set(k, v);
                }

            // constructor()
            } else {
                throw new TypeError("First parameter should be a " +
                    "number, map, or a comparator function. Got " +
                    `new AVLGTree(arg: ${args[0].constructor?.name ?? typeof args[0]})`
                );
            }
        } else {
            this.comparator = DEFAULT_COMPARATOR;
            this._maxImbalance = DEFAULT_MAX_IMBALANCE;
        }
    }

    get height(): number {
        return this.root?.height ?? -1;
    }
    get size(): number {
        return this.root?.size ?? 0;
    }
    get isEmpty(): boolean {
        return !this.root;
    }
    *keys(): Generator<K, void, undefined> {
        if (!this.root) {
            return;
        }

        for (let { key } of this.root) {
            yield key;
        }
    }

    *values(): Generator<V, void, undefined> {
        if (!this.root) {
            return;
        }

        for (let { data } of this.root) {
            yield data;
        }
    }
    contains(key: K): boolean {
        return this.root?.contains(key) ?? false;
    }

    get(key: K): V | null {
        return this.root?.get(key) ?? null;
    }
    set(pair: MapEntry<K, V>): V | null;
    set(key: K, value: V): V | null;
    set(key: K | MapEntry<K, V>, value?: V): V | null {
        if (arguments.length == 1) {
            let [k, v] = key as MapEntry<K, V>;
            value = v;
            key = k;
        }
        invariant(value, "Cannot store null values.");
        if (this.root) {
            const [newRoot, data] = this.root.set(key as K, value as V);
            // TODO I'm doing this check in the hopes that it's more efficient than
            // re-assigning root when they're the same. This needs to be verified.
            if (this.root != newRoot) {
                this.root = newRoot;
            }
            return data;

        } else {
            this.root = new AVLGNode(key as K, value as V, this._maxImbalance, this.comparator);
            return null;
        }
    }
    setAll(entries: Iterable<MapEntry<K, V>>): void {
        for (let [k, v] of entries) {
            this.set(k, v);
        }
    }
    setIfAbsent(pair: MapEntry<K, V>): V | null;
    setIfAbsent(key: K, value: V): V | null;
    setIfAbsent(key: K | MapEntry<K, V>, value?: V): V | null {
        if (arguments.length == 1) {
            invariant(key instanceof Array, "MapEntries must be an array.");
            let [k, v] = key as MapEntry<K, V>;
            value = v;
            key = k;
        }
        invariant(value, "Cannot store null values.");

        if (this.root) {
            const [root, data] = this.root.setIfAbsent(key as K, value as V);
            this.root = root;
            return data;
        } else {
            this.root = new AVLGNode(key as K, value as V, this._maxImbalance, this.comparator);
            return null;
        }
    }
    setAllIfAbsent(entries: Iterable<MapEntry<K, V>>): void {
        for (let [k, v] of entries) {
            this.setIfAbsent(k, v);
        }
    }
    replace(pair: MapEntry<K, V>): V | null;
    replace(key: K, value: V): V | null;
    replace(key: K | MapEntry<K, V>, value?: V): V | null {
        if (arguments.length == 1) {
            invariant(key instanceof Array, "MapEntries must be an array.");
            let [k, v] = key as MapEntry<K, V>;
            value = v;
            key = k;
        }
        return this.root?.replace(key as K, value as V) ?? null;
    }
    remove(key: K): V | null {
        if (!this.root) {
            return null;
        }

        const [tree, data] = this.root.remove(key);
        this.root = tree;
        return data;
    }
    forEach(callback: Predicate<MapEntry<K, V>>): void {
        if (this.root) {
            for (let { key, data } of this.root) {
                callback([key, data]);
            }
        }
    }
    merge(other: Map<K, V>): Map<K, V> {
        throw new Error("Method not implemented." + other);
    }
    filter(predicate: Predicate<MapEntry<K, V>>): Map<K, V> {
        const _filtered = new AVLGTreeMap<K, V>(this._maxImbalance, this.comparator);

        if (this.root) {
            for (let { key, data } of this.root) {
                if (predicate([key, data])) {
                    _filtered.set([key, data]);
                }
            }
        }

        return _filtered;
    }
    map<T>(callback: MapCallback<MapEntry<K, V>, T>): T[] {
        if (!this.root) {
            return [];
        }

        const arr: T[] = [];
        for (const { key, data } of this.root) {
            const el: T = callback([key, data]);
            arr.push(el);
        }

        return arr;
    }

    *[Symbol.iterator](): Iterator<MapEntry<K, V>, void, undefined> {
        if (!this.root) {
            return;
        }

        for(let { key, data } of this.root) {
            yield [key, data];
        }
    }

}
