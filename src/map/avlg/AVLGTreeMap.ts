import { MapEntry, Map } from '../map';

export class AVLGTreeMap<K, V> implements Map<K, V> {
    comparator: (a: K, b: K) => number;

    protected root: AVLGNode<K, V>;
    private _maxImbalance: number;

    constructor();
    constructor(maxImbalance: number) {

    }
    constructor() {

    }
    get size(): number {
        return -1;
    }
    get isEmpty(): boolean {
        return true;
    }
    get keys(): K[] {
        throw new Error("Method not implemented."); 
    }
    get values(): V[] {
        throw new Error("Method not implemented."); 
    }
    contains(key: K): boolean {
        throw new Error("Method not implemented.");
    }
    get(key: K): V | null {
        throw new Error("Method not implemented.");
    }
    set(key: K, value: V): V | null {
        throw new Error("Method not implemented.");
    }
    setAll(entries: Iterable<MapEntry<K, V>>): void {
        throw new Error("Method not implemented.");
    }
    setIfAbsent(key: K, value: V): V | null {
        throw new Error("Method not implemented.");
    }
    setAllIfAbsent(entries: Iterable<MapEntry<K, V>>): void {
        throw new Error("Method not implemented.");
    }
    replace(key: K, value: V): V {
        throw new Error("Method not implemented.");
    }
    remove(key: K): V | null {
        throw new Error("Method not implemented.");
    }
    [Symbol.iterator]: Generator<MapEntry<K, V>, void, boolean>;
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
    map<T, U>(callback: (key: K, value: V) => MapEntry<T, U>): Map<T, U>;
    map(callback: any) {
        throw new Error("Method not implemented.");
    }

    
}

