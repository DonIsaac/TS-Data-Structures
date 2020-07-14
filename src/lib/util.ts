/**
 * Establishes a predicate as an invariant, meaning it must be `true`. If the
 * predicate is falsey, an error is thrown.
 *
 * @param predicate     The predicate to be tested.
 * @param message       An optional message describing the invariant violation.
 * @param errCtor       Error constructor to use. Defaults to `Error`.
 *
 * @throws              If `predicate` is falsey.
 */
export function invariant(predicate: any, message?: string, errCtor: ErrorConstructor = Error): asserts predicate {
    if (!predicate) {
        throw new errCtor(message ?? predicate == null ? "Got an unexpected null or undefined value" : "Invariant violated");
    }
}

export const NullIterator: Iterator<any, void, undefined> = {
    next: () => ({ value: undefined, done: true})
}
