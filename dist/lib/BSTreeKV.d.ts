import * as util from './util';
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
    private root;
    private compare;
    private nElements;
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
    constructor(compareFunction?: util.ICompareFunction<K>);
    /**
     * Adds the specified element to this tree if it is not already present.
     * @param {Object} element the element to insert.
     * @return {boolean} true if this tree did not already contain the specified element.
     */
    add(element: V): boolean;
    /**
     * Removes all of the elements from this tree.
     */
    clear(): void;
    /**
     * Returns true if this tree contains no elements.
     * @return {boolean} true if this tree contains no elements.
     */
    isEmpty(): boolean;
    /**
     * Returns the number of elements in this tree.
     * @return {number} the number of elements in this tree.
     */
    size(): number;
    /**
     * Returns true if this tree contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this tree contains the specified element,
     * false otherwise.
     */
    contains(element: K): boolean;
    /**
     * Looks for the value with the provided search key.
     * @param {Object} element The key to look for
     * @return {Object} The value found or undefined if it was not found.
     */
    search(element: K): V | undefined;
    /**
     * Removes the specified element from this tree if it is present.
     * @return {boolean} true if this tree contained the specified element.
     */
    remove(element: K): boolean;
    /**
     * Executes the provided function once for each element present in this tree in
     * in-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    inorderTraversal(callback: util.ILoopFunction<V>): void;
    /**
     * Executes the provided function once for each element present in this tree in pre-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    preorderTraversal(callback: util.ILoopFunction<V>): void;
    /**
     * Executes the provided function once for each element present in this tree in post-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    postorderTraversal(callback: util.ILoopFunction<V>): void;
    /**
     * Executes the provided function once for each element present in this tree in
     * level-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    levelTraversal(callback: util.ILoopFunction<V>): void;
    /**
     * Returns the minimum element of this tree.
     * @return {*} the minimum element of this tree or undefined if this tree is
     * is empty.
     */
    minimum(): V | undefined;
    /**
     * Returns the maximum element of this tree.
     * @return {*} the maximum element of this tree or undefined if this tree is
     * is empty.
     */
    maximum(): V | undefined;
    /**
     * Executes the provided function once for each element present in this tree in inorder.
     * Equivalent to inorderTraversal.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<V>): void;
    /**
     * Returns an array containing all of the elements in this tree in in-order.
     * @return {Array} an array containing all of the elements in this tree in in-order.
     */
    toArray(): V[];
    /**
     * Returns the height of this tree.
     * @return {number} the height of this tree or -1 if is empty.
     */
    height(): number;
    /**
     * @private
     */
    private searchNode(node, element);
    /**
     * @private
     */
    private transplant(n1, n2);
    /**
     * @private
     */
    private removeNode(node);
    /**
     * @private
     */
    private inorderTraversalAux(node, callback, signal);
    /**
     * @private
     */
    private levelTraversalAux(node, callback);
    /**
     * @private
     */
    private preorderTraversalAux(node, callback, signal);
    /**
     * @private
     */
    private postorderTraversalAux(node, callback, signal);
    /**
     * @private
     */
    private minimumAux(node);
    private minimumAux(node);
    /**
     * @private
     */
    private maximumAux(node);
    private maximumAux(node);
    /**
     * @private
     */
    private heightAux(node);
    private insertNode(node);
    /**
     * @private
     */
    private createNode(element);
}
