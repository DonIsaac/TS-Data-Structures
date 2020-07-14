import { invariant } from "./util";

/**
 * A Comparator is a function that can compare two objects of the same type.
 *
 * This function must return:
 *
 * - A negative number if `a < b`
 * - `0` if `a == b`
 * - A positive number if `a > b`
 *
 * The implementor must ensure `sgn(x.compareTo(y)) == -sgn(y.compareTo(x))` for
 * all `x` and `y`. (This implies that `x.compareTo(y)` must throw an exception
 * iff `y.compareTo(x)` throws an exception.)
 *
 * The implementor must also ensure that the relation is transitive:
 * `(x.compareTo(y) > 0 && y.compareTo(z) > 0)` implies `x.compareTo(z) > 0`.
 *
 * Finally, the implementor must ensure that `x.compareTo(y) == 0` implies that
 * `sgn(x.compareTo(z)) == sgn(y.compareTo(z))`, for all `z`.
 *
 * It is strongly recommended, but not strictly required that
 * `(x.compareTo(y) == 0) == (x.equals(y))`. Generally speaking, any class that
 * implements the `Comparable` interface and violates this condition should
 * clearly indicate this fact. The recommended language is "Note: this class has
 * a natural ordering that is inconsistent with equals."
 *
 * In the foregoing description, the notation `sgn(expression)` designates the
 * mathematical signum function, which is defined to return one of `-1`, `0`, or
 * `1` according to whether the value of expression is negative, zero or positive.
 *
 * @returns A negative integer, zero, or a positive integer as this object is
 * less than, equal to, or greater than the specified object.
 */
export type Comparator<T> = (a: T, b: T) => number;

export const DEFAULT_COMPARATOR: Comparator<any> = (a, b): number => {
    if (a === b) return 0;
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    else
        return 0;

};

export const Comparable: ClassDecorator = <T extends Function>(target: T): T => {
    invariant(target != null, "target class cannot be null.");
    invariant(typeof target === "function", "Only a constructor may be marked as Comparable.");

    let success: boolean = Reflect.defineProperty(target, COMPARABLE_SYMBOL, {
        value: target.name,
        enumerable: false,
        configurable: false
    });

    if (!success) {
        throw new Error(`Could not configure target ${target.name} as Comparable.`);
    }

    return target;
};


const COMPARABLE_SYMBOL = Symbol("@@Comparable");
