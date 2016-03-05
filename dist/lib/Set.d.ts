import * as util from './util';
export default class Set<T> {
    private dictionary;
    /**
     * Creates an empty set.
     * @class <p>A set is a data structure that contains no duplicate items.</p>
     * <p>If the inserted elements are custom objects a function
     * which converts elements to strings must be provided. Example:</p>
     *
     * <pre>
     * function petToString(pet) {
     *  return pet.name;
     * }
     * </pre>
     *
     * @constructor
     * @param {function(Object):string=} toStringFunction optional function used
     * to convert elements to strings. If the elements aren't strings or if toString()
     * is not appropriate, a custom function which receives a onject and returns a
     * unique string must be provided.
     */
    constructor(toStringFunction?: (item: T) => string);
    /**
     * Returns true if this set contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this set contains the specified element,
     * false otherwise.
     */
    contains(element: T): boolean;
    /**
     * Adds the specified element to this set if it is not already present.
     * @param {Object} element the element to insert.
     * @return {boolean} true if this set did not already contain the specified element.
     */
    add(element: T): boolean;
    /**
     * Performs an intersecion between this an another set.
     * Removes all values that are not present this set and the given set.
     * @param {collections.Set} otherSet other set.
     */
    intersection(otherSet: Set<T>): void;
    /**
     * Performs a union between this an another set.
     * Adds all values from the given set to this set.
     * @param {collections.Set} otherSet other set.
     */
    union(otherSet: Set<T>): void;
    /**
     * Performs a difference between this an another set.
     * Removes from this set all the values that are present in the given set.
     * @param {collections.Set} otherSet other set.
     */
    difference(otherSet: Set<T>): void;
    /**
     * Checks whether the given set contains all the elements in this set.
     * @param {collections.Set} otherSet other set.
     * @return {boolean} true if this set is a subset of the given set.
     */
    isSubsetOf(otherSet: Set<T>): boolean;
    /**
     * Removes the specified element from this set if it is present.
     * @return {boolean} true if this set contained the specified element.
     */
    remove(element: T): boolean;
    /**
     * Executes the provided function once for each element
     * present in this set.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one arguments: the element. To break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<T>): void;
    /**
     * Returns an array containing all of the elements in this set in arbitrary order.
     * @return {Array} an array containing all of the elements in this set.
     */
    toArray(): T[];
    /**
     * Returns true if this set contains no elements.
     * @return {boolean} true if this set contains no elements.
     */
    isEmpty(): boolean;
    /**
     * Returns the number of elements in this set.
     * @return {number} the number of elements in this set.
     */
    size(): number;
    /**
     * Removes all of the elements from this set.
     */
    clear(): void;
    toString(): string;
}
