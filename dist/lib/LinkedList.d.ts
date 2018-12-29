import * as util from './util';
export interface ILinkedListNode<T> {
    element: T;
    next: ILinkedListNode<T> | null;
}
export default class LinkedList<T> {
    /**
     * First node in the list
     * @type {Object}
     * @private
     */
    firstNode: ILinkedListNode<T> | null;
    /**
     * Last node in the list
     * @type {Object}
     * @private
     */
    private lastNode;
    /**
     * Number of elements in the list
     * @type {number}
     * @private
     */
    private nElements;
    /**
     * Creates an empty Linked List.
     * @class A linked list is a data structure consisting of a group of nodes
     * which together represent a sequence.
     * @constructor
     */
    constructor();
    /**
     * Adds an element to this list.
     * @param {Object} item element to be added.
     * @param {number=} index optional index to add the element. If no index is specified
     * the element is added to the end of this list.
     * @return {boolean} true if the element was added or false if the index is invalid
     * or if the element is undefined.
     */
    add(item: T, index?: number): boolean;
    /**
     * Returns the first element in this list.
     * @return {*} the first element of the list or undefined if the list is
     * empty.
     */
    first(): T | undefined;
    /**
     * Returns the last element in this list.
     * @return {*} the last element in the list or undefined if the list is
     * empty.
     */
    last(): T | undefined;
    /**
     * Returns the element at the specified position in this list.
     * @param {number} index desired index.
     * @return {*} the element at the given index or undefined if the index is
     * out of bounds.
     */
    elementAtIndex(index: number): T | undefined;
    /**
     * Returns the index in this list of the first occurrence of the
     * specified element, or -1 if the List does not contain this element.
     * <p>If the elements inside this list are
     * not comparable with the === operator a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * const petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} item element to search for.
     * @param {function(Object,Object):boolean=} equalsFunction Optional
     * function used to check if two elements are equal.
     * @return {number} the index in this list of the first occurrence
     * of the specified element, or -1 if this list does not contain the
     * element.
     */
    indexOf(item: T, equalsFunction?: util.IEqualsFunction<T>): number;
    /**
     * Returns true if this list contains the specified element.
     * <p>If the elements inside the list are
     * not comparable with the === operator a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * const petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} item element to search for.
     * @param {function(Object,Object):boolean=} equalsFunction Optional
     * function used to check if two elements are equal.
     * @return {boolean} true if this list contains the specified element, false
     * otherwise.
     */
    contains(item: T, equalsFunction?: util.IEqualsFunction<T>): boolean;
    /**
     * Removes the first occurrence of the specified element in this list.
     * <p>If the elements inside the list are
     * not comparable with the === operator a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * const petsAreEqualByName = function(pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} item element to be removed from this list, if present.
     * @return {boolean} true if the list contained the specified element.
     */
    remove(item: T, equalsFunction?: util.IEqualsFunction<T>): boolean;
    /**
     * Removes all of the elements from this list.
     */
    clear(): void;
    /**
     * Returns true if this list is equal to the given list.
     * Two lists are equal if they have the same elements in the same order.
     * @param {LinkedList} other the other list.
     * @param {function(Object,Object):boolean=} equalsFunction optional
     * function used to check if two elements are equal. If the elements in the lists
     * are custom objects you should provide a function, otherwise
     * the === operator is used to check equality between elements.
     * @return {boolean} true if this list is equal to the given list.
     */
    equals(other: any, equalsFunction?: util.IEqualsFunction<T>): boolean;
    /**
     * @private
     */
    private equalsAux(n1, n2, eqF);
    /**
     * Removes the element at the specified position in this list.
     * @param {number} index given index.
     * @return {*} removed element or undefined if the index is out of bounds.
     */
    removeElementAtIndex(index: number): T | undefined;
    /**
     * Executes the provided function once for each element present in this list in order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<T>): void;
    /**
     * Reverses the order of the elements in this linked list (makes the last
     * element first, and the first element last).
     */
    reverse(): void;
    /**
     * Returns an array containing all of the elements in this list in proper
     * sequence.
     * @return {Array.<*>} an array containing all of the elements in this list,
     * in proper sequence.
     */
    toArray(): T[];
    /**
     * Returns the number of elements in this list.
     * @return {number} the number of elements in this list.
     */
    size(): number;
    /**
     * Returns true if this list contains no elements.
     * @return {boolean} true if this list contains no elements.
     */
    isEmpty(): boolean;
    toString(): string;
    /**
     * @private
     */
    private nodeAtIndex(index);
    /**
     * @private
     */
    private createNode(item);
}
