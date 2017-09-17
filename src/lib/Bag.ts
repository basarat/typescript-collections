import * as util from './util';
import Dictionary from './Dictionary';
import Set from './Set';

export default class Bag<T> {

    private toStrF: (item: T) => string;
    private dictionary: Dictionary<T, any>;
    private nElements: number;

    /**
     * Creates an empty bag.
     * @class <p>A bag is a special kind of set in which members are
     * allowed to appear more than once.</p>
     * <p>If the inserted elements are custom objects a function
     * which converts elements to unique strings must be provided. Example:</p>
     *
     * <pre>
     * function petToString(pet) {
     *  return pet.name;
     * }
     * </pre>
     *
     * @constructor
     * @param {function(Object):string=} toStrFunction optional function used
     * to convert elements to strings. If the elements aren't strings or if toString()
     * is not appropriate, a custom function which receives an object and returns a
     * unique string must be provided.
     */
    constructor(toStrFunction?: (item: T) => string) {
        this.toStrF = toStrFunction || util.defaultToString;
        this.dictionary = new Dictionary<T, any>(this.toStrF);
        this.nElements = 0;
    }


    /**
    * Adds nCopies of the specified object to this bag.
    * @param {Object} element element to add.
    * @param {number=} nCopies the number of copies to add, if this argument is
    * undefined 1 copy is added.
    * @return {boolean} true unless element is undefined.
    */
    add(element: T, nCopies: number = 1): boolean {

        if (util.isUndefined(element) || nCopies <= 0) {
            return false;
        }

        if (!this.contains(element)) {
            const node = {
                value: element,
                copies: nCopies
            };
            this.dictionary.setValue(element, node);
        } else {
            this.dictionary.getValue(element).copies += nCopies;
        }
        this.nElements += nCopies;
        return true;
    }

    /**
    * Counts the number of copies of the specified object in this bag.
    * @param {Object} element the object to search for..
    * @return {number} the number of copies of the object, 0 if not found
    */
    count(element: T): number {

        if (!this.contains(element)) {
            return 0;
        } else {
            return this.dictionary.getValue(element).copies;
        }
    }

    /**
     * Returns true if this bag contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this bag contains the specified element,
     * false otherwise.
     */
    contains(element: T): boolean {
        return this.dictionary.containsKey(element);
    }

    /**
    * Removes nCopies of the specified object to this bag.
    * If the number of copies to remove is greater than the actual number
    * of copies in the Bag, all copies are removed.
    * @param {Object} element element to remove.
    * @param {number=} nCopies the number of copies to remove, if this argument is
    * undefined 1 copy is removed.
    * @return {boolean} true if at least 1 element was removed.
    */
    remove(element: T, nCopies: number = 1) {

        if (util.isUndefined(element) || nCopies <= 0) {
            return false;
        }

        if (!this.contains(element)) {
            return false;
        } else {
            const node = this.dictionary.getValue(element);
            if (nCopies > node.copies) {
                this.nElements -= node.copies;
            } else {
                this.nElements -= nCopies;
            }
            node.copies -= nCopies;
            if (node.copies <= 0) {
                this.dictionary.remove(element);
            }
            return true;
        }
    }

    /**
     * Returns an array containing all of the elements in this big in arbitrary order,
     * including multiple copies.
     * @return {Array} an array containing all of the elements in this bag.
     */
    toArray(): T[] {
        const a: Array<T> = [];
        const values = this.dictionary.values();
        for (const node of values) {
            const element = node.value;
            const copies = node.copies;
            for (let j = 0; j < copies; j++) {
                a.push(element);
            }
        }
        return a;
    }

    /**
     * Returns a set of unique elements in this bag.
     * @return {collections.Set<T>} a set of unique elements in this bag.
     */
    toSet(): Set<T> {
        const toret = new Set<T>(this.toStrF);
        const elements = this.dictionary.values();
        for (const ele of elements) {
            const value = ele.value;
            toret.add(value);
        }
        return toret;
    }

    /**
     * Executes the provided function once for each element
     * present in this bag, including multiple copies.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element. To break the iteration you can
     * optionally return false.
     */
    forEach(callback: util.ILoopFunction<T>) {
        this.dictionary.forEach(function(k, v) {
            const value = v.value;
            const copies = v.copies;
            for (let i = 0; i < copies; i++) {
                if (callback(value) === false) {
                    return false;
                }
            }
            return true;
        });
    }
    /**
     * Returns the number of elements in this bag.
     * @return {number} the number of elements in this bag.
     */
    size(): number {
        return this.nElements;
    }

    /**
     * Returns true if this bag contains no elements.
     * @return {boolean} true if this bag contains no elements.
     */
    isEmpty(): boolean {
        return this.nElements === 0;
    }

    /**
     * Removes all of the elements from this bag.
     */
    clear(): void {
        this.nElements = 0;
        this.dictionary.clear();
    }

}// End of bag
