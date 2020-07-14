import copy from "fast-copy";
// import type { Map, MapEntry } from "../map";
import type { Comparator } from "../../lib/compare";
import { invariant } from "../../lib/util";
// import { NullIterator } from "../../lib/util";

/**
 *
 */
export class AVLGNode<K, V> /* implements Node<K, V> */ {

    constructor(
        public key: K,
        public data: V,
        private maxImbalance: number,
        private comparator: Comparator<K>,
        public left: AVLGNode<K, V> | null = null,
        public right: AVLGNode<K, V> | null = null,
    ) { }

    public get height(): number {
        // Height of left subtree
        let left: number  = this.left  ? this.left.height  : -1;
        // Height of right subtree
        let right: number = this.right ? this.right.height : -1;

        return 1 + Math.max(left, right);
    }

    public get size(): number {
        // Size of left node
        let left: number  =    this.left  ? this.left.size  : 0;
        // Size of right node
        let right: number =    this.right ? this.right.size : 0;

        return left + right + (this.data != null ? 1 : 0);
    }

    public get isEmpty(): boolean {
        return this.key  != null
            && this.data != null
            && (this.left?.isEmpty  ?? true)
            && (this.right?.isEmpty ?? true);
    }
    contains(key: K): boolean {
        let cmp: number = this.comparator(key, this.key);

        // Keys are equal
        if (!cmp) {
            return true;
            // Target key is less than this' key
        } else if (cmp < 0) {
            return this.left?.contains(key)  ?? false;
            // Target key is greater than this' key
        } else {
            return this.right?.contains(key) ?? false;
        }
    }
    get(key: K): V | null {
        let cmp: number = this.comparator(key, this.key);

        // Keys are equal
        if (!cmp) {
            return this.data;
            // Target key is less than this' key
        } else if (cmp < 0) {
            return this.left?.get(key)  ?? null;
            // Target key is greater than this' key
        } else {
            return this.right?.get(key) ?? null;
        }
    }
    set(key: K, value: V): [AVLGNode<K, V>, V | null] {
        invariant(value != null, "Passed value is null. Are you passing a MapEntry?");
        let cmp: number = this.comparator(key as K, this.key);

        // Keys are equal
        if (!cmp) {
            let oldData = this.data;
            this.data = value;
            return [this, oldData];

        // Target key is less than this' key
        } else if (cmp < 0) {
            const [tree, data] = this.left?.set(key, value)
                ?? [new AVLGNode<K, V>(key, value, this.maxImbalance, this.comparator), null];
            this.left = tree;
            return [this.rebalance(), data];

        // Target key is greater than this' key
        } else {
            const [tree, data] = this.right?.set(key, value)
                ?? [new AVLGNode(key, value, this.maxImbalance, this.comparator), null];
            this.right = tree;
            return [this.rebalance(), data];
        }
    }
    setIfAbsent(key: K, value: V): [AVLGNode<K, V>, V | null] {
        invariant(value != null, "Passed value is null. Are you passing a MapEntry?");
        let cmp: number = this.comparator(key as K, this.key);

        // Keys are equal
        if (!cmp) {
            return [this, this.data];

        // Target key is less than this' key
        } else if (cmp < 0) {
            const [tree, data] = this.left?.setIfAbsent(key, value)
                ?? [new AVLGNode<K, V>(key, value, this.maxImbalance, this.comparator), null];
            this.left = tree;
            return [this.rebalance(), data];

        // Target key is greater than this' key
        } else {
            const [tree, data] = this.right?.setIfAbsent(key, value)
                ?? [new AVLGNode(key, value, this.maxImbalance, this.comparator), null];
            this.right = tree;
            return [this.rebalance(), data];
        }
    }
    replace(key: K, value: V): V | null {
        invariant(value != null, "Passed value is null. Are you passing a MapEntry?");
        let cmp: number = this.comparator(key as K, this.key);

        // Keys are equal
        if (!cmp) {
            let oldData = this.data;
            this.data = value;
            return oldData;

        // Target key is less than this' key
        } else if (cmp < 0) {
            return this.left?.replace(key, value) ?? null;

        // Target key is greater than this' key
        } else {
            return this.right?.replace(key, value) ?? null;
        }
    }

    remove(key: K): [AVLGNode<K, V> | null, V | null] {
        let cmp: number = this.comparator(key, this.key);

        // Keys are equal
        if (!cmp) {
            // No re-arrangement is needed for leaf nodes
            if (this.isLeaf()) {
                return [null, this.data];
            // Replace node w/ in order successor and delete the duplicate
            } else if (this.right) {
                let ios: AVLGNode<K, V> = this.inOrderSuccessor()!;
                let oldData = this.data;
                this.key = ios.key;
                this.data = ios.data;
                let [tree] = this.right.remove(ios.key);
                this.right = tree?.rebalance() ?? null;
                return [this, oldData];
            // No right subtree, this' left subtree replaces this node
            } else {
                invariant(this.left);
                return [this.left, this.data];
            }

        // Target key is less than this' key
        } else if (cmp < 0) {
            if (this.left) {
                let [tree, data] = this.left.remove(key);
                this.left = tree;
                return [this.rebalance(), data];
            } else {
                return [this, null];
            }

        // Target key is greater than this' key
        } else {
            if (this.right) {
                let [tree, data] = this.right.remove(key);
                this.right = tree;
                return [this.rebalance(), data];
            } else {
                return [this, null];
            }
        }
    }

    /**
     * Gets the balance of the node.
     *
     * B(n) = H(n_L) - H(n_R)
     *
     * @return the balance of the node
     */
    public balance(): number {
        let leftHeight = this.left?.height ?? -1;
        let rightHeight = this.right?.height ?? -1;

        return leftHeight - rightHeight;
    }

    public clone(): AVLGNode<K, V> {
        return new AVLGNode<K,V> (
            copy(this.key),
            copy(this.data),
            this.maxImbalance,
            this.comparator,
            this.left?.clone(),
            this.right?.clone()
        );
    }
    private inOrderSuccessor() {
        invariant(this.right);
        return this.right.min;
    }
    public get min(): AVLGNode<K, V> {
        return this.left?.min ?? this;
    }
    public get max(): AVLGNode<K, V> {
        return this.right?.max ?? this;
    }

    *[Symbol.iterator](): Generator<AVLGNode<K, V>, void, undefined> {
        yield* inOrder(this);
    }

    /**
     * Performs rotations to rebalance this node (if necessary) after mutations (set, get, replace, etc.).
     *
     * @returns the new, rebalanced node
     */
    private rebalance(): AVLGNode<K, V> {
        let balance = this.balance();
        if (Math.abs(balance) <= this.maxImbalance) {
            return this;
        } else if (balance > this.maxImbalance) {
            invariant(this.left);
            return this.left.balance() >= 0
                ? this.rotateRight()
                : this.rotateLeftRight();
        } else {
            invariant(this.right);
            invariant(balance < -this.maxImbalance);
            return this.right.balance() <= 0
                ? this.rotateLeft()
                : this.rotateRightLeft();
        }
    }

    /**
     * Rotates this node to the left.
     *
     * The rotation looks like this:
     *
     * ```
     *
     * t               u
     *  \             / \
     *   u     ->    t   v
     *    \
     *     v
     * ```
     * @return The new root of the node
     */
    private rotateLeft(): AVLGNode<K, V> {
        invariant(this.right);
        let temp = this.right;
        this.right = temp.left;
        temp.left = this;

        return temp;
    }
    /**
     * Rotates this node to the right.
     *
     * The rotation looks like this:
     *
     * ```
     *     t            u
     *    /            / \
     *   u     ->     v   t
     *  /
     * v
     * ```
     * @return The new root of the node
     */
    private rotateRight(): AVLGNode<K, V> {
        invariant(this.left);
        let temp = this.left;
        this.left = temp.right;
        temp.right = this;

        return temp;
    }
    /**
     * Rotate Left Right
     */
    private rotateLeftRight(): AVLGNode<K, V> {
        invariant(this.left);
        this.left = this.left.rotateLeft();
        return this.rotateRight();
    }
    /**
     * Rotate Right Left
     */
    private rotateRightLeft(): AVLGNode<K, V> {
        invariant(this.right);
        this.right = this.right.rotateRight();
        return this.rotateLeft();
    }

    private isLeaf(): boolean {
        return this.left == null && this.right == null;
    }
}

export function* preOrder<K, V>(node: AVLGNode<K, V> | null): Generator<AVLGNode<K, V>, void, undefined> {
    if (node == null) {
        return;
    }
    yield node;
    yield* preOrder(node.left);
    yield* preOrder(node.right);
}

export function* inOrder<K, V>(node: AVLGNode<K, V> | null): Generator<AVLGNode<K, V>, void, undefined> {
    if (node == null) {
        return;
    }
    yield* inOrder(node.left);
    yield node;
    yield* inOrder(node.right);
}

export function* postOrder<K, V>(node: AVLGNode<K, V> | null): Generator<AVLGNode<K, V>, void, undefined> {
    if (node == null) {
        return;
    }
    yield* postOrder(node.left);
    yield* postOrder(node.right);
    yield node;
}
