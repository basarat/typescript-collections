"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var collections = require("./util");
var arrays = require("./arrays");
var Heap = /** @class */ (function () {
    /**
     * Creates an empty Heap.
     * @class
     * <p>A heap is a binary tree, where the nodes maintain the heap property:
     * each node is smaller than each of its children and therefore a MinHeap
     * This implementation uses an array to store elements.</p>
     * <p>If the inserted elements are custom objects a compare function must be provided,
     *  at construction time, otherwise the <=, === and >= operators are
     * used to compare elements. Example:</p>
     *
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
     *
     * <p>If a Max-Heap is wanted (greater elements on top) you can a provide a
     * reverse compare function to accomplish that behavior. Example:</p>
     *
     * <pre>
     * function reverseCompare(a, b) {
     *  if (a is less than b by some ordering criterion) {
     *     return 1;
     *  } if (a is greater than b by the ordering criterion) {
     *     return -1;
     *  }
     *  // a must be equal to b
     *  return 0;
     * }
     * </pre>
     *
     * @constructor
     * @param {function(Object,Object):number=} compareFunction optional
     * function used to compare two elements. Must return a negative integer,
     * zero, or a positive integer as the first argument is less than, equal to,
     * or greater than the second.
     */
    function Heap(compareFunction) {
        /**
         * Array used to store the elements of the heap.
         * @type {Array.<Object>}
         * @private
         */
        this.data = [];
        this.compare = compareFunction || collections.defaultCompare;
    }
    /**
     * Returns the index of the left child of the node at the given index.
     * @param {number} nodeIndex The index of the node to get the left child
     * for.
     * @return {number} The index of the left child.
     * @private
     */
    Heap.prototype.leftChildIndex = function (nodeIndex) {
        return (2 * nodeIndex) + 1;
    };
    /**
     * Returns the index of the right child of the node at the given index.
     * @param {number} nodeIndex The index of the node to get the right child
     * for.
     * @return {number} The index of the right child.
     * @private
     */
    Heap.prototype.rightChildIndex = function (nodeIndex) {
        return (2 * nodeIndex) + 2;
    };
    /**
     * Returns the index of the parent of the node at the given index.
     * @param {number} nodeIndex The index of the node to get the parent for.
     * @return {number} The index of the parent.
     * @private
     */
    Heap.prototype.parentIndex = function (nodeIndex) {
        return Math.floor((nodeIndex - 1) / 2);
    };
    /**
     * Returns the index of the smaller child node (if it exists).
     * @param {number} leftChild left child index.
     * @param {number} rightChild right child index.
     * @return {number} the index with the minimum value or -1 if it doesn't
     * exists.
     * @private
     */
    Heap.prototype.minIndex = function (leftChild, rightChild) {
        if (rightChild >= this.data.length) {
            if (leftChild >= this.data.length) {
                return -1;
            }
            else {
                return leftChild;
            }
        }
        else {
            if (this.compare(this.data[leftChild], this.data[rightChild]) <= 0) {
                return leftChild;
            }
            else {
                return rightChild;
            }
        }
    };
    /**
     * Moves the node at the given index up to its proper place in the heap.
     * @param {number} index The index of the node to move up.
     * @private
     */
    Heap.prototype.siftUp = function (index) {
        var parent = this.parentIndex(index);
        while (index > 0 && this.compare(this.data[parent], this.data[index]) > 0) {
            arrays.swap(this.data, parent, index);
            index = parent;
            parent = this.parentIndex(index);
        }
    };
    /**
     * Moves the node at the given index down to its proper place in the heap.
     * @param {number} nodeIndex The index of the node to move down.
     * @private
     */
    Heap.prototype.siftDown = function (nodeIndex) {
        //smaller child index
        var min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
        while (min >= 0 && this.compare(this.data[nodeIndex], this.data[min]) > 0) {
            arrays.swap(this.data, min, nodeIndex);
            nodeIndex = min;
            min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
        }
    };
    /**
     * Retrieves but does not remove the root element of this heap.
     * @return {*} The value at the root of the heap. Returns undefined if the
     * heap is empty.
     */
    Heap.prototype.peek = function () {
        if (this.data.length > 0) {
            return this.data[0];
        }
        else {
            return undefined;
        }
    };
    /**
     * Adds the given element into the heap.
     * @param {*} element the element.
     * @return true if the element was added or fals if it is undefined.
     */
    Heap.prototype.add = function (element) {
        if (collections.isUndefined(element)) {
            return false;
        }
        this.data.push(element);
        this.siftUp(this.data.length - 1);
        return true;
    };
    /**
     * Retrieves and removes the root element of this heap.
     * @return {*} The value removed from the root of the heap. Returns
     * undefined if the heap is empty.
     */
    Heap.prototype.removeRoot = function () {
        if (this.data.length > 0) {
            var obj = this.data[0];
            this.data[0] = this.data[this.data.length - 1];
            this.data.splice(this.data.length - 1, 1);
            if (this.data.length > 0) {
                this.siftDown(0);
            }
            return obj;
        }
        return undefined;
    };
    /**
     * Returns true if this heap contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this Heap contains the specified element, false
     * otherwise.
     */
    Heap.prototype.contains = function (element) {
        var equF = collections.compareToEquals(this.compare);
        return arrays.contains(this.data, element, equF);
    };
    /**
     * Returns the number of elements in this heap.
     * @return {number} the number of elements in this heap.
     */
    Heap.prototype.size = function () {
        return this.data.length;
    };
    /**
     * Checks if this heap is empty.
     * @return {boolean} true if and only if this heap contains no items; false
     * otherwise.
     */
    Heap.prototype.isEmpty = function () {
        return this.data.length <= 0;
    };
    /**
     * Removes all of the elements from this heap.
     */
    Heap.prototype.clear = function () {
        this.data.length = 0;
    };
    /**
     * Executes the provided function once for each element present in this heap in
     * no particular order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    Heap.prototype.forEach = function (callback) {
        arrays.forEach(this.data, callback);
    };
    return Heap;
}());
exports.default = Heap;
//# sourceMappingURL=Heap.js.map