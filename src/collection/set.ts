import { Collection } from './collection';

export class ArrayList<T> implements Collection<T> {

    private arr: T[];

    constructor(elements?: T[]) {
        this.arr = elements ?? [] as T[];
    }
    insert(key: T): this {
        this.arr.push(key);
        return this;
    }
    insertAll(keys: T[]): this {
        for (let key of keys) {
            this.arr.push(key);
        }

        return this;
    }
    contains(key: T): boolean {
        return this.arr.includes(key);
    }
    delete(key: T): T | null {
        let included = this.arr.includes(key);
        if (!included) return null;

        this.arr = this.arr.filter(elem => elem !== key)
        return key;
    }

}