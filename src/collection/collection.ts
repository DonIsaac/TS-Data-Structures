export interface Collection<T> {
    
    /**
     * Inserts an element into this Collection.
     * 
     * @param element the element to insert.
     * 
     * @returns `this` for method chaining.
     * 
     * @throws If `element` is null or undefined.
     */
    insert(element: T): this;
    /**
     * Inserts a list of elements into this Collection.
     * 
     * @param elements the elements to insert
     * 
     * @returns `this` for method chaining.
     * 
     * @throws If the element list is null or undefined.
     */
    insertAll(elements: T[]): this;
    /**
     * Checks if a element is stored in this Collection.
     * 
     * @param element the key to check.
     * 
     * @returns `true` if the element is inside the Collection, `false` otherwise.
     * 
     * @throws If `element` is null or undefined.
     */
    contains(element: T): boolean;
    /**
     * Removes a element from this Collection.
     *  
     * @param element the key to remove.
     * 
     * @returns The deleted element if the key was stored in the Collection, `null` if it was not stored.
     * 
     * @throws if `element` is null or undefined.
     */
    delete(element: T): T | null;
}