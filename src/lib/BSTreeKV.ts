import * as util from './util';
import Queue from './Queue';
// Internal interface for BST
interface BSTreeNode<T> {
    element: T;
    leftCh: BSTreeNode<T> | null;
    rightCh: BSTreeNode<T> | null;
    parent: BSTreeNode<T> | null;
}

/**
 * General binary search tree implementation.
 *
 * This interface allows one to search elements using a subset of their attributes (thus the
 * tree can be used as an index for complex objects).
 * The attributes required to define an ordering in the tree must be defined in the type K.
 * Any additional attribute must be defined in the type V.
 *
 * @see BSTree
 */
export default class BSTreeKV<K, V extends K> {

    private root: BSTreeNode<V> | null;
    private compare: util.ICompareFunction<K>;
    private nElements: number;
    /**
     * Creates an empty binary search tree.
     * @class <p>A binary search tree is a binary tree in which each
     * internal node stores an element such that the elements stored in the
     * left subtree are less than it and the elements
     * stored in the right subtree are greater.</p>
     * <p>Formally, a binary search tree is a node-based binary tree data structure which
     * has the following properties:</p>
     * <ul>
     * <li>The left subtree of a node contains only nodes with elements less
     * than the node's element</li>
     * <li>The right subtree of a node contains only nodes with elements greater
     * than the node's element</li>
     * <li>Both the left and right subtrees must also be binary search trees.</li>
     * </ul>
     * <p>If the inserted elements are custom objects a compare function must
     * be provided at construction time, otherwise the <=, === and >= operators are
     * used to compare elements. Example:</p>
     * <pre>
     * function compare(a, b) {
     *  if (a is less than b by some ordering criterion) {
     *     return -1;
     *  } if (a is greater than b by the ordering criterion) {
     *     return 1;
     *  }
     *  // a must be equal to b
     *  return 0;
     * }
     * </pre>
     * @constructor
     * @param {function(Object,Object):number=} compareFunction optional
     * function used to compare two elements. Must return a negative integer,
     * zero, or a positive integer as the first argument is less than, equal to,
     * or greater than the second.
     */
    constructor(compareFunction?: util.ICompareFunction<K>) {
        this.root = null;
        this.compare = compareFunction || util.defaultCompare;
        this.nElements = 0;
    }

    /**
     * Adds the specified element to this tree if it is not already present.
     * @param {Object} element the element to insert.
     * @return {boolean} true if this tree did not already contain the specified element.
     */
    add(element: V): boolean {
        if (util.isUndefined(element)) {
            return false;
        }

        if (this.insertNode(this.createNode(element)) !== null) {
            this.nElements++;
            return true;
        }
        return false;
    }

    /**
     * Removes all of the elements from this tree.
     */
    clear(): void {
        this.root = null;
        this.nElements = 0;
    }

    /**
     * Returns true if this tree contains no elements.
     * @return {boolean} true if this tree contains no elements.
     */
    isEmpty(): boolean {
        return this.nElements === 0;
    }

    /**
     * Returns the number of elements in this tree.
     * @return {number} the number of elements in this tree.
     */
    size(): number {
        return this.nElements;
    }

    /**
     * Returns true if this tree contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this tree contains the specified element,
     * false otherwise.
     */
    contains(element: K): boolean {
        if (util.isUndefined(element)) {
            return false;
        }
        return this.searchNode(this.root, element) !== null;
    }

    /**
     * Looks for the value with the provided search key.
     * @param {Object} element The key to look for
     * @return {Object} The value found or undefined if it was not found.
     */
    search(element: K): V | undefined {
        const ret = this.searchNode(this.root, element);
        if (ret === null) {
            return undefined;
        }
        return ret.element;
    }

    /**
     * Removes the specified element from this tree if it is present.
     * @return {boolean} true if this tree contained the specified element.
     */
    remove(element: K): boolean {
        const node = this.searchNode(this.root, element);
        if (node === null) {
            return false;
        }
        this.removeNode(node);
        this.nElements--;
        return true;
    }

    /**
     * Executes the provided function once for each element present in this tree in
     * in-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    inorderTraversal(callback: util.ILoopFunction<V>): void {
        this.inorderTraversalAux(this.root, callback, {
            stop: false
        });
    }

    /**
     * Executes the provided function once for each element present in this tree in pre-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    preorderTraversal(callback: util.ILoopFunction<V>): void {
        this.preorderTraversalAux(this.root, callback, {
            stop: false
        });
    }

    /**
     * Executes the provided function once for each element present in this tree in post-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    postorderTraversal(callback: util.ILoopFunction<V>): void {
        this.postorderTraversalAux(this.root, callback, {
            stop: false
        });
    }

    /**
     * Executes the provided function once for each element present in this tree in
     * level-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    levelTraversal(callback: util.ILoopFunction<V>): void {
        this.levelTraversalAux(this.root, callback);
    }

    /**
     * Returns the minimum element of this tree.
     * @return {*} the minimum element of this tree or undefined if this tree is
     * is empty.
     */
    minimum(): V | undefined {
        if (this.isEmpty() || this.root === null) {
            return undefined;
        }
        return this.minimumAux(this.root).element;
    }

    /**
     * Returns the maximum element of this tree.
     * @return {*} the maximum element of this tree or undefined if this tree is
     * is empty.
     */
    maximum(): V | undefined {
        if (this.isEmpty() || this.root === null) {
            return undefined;
        }
        return this.maximumAux(this.root).element;
    }

    /**
     * Executes the provided function once for each element present in this tree in inorder.
     * Equivalent to inorderTraversal.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<V>): void {
        this.inorderTraversal(callback);
    }

    /**
     * Returns an array containing all of the elements in this tree in in-order.
     * @return {Array} an array containing all of the elements in this tree in in-order.
     */
    toArray(): V[] {
        const array: Array<V> = [];
        this.inorderTraversal(function(element: V): boolean {
            array.push(element);
            return true;
        });
        return array;
    }

    /**
     * Returns the height of this tree.
     * @return {number} the height of this tree or -1 if is empty.
     */
    height(): number {
        return this.heightAux(this.root);
    }

    /**
    * @private
    */
    private searchNode(node: BSTreeNode<V> | null, element: K): BSTreeNode<V> | null {
        let cmp: number = 1;
        while (node !== null && cmp !== 0) {
            cmp = this.compare(element, node.element);
            if (cmp < 0) {
                node = node.leftCh;
            } else if (cmp > 0) {
                node = node.rightCh;
            }
        }
        return node;
    }

    /**
    * @private
    */
    private transplant(n1: BSTreeNode<V>, n2: BSTreeNode<V> | null): void {
        if (n1.parent === null) {
            this.root = n2;
        } else if (n1 === n1.parent.leftCh) {
            n1.parent.leftCh = n2;
        } else {
            n1.parent.rightCh = n2;
        }
        if (n2 !== null) {
            n2.parent = n1.parent;
        }
    }

    /**
    * @private
    */
    private removeNode(node: BSTreeNode<V>): void {
        if (node.leftCh === null) {
            this.transplant(node, node.rightCh);
        } else if (node.rightCh === null) {
            this.transplant(node, node.leftCh);
        } else {
            const y = this.minimumAux(node.rightCh);
            if (y.parent !== node) {
                this.transplant(y, y.rightCh);
                y.rightCh = node.rightCh;
                y.rightCh.parent = y;
            }
            this.transplant(node, y);
            y.leftCh = node.leftCh;
            y.leftCh.parent = y;
        }
    }

    /**
    * @private
    */
    private inorderTraversalAux(node: BSTreeNode<V> | null, callback: util.ILoopFunction<V>, signal: { stop: boolean; }): void {
        if (node === null || signal.stop) {
            return;
        }
        this.inorderTraversalAux(node.leftCh, callback, signal);
        if (signal.stop) {
            return;
        }
        signal.stop = callback(node.element) === false;
        if (signal.stop) {
            return;
        }
        this.inorderTraversalAux(node.rightCh, callback, signal);
    }

    /**
    * @private
    */
    private levelTraversalAux(node: BSTreeNode<V> | null, callback: util.ILoopFunction<V>) {
        const queue = new Queue<BSTreeNode<V>>();
        if (node !== null) {
            queue.enqueue(node);
        }
        node = queue.dequeue() || null;
        while (node != null) {
            if (callback(node.element) === false) {
                return;
            }
            if (node.leftCh !== null) {
                queue.enqueue(node.leftCh);
            }
            if (node.rightCh !== null) {
                queue.enqueue(node.rightCh);
            }
            node = queue.dequeue() || null;
        }
    }

    /**
    * @private
    */
    private preorderTraversalAux(node: BSTreeNode<V> | null, callback: util.ILoopFunction<V>, signal: { stop: boolean; }) {
        if (node === null || signal.stop) {
            return;
        }
        signal.stop = callback(node.element) === false;
        if (signal.stop) {
            return;
        }
        this.preorderTraversalAux(node.leftCh, callback, signal);
        if (signal.stop) {
            return;
        }
        this.preorderTraversalAux(node.rightCh, callback, signal);
    }
    /**
    * @private
    */
    private postorderTraversalAux(node: BSTreeNode<V> | null, callback: util.ILoopFunction<V>, signal: { stop: boolean; }) {
        if (node === null || signal.stop) {
            return;
        }
        this.postorderTraversalAux(node.leftCh, callback, signal);
        if (signal.stop) {
            return;
        }
        this.postorderTraversalAux(node.rightCh, callback, signal);
        if (signal.stop) {
            return;
        }
        signal.stop = callback(node.element) === false;
    }

    /**
    * @private
    */
    private minimumAux(node: BSTreeNode<V>): BSTreeNode<V>;
    private minimumAux(node: BSTreeNode<V> | null): BSTreeNode<V> | null;
    private minimumAux(node: BSTreeNode<V> | null): BSTreeNode<V> | null {
        while (node != null && node.leftCh !== null) {
            node = node.leftCh;
        }
        return node;
    }

    /**
    * @private
    */
    private maximumAux(node: BSTreeNode<V>): BSTreeNode<V>;
    private maximumAux(node: BSTreeNode<V> | null): BSTreeNode<V> | null;
    private maximumAux(node: BSTreeNode<V> | null): BSTreeNode<V> | null {
        while (node != null && node.rightCh !== null) {
            node = node.rightCh;
        }
        return node;
    }

    /**
      * @private
      */
    private heightAux(node: BSTreeNode<V> | null): number {
        if (node === null) {
            return -1;
        }
        return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
    }

    /*
    * @private
    */
    private insertNode(node: BSTreeNode<V>): BSTreeNode<V> | null {

        let parent: any = null;
        let position = this.root;
        while (position !== null) {
            const cmp = this.compare(node.element, position.element);
            if (cmp === 0) {
                return null;
            } else if (cmp < 0) {
                parent = position;
                position = position.leftCh;
            } else {
                parent = position;
                position = position.rightCh;
            }
        }
        node.parent = parent;
        if (parent === null) {
            // tree is empty
            this.root = node;
        } else if (this.compare(node.element, parent.element) < 0) {
            parent.leftCh = node;
        } else {
            parent.rightCh = node;
        }
        return node;
    }

    /**
    * @private
    */
    private createNode(element: V): BSTreeNode<V> {
        return {
            element: element,
            leftCh: null,
            rightCh: null,
            parent: null
        };
    }

}
