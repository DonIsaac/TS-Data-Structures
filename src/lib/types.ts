export type MapCallback<TParams = any, TReturn = TParams> = TParams extends [infer R]
    ? (...args: [R]) => TReturn
    : (...args: [TParams]) => TReturn
;

export type Predicate<TParams = any> = MapCallback<TParams, boolean>;

export interface Clonable {
    clone(): this;
}

export interface Comparable<K> {
    compareTo(other: K): number;
}
