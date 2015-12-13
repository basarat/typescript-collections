import * as collections from "./util";
import LinkedList from "./LinkedList";
import Heap from "./Heap";

export default class Queue<T>{

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
    dequeue(): T {
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
    peek(): T {

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
    contains(elem: T, equalsFunction?: collections.IEqualsFunction<T>): boolean {
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
    forEach(callback: collections.ILoopFunction<T>) {
        this.list.forEach(callback);
    }

} // End of queue


export class PriorityQueue<T> {

    private heap: Heap<T>;
    /**
     * Creates an empty priority queue.
     * @class <p>In a priority queue each element is associated with a "priority",
     * elements are dequeued in highest-priority-first order (the elements with the
     * highest priority are dequeued first). Priority Queues are implemented as heaps.
     * If the inserted elements are custom objects a compare function must be provided,
     * otherwise the <=, === and >= operators are used to compare object priority.</p>
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
     * function used to compare two element priorities. Must return a negative integer,
     * zero, or a positive integer as the first argument is less than, equal to,
     * or greater than the second.
     */
    constructor(compareFunction?: collections.ICompareFunction<T>) {
        this.heap = new Heap<T>(collections.reverseCompareFunction(compareFunction));
    }

    /**
     * Inserts the specified element into this priority queue.
     * @param {Object} element the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    enqueue(element: T): boolean {
        return this.heap.add(element);
    }

    /**
     * Inserts the specified element into this priority queue.
     * @param {Object} element the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    add(element: T): boolean {
        return this.heap.add(element);
    }

    /**
     * Retrieves and removes the highest priority element of this queue.
     * @return {*} the the highest priority element of this queue,
     *  or undefined if this queue is empty.
     */
    dequeue(): T {
        if (this.heap.size() !== 0) {
            const el = this.heap.peek();
            this.heap.removeRoot();
            return el;
        }
        return undefined;
    }

    /**
     * Retrieves, but does not remove, the highest priority element of this queue.
     * @return {*} the highest priority element of this queue, or undefined if this queue is empty.
     */
    peek(): T {
        return this.heap.peek();
    }

    /**
     * Returns true if this priority queue contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this priority queue contains the specified element,
     * false otherwise.
     */
    contains(element: T): boolean {
        return this.heap.contains(element);
    }

    /**
     * Checks if this priority queue is empty.
     * @return {boolean} true if and only if this priority queue contains no items; false
     * otherwise.
     */
    isEmpty(): boolean {
        return this.heap.isEmpty();
    }

    /**
     * Returns the number of elements in this priority queue.
     * @return {number} the number of elements in this priority queue.
     */
    size(): number {
        return this.heap.size();
    }

    /**
     * Removes all of the elements from this priority queue.
     */
    clear(): void {
        this.heap.clear();
    }

    /**
     * Executes the provided function once for each element present in this queue in
     * no particular order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    forEach(callback: collections.ILoopFunction<T>) {
        this.heap.forEach(callback);
    }

} // end of priority queue
