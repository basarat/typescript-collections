import * as util from './util';
import LinkedList from './LinkedList';
import Heap from './Heap';

export default class Queue<T> {

    /**
     * List containing the elements.
     * @type collections.LinkedList
     * @private
     */
    private list: LinkedList<T>;

    /**
     * Creates an empty queue.
     * @class A queue is a First-In-First-Out (FIFO) data structure, the first
     * element added to the queue will be the first one to be removed. This
     * implementation uses a linked list as a container.
     * @constructor
     */
    constructor() {
        this.list = new LinkedList<T>();
    }


    /**
     * Inserts the specified element into the end of this queue.
     * @param {Object} elem the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    enqueue(elem: T): boolean {
        return this.list.add(elem);
    }
    /**
     * Inserts the specified element into the end of this queue.
     * @param {Object} elem the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    add(elem: T): boolean {
        return this.list.add(elem);
    }
    /**
     * Retrieves and removes the head of this queue.
     * @return {*} the head of this queue, or undefined if this queue is empty.
     */
    dequeue(): T | undefined {
        if (this.list.size() !== 0) {
            const el = this.list.first();
            this.list.removeElementAtIndex(0);
            return el;
        }
        return undefined;
    }
    /**
     * Retrieves, but does not remove, the head of this queue.
     * @return {*} the head of this queue, or undefined if this queue is empty.
     */
    peek(): T | undefined {

        if (this.list.size() !== 0) {
            return this.list.first();
        }
        return undefined;
    }

    /**
     * Returns the number of elements in this queue.
     * @return {number} the number of elements in this queue.
     */
    size(): number {
        return this.list.size();
    }

    /**
     * Returns true if this queue contains the specified element.
     * <p>If the elements inside this stack are
     * not comparable with the === operator, a custom equals function should be
     * provided to perform searches, the function must receive two arguments and
     * return true if they are equal, false otherwise. Example:</p>
     *
     * <pre>
     * const petsAreEqualByName (pet1, pet2) {
     *  return pet1.name === pet2.name;
     * }
     * </pre>
     * @param {Object} elem element to search for.
     * @param {function(Object,Object):boolean=} equalsFunction optional
     * function to check if two elements are equal.
     * @return {boolean} true if this queue contains the specified element,
     * false otherwise.
     */
    contains(elem: T, equalsFunction?: util.IEqualsFunction<T>): boolean {
        return this.list.contains(elem, equalsFunction);
    }

    /**
     * Checks if this queue is empty.
     * @return {boolean} true if and only if this queue contains no items; false
     * otherwise.
     */
    isEmpty(): boolean {
        return this.list.size() <= 0;
    }

    /**
     * Removes all of the elements from this queue.
     */
    clear(): void {
        this.list.clear();
    }

    /**
     * Executes the provided function once for each element present in this queue in
     * FIFO order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<T>) {
        this.list.forEach(callback);
    }

} // End of queue
