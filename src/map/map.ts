/**
 * Represents a key-pair Map entry.
 *
 * @type  	K 	The type of the keys used by the Map.
 * @type 	V 	The type of the values stored by the Map.
 */
export type MapEntry<K, V> = { k: K, v: V};
/**
 * A comparator is a function that can compare two objects of the same type.
 *
 * This function must return:
 *
 * - A negative number if `a < b`
 * - `0` if `a == b`
 * - A positive number if `a > b`
 * 
 * The implementor must ensure sgn(x.compareTo(y)) == -sgn(y.compareTo(x)) for all x and y. (This implies that x.compareTo(y) must throw an exception iff y.compareTo(x) throws an exception.)
 * 
 * The implementor must also ensure that the relation is transitive: (x.compareTo(y)>0 && y.compareTo(z)>0) implies x.compareTo(z)>0.
 * 
 * Finally, the implementor must ensure that x.compareTo(y)==0 implies that sgn(x.compareTo(z)) == sgn(y.compareTo(z)), for all z.
 * 
 * It is strongly recommended, but not strictly required that (x.compareTo(y)==0) == (x.equals(y)). Generally speaking, any class that implements the Comparable interface and violates this condition should clearly indicate this fact. The recommended language is "Note: this class has a natural ordering that is inconsistent with equals."
 * 
 * In the foregoing description, the notation sgn(expression) designates the mathematical signum function, which is defined to return one of -1, 0, or 1 according to whether the value of expression is negative, zero or positive.
 *
 * @returns A negative integer, zero, or a positive integer as this object is less than, equal to, or greater than the specified object. 
 */
export type Comparator<T> = (a: T, b: T) => number;

export const DEFAULT_COMPARATOR = <T>(a: T, b: T) => {
	if (a === b) return 0;
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    else
        return 0;

}

/**
 * Root interface for all Maps. A Map cannot contain duplicate keys, but may
 * contain duplicate values. Key values should be immutable.
 *
 * This interface is based off of Java's Map interface.
 *
 * @type K The type of the Map's keys. Used to access values.
 * @type V THe type of the values stored in the Map.
 *
 * @author Donald Isaac
 * @license MIT
 */ 
export interface Map<K, V> {

	/**
	 * Gets the number of entries stored in the map.
	 */
	size: number; 
	/**
	 * Returns `true` if the Map contains no key-value mappings.
	 *
	 * @returns 		`true` if the Map is empty, `false` otherwise.
	 */
	isEmpty: boolean;
	/**
	 * Returns an array of every key stored in the Map.
	 *
	 * @returns 		All keys stored in the Map.
	 */
	keys: K[];
	/**
	 * Returns an array of every value stored in the Map.
	 *
	 * @returns 		All values stored in the Map.
	 */
	values: V[];
	/**
	 * The comparator function used to compare keys.
	 *
	 * @see Comparator  For implementation details
	 */
	comparator: Comparator<K>;	
	/**
	 * Checks if the Map is storing a value under a specific key.
	 *
	 * @param 	key 	The key to check.
	 *
	 * @returns  		`true` if a value is stored under the key, `false` otherwise.
	 */
	contains(key: K): boolean;
	/**
	 * Gets a value stored under a key.
	 *
	 * @param 	key 	The key storing the desired value.
	 * 
	 * @returns 		The value stored under the key, or `null` if no value has been
	 * 					associated with the key.
	 */ 
	get(key: K): V | null;
	/**
	 * Stores a value under a key.
	 *
	 * If a value is already stored under the key, it is replaced.
	 *
	 * @param 	key 	The key to store the value under.
	 * @param 	value 	The value to store in the map.
	 *
	 * @returns 		The value previously stored under the key, or `null` if no
	 * 					value was stored there previously.
	 */
	set(key: K, value: V): V | null;
	/**
	 * Inserts a collection of entries into the map. If the collection specifies
	 * a mapping for a key that already has a value stored in this Map, this Map's
	 * entry is overwritten.
	 * 
	 * @param entries 	The collection of entries to insert.
	 */
	setAll(entries: Iterable<MapEntry<K, V>>): void;
	/**
	 * Sets the value under a key if and only if it does not yet have a value
	 * stored under it yet. If the key is not yet storing a value, the specified
	 * value is stored and `null` is returned. Otherwise, the value already stored
	 * under the key is returned.
	 *
	 * @param 	key 	The key to store the value under.
	 * @param 	value 	The value to store under the key.
	 *
	 * @returns 		`null` if the value is inserted, or the the value currently 
	 * 					stored under the key.
	 */
	setIfAbsent(key: K, value: V): V | null;
	/**
	 * Inserts a collection of entries into the map. Entries that already exist
	 * in this Map will not be overwritten.
	 * 
	 * @param entries 	The collection of entries to insert.
	 */
	setAllIfAbsent(entries: Iterable<MapEntry<K, V>>): void;
	/**
	 * Replaces a value stored under the specified key. If a value is not yet 
	 * stored under the key, nothing happens and `null` is returned.
	 *
	 * @param 	key 	The key associated with the value to replace.
	 * @param 	value 	The value to replace `key`s current value with.
	 *
	 * @returns 		The previous value stored under the key, or `null` if no value
	 * 					is associated with the key yet.
	 */
	replace(key: K, value: V): V;
	/**
	 * Deletes a key-value pair from the Map. If no mapping exists under `key`,
	 * `null` is returned.
	 *
	 * @param 	key 	The key of the key-value mapping to delete.
	 *
	 * @returns 		The deleted value if a mapping existed and was removed, or
	 * 					`null` if no mapping existed to remove.
	 */
	remove(key: K): V | null;
	/**
	 * Iterator function that yields every key-value pair in the map.
	 * If `false` is passed to `yield`, iteration is terminated.
	 */
	[Symbol.iterator]: Generator<MapEntry<K,V>, void, boolean>;
	/**
	 * Iterates over every key-value pair stored in the Map.
	 *
	 * Each key-value pair is passed to the iterator function. If the iterator
	 * returns false, iteration is terminated.
	 * 
	 * This method is identical to `forEach()`.
	 *
	 * @param 	iterator The iterator function to pass key-value pairs to.
	 *
	 * @returns 		The generator function specified above
	 */
	each(iterator: (key: K, value: V) => boolean): void;
	/**
	 * Iterates over every key-value pair stored in the Map.
	 *
	 * Each key-value pair is passed to the iterator function. If the iterator
	 * returns false, iteration is terminated.
	 *
	 * This method is identical to `each()`.
	 * 
	 * @param 	iterator The iterator function to pass key-value pairs to.
	 *
	 * @returns 		The generator function specified above
	 */
	forEach(iterator: (key: K, value: V) => boolean): void;
	/**
	 * Merges the entries of this Map with another map.
	 *
	 * The original Map is not modified by this operation. Instead, a new Map with
	 * the combined entries of both Maps is returned. If this Map and the other Map
	 * both store a mapping under the same key, this Map's entry is overwritten by
	 * the other Map's.
	 *
	 * @param 	other 	The Map to merge with this Map.
	 *
	 * @returns 		The combination of the two Maps.
	 */
	merge(other: Map<K, V>): Map<K, V>;
	/**
	 * Creates a new Map with any mappings that do not satisfy the predicate
	 * removed.
	 * 
	 * @param predicate A function that should return `true` to keep the entry
	 * 					in the new Map, `false` to remove it.
	 */
	filter(predicate: (key: K, value: V) => boolean): Map<K, V>;
	/**
	 * Maps every entry to a new, modified Map.
	 * 
	 * Every entry will be passed to the specified callback function. The
	 * resulting Map entries will be aggrigated into a new Map, which is returned.
	 * 
	 * @param callback 	The map function that takes in every entry and returns the
	 * 					modified value, which will then be put into the new Map. 
	 * 
	 * @returns 		The newly created Map.
	 */
	map<T>(callback: (key: K, value: V) => T): T[];
	map<T, U>(callback: (key: K, value: V) => MapEntry<T, U>): Map<T, U>;


}

