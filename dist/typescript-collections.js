(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.listComponent = f()
    }
})(function() {
        var define, module, exports;
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var util = require('./util');
var Queue_1 = require('./Queue');
var BSTree = (function () {
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
    function BSTree(compareFunction) {
        this.root = null;
        this.compare = compareFunction || util.defaultCompare;
        this.nElements = 0;
    }
    /**
     * Adds the specified element to this tree if it is not already present.
     * @param {Object} element the element to insert.
     * @return {boolean} true if this tree did not already contain the specified element.
     */
    BSTree.prototype.add = function (element) {
        if (util.isUndefined(element)) {
            return false;
        }
        if (this.insertNode(this.createNode(element)) !== null) {
            this.nElements++;
            return true;
        }
        return false;
    };
    /**
     * Removes all of the elements from this tree.
     */
    BSTree.prototype.clear = function () {
        this.root = null;
        this.nElements = 0;
    };
    /**
     * Returns true if this tree contains no elements.
     * @return {boolean} true if this tree contains no elements.
     */
    BSTree.prototype.isEmpty = function () {
        return this.nElements === 0;
    };
    /**
     * Returns the number of elements in this tree.
     * @return {number} the number of elements in this tree.
     */
    BSTree.prototype.size = function () {
        return this.nElements;
    };
    /**
     * Returns true if this tree contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this tree contains the specified element,
     * false otherwise.
     */
    BSTree.prototype.contains = function (element) {
        if (util.isUndefined(element)) {
            return false;
        }
        return this.searchNode(this.root, element) !== null;
    };
    /**
     * Removes the specified element from this tree if it is present.
     * @return {boolean} true if this tree contained the specified element.
     */
    BSTree.prototype.remove = function (element) {
        var node = this.searchNode(this.root, element);
        if (node === null) {
            return false;
        }
        this.removeNode(node);
        this.nElements--;
        return true;
    };
    /**
     * Executes the provided function once for each element present in this tree in
     * in-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    BSTree.prototype.inorderTraversal = function (callback) {
        this.inorderTraversalAux(this.root, callback, {
            stop: false
        });
    };
    /**
     * Executes the provided function once for each element present in this tree in pre-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    BSTree.prototype.preorderTraversal = function (callback) {
        this.preorderTraversalAux(this.root, callback, {
            stop: false
        });
    };
    /**
     * Executes the provided function once for each element present in this tree in post-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    BSTree.prototype.postorderTraversal = function (callback) {
        this.postorderTraversalAux(this.root, callback, {
            stop: false
        });
    };
    /**
     * Executes the provided function once for each element present in this tree in
     * level-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    BSTree.prototype.levelTraversal = function (callback) {
        this.levelTraversalAux(this.root, callback);
    };
    /**
     * Returns the minimum element of this tree.
     * @return {*} the minimum element of this tree or undefined if this tree is
     * is empty.
     */
    BSTree.prototype.minimum = function () {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.minimumAux(this.root).element;
    };
    /**
     * Returns the maximum element of this tree.
     * @return {*} the maximum element of this tree or undefined if this tree is
     * is empty.
     */
    BSTree.prototype.maximum = function () {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.maximumAux(this.root).element;
    };
    /**
     * Executes the provided function once for each element present in this tree in inorder.
     * Equivalent to inorderTraversal.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    BSTree.prototype.forEach = function (callback) {
        this.inorderTraversal(callback);
    };
    /**
     * Returns an array containing all of the elements in this tree in in-order.
     * @return {Array} an array containing all of the elements in this tree in in-order.
     */
    BSTree.prototype.toArray = function () {
        var array = [];
        this.inorderTraversal(function (element) {
            array.push(element);
            return true;
        });
        return array;
    };
    /**
     * Returns the height of this tree.
     * @return {number} the height of this tree or -1 if is empty.
     */
    BSTree.prototype.height = function () {
        return this.heightAux(this.root);
    };
    /**
    * @private
    */
    BSTree.prototype.searchNode = function (node, element) {
        var cmp = null;
        while (node !== null && cmp !== 0) {
            cmp = this.compare(element, node.element);
            if (cmp < 0) {
                node = node.leftCh;
            }
            else if (cmp > 0) {
                node = node.rightCh;
            }
        }
        return node;
    };
    /**
    * @private
    */
    BSTree.prototype.transplant = function (n1, n2) {
        if (n1.parent === null) {
            this.root = n2;
        }
        else if (n1 === n1.parent.leftCh) {
            n1.parent.leftCh = n2;
        }
        else {
            n1.parent.rightCh = n2;
        }
        if (n2 !== null) {
            n2.parent = n1.parent;
        }
    };
    /**
    * @private
    */
    BSTree.prototype.removeNode = function (node) {
        if (node.leftCh === null) {
            this.transplant(node, node.rightCh);
        }
        else if (node.rightCh === null) {
            this.transplant(node, node.leftCh);
        }
        else {
            var y = this.minimumAux(node.rightCh);
            if (y.parent !== node) {
                this.transplant(y, y.rightCh);
                y.rightCh = node.rightCh;
                y.rightCh.parent = y;
            }
            this.transplant(node, y);
            y.leftCh = node.leftCh;
            y.leftCh.parent = y;
        }
    };
    /**
    * @private
    */
    BSTree.prototype.inorderTraversalAux = function (node, callback, signal) {
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
    };
    /**
    * @private
    */
    BSTree.prototype.levelTraversalAux = function (node, callback) {
        var queue = new Queue_1.default();
        if (node !== null) {
            queue.enqueue(node);
        }
        while (!queue.isEmpty()) {
            node = queue.dequeue();
            if (callback(node.element) === false) {
                return;
            }
            if (node.leftCh !== null) {
                queue.enqueue(node.leftCh);
            }
            if (node.rightCh !== null) {
                queue.enqueue(node.rightCh);
            }
        }
    };
    /**
    * @private
    */
    BSTree.prototype.preorderTraversalAux = function (node, callback, signal) {
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
    };
    /**
    * @private
    */
    BSTree.prototype.postorderTraversalAux = function (node, callback, signal) {
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
    };
    /**
    * @private
    */
    BSTree.prototype.minimumAux = function (node) {
        while (node.leftCh !== null) {
            node = node.leftCh;
        }
        return node;
    };
    /**
    * @private
    */
    BSTree.prototype.maximumAux = function (node) {
        while (node.rightCh !== null) {
            node = node.rightCh;
        }
        return node;
    };
    /**
      * @private
      */
    BSTree.prototype.heightAux = function (node) {
        if (node === null) {
            return -1;
        }
        return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
    };
    /*
    * @private
    */
    BSTree.prototype.insertNode = function (node) {
        var parent = null;
        var position = this.root;
        var cmp = null;
        while (position !== null) {
            cmp = this.compare(node.element, position.element);
            if (cmp === 0) {
                return null;
            }
            else if (cmp < 0) {
                parent = position;
                position = position.leftCh;
            }
            else {
                parent = position;
                position = position.rightCh;
            }
        }
        node.parent = parent;
        if (parent === null) {
            // tree is empty
            this.root = node;
        }
        else if (this.compare(node.element, parent.element) < 0) {
            parent.leftCh = node;
        }
        else {
            parent.rightCh = node;
        }
        return node;
    };
    /**
    * @private
    */
    BSTree.prototype.createNode = function (element) {
        return {
            element: element,
            leftCh: null,
            rightCh: null,
            parent: null
        };
    };
    return BSTree;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BSTree;

},{"./Queue":9,"./util":13}],2:[function(require,module,exports){
"use strict";
var util = require('./util');
var Dictionary_1 = require('./Dictionary');
var Set_1 = require('./Set');
var Bag = (function () {
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
    function Bag(toStrFunction) {
        this.toStrF = toStrFunction || util.defaultToString;
        this.dictionary = new Dictionary_1.default(this.toStrF);
        this.nElements = 0;
    }
    /**
    * Adds nCopies of the specified object to this bag.
    * @param {Object} element element to add.
    * @param {number=} nCopies the number of copies to add, if this argument is
    * undefined 1 copy is added.
    * @return {boolean} true unless element is undefined.
    */
    Bag.prototype.add = function (element, nCopies) {
        if (nCopies === void 0) { nCopies = 1; }
        if (util.isUndefined(element) || nCopies <= 0) {
            return false;
        }
        if (!this.contains(element)) {
            var node = {
                value: element,
                copies: nCopies
            };
            this.dictionary.setValue(element, node);
        }
        else {
            this.dictionary.getValue(element).copies += nCopies;
        }
        this.nElements += nCopies;
        return true;
    };
    /**
    * Counts the number of copies of the specified object in this bag.
    * @param {Object} element the object to search for..
    * @return {number} the number of copies of the object, 0 if not found
    */
    Bag.prototype.count = function (element) {
        if (!this.contains(element)) {
            return 0;
        }
        else {
            return this.dictionary.getValue(element).copies;
        }
    };
    /**
     * Returns true if this bag contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this bag contains the specified element,
     * false otherwise.
     */
    Bag.prototype.contains = function (element) {
        return this.dictionary.containsKey(element);
    };
    /**
    * Removes nCopies of the specified object to this bag.
    * If the number of copies to remove is greater than the actual number
    * of copies in the Bag, all copies are removed.
    * @param {Object} element element to remove.
    * @param {number=} nCopies the number of copies to remove, if this argument is
    * undefined 1 copy is removed.
    * @return {boolean} true if at least 1 element was removed.
    */
    Bag.prototype.remove = function (element, nCopies) {
        if (nCopies === void 0) { nCopies = 1; }
        if (util.isUndefined(element) || nCopies <= 0) {
            return false;
        }
        if (!this.contains(element)) {
            return false;
        }
        else {
            var node = this.dictionary.getValue(element);
            if (nCopies > node.copies) {
                this.nElements -= node.copies;
            }
            else {
                this.nElements -= nCopies;
            }
            node.copies -= nCopies;
            if (node.copies <= 0) {
                this.dictionary.remove(element);
            }
            return true;
        }
    };
    /**
     * Returns an array containing all of the elements in this big in arbitrary order,
     * including multiple copies.
     * @return {Array} an array containing all of the elements in this bag.
     */
    Bag.prototype.toArray = function () {
        var a = [];
        var values = this.dictionary.values();
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var node = values_1[_i];
            var element = node.value;
            var copies = node.copies;
            for (var j = 0; j < copies; j++) {
                a.push(element);
            }
        }
        return a;
    };
    /**
     * Returns a set of unique elements in this bag.
     * @return {collections.Set<T>} a set of unique elements in this bag.
     */
    Bag.prototype.toSet = function () {
        var toret = new Set_1.default(this.toStrF);
        var elements = this.dictionary.values();
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var ele = elements_1[_i];
            var value = ele.value;
            toret.add(value);
        }
        return toret;
    };
    /**
     * Executes the provided function once for each element
     * present in this bag, including multiple copies.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element. To break the iteration you can
     * optionally return false.
     */
    Bag.prototype.forEach = function (callback) {
        this.dictionary.forEach(function (k, v) {
            var value = v.value;
            var copies = v.copies;
            for (var i = 0; i < copies; i++) {
                if (callback(value) === false) {
                    return false;
                }
            }
            return true;
        });
    };
    /**
     * Returns the number of elements in this bag.
     * @return {number} the number of elements in this bag.
     */
    Bag.prototype.size = function () {
        return this.nElements;
    };
    /**
     * Returns true if this bag contains no elements.
     * @return {boolean} true if this bag contains no elements.
     */
    Bag.prototype.isEmpty = function () {
        return this.nElements === 0;
    };
    /**
     * Removes all of the elements from this bag.
     */
    Bag.prototype.clear = function () {
        this.nElements = 0;
        this.dictionary.clear();
    };
    return Bag;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Bag; // End of bag

},{"./Dictionary":3,"./Set":10,"./util":13}],3:[function(require,module,exports){
"use strict";
var util = require('./util');
var Dictionary = (function () {
    /**
     * Creates an empty dictionary.
     * @class <p>Dictionaries map keys to values; each key can map to at most one value.
     * This implementation accepts any kind of objects as keys.</p>
     *
     * <p>If the keys are custom objects a function which converts keys to unique
     * strings must be provided. Example:</p>
     * <pre>
     * function petToString(pet) {
     *  return pet.name;
     * }
     * </pre>
     * @constructor
     * @param {function(Object):string=} toStrFunction optional function used
     * to convert keys to strings. If the keys aren't strings or if toString()
     * is not appropriate, a custom function which receives a key and returns a
     * unique string must be provided.
     */
    function Dictionary(toStrFunction) {
        this.table = {};
        this.nElements = 0;
        this.toStr = toStrFunction || util.defaultToString;
    }
    /**
     * Returns the value to which this dictionary maps the specified key.
     * Returns undefined if this dictionary contains no mapping for this key.
     * @param {Object} key key whose associated value is to be returned.
     * @return {*} the value to which this dictionary maps the specified key or
     * undefined if the map contains no mapping for this key.
     */
    Dictionary.prototype.getValue = function (key) {
        var pair = this.table['$' + this.toStr(key)];
        if (util.isUndefined(pair)) {
            return undefined;
        }
        return pair.value;
    };
    /**
     * Associates the specified value with the specified key in this dictionary.
     * If the dictionary previously contained a mapping for this key, the old
     * value is replaced by the specified value.
     * @param {Object} key key with which the specified value is to be
     * associated.
     * @param {Object} value value to be associated with the specified key.
     * @return {*} previous value associated with the specified key, or undefined if
     * there was no mapping for the key or if the key/value are undefined.
     */
    Dictionary.prototype.setValue = function (key, value) {
        if (util.isUndefined(key) || util.isUndefined(value)) {
            return undefined;
        }
        var ret;
        var k = '$' + this.toStr(key);
        var previousElement = this.table[k];
        if (util.isUndefined(previousElement)) {
            this.nElements++;
            ret = undefined;
        }
        else {
            ret = previousElement.value;
        }
        this.table[k] = {
            key: key,
            value: value
        };
        return ret;
    };
    /**
     * Removes the mapping for this key from this dictionary if it is present.
     * @param {Object} key key whose mapping is to be removed from the
     * dictionary.
     * @return {*} previous value associated with specified key, or undefined if
     * there was no mapping for key.
     */
    Dictionary.prototype.remove = function (key) {
        var k = '$' + this.toStr(key);
        var previousElement = this.table[k];
        if (!util.isUndefined(previousElement)) {
            delete this.table[k];
            this.nElements--;
            return previousElement.value;
        }
        return undefined;
    };
    /**
     * Returns an array containing all of the keys in this dictionary.
     * @return {Array} an array containing all of the keys in this dictionary.
     */
    Dictionary.prototype.keys = function () {
        var array = [];
        for (var name_1 in this.table) {
            if (util.has(this.table, name_1)) {
                var pair = this.table[name_1];
                array.push(pair.key);
            }
        }
        return array;
    };
    /**
     * Returns an array containing all of the values in this dictionary.
     * @return {Array} an array containing all of the values in this dictionary.
     */
    Dictionary.prototype.values = function () {
        var array = [];
        for (var name_2 in this.table) {
            if (util.has(this.table, name_2)) {
                var pair = this.table[name_2];
                array.push(pair.value);
            }
        }
        return array;
    };
    /**
    * Executes the provided function once for each key-value pair
    * present in this dictionary.
    * @param {function(Object,Object):*} callback function to execute, it is
    * invoked with two arguments: key and value. To break the iteration you can
    * optionally return false.
    */
    Dictionary.prototype.forEach = function (callback) {
        for (var name_3 in this.table) {
            if (util.has(this.table, name_3)) {
                var pair = this.table[name_3];
                var ret = callback(pair.key, pair.value);
                if (ret === false) {
                    return;
                }
            }
        }
    };
    /**
     * Returns true if this dictionary contains a mapping for the specified key.
     * @param {Object} key key whose presence in this dictionary is to be
     * tested.
     * @return {boolean} true if this dictionary contains a mapping for the
     * specified key.
     */
    Dictionary.prototype.containsKey = function (key) {
        return !util.isUndefined(this.getValue(key));
    };
    /**
    * Removes all mappings from this dictionary.
    * @this {collections.Dictionary}
    */
    Dictionary.prototype.clear = function () {
        this.table = {};
        this.nElements = 0;
    };
    /**
     * Returns the number of keys in this dictionary.
     * @return {number} the number of key-value mappings in this dictionary.
     */
    Dictionary.prototype.size = function () {
        return this.nElements;
    };
    /**
     * Returns true if this dictionary contains no mappings.
     * @return {boolean} true if this dictionary contains no mappings.
     */
    Dictionary.prototype.isEmpty = function () {
        return this.nElements <= 0;
    };
    Dictionary.prototype.toString = function () {
        var toret = '{';
        this.forEach(function (k, v) {
            toret += "\n\t" + k + " : " + v;
        });
        return toret + '\n}';
    };
    return Dictionary;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dictionary; // End of dictionary

},{"./util":13}],4:[function(require,module,exports){
"use strict";
var collections = require('./util');
var arrays = require('./arrays');
var Heap = (function () {
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
         * Array used to store the elements od the heap.
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
            return undefined;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Heap;

},{"./arrays":12,"./util":13}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dictionary_1 = require('./Dictionary');
var util = require('./util');
/**
 * This class is used by the LinkedDictionary Internally
 * Has to be a class, not an interface, because it needs to have
 * the 'unlink' function defined.
 */
var LinkedDictionaryPair = (function () {
    function LinkedDictionaryPair(key, value) {
        this.key = key;
        this.value = value;
    }
    LinkedDictionaryPair.prototype.unlink = function () {
        this.prev.next = this.next;
        this.next.prev = this.prev;
    };
    return LinkedDictionaryPair;
}());
var LinkedDictionary = (function (_super) {
    __extends(LinkedDictionary, _super);
    function LinkedDictionary(toStrFunction) {
        _super.call(this, toStrFunction);
        this.head = new LinkedDictionaryPair(null, null);
        this.tail = new LinkedDictionaryPair(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    /**
     * Inserts the new node to the 'tail' of the list, updating the
     * neighbors, and moving 'this.tail' (the End of List indicator) that
     * to the end.
     */
    LinkedDictionary.prototype.appendToTail = function (entry) {
        var lastNode = this.tail.prev;
        lastNode.next = entry;
        entry.prev = lastNode;
        entry.next = this.tail;
        this.tail.prev = entry;
    };
    /**
     * Retrieves a linked dictionary from the table internally
     */
    LinkedDictionary.prototype.getLinkedDictionaryPair = function (key) {
        if (util.isUndefined(key)) {
            return undefined;
        }
        var k = '$' + this.toStr(key);
        var pair = (this.table[k]);
        return pair;
    };
    /**
     * Returns the value to which this dictionary maps the specified key.
     * Returns undefined if this dictionary contains no mapping for this key.
     * @param {Object} key key whose associated value is to be returned.
     * @return {*} the value to which this dictionary maps the specified key or
     * undefined if the map contains no mapping for this key.
     */
    LinkedDictionary.prototype.getValue = function (key) {
        var pair = this.getLinkedDictionaryPair(key);
        if (!util.isUndefined(pair)) {
            return pair.value;
        }
        return undefined;
    };
    /**
     * Removes the mapping for this key from this dictionary if it is present.
     * Also, if a value is present for this key, the entry is removed from the
     * insertion ordering.
     * @param {Object} key key whose mapping is to be removed from the
     * dictionary.
     * @return {*} previous value associated with specified key, or undefined if
     * there was no mapping for key.
     */
    LinkedDictionary.prototype.remove = function (key) {
        var pair = this.getLinkedDictionaryPair(key);
        if (!util.isUndefined(pair)) {
            _super.prototype.remove.call(this, key); // This will remove it from the table
            pair.unlink(); // This will unlink it from the chain
            return pair.value;
        }
        return undefined;
    };
    /**
    * Removes all mappings from this LinkedDictionary.
    * @this {collections.LinkedDictionary}
    */
    LinkedDictionary.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    };
    /**
     * Internal function used when updating an existing KeyValue pair.
     * It places the new value indexed by key into the table, but maintains
     * its place in the linked ordering.
     */
    LinkedDictionary.prototype.replace = function (oldPair, newPair) {
        var k = '$' + this.toStr(newPair.key);
        // set the new Pair's links to existingPair's links
        newPair.next = oldPair.next;
        newPair.prev = oldPair.prev;
        // Delete Existing Pair from the table, unlink it from chain.
        // As a result, the nElements gets decremented by this operation
        this.remove(oldPair.key);
        // Link new Pair in place of where oldPair was,
        // by pointing the old pair's neighbors to it.
        newPair.prev.next = newPair;
        newPair.next.prev = newPair;
        this.table[k] = newPair;
        // To make up for the fact that the number of elements was decremented,
        // We need to increase it by one.
        ++this.nElements;
    };
    /**
     * Associates the specified value with the specified key in this dictionary.
     * If the dictionary previously contained a mapping for this key, the old
     * value is replaced by the specified value.
     * Updating of a key that already exists maintains its place in the
     * insertion order into the map.
     * @param {Object} key key with which the specified value is to be
     * associated.
     * @param {Object} value value to be associated with the specified key.
     * @return {*} previous value associated with the specified key, or undefined if
     * there was no mapping for the key or if the key/value are undefined.
     */
    LinkedDictionary.prototype.setValue = function (key, value) {
        if (util.isUndefined(key) || util.isUndefined(value)) {
            return undefined;
        }
        var existingPair = this.getLinkedDictionaryPair(key);
        var newPair = new LinkedDictionaryPair(key, value);
        var k = '$' + this.toStr(key);
        // If there is already an element for that key, we
        // keep it's place in the LinkedList
        if (!util.isUndefined(existingPair)) {
            this.replace(existingPair, newPair);
            return existingPair.value;
        }
        else {
            this.appendToTail(newPair);
            this.table[k] = newPair;
            ++this.nElements;
            return undefined;
        }
    };
    /**
     * Returns an array containing all of the keys in this LinkedDictionary, ordered
     * by insertion order.
     * @return {Array} an array containing all of the keys in this LinkedDictionary,
     * ordered by insertion order.
     */
    LinkedDictionary.prototype.keys = function () {
        var array = [];
        this.forEach(function (key, value) {
            array.push(key);
        });
        return array;
    };
    /**
     * Returns an array containing all of the values in this LinkedDictionary, ordered by
     * insertion order.
     * @return {Array} an array containing all of the values in this LinkedDictionary,
     * ordered by insertion order.
     */
    LinkedDictionary.prototype.values = function () {
        var array = [];
        this.forEach(function (key, value) {
            array.push(value);
        });
        return array;
    };
    /**
    * Executes the provided function once for each key-value pair
    * present in this LinkedDictionary. It is done in the order of insertion
    * into the LinkedDictionary
    * @param {function(Object,Object):*} callback function to execute, it is
    * invoked with two arguments: key and value. To break the iteration you can
    * optionally return false.
    */
    LinkedDictionary.prototype.forEach = function (callback) {
        var crawlNode = this.head.next;
        while (crawlNode.next != null) {
            var ret = callback(crawlNode.key, crawlNode.value);
            if (ret === false) {
                return;
            }
            crawlNode = crawlNode.next;
        }
    };
    return LinkedDictionary;
}(Dictionary_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinkedDictionary; // End of LinkedDictionary
// /**
//  * Returns true if this dictionary is equal to the given dictionary.
//  * Two dictionaries are equal if they contain the same mappings.
//  * @param {collections.Dictionary} other the other dictionary.
//  * @param {function(Object,Object):boolean=} valuesEqualFunction optional
//  * function used to check if two values are equal.
//  * @return {boolean} true if this dictionary is equal to the given dictionary.
//  */
// collections.Dictionary.prototype.equals = function(other,valuesEqualFunction) {
// 	const eqF = valuesEqualFunction || collections.defaultEquals;
// 	if(!(other instanceof collections.Dictionary)){
// 		return false;
// 	}
// 	if(this.size() !== other.size()){
// 		return false;
// 	}
// 	return this.equalsAux(this.firstNode,other.firstNode,eqF);
// }

},{"./Dictionary":3,"./util":13}],6:[function(require,module,exports){
"use strict";
var util = require('./util');
var arrays = require('./arrays');
var LinkedList = (function () {
    /**
    * Creates an empty Linked List.
    * @class A linked list is a data structure consisting of a group of nodes
    * which together represent a sequence.
    * @constructor
    */
    function LinkedList() {
        /**
        * First node in the list
        * @type {Object}
        * @private
        */
        this.firstNode = null;
        /**
        * Last node in the list
        * @type {Object}
        * @private
        */
        this.lastNode = null;
        /**
        * Number of elements in the list
        * @type {number}
        * @private
        */
        this.nElements = 0;
    }
    /**
    * Adds an element to this list.
    * @param {Object} item element to be added.
    * @param {number=} index optional index to add the element. If no index is specified
    * the element is added to the end of this list.
    * @return {boolean} true if the element was added or false if the index is invalid
    * or if the element is undefined.
    */
    LinkedList.prototype.add = function (item, index) {
        if (util.isUndefined(index)) {
            index = this.nElements;
        }
        if (index < 0 || index > this.nElements || util.isUndefined(item)) {
            return false;
        }
        var newNode = this.createNode(item);
        if (this.nElements === 0) {
            // First node in the list.
            this.firstNode = newNode;
            this.lastNode = newNode;
        }
        else if (index === this.nElements) {
            // Insert at the end.
            this.lastNode.next = newNode;
            this.lastNode = newNode;
        }
        else if (index === 0) {
            // Change first node.
            newNode.next = this.firstNode;
            this.firstNode = newNode;
        }
        else {
            var prev = this.nodeAtIndex(index - 1);
            newNode.next = prev.next;
            prev.next = newNode;
        }
        this.nElements++;
        return true;
    };
    /**
    * Returns the first element in this list.
    * @return {*} the first element of the list or undefined if the list is
    * empty.
    */
    LinkedList.prototype.first = function () {
        if (this.firstNode !== null) {
            return this.firstNode.element;
        }
        return undefined;
    };
    /**
    * Returns the last element in this list.
    * @return {*} the last element in the list or undefined if the list is
    * empty.
    */
    LinkedList.prototype.last = function () {
        if (this.lastNode !== null) {
            return this.lastNode.element;
        }
        return undefined;
    };
    /**
     * Returns the element at the specified position in this list.
     * @param {number} index desired index.
     * @return {*} the element at the given index or undefined if the index is
     * out of bounds.
     */
    LinkedList.prototype.elementAtIndex = function (index) {
        var node = this.nodeAtIndex(index);
        if (node === null) {
            return undefined;
        }
        return node.element;
    };
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
    LinkedList.prototype.indexOf = function (item, equalsFunction) {
        var equalsF = equalsFunction || util.defaultEquals;
        if (util.isUndefined(item)) {
            return -1;
        }
        var currentNode = this.firstNode;
        var index = 0;
        while (currentNode !== null) {
            if (equalsF(currentNode.element, item)) {
                return index;
            }
            index++;
            currentNode = currentNode.next;
        }
        return -1;
    };
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
    LinkedList.prototype.contains = function (item, equalsFunction) {
        return (this.indexOf(item, equalsFunction) >= 0);
    };
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
    LinkedList.prototype.remove = function (item, equalsFunction) {
        var equalsF = equalsFunction || util.defaultEquals;
        if (this.nElements < 1 || util.isUndefined(item)) {
            return false;
        }
        var previous = null;
        var currentNode = this.firstNode;
        while (currentNode !== null) {
            if (equalsF(currentNode.element, item)) {
                if (currentNode === this.firstNode) {
                    this.firstNode = this.firstNode.next;
                    if (currentNode === this.lastNode) {
                        this.lastNode = null;
                    }
                }
                else if (currentNode === this.lastNode) {
                    this.lastNode = previous;
                    previous.next = currentNode.next;
                    currentNode.next = null;
                }
                else {
                    previous.next = currentNode.next;
                    currentNode.next = null;
                }
                this.nElements--;
                return true;
            }
            previous = currentNode;
            currentNode = currentNode.next;
        }
        return false;
    };
    /**
     * Removes all of the elements from this list.
     */
    LinkedList.prototype.clear = function () {
        this.firstNode = null;
        this.lastNode = null;
        this.nElements = 0;
    };
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
    LinkedList.prototype.equals = function (other, equalsFunction) {
        var eqF = equalsFunction || util.defaultEquals;
        if (!(other instanceof LinkedList)) {
            return false;
        }
        if (this.size() !== other.size()) {
            return false;
        }
        return this.equalsAux(this.firstNode, other.firstNode, eqF);
    };
    /**
    * @private
    */
    LinkedList.prototype.equalsAux = function (n1, n2, eqF) {
        while (n1 !== null) {
            if (!eqF(n1.element, n2.element)) {
                return false;
            }
            n1 = n1.next;
            n2 = n2.next;
        }
        return true;
    };
    /**
     * Removes the element at the specified position in this list.
     * @param {number} index given index.
     * @return {*} removed element or undefined if the index is out of bounds.
     */
    LinkedList.prototype.removeElementAtIndex = function (index) {
        if (index < 0 || index >= this.nElements) {
            return undefined;
        }
        var element;
        if (this.nElements === 1) {
            //First node in the list.
            element = this.firstNode.element;
            this.firstNode = null;
            this.lastNode = null;
        }
        else {
            var previous = this.nodeAtIndex(index - 1);
            if (previous === null) {
                element = this.firstNode.element;
                this.firstNode = this.firstNode.next;
            }
            else if (previous.next === this.lastNode) {
                element = this.lastNode.element;
                this.lastNode = previous;
            }
            if (previous !== null) {
                element = previous.next.element;
                previous.next = previous.next.next;
            }
        }
        this.nElements--;
        return element;
    };
    /**
     * Executes the provided function once for each element present in this list in order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    LinkedList.prototype.forEach = function (callback) {
        var currentNode = this.firstNode;
        while (currentNode !== null) {
            if (callback(currentNode.element) === false) {
                break;
            }
            currentNode = currentNode.next;
        }
    };
    /**
     * Reverses the order of the elements in this linked list (makes the last
     * element first, and the first element last).
     */
    LinkedList.prototype.reverse = function () {
        var previous = null;
        var current = this.firstNode;
        var temp = null;
        while (current !== null) {
            temp = current.next;
            current.next = previous;
            previous = current;
            current = temp;
        }
        temp = this.firstNode;
        this.firstNode = this.lastNode;
        this.lastNode = temp;
    };
    /**
     * Returns an array containing all of the elements in this list in proper
     * sequence.
     * @return {Array.<*>} an array containing all of the elements in this list,
     * in proper sequence.
     */
    LinkedList.prototype.toArray = function () {
        var array = [];
        var currentNode = this.firstNode;
        while (currentNode !== null) {
            array.push(currentNode.element);
            currentNode = currentNode.next;
        }
        return array;
    };
    /**
     * Returns the number of elements in this list.
     * @return {number} the number of elements in this list.
     */
    LinkedList.prototype.size = function () {
        return this.nElements;
    };
    /**
     * Returns true if this list contains no elements.
     * @return {boolean} true if this list contains no elements.
     */
    LinkedList.prototype.isEmpty = function () {
        return this.nElements <= 0;
    };
    LinkedList.prototype.toString = function () {
        return arrays.toString(this.toArray());
    };
    /**
     * @private
     */
    LinkedList.prototype.nodeAtIndex = function (index) {
        if (index < 0 || index >= this.nElements) {
            return null;
        }
        if (index === (this.nElements - 1)) {
            return this.lastNode;
        }
        var node = this.firstNode;
        for (var i = 0; i < index; i++) {
            node = node.next;
        }
        return node;
    };
    /**
     * @private
     */
    LinkedList.prototype.createNode = function (item) {
        return {
            element: item,
            next: null
        };
    };
    return LinkedList;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinkedList; // End of linked list

},{"./arrays":12,"./util":13}],7:[function(require,module,exports){
"use strict";
var util = require('./util');
var Dictionary_1 = require('./Dictionary');
var arrays = require('./arrays');
var MultiDictionary = (function () {
    /**
     * Creates an empty multi dictionary.
     * @class <p>A multi dictionary is a special kind of dictionary that holds
     * multiple values against each key. Setting a value into the dictionary will
     * add the value to an array at that key. Getting a key will return an array,
     * holding all the values set to that key.
     * You can configure to allow duplicates in the values.
     * This implementation accepts any kind of objects as keys.</p>
     *
     * <p>If the keys are custom objects a function which converts keys to strings must be
     * provided. Example:</p>
     *
     * <pre>
     * function petToString(pet) {
       *  return pet.name;
       * }
     * </pre>
     * <p>If the values are custom objects a function to check equality between values
     * must be provided. Example:</p>
     *
     * <pre>
     * function petsAreEqualByAge(pet1,pet2) {
       *  return pet1.age===pet2.age;
       * }
     * </pre>
     * @constructor
     * @param {function(Object):string=} toStrFunction optional function
     * to convert keys to strings. If the keys aren't strings or if toString()
     * is not appropriate, a custom function which receives a key and returns a
     * unique string must be provided.
     * @param {function(Object,Object):boolean=} valuesEqualsFunction optional
     * function to check if two values are equal.
     *
     * @param allowDuplicateValues
     */
    function MultiDictionary(toStrFunction, valuesEqualsFunction, allowDuplicateValues) {
        if (allowDuplicateValues === void 0) { allowDuplicateValues = false; }
        this.dict = new Dictionary_1.default(toStrFunction);
        this.equalsF = valuesEqualsFunction || util.defaultEquals;
        this.allowDuplicate = allowDuplicateValues;
    }
    /**
    * Returns an array holding the values to which this dictionary maps
    * the specified key.
    * Returns an empty array if this dictionary contains no mappings for this key.
    * @param {Object} key key whose associated values are to be returned.
    * @return {Array} an array holding the values to which this dictionary maps
    * the specified key.
    */
    MultiDictionary.prototype.getValue = function (key) {
        var values = this.dict.getValue(key);
        if (util.isUndefined(values)) {
            return [];
        }
        return arrays.copy(values);
    };
    /**
     * Adds the value to the array associated with the specified key, if
     * it is not already present.
     * @param {Object} key key with which the specified value is to be
     * associated.
     * @param {Object} value the value to add to the array at the key
     * @return {boolean} true if the value was not already associated with that key.
     */
    MultiDictionary.prototype.setValue = function (key, value) {
        if (util.isUndefined(key) || util.isUndefined(value)) {
            return false;
        }
        if (!this.containsKey(key)) {
            this.dict.setValue(key, [value]);
            return true;
        }
        var array = this.dict.getValue(key);
        if (!this.allowDuplicate) {
            if (arrays.contains(array, value, this.equalsF)) {
                return false;
            }
        }
        array.push(value);
        return true;
    };
    /**
     * Removes the specified values from the array of values associated with the
     * specified key. If a value isn't given, all values associated with the specified
     * key are removed.
     * @param {Object} key key whose mapping is to be removed from the
     * dictionary.
     * @param {Object=} value optional argument to specify the value to remove
     * from the array associated with the specified key.
     * @return {*} true if the dictionary changed, false if the key doesn't exist or
     * if the specified value isn't associated with the specified key.
     */
    MultiDictionary.prototype.remove = function (key, value) {
        if (util.isUndefined(value)) {
            var v = this.dict.remove(key);
            return !util.isUndefined(v);
        }
        var array = this.dict.getValue(key);
        if (arrays.remove(array, value, this.equalsF)) {
            if (array.length === 0) {
                this.dict.remove(key);
            }
            return true;
        }
        return false;
    };
    /**
     * Returns an array containing all of the keys in this dictionary.
     * @return {Array} an array containing all of the keys in this dictionary.
     */
    MultiDictionary.prototype.keys = function () {
        return this.dict.keys();
    };
    /**
     * Returns an array containing all of the values in this dictionary.
     * @return {Array} an array containing all of the values in this dictionary.
     */
    MultiDictionary.prototype.values = function () {
        var values = this.dict.values();
        var array = [];
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var v = values_1[_i];
            for (var _a = 0, v_1 = v; _a < v_1.length; _a++) {
                var w = v_1[_a];
                array.push(w);
            }
        }
        return array;
    };
    /**
     * Returns true if this dictionary at least one value associatted the specified key.
     * @param {Object} key key whose presence in this dictionary is to be
     * tested.
     * @return {boolean} true if this dictionary at least one value associatted
     * the specified key.
     */
    MultiDictionary.prototype.containsKey = function (key) {
        return this.dict.containsKey(key);
    };
    /**
     * Removes all mappings from this dictionary.
     */
    MultiDictionary.prototype.clear = function () {
        this.dict.clear();
    };
    /**
     * Returns the number of keys in this dictionary.
     * @return {number} the number of key-value mappings in this dictionary.
     */
    MultiDictionary.prototype.size = function () {
        return this.dict.size();
    };
    /**
     * Returns true if this dictionary contains no mappings.
     * @return {boolean} true if this dictionary contains no mappings.
     */
    MultiDictionary.prototype.isEmpty = function () {
        return this.dict.isEmpty();
    };
    return MultiDictionary;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MultiDictionary; // end of multi dictionary

},{"./Dictionary":3,"./arrays":12,"./util":13}],8:[function(require,module,exports){
"use strict";
var util = require('./util');
var Heap_1 = require('./Heap');
var PriorityQueue = (function () {
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
    function PriorityQueue(compareFunction) {
        this.heap = new Heap_1.default(util.reverseCompareFunction(compareFunction));
    }
    /**
     * Inserts the specified element into this priority queue.
     * @param {Object} element the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    PriorityQueue.prototype.enqueue = function (element) {
        return this.heap.add(element);
    };
    /**
     * Inserts the specified element into this priority queue.
     * @param {Object} element the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    PriorityQueue.prototype.add = function (element) {
        return this.heap.add(element);
    };
    /**
     * Retrieves and removes the highest priority element of this queue.
     * @return {*} the the highest priority element of this queue,
     *  or undefined if this queue is empty.
     */
    PriorityQueue.prototype.dequeue = function () {
        if (this.heap.size() !== 0) {
            var el = this.heap.peek();
            this.heap.removeRoot();
            return el;
        }
        return undefined;
    };
    /**
     * Retrieves, but does not remove, the highest priority element of this queue.
     * @return {*} the highest priority element of this queue, or undefined if this queue is empty.
     */
    PriorityQueue.prototype.peek = function () {
        return this.heap.peek();
    };
    /**
     * Returns true if this priority queue contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this priority queue contains the specified element,
     * false otherwise.
     */
    PriorityQueue.prototype.contains = function (element) {
        return this.heap.contains(element);
    };
    /**
     * Checks if this priority queue is empty.
     * @return {boolean} true if and only if this priority queue contains no items; false
     * otherwise.
     */
    PriorityQueue.prototype.isEmpty = function () {
        return this.heap.isEmpty();
    };
    /**
     * Returns the number of elements in this priority queue.
     * @return {number} the number of elements in this priority queue.
     */
    PriorityQueue.prototype.size = function () {
        return this.heap.size();
    };
    /**
     * Removes all of the elements from this priority queue.
     */
    PriorityQueue.prototype.clear = function () {
        this.heap.clear();
    };
    /**
     * Executes the provided function once for each element present in this queue in
     * no particular order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    PriorityQueue.prototype.forEach = function (callback) {
        this.heap.forEach(callback);
    };
    return PriorityQueue;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PriorityQueue; // end of priority queue

},{"./Heap":4,"./util":13}],9:[function(require,module,exports){
"use strict";
var LinkedList_1 = require('./LinkedList');
var Queue = (function () {
    /**
     * Creates an empty queue.
     * @class A queue is a First-In-First-Out (FIFO) data structure, the first
     * element added to the queue will be the first one to be removed. This
     * implementation uses a linked list as a container.
     * @constructor
     */
    function Queue() {
        this.list = new LinkedList_1.default();
    }
    /**
     * Inserts the specified element into the end of this queue.
     * @param {Object} elem the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    Queue.prototype.enqueue = function (elem) {
        return this.list.add(elem);
    };
    /**
     * Inserts the specified element into the end of this queue.
     * @param {Object} elem the element to insert.
     * @return {boolean} true if the element was inserted, or false if it is undefined.
     */
    Queue.prototype.add = function (elem) {
        return this.list.add(elem);
    };
    /**
     * Retrieves and removes the head of this queue.
     * @return {*} the head of this queue, or undefined if this queue is empty.
     */
    Queue.prototype.dequeue = function () {
        if (this.list.size() !== 0) {
            var el = this.list.first();
            this.list.removeElementAtIndex(0);
            return el;
        }
        return undefined;
    };
    /**
     * Retrieves, but does not remove, the head of this queue.
     * @return {*} the head of this queue, or undefined if this queue is empty.
     */
    Queue.prototype.peek = function () {
        if (this.list.size() !== 0) {
            return this.list.first();
        }
        return undefined;
    };
    /**
     * Returns the number of elements in this queue.
     * @return {number} the number of elements in this queue.
     */
    Queue.prototype.size = function () {
        return this.list.size();
    };
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
    Queue.prototype.contains = function (elem, equalsFunction) {
        return this.list.contains(elem, equalsFunction);
    };
    /**
     * Checks if this queue is empty.
     * @return {boolean} true if and only if this queue contains no items; false
     * otherwise.
     */
    Queue.prototype.isEmpty = function () {
        return this.list.size() <= 0;
    };
    /**
     * Removes all of the elements from this queue.
     */
    Queue.prototype.clear = function () {
        this.list.clear();
    };
    /**
     * Executes the provided function once for each element present in this queue in
     * FIFO order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    Queue.prototype.forEach = function (callback) {
        this.list.forEach(callback);
    };
    return Queue;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Queue; // End of queue

},{"./LinkedList":6}],10:[function(require,module,exports){
"use strict";
var util = require('./util');
var arrays = require('./arrays');
var Dictionary_1 = require('./Dictionary');
var Set = (function () {
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
    function Set(toStringFunction) {
        this.dictionary = new Dictionary_1.default(toStringFunction);
    }
    /**
     * Returns true if this set contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this set contains the specified element,
     * false otherwise.
     */
    Set.prototype.contains = function (element) {
        return this.dictionary.containsKey(element);
    };
    /**
     * Adds the specified element to this set if it is not already present.
     * @param {Object} element the element to insert.
     * @return {boolean} true if this set did not already contain the specified element.
     */
    Set.prototype.add = function (element) {
        if (this.contains(element) || util.isUndefined(element)) {
            return false;
        }
        else {
            this.dictionary.setValue(element, element);
            return true;
        }
    };
    /**
     * Performs an intersecion between this an another set.
     * Removes all values that are not present this set and the given set.
     * @param {collections.Set} otherSet other set.
     */
    Set.prototype.intersection = function (otherSet) {
        var set = this;
        this.forEach(function (element) {
            if (!otherSet.contains(element)) {
                set.remove(element);
            }
            return true;
        });
    };
    /**
     * Performs a union between this an another set.
     * Adds all values from the given set to this set.
     * @param {collections.Set} otherSet other set.
     */
    Set.prototype.union = function (otherSet) {
        var set = this;
        otherSet.forEach(function (element) {
            set.add(element);
            return true;
        });
    };
    /**
     * Performs a difference between this an another set.
     * Removes from this set all the values that are present in the given set.
     * @param {collections.Set} otherSet other set.
     */
    Set.prototype.difference = function (otherSet) {
        var set = this;
        otherSet.forEach(function (element) {
            set.remove(element);
            return true;
        });
    };
    /**
     * Checks whether the given set contains all the elements in this set.
     * @param {collections.Set} otherSet other set.
     * @return {boolean} true if this set is a subset of the given set.
     */
    Set.prototype.isSubsetOf = function (otherSet) {
        if (this.size() > otherSet.size()) {
            return false;
        }
        var isSub = true;
        this.forEach(function (element) {
            if (!otherSet.contains(element)) {
                isSub = false;
                return false;
            }
            return true;
        });
        return isSub;
    };
    /**
     * Removes the specified element from this set if it is present.
     * @return {boolean} true if this set contained the specified element.
     */
    Set.prototype.remove = function (element) {
        if (!this.contains(element)) {
            return false;
        }
        else {
            this.dictionary.remove(element);
            return true;
        }
    };
    /**
     * Executes the provided function once for each element
     * present in this set.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one arguments: the element. To break the iteration you can
     * optionally return false.
     */
    Set.prototype.forEach = function (callback) {
        this.dictionary.forEach(function (k, v) {
            return callback(v);
        });
    };
    /**
     * Returns an array containing all of the elements in this set in arbitrary order.
     * @return {Array} an array containing all of the elements in this set.
     */
    Set.prototype.toArray = function () {
        return this.dictionary.values();
    };
    /**
     * Returns true if this set contains no elements.
     * @return {boolean} true if this set contains no elements.
     */
    Set.prototype.isEmpty = function () {
        return this.dictionary.isEmpty();
    };
    /**
     * Returns the number of elements in this set.
     * @return {number} the number of elements in this set.
     */
    Set.prototype.size = function () {
        return this.dictionary.size();
    };
    /**
     * Removes all of the elements from this set.
     */
    Set.prototype.clear = function () {
        this.dictionary.clear();
    };
    /*
    * Provides a string representation for display
    */
    Set.prototype.toString = function () {
        return arrays.toString(this.toArray());
    };
    return Set;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Set; // end of Set

},{"./Dictionary":3,"./arrays":12,"./util":13}],11:[function(require,module,exports){
"use strict";
var LinkedList_1 = require('./LinkedList');
var Stack = (function () {
    /**
     * Creates an empty Stack.
     * @class A Stack is a Last-In-First-Out (LIFO) data structure, the last
     * element added to the stack will be the first one to be removed. This
     * implementation uses a linked list as a container.
     * @constructor
     */
    function Stack() {
        this.list = new LinkedList_1.default();
    }
    /**
     * Pushes an item onto the top of this stack.
     * @param {Object} elem the element to be pushed onto this stack.
     * @return {boolean} true if the element was pushed or false if it is undefined.
     */
    Stack.prototype.push = function (elem) {
        return this.list.add(elem, 0);
    };
    /**
     * Pushes an item onto the top of this stack.
     * @param {Object} elem the element to be pushed onto this stack.
     * @return {boolean} true if the element was pushed or false if it is undefined.
     */
    Stack.prototype.add = function (elem) {
        return this.list.add(elem, 0);
    };
    /**
     * Removes the object at the top of this stack and returns that object.
     * @return {*} the object at the top of this stack or undefined if the
     * stack is empty.
     */
    Stack.prototype.pop = function () {
        return this.list.removeElementAtIndex(0);
    };
    /**
     * Looks at the object at the top of this stack without removing it from the
     * stack.
     * @return {*} the object at the top of this stack or undefined if the
     * stack is empty.
     */
    Stack.prototype.peek = function () {
        return this.list.first();
    };
    /**
     * Returns the number of elements in this stack.
     * @return {number} the number of elements in this stack.
     */
    Stack.prototype.size = function () {
        return this.list.size();
    };
    /**
     * Returns true if this stack contains the specified element.
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
     * @return {boolean} true if this stack contains the specified element,
     * false otherwise.
     */
    Stack.prototype.contains = function (elem, equalsFunction) {
        return this.list.contains(elem, equalsFunction);
    };
    /**
     * Checks if this stack is empty.
     * @return {boolean} true if and only if this stack contains no items; false
     * otherwise.
     */
    Stack.prototype.isEmpty = function () {
        return this.list.isEmpty();
    };
    /**
     * Removes all of the elements from this stack.
     */
    Stack.prototype.clear = function () {
        this.list.clear();
    };
    /**
     * Executes the provided function once for each element present in this stack in
     * LIFO order.
     * @param {function(Object):*} callback function to execute, it is
     * invoked with one argument: the element value, to break the iteration you can
     * optionally return false.
     */
    Stack.prototype.forEach = function (callback) {
        this.list.forEach(callback);
    };
    return Stack;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stack; // End of stack

},{"./LinkedList":6}],12:[function(require,module,exports){
"use strict";
var util = require('./util');
/**
 * Returns the position of the first occurrence of the specified item
 * within the specified array.4
 * @param {*} array the array in which to search the element.
 * @param {Object} item the element to search.
 * @param {function(Object,Object):boolean=} equalsFunction optional function used to
 * check equality between 2 elements.
 * @return {number} the position of the first occurrence of the specified element
 * within the specified array, or -1 if not found.
 */
function indexOf(array, item, equalsFunction) {
    var equals = equalsFunction || util.defaultEquals;
    var length = array.length;
    for (var i = 0; i < length; i++) {
        if (equals(array[i], item)) {
            return i;
        }
    }
    return -1;
}
exports.indexOf = indexOf;
/**
 * Returns the position of the last occurrence of the specified element
 * within the specified array.
 * @param {*} array the array in which to search the element.
 * @param {Object} item the element to search.
 * @param {function(Object,Object):boolean=} equalsFunction optional function used to
 * check equality between 2 elements.
 * @return {number} the position of the last occurrence of the specified element
 * within the specified array or -1 if not found.
 */
function lastIndexOf(array, item, equalsFunction) {
    var equals = equalsFunction || util.defaultEquals;
    var length = array.length;
    for (var i = length - 1; i >= 0; i--) {
        if (equals(array[i], item)) {
            return i;
        }
    }
    return -1;
}
exports.lastIndexOf = lastIndexOf;
/**
 * Returns true if the specified array contains the specified element.
 * @param {*} array the array in which to search the element.
 * @param {Object} item the element to search.
 * @param {function(Object,Object):boolean=} equalsFunction optional function to
 * check equality between 2 elements.
 * @return {boolean} true if the specified array contains the specified element.
 */
function contains(array, item, equalsFunction) {
    return indexOf(array, item, equalsFunction) >= 0;
}
exports.contains = contains;
/**
 * Removes the first ocurrence of the specified element from the specified array.
 * @param {*} array the array in which to search element.
 * @param {Object} item the element to search.
 * @param {function(Object,Object):boolean=} equalsFunction optional function to
 * check equality between 2 elements.
 * @return {boolean} true if the array changed after this call.
 */
function remove(array, item, equalsFunction) {
    var index = indexOf(array, item, equalsFunction);
    if (index < 0) {
        return false;
    }
    array.splice(index, 1);
    return true;
}
exports.remove = remove;
/**
 * Returns the number of elements in the specified array equal
 * to the specified object.
 * @param {Array} array the array in which to determine the frequency of the element.
 * @param {Object} item the element whose frequency is to be determined.
 * @param {function(Object,Object):boolean=} equalsFunction optional function used to
 * check equality between 2 elements.
 * @return {number} the number of elements in the specified array
 * equal to the specified object.
 */
function frequency(array, item, equalsFunction) {
    var equals = equalsFunction || util.defaultEquals;
    var length = array.length;
    var freq = 0;
    for (var i = 0; i < length; i++) {
        if (equals(array[i], item)) {
            freq++;
        }
    }
    return freq;
}
exports.frequency = frequency;
/**
 * Returns true if the two specified arrays are equal to one another.
 * Two arrays are considered equal if both arrays contain the same number
 * of elements, and all corresponding pairs of elements in the two
 * arrays are equal and are in the same order.
 * @param {Array} array1 one array to be tested for equality.
 * @param {Array} array2 the other array to be tested for equality.
 * @param {function(Object,Object):boolean=} equalsFunction optional function used to
 * check equality between elemements in the arrays.
 * @return {boolean} true if the two arrays are equal
 */
function equals(array1, array2, equalsFunction) {
    var equals = equalsFunction || util.defaultEquals;
    if (array1.length !== array2.length) {
        return false;
    }
    var length = array1.length;
    for (var i = 0; i < length; i++) {
        if (!equals(array1[i], array2[i])) {
            return false;
        }
    }
    return true;
}
exports.equals = equals;
/**
 * Returns shallow a copy of the specified array.
 * @param {*} array the array to copy.
 * @return {Array} a copy of the specified array
 */
function copy(array) {
    return array.concat();
}
exports.copy = copy;
/**
 * Swaps the elements at the specified positions in the specified array.
 * @param {Array} array The array in which to swap elements.
 * @param {number} i the index of one element to be swapped.
 * @param {number} j the index of the other element to be swapped.
 * @return {boolean} true if the array is defined and the indexes are valid.
 */
function swap(array, i, j) {
    if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
        return false;
    }
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    return true;
}
exports.swap = swap;
function toString(array) {
    return '[' + array.toString() + ']';
}
exports.toString = toString;
/**
 * Executes the provided function once for each element present in this array
 * starting from index 0 to length - 1.
 * @param {Array} array The array in which to iterate.
 * @param {function(Object):*} callback function to execute, it is
 * invoked with one argument: the element value, to break the iteration you can
 * optionally return false.
 */
function forEach(array, callback) {
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var ele = array_1[_i];
        if (callback(ele) === false) {
            return;
        }
    }
}
exports.forEach = forEach;

},{"./util":13}],13:[function(require,module,exports){
"use strict";
var _hasOwnProperty = Object.prototype.hasOwnProperty;
exports.has = function (obj, prop) {
    return _hasOwnProperty.call(obj, prop);
};
/**
 * Default function to compare element order.
 * @function
 */
function defaultCompare(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a === b) {
        return 0;
    }
    else {
        return 1;
    }
}
exports.defaultCompare = defaultCompare;
/**
 * Default function to test equality.
 * @function
 */
function defaultEquals(a, b) {
    return a === b;
}
exports.defaultEquals = defaultEquals;
/**
 * Default function to convert an object to a string.
 * @function
 */
function defaultToString(item) {
    if (item === null) {
        return 'COLLECTION_NULL';
    }
    else if (isUndefined(item)) {
        return 'COLLECTION_UNDEFINED';
    }
    else if (isString(item)) {
        return '$s' + item;
    }
    else {
        return '$o' + item.toString();
    }
}
exports.defaultToString = defaultToString;
/**
* Joins all the properies of the object using the provided join string
*/
function makeString(item, join) {
    if (join === void 0) { join = ','; }
    if (item === null) {
        return 'COLLECTION_NULL';
    }
    else if (isUndefined(item)) {
        return 'COLLECTION_UNDEFINED';
    }
    else if (isString(item)) {
        return item.toString();
    }
    else {
        var toret = '{';
        var first = true;
        for (var prop in item) {
            if (exports.has(item, prop)) {
                if (first) {
                    first = false;
                }
                else {
                    toret = toret + join;
                }
                toret = toret + prop + ':' + item[prop];
            }
        }
        return toret + '}';
    }
}
exports.makeString = makeString;
/**
 * Checks if the given argument is a function.
 * @function
 */
function isFunction(func) {
    return (typeof func) === 'function';
}
exports.isFunction = isFunction;
/**
 * Checks if the given argument is undefined.
 * @function
 */
function isUndefined(obj) {
    return (typeof obj) === 'undefined';
}
exports.isUndefined = isUndefined;
/**
 * Checks if the given argument is a string.
 * @function
 */
function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}
exports.isString = isString;
/**
 * Reverses a compare function.
 * @function
 */
function reverseCompareFunction(compareFunction) {
    if (!isFunction(compareFunction)) {
        return function (a, b) {
            if (a < b) {
                return 1;
            }
            else if (a === b) {
                return 0;
            }
            else {
                return -1;
            }
        };
    }
    else {
        return function (d, v) {
            return compareFunction(d, v) * -1;
        };
    }
}
exports.reverseCompareFunction = reverseCompareFunction;
/**
 * Returns an equal function given a compare function.
 * @function
 */
function compareToEquals(compareFunction) {
    return function (a, b) {
        return compareFunction(a, b) === 0;
    };
}
exports.compareToEquals = compareToEquals;

},{}],"typescript-collections":[function(require,module,exports){
"use strict";
// Copyright 2013 Basarat Ali Syed. All Rights Reserved.
//
// Licensed under MIT open source license http://opensource.org/licenses/MIT
//
// Orginal javascript code was by Mauricio Santos
//
var _arrays = require('./arrays');
exports.arrays = _arrays;
var Bag_1 = require('./Bag');
exports.Bag = Bag_1.default;
var BSTree_1 = require('./BSTree');
exports.BSTree = BSTree_1.default;
var Dictionary_1 = require('./Dictionary');
exports.Dictionary = Dictionary_1.default;
var Heap_1 = require('./Heap');
exports.Heap = Heap_1.default;
var LinkedDictionary_1 = require('./LinkedDictionary');
exports.LinkedDictionary = LinkedDictionary_1.default;
var LinkedList_1 = require('./LinkedList');
exports.LinkedList = LinkedList_1.default;
var MultiDictionary_1 = require('./MultiDictionary');
exports.MultiDictionary = MultiDictionary_1.default;
var Queue_1 = require('./Queue');
exports.Queue = Queue_1.default;
var PriorityQueue_1 = require('./PriorityQueue');
exports.PriorityQueue = PriorityQueue_1.default;
var Set_1 = require('./Set');
exports.Set = Set_1.default;
var Stack_1 = require('./Stack');
exports.Stack = Stack_1.default;

},{"./BSTree":1,"./Bag":2,"./Dictionary":3,"./Heap":4,"./LinkedDictionary":5,"./LinkedList":6,"./MultiDictionary":7,"./PriorityQueue":8,"./Queue":9,"./Set":10,"./Stack":11,"./arrays":12}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2xpYi9CU1RyZWUuanMiLCJkaXN0L2xpYi9CYWcuanMiLCJkaXN0L2xpYi9EaWN0aW9uYXJ5LmpzIiwiZGlzdC9saWIvSGVhcC5qcyIsImRpc3QvbGliL0xpbmtlZERpY3Rpb25hcnkuanMiLCJkaXN0L2xpYi9MaW5rZWRMaXN0LmpzIiwiZGlzdC9saWIvTXVsdGlEaWN0aW9uYXJ5LmpzIiwiZGlzdC9saWIvUHJpb3JpdHlRdWV1ZS5qcyIsImRpc3QvbGliL1F1ZXVlLmpzIiwiZGlzdC9saWIvU2V0LmpzIiwiZGlzdC9saWIvU3RhY2suanMiLCJkaXN0L2xpYi9hcnJheXMuanMiLCJkaXN0L2xpYi91dGlsLmpzIiwiZGlzdC9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgUXVldWVfMSA9IHJlcXVpcmUoJy4vUXVldWUnKTtcbnZhciBCU1RyZWUgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgYmluYXJ5IHNlYXJjaCB0cmVlLlxuICAgICAqIEBjbGFzcyA8cD5BIGJpbmFyeSBzZWFyY2ggdHJlZSBpcyBhIGJpbmFyeSB0cmVlIGluIHdoaWNoIGVhY2hcbiAgICAgKiBpbnRlcm5hbCBub2RlIHN0b3JlcyBhbiBlbGVtZW50IHN1Y2ggdGhhdCB0aGUgZWxlbWVudHMgc3RvcmVkIGluIHRoZVxuICAgICAqIGxlZnQgc3VidHJlZSBhcmUgbGVzcyB0aGFuIGl0IGFuZCB0aGUgZWxlbWVudHNcbiAgICAgKiBzdG9yZWQgaW4gdGhlIHJpZ2h0IHN1YnRyZWUgYXJlIGdyZWF0ZXIuPC9wPlxuICAgICAqIDxwPkZvcm1hbGx5LCBhIGJpbmFyeSBzZWFyY2ggdHJlZSBpcyBhIG5vZGUtYmFzZWQgYmluYXJ5IHRyZWUgZGF0YSBzdHJ1Y3R1cmUgd2hpY2hcbiAgICAgKiBoYXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOjwvcD5cbiAgICAgKiA8dWw+XG4gICAgICogPGxpPlRoZSBsZWZ0IHN1YnRyZWUgb2YgYSBub2RlIGNvbnRhaW5zIG9ubHkgbm9kZXMgd2l0aCBlbGVtZW50cyBsZXNzXG4gICAgICogdGhhbiB0aGUgbm9kZSdzIGVsZW1lbnQ8L2xpPlxuICAgICAqIDxsaT5UaGUgcmlnaHQgc3VidHJlZSBvZiBhIG5vZGUgY29udGFpbnMgb25seSBub2RlcyB3aXRoIGVsZW1lbnRzIGdyZWF0ZXJcbiAgICAgKiB0aGFuIHRoZSBub2RlJ3MgZWxlbWVudDwvbGk+XG4gICAgICogPGxpPkJvdGggdGhlIGxlZnQgYW5kIHJpZ2h0IHN1YnRyZWVzIG11c3QgYWxzbyBiZSBiaW5hcnkgc2VhcmNoIHRyZWVzLjwvbGk+XG4gICAgICogPC91bD5cbiAgICAgKiA8cD5JZiB0aGUgaW5zZXJ0ZWQgZWxlbWVudHMgYXJlIGN1c3RvbSBvYmplY3RzIGEgY29tcGFyZSBmdW5jdGlvbiBtdXN0XG4gICAgICogYmUgcHJvdmlkZWQgYXQgY29uc3RydWN0aW9uIHRpbWUsIG90aGVyd2lzZSB0aGUgPD0sID09PSBhbmQgPj0gb3BlcmF0b3JzIGFyZVxuICAgICAqIHVzZWQgdG8gY29tcGFyZSBlbGVtZW50cy4gRXhhbXBsZTo8L3A+XG4gICAgICogPHByZT5cbiAgICAgKiBmdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgICAgKiAgaWYgKGEgaXMgbGVzcyB0aGFuIGIgYnkgc29tZSBvcmRlcmluZyBjcml0ZXJpb24pIHtcbiAgICAgKiAgICAgcmV0dXJuIC0xO1xuICAgICAqICB9IGlmIChhIGlzIGdyZWF0ZXIgdGhhbiBiIGJ5IHRoZSBvcmRlcmluZyBjcml0ZXJpb24pIHtcbiAgICAgKiAgICAgcmV0dXJuIDE7XG4gICAgICogIH1cbiAgICAgKiAgLy8gYSBtdXN0IGJlIGVxdWFsIHRvIGJcbiAgICAgKiAgcmV0dXJuIDA7XG4gICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6bnVtYmVyPX0gY29tcGFyZUZ1bmN0aW9uIG9wdGlvbmFsXG4gICAgICogZnVuY3Rpb24gdXNlZCB0byBjb21wYXJlIHR3byBlbGVtZW50cy4gTXVzdCByZXR1cm4gYSBuZWdhdGl2ZSBpbnRlZ2VyLFxuICAgICAqIHplcm8sIG9yIGEgcG9zaXRpdmUgaW50ZWdlciBhcyB0aGUgZmlyc3QgYXJndW1lbnQgaXMgbGVzcyB0aGFuLCBlcXVhbCB0byxcbiAgICAgKiBvciBncmVhdGVyIHRoYW4gdGhlIHNlY29uZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBCU1RyZWUoY29tcGFyZUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XG4gICAgICAgIHRoaXMuY29tcGFyZSA9IGNvbXBhcmVGdW5jdGlvbiB8fCB1dGlsLmRlZmF1bHRDb21wYXJlO1xuICAgICAgICB0aGlzLm5FbGVtZW50cyA9IDA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIHNwZWNpZmllZCBlbGVtZW50IHRvIHRoaXMgdHJlZSBpZiBpdCBpcyBub3QgYWxyZWFkeSBwcmVzZW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IHRoZSBlbGVtZW50IHRvIGluc2VydC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgdHJlZSBkaWQgbm90IGFscmVhZHkgY29udGFpbiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChlbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmluc2VydE5vZGUodGhpcy5jcmVhdGVOb2RlKGVsZW1lbnQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5uRWxlbWVudHMrKztcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIG9mIHRoZSBlbGVtZW50cyBmcm9tIHRoaXMgdHJlZS5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJvb3QgPSBudWxsO1xuICAgICAgICB0aGlzLm5FbGVtZW50cyA9IDA7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyB0cmVlIGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyB0cmVlIGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxuICAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzID09PSAwO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgdHJlZS5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyB0cmVlLlxuICAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgdHJlZSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyB0cmVlIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCxcbiAgICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoTm9kZSh0aGlzLnJvb3QsIGVsZW1lbnQpICE9PSBudWxsO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgZnJvbSB0aGlzIHRyZWUgaWYgaXQgaXMgcHJlc2VudC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgdHJlZSBjb250YWluZWQgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnNlYXJjaE5vZGUodGhpcy5yb290LCBlbGVtZW50KTtcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZU5vZGUobm9kZSk7XG4gICAgICAgIHRoaXMubkVsZW1lbnRzLS07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudCBwcmVzZW50IGluIHRoaXMgdHJlZSBpblxuICAgICAqIGluLW9yZGVyLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpcyBpbnZva2VkIHdpdGggb25lXG4gICAgICogYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW4gb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5pbm9yZGVyVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaW5vcmRlclRyYXZlcnNhbEF1eCh0aGlzLnJvb3QsIGNhbGxiYWNrLCB7XG4gICAgICAgICAgICBzdG9wOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIHRyZWUgaW4gcHJlLW9yZGVyLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpcyBpbnZva2VkIHdpdGggb25lXG4gICAgICogYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW4gb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5wcmVvcmRlclRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KHRoaXMucm9vdCwgY2FsbGJhY2ssIHtcbiAgICAgICAgICAgIHN0b3A6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudCBwcmVzZW50IGluIHRoaXMgdHJlZSBpbiBwb3N0LW9yZGVyLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpcyBpbnZva2VkIHdpdGggb25lXG4gICAgICogYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW4gb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5wb3N0b3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5yb290LCBjYWxsYmFjaywge1xuICAgICAgICAgICAgc3RvcDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyB0cmVlIGluXG4gICAgICogbGV2ZWwtb3JkZXIuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzIGludm9rZWQgd2l0aCBvbmVcbiAgICAgKiBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhbiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLmxldmVsVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMubGV2ZWxUcmF2ZXJzYWxBdXgodGhpcy5yb290LCBjYWxsYmFjayk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtaW5pbXVtIGVsZW1lbnQgb2YgdGhpcyB0cmVlLlxuICAgICAqIEByZXR1cm4geyp9IHRoZSBtaW5pbXVtIGVsZW1lbnQgb2YgdGhpcyB0cmVlIG9yIHVuZGVmaW5lZCBpZiB0aGlzIHRyZWUgaXNcbiAgICAgKiBpcyBlbXB0eS5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLm1pbmltdW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5taW5pbXVtQXV4KHRoaXMucm9vdCkuZWxlbWVudDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gZWxlbWVudCBvZiB0aGlzIHRyZWUuXG4gICAgICogQHJldHVybiB7Kn0gdGhlIG1heGltdW0gZWxlbWVudCBvZiB0aGlzIHRyZWUgb3IgdW5kZWZpbmVkIGlmIHRoaXMgdHJlZSBpc1xuICAgICAqIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUubWF4aW11bSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm1heGltdW1BdXgodGhpcy5yb290KS5lbGVtZW50O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudCBwcmVzZW50IGluIHRoaXMgdHJlZSBpbiBpbm9yZGVyLlxuICAgICAqIEVxdWl2YWxlbnQgdG8gaW5vcmRlclRyYXZlcnNhbC5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiB0aGUgZWxlbWVudCB2YWx1ZSwgdG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaW5vcmRlclRyYXZlcnNhbChjYWxsYmFjayk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIHRyZWUgaW4gaW4tb3JkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIHRyZWUgaW4gaW4tb3JkZXIuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhpcyB0cmVlLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGhlaWdodCBvZiB0aGlzIHRyZWUgb3IgLTEgaWYgaXMgZW1wdHkuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5oZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlaWdodEF1eCh0aGlzLnJvb3QpO1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5zZWFyY2hOb2RlID0gZnVuY3Rpb24gKG5vZGUsIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGNtcCA9IG51bGw7XG4gICAgICAgIHdoaWxlIChub2RlICE9PSBudWxsICYmIGNtcCAhPT0gMCkge1xuICAgICAgICAgICAgY21wID0gdGhpcy5jb21wYXJlKGVsZW1lbnQsIG5vZGUuZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoY21wIDwgMCkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLmxlZnRDaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNtcCA+IDApIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5yaWdodENoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS50cmFuc3BsYW50ID0gZnVuY3Rpb24gKG4xLCBuMikge1xuICAgICAgICBpZiAobjEucGFyZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBuMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChuMSA9PT0gbjEucGFyZW50LmxlZnRDaCkge1xuICAgICAgICAgICAgbjEucGFyZW50LmxlZnRDaCA9IG4yO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbjEucGFyZW50LnJpZ2h0Q2ggPSBuMjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobjIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIG4yLnBhcmVudCA9IG4xLnBhcmVudDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5yZW1vdmVOb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUubGVmdENoID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnRyYW5zcGxhbnQobm9kZSwgbm9kZS5yaWdodENoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLnJpZ2h0Q2ggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNwbGFudChub2RlLCBub2RlLmxlZnRDaCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMubWluaW11bUF1eChub2RlLnJpZ2h0Q2gpO1xuICAgICAgICAgICAgaWYgKHkucGFyZW50ICE9PSBub2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc3BsYW50KHksIHkucmlnaHRDaCk7XG4gICAgICAgICAgICAgICAgeS5yaWdodENoID0gbm9kZS5yaWdodENoO1xuICAgICAgICAgICAgICAgIHkucmlnaHRDaC5wYXJlbnQgPSB5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50cmFuc3BsYW50KG5vZGUsIHkpO1xuICAgICAgICAgICAgeS5sZWZ0Q2ggPSBub2RlLmxlZnRDaDtcbiAgICAgICAgICAgIHkubGVmdENoLnBhcmVudCA9IHk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICogQHByaXZhdGVcbiAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaywgc2lnbmFsKSB7XG4gICAgICAgIGlmIChub2RlID09PSBudWxsIHx8IHNpZ25hbC5zdG9wKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KG5vZGUubGVmdENoLCBjYWxsYmFjaywgc2lnbmFsKTtcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2lnbmFsLnN0b3AgPSBjYWxsYmFjayhub2RlLmVsZW1lbnQpID09PSBmYWxzZTtcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KG5vZGUucmlnaHRDaCwgY2FsbGJhY2ssIHNpZ25hbCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLmxldmVsVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZV8xLmRlZmF1bHQoKTtcbiAgICAgICAgaWYgKG5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHF1ZXVlLmVucXVldWUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKCFxdWV1ZS5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgIG5vZGUgPSBxdWV1ZS5kZXF1ZXVlKCk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sobm9kZS5lbGVtZW50KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5sZWZ0Q2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZS5lbnF1ZXVlKG5vZGUubGVmdENoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnJpZ2h0Q2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZS5lbnF1ZXVlKG5vZGUucmlnaHRDaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICogQHByaXZhdGVcbiAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUucHJlb3JkZXJUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2ssIHNpZ25hbCkge1xuICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCB8fCBzaWduYWwuc3RvcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNpZ25hbC5zdG9wID0gY2FsbGJhY2sobm9kZS5lbGVtZW50KSA9PT0gZmFsc2U7XG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgobm9kZS5sZWZ0Q2gsIGNhbGxiYWNrLCBzaWduYWwpO1xuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZW9yZGVyVHJhdmVyc2FsQXV4KG5vZGUucmlnaHRDaCwgY2FsbGJhY2ssIHNpZ25hbCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLnBvc3RvcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaywgc2lnbmFsKSB7XG4gICAgICAgIGlmIChub2RlID09PSBudWxsIHx8IHNpZ25hbC5zdG9wKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgobm9kZS5sZWZ0Q2gsIGNhbGxiYWNrLCBzaWduYWwpO1xuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eChub2RlLnJpZ2h0Q2gsIGNhbGxiYWNrLCBzaWduYWwpO1xuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzaWduYWwuc3RvcCA9IGNhbGxiYWNrKG5vZGUuZWxlbWVudCkgPT09IGZhbHNlO1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5taW5pbXVtQXV4ID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgd2hpbGUgKG5vZGUubGVmdENoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5sZWZ0Q2g7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLm1heGltdW1BdXggPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB3aGlsZSAobm9kZS5yaWdodENoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5yaWdodENoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICAqIEBwcml2YXRlXG4gICAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUuaGVpZ2h0QXV4ID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5oZWlnaHRBdXgobm9kZS5sZWZ0Q2gpLCB0aGlzLmhlaWdodEF1eChub2RlLnJpZ2h0Q2gpKSArIDE7XG4gICAgfTtcbiAgICAvKlxuICAgICogQHByaXZhdGVcbiAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUuaW5zZXJ0Tm9kZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSBudWxsO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLnJvb3Q7XG4gICAgICAgIHZhciBjbXAgPSBudWxsO1xuICAgICAgICB3aGlsZSAocG9zaXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNtcCA9IHRoaXMuY29tcGFyZShub2RlLmVsZW1lbnQsIHBvc2l0aW9uLmVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY21wIDwgMCkge1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24ubGVmdENoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gcG9zaXRpb247XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbi5yaWdodENoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5vZGUucGFyZW50ID0gcGFyZW50O1xuICAgICAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICAvLyB0cmVlIGlzIGVtcHR5XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY29tcGFyZShub2RlLmVsZW1lbnQsIHBhcmVudC5lbGVtZW50KSA8IDApIHtcbiAgICAgICAgICAgIHBhcmVudC5sZWZ0Q2ggPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LnJpZ2h0Q2ggPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5jcmVhdGVOb2RlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICAgICAgICBsZWZ0Q2g6IG51bGwsXG4gICAgICAgICAgICByaWdodENoOiBudWxsLFxuICAgICAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gQlNUcmVlO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEJTVHJlZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJTVHJlZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgRGljdGlvbmFyeV8xID0gcmVxdWlyZSgnLi9EaWN0aW9uYXJ5Jyk7XG52YXIgU2V0XzEgPSByZXF1aXJlKCcuL1NldCcpO1xudmFyIEJhZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBiYWcuXG4gICAgICogQGNsYXNzIDxwPkEgYmFnIGlzIGEgc3BlY2lhbCBraW5kIG9mIHNldCBpbiB3aGljaCBtZW1iZXJzIGFyZVxuICAgICAqIGFsbG93ZWQgdG8gYXBwZWFyIG1vcmUgdGhhbiBvbmNlLjwvcD5cbiAgICAgKiA8cD5JZiB0aGUgaW5zZXJ0ZWQgZWxlbWVudHMgYXJlIGN1c3RvbSBvYmplY3RzIGEgZnVuY3Rpb25cbiAgICAgKiB3aGljaCBjb252ZXJ0cyBlbGVtZW50cyB0byB1bmlxdWUgc3RyaW5ncyBtdXN0IGJlIHByb3ZpZGVkLiBFeGFtcGxlOjwvcD5cbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogZnVuY3Rpb24gcGV0VG9TdHJpbmcocGV0KSB7XG4gICAgICogIHJldHVybiBwZXQubmFtZTtcbiAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6c3RyaW5nPX0gdG9TdHJGdW5jdGlvbiBvcHRpb25hbCBmdW5jdGlvbiB1c2VkXG4gICAgICogdG8gY29udmVydCBlbGVtZW50cyB0byBzdHJpbmdzLiBJZiB0aGUgZWxlbWVudHMgYXJlbid0IHN0cmluZ3Mgb3IgaWYgdG9TdHJpbmcoKVxuICAgICAqIGlzIG5vdCBhcHByb3ByaWF0ZSwgYSBjdXN0b20gZnVuY3Rpb24gd2hpY2ggcmVjZWl2ZXMgYW4gb2JqZWN0IGFuZCByZXR1cm5zIGFcbiAgICAgKiB1bmlxdWUgc3RyaW5nIG11c3QgYmUgcHJvdmlkZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gQmFnKHRvU3RyRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy50b1N0ckYgPSB0b1N0ckZ1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdFRvU3RyaW5nO1xuICAgICAgICB0aGlzLmRpY3Rpb25hcnkgPSBuZXcgRGljdGlvbmFyeV8xLmRlZmF1bHQodGhpcy50b1N0ckYpO1xuICAgICAgICB0aGlzLm5FbGVtZW50cyA9IDA7XG4gICAgfVxuICAgIC8qKlxuICAgICogQWRkcyBuQ29waWVzIG9mIHRoZSBzcGVjaWZpZWQgb2JqZWN0IHRvIHRoaXMgYmFnLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgZWxlbWVudCB0byBhZGQuXG4gICAgKiBAcGFyYW0ge251bWJlcj19IG5Db3BpZXMgdGhlIG51bWJlciBvZiBjb3BpZXMgdG8gYWRkLCBpZiB0aGlzIGFyZ3VtZW50IGlzXG4gICAgKiB1bmRlZmluZWQgMSBjb3B5IGlzIGFkZGVkLlxuICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSB1bmxlc3MgZWxlbWVudCBpcyB1bmRlZmluZWQuXG4gICAgKi9cbiAgICBCYWcucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBuQ29waWVzKSB7XG4gICAgICAgIGlmIChuQ29waWVzID09PSB2b2lkIDApIHsgbkNvcGllcyA9IDE7IH1cbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoZWxlbWVudCkgfHwgbkNvcGllcyA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogZWxlbWVudCxcbiAgICAgICAgICAgICAgICBjb3BpZXM6IG5Db3BpZXNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmRpY3Rpb25hcnkuc2V0VmFsdWUoZWxlbWVudCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpY3Rpb25hcnkuZ2V0VmFsdWUoZWxlbWVudCkuY29waWVzICs9IG5Db3BpZXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uRWxlbWVudHMgKz0gbkNvcGllcztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIENvdW50cyB0aGUgbnVtYmVyIG9mIGNvcGllcyBvZiB0aGUgc3BlY2lmaWVkIG9iamVjdCBpbiB0aGlzIGJhZy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IHRoZSBvYmplY3QgdG8gc2VhcmNoIGZvci4uXG4gICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgY29waWVzIG9mIHRoZSBvYmplY3QsIDAgaWYgbm90IGZvdW5kXG4gICAgKi9cbiAgICBCYWcucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkuZ2V0VmFsdWUoZWxlbWVudCkuY29waWVzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBiYWcgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IGVsZW1lbnQgdG8gc2VhcmNoIGZvci5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgYmFnIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCxcbiAgICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgQmFnLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkuY29udGFpbnNLZXkoZWxlbWVudCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIFJlbW92ZXMgbkNvcGllcyBvZiB0aGUgc3BlY2lmaWVkIG9iamVjdCB0byB0aGlzIGJhZy5cbiAgICAqIElmIHRoZSBudW1iZXIgb2YgY29waWVzIHRvIHJlbW92ZSBpcyBncmVhdGVyIHRoYW4gdGhlIGFjdHVhbCBudW1iZXJcbiAgICAqIG9mIGNvcGllcyBpbiB0aGUgQmFnLCBhbGwgY29waWVzIGFyZSByZW1vdmVkLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgZWxlbWVudCB0byByZW1vdmUuXG4gICAgKiBAcGFyYW0ge251bWJlcj19IG5Db3BpZXMgdGhlIG51bWJlciBvZiBjb3BpZXMgdG8gcmVtb3ZlLCBpZiB0aGlzIGFyZ3VtZW50IGlzXG4gICAgKiB1bmRlZmluZWQgMSBjb3B5IGlzIHJlbW92ZWQuXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIGF0IGxlYXN0IDEgZWxlbWVudCB3YXMgcmVtb3ZlZC5cbiAgICAqL1xuICAgIEJhZy5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG5Db3BpZXMpIHtcbiAgICAgICAgaWYgKG5Db3BpZXMgPT09IHZvaWQgMCkgeyBuQ29waWVzID0gMTsgfVxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChlbGVtZW50KSB8fCBuQ29waWVzIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5kaWN0aW9uYXJ5LmdldFZhbHVlKGVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKG5Db3BpZXMgPiBub2RlLmNvcGllcykge1xuICAgICAgICAgICAgICAgIHRoaXMubkVsZW1lbnRzIC09IG5vZGUuY29waWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uRWxlbWVudHMgLT0gbkNvcGllcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUuY29waWVzIC09IG5Db3BpZXM7XG4gICAgICAgICAgICBpZiAobm9kZS5jb3BpZXMgPD0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeS5yZW1vdmUoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgZWxlbWVudHMgaW4gdGhpcyBiaWcgaW4gYXJiaXRyYXJ5IG9yZGVyLFxuICAgICAqIGluY2x1ZGluZyBtdWx0aXBsZSBjb3BpZXMuXG4gICAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIGJhZy5cbiAgICAgKi9cbiAgICBCYWcucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLmRpY3Rpb25hcnkudmFsdWVzKCk7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgdmFsdWVzXzEgPSB2YWx1ZXM7IF9pIDwgdmFsdWVzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHZhbHVlc18xW19pXTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbm9kZS52YWx1ZTtcbiAgICAgICAgICAgIHZhciBjb3BpZXMgPSBub2RlLmNvcGllcztcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29waWVzOyBqKyspIHtcbiAgICAgICAgICAgICAgICBhLnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc2V0IG9mIHVuaXF1ZSBlbGVtZW50cyBpbiB0aGlzIGJhZy5cbiAgICAgKiBAcmV0dXJuIHtjb2xsZWN0aW9ucy5TZXQ8VD59IGEgc2V0IG9mIHVuaXF1ZSBlbGVtZW50cyBpbiB0aGlzIGJhZy5cbiAgICAgKi9cbiAgICBCYWcucHJvdG90eXBlLnRvU2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9yZXQgPSBuZXcgU2V0XzEuZGVmYXVsdCh0aGlzLnRvU3RyRik7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IHRoaXMuZGljdGlvbmFyeS52YWx1ZXMoKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBlbGVtZW50c18xID0gZWxlbWVudHM7IF9pIDwgZWxlbWVudHNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBlbGUgPSBlbGVtZW50c18xW19pXTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGVsZS52YWx1ZTtcbiAgICAgICAgICAgIHRvcmV0LmFkZCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvcmV0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudFxuICAgICAqIHByZXNlbnQgaW4gdGhpcyBiYWcsIGluY2x1ZGluZyBtdWx0aXBsZSBjb3BpZXMuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXG4gICAgICogaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogdGhlIGVsZW1lbnQuIFRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxuICAgICAqIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIEJhZy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmRpY3Rpb25hcnkuZm9yRWFjaChmdW5jdGlvbiAoaywgdikge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdi52YWx1ZTtcbiAgICAgICAgICAgIHZhciBjb3BpZXMgPSB2LmNvcGllcztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29waWVzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgYmFnLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGJhZy5cbiAgICAgKi9cbiAgICBCYWcucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5FbGVtZW50cztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGJhZyBjb250YWlucyBubyBlbGVtZW50cy5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgYmFnIGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxuICAgICAqL1xuICAgIEJhZy5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzID09PSAwO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgb2YgdGhlIGVsZW1lbnRzIGZyb20gdGhpcyBiYWcuXG4gICAgICovXG4gICAgQmFnLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5uRWxlbWVudHMgPSAwO1xuICAgICAgICB0aGlzLmRpY3Rpb25hcnkuY2xlYXIoKTtcbiAgICB9O1xuICAgIHJldHVybiBCYWc7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQmFnOyAvLyBFbmQgb2YgYmFnXG4vLyMgc291cmNlTWFwcGluZ1VSTD1CYWcuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIERpY3Rpb25hcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgZGljdGlvbmFyeS5cbiAgICAgKiBAY2xhc3MgPHA+RGljdGlvbmFyaWVzIG1hcCBrZXlzIHRvIHZhbHVlczsgZWFjaCBrZXkgY2FuIG1hcCB0byBhdCBtb3N0IG9uZSB2YWx1ZS5cbiAgICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIGFjY2VwdHMgYW55IGtpbmQgb2Ygb2JqZWN0cyBhcyBrZXlzLjwvcD5cbiAgICAgKlxuICAgICAqIDxwPklmIHRoZSBrZXlzIGFyZSBjdXN0b20gb2JqZWN0cyBhIGZ1bmN0aW9uIHdoaWNoIGNvbnZlcnRzIGtleXMgdG8gdW5pcXVlXG4gICAgICogc3RyaW5ncyBtdXN0IGJlIHByb3ZpZGVkLiBFeGFtcGxlOjwvcD5cbiAgICAgKiA8cHJlPlxuICAgICAqIGZ1bmN0aW9uIHBldFRvU3RyaW5nKHBldCkge1xuICAgICAqICByZXR1cm4gcGV0Lm5hbWU7XG4gICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KTpzdHJpbmc9fSB0b1N0ckZ1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWRcbiAgICAgKiB0byBjb252ZXJ0IGtleXMgdG8gc3RyaW5ncy4gSWYgdGhlIGtleXMgYXJlbid0IHN0cmluZ3Mgb3IgaWYgdG9TdHJpbmcoKVxuICAgICAqIGlzIG5vdCBhcHByb3ByaWF0ZSwgYSBjdXN0b20gZnVuY3Rpb24gd2hpY2ggcmVjZWl2ZXMgYSBrZXkgYW5kIHJldHVybnMgYVxuICAgICAqIHVuaXF1ZSBzdHJpbmcgbXVzdCBiZSBwcm92aWRlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBEaWN0aW9uYXJ5KHRvU3RyRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy50YWJsZSA9IHt9O1xuICAgICAgICB0aGlzLm5FbGVtZW50cyA9IDA7XG4gICAgICAgIHRoaXMudG9TdHIgPSB0b1N0ckZ1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdFRvU3RyaW5nO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSB0byB3aGljaCB0aGlzIGRpY3Rpb25hcnkgbWFwcyB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKiBSZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgbm8gbWFwcGluZyBmb3IgdGhpcyBrZXkuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2hvc2UgYXNzb2NpYXRlZCB2YWx1ZSBpcyB0byBiZSByZXR1cm5lZC5cbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgdmFsdWUgdG8gd2hpY2ggdGhpcyBkaWN0aW9uYXJ5IG1hcHMgdGhlIHNwZWNpZmllZCBrZXkgb3JcbiAgICAgKiB1bmRlZmluZWQgaWYgdGhlIG1hcCBjb250YWlucyBubyBtYXBwaW5nIGZvciB0aGlzIGtleS5cbiAgICAgKi9cbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHBhaXIgPSB0aGlzLnRhYmxlWyckJyArIHRoaXMudG9TdHIoa2V5KV07XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKHBhaXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWlyLnZhbHVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQXNzb2NpYXRlcyB0aGUgc3BlY2lmaWVkIHZhbHVlIHdpdGggdGhlIHNwZWNpZmllZCBrZXkgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqIElmIHRoZSBkaWN0aW9uYXJ5IHByZXZpb3VzbHkgY29udGFpbmVkIGEgbWFwcGluZyBmb3IgdGhpcyBrZXksIHRoZSBvbGRcbiAgICAgKiB2YWx1ZSBpcyByZXBsYWNlZCBieSB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdpdGggd2hpY2ggdGhlIHNwZWNpZmllZCB2YWx1ZSBpcyB0byBiZVxuICAgICAqIGFzc29jaWF0ZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIHZhbHVlIHRvIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKiBAcmV0dXJuIHsqfSBwcmV2aW91cyB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZCBrZXksIG9yIHVuZGVmaW5lZCBpZlxuICAgICAqIHRoZXJlIHdhcyBubyBtYXBwaW5nIGZvciB0aGUga2V5IG9yIGlmIHRoZSBrZXkvdmFsdWUgYXJlIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGtleSkgfHwgdXRpbC5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldDtcbiAgICAgICAgdmFyIGsgPSAnJCcgKyB0aGlzLnRvU3RyKGtleSk7XG4gICAgICAgIHZhciBwcmV2aW91c0VsZW1lbnQgPSB0aGlzLnRhYmxlW2tdO1xuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChwcmV2aW91c0VsZW1lbnQpKSB7XG4gICAgICAgICAgICB0aGlzLm5FbGVtZW50cysrO1xuICAgICAgICAgICAgcmV0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0ID0gcHJldmlvdXNFbGVtZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFibGVba10gPSB7XG4gICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgbWFwcGluZyBmb3IgdGhpcyBrZXkgZnJvbSB0aGlzIGRpY3Rpb25hcnkgaWYgaXQgaXMgcHJlc2VudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aG9zZSBtYXBwaW5nIGlzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgKiBkaWN0aW9uYXJ5LlxuICAgICAqIEByZXR1cm4geyp9IHByZXZpb3VzIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBzcGVjaWZpZWQga2V5LCBvciB1bmRlZmluZWQgaWZcbiAgICAgKiB0aGVyZSB3YXMgbm8gbWFwcGluZyBmb3Iga2V5LlxuICAgICAqL1xuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIGsgPSAnJCcgKyB0aGlzLnRvU3RyKGtleSk7XG4gICAgICAgIHZhciBwcmV2aW91c0VsZW1lbnQgPSB0aGlzLnRhYmxlW2tdO1xuICAgICAgICBpZiAoIXV0aWwuaXNVbmRlZmluZWQocHJldmlvdXNFbGVtZW50KSkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMudGFibGVba107XG4gICAgICAgICAgICB0aGlzLm5FbGVtZW50cy0tO1xuICAgICAgICAgICAgcmV0dXJuIHByZXZpb3VzRWxlbWVudC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUga2V5cyBpbiB0aGlzIGRpY3Rpb25hcnkuXG4gICAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBrZXlzIGluIHRoaXMgZGljdGlvbmFyeS5cbiAgICAgKi9cbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgbmFtZV8xIGluIHRoaXMudGFibGUpIHtcbiAgICAgICAgICAgIGlmICh1dGlsLmhhcyh0aGlzLnRhYmxlLCBuYW1lXzEpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaXIgPSB0aGlzLnRhYmxlW25hbWVfMV07XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChwYWlyLmtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgdmFsdWVzIGluIHRoaXMgZGljdGlvbmFyeS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIHZhbHVlcyBpbiB0aGlzIGRpY3Rpb25hcnkuXG4gICAgICovXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgbmFtZV8yIGluIHRoaXMudGFibGUpIHtcbiAgICAgICAgICAgIGlmICh1dGlsLmhhcyh0aGlzLnRhYmxlLCBuYW1lXzIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaXIgPSB0aGlzLnRhYmxlW25hbWVfMl07XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChwYWlyLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGtleS12YWx1ZSBwYWlyXG4gICAgKiBwcmVzZW50IGluIHRoaXMgZGljdGlvbmFyeS5cbiAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcbiAgICAqIGludm9rZWQgd2l0aCB0d28gYXJndW1lbnRzOiBrZXkgYW5kIHZhbHVlLiBUbyBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cbiAgICAqIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxuICAgICovXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBmb3IgKHZhciBuYW1lXzMgaW4gdGhpcy50YWJsZSkge1xuICAgICAgICAgICAgaWYgKHV0aWwuaGFzKHRoaXMudGFibGUsIG5hbWVfMykpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpciA9IHRoaXMudGFibGVbbmFtZV8zXTtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gY2FsbGJhY2socGFpci5rZXksIHBhaXIudmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgYSBtYXBwaW5nIGZvciB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aG9zZSBwcmVzZW5jZSBpbiB0aGlzIGRpY3Rpb25hcnkgaXMgdG8gYmVcbiAgICAgKiB0ZXN0ZWQuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgYSBtYXBwaW5nIGZvciB0aGVcbiAgICAgKiBzcGVjaWZpZWQga2V5LlxuICAgICAqL1xuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLmNvbnRhaW5zS2V5ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gIXV0aWwuaXNVbmRlZmluZWQodGhpcy5nZXRWYWx1ZShrZXkpKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICogUmVtb3ZlcyBhbGwgbWFwcGluZ3MgZnJvbSB0aGlzIGRpY3Rpb25hcnkuXG4gICAgKiBAdGhpcyB7Y29sbGVjdGlvbnMuRGljdGlvbmFyeX1cbiAgICAqL1xuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRhYmxlID0ge307XG4gICAgICAgIHRoaXMubkVsZW1lbnRzID0gMDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBrZXlzIGluIHRoaXMgZGljdGlvbmFyeS5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2Yga2V5LXZhbHVlIG1hcHBpbmdzIGluIHRoaXMgZGljdGlvbmFyeS5cbiAgICAgKi9cbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uRWxlbWVudHM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGNvbnRhaW5zIG5vIG1hcHBpbmdzLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGNvbnRhaW5zIG5vIG1hcHBpbmdzLlxuICAgICAqL1xuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5FbGVtZW50cyA8PSAwO1xuICAgIH07XG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0b3JldCA9ICd7JztcbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgICAgICAgICB0b3JldCArPSBcIlxcblxcdFwiICsgayArIFwiIDogXCIgKyB2O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRvcmV0ICsgJ1xcbn0nO1xuICAgIH07XG4gICAgcmV0dXJuIERpY3Rpb25hcnk7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gRGljdGlvbmFyeTsgLy8gRW5kIG9mIGRpY3Rpb25hcnlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURpY3Rpb25hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgY29sbGVjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBhcnJheXMgPSByZXF1aXJlKCcuL2FycmF5cycpO1xudmFyIEhlYXAgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgSGVhcC5cbiAgICAgKiBAY2xhc3NcbiAgICAgKiA8cD5BIGhlYXAgaXMgYSBiaW5hcnkgdHJlZSwgd2hlcmUgdGhlIG5vZGVzIG1haW50YWluIHRoZSBoZWFwIHByb3BlcnR5OlxuICAgICAqIGVhY2ggbm9kZSBpcyBzbWFsbGVyIHRoYW4gZWFjaCBvZiBpdHMgY2hpbGRyZW4gYW5kIHRoZXJlZm9yZSBhIE1pbkhlYXBcbiAgICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIHVzZXMgYW4gYXJyYXkgdG8gc3RvcmUgZWxlbWVudHMuPC9wPlxuICAgICAqIDxwPklmIHRoZSBpbnNlcnRlZCBlbGVtZW50cyBhcmUgY3VzdG9tIG9iamVjdHMgYSBjb21wYXJlIGZ1bmN0aW9uIG11c3QgYmUgcHJvdmlkZWQsXG4gICAgICogIGF0IGNvbnN0cnVjdGlvbiB0aW1lLCBvdGhlcndpc2UgdGhlIDw9LCA9PT0gYW5kID49IG9wZXJhdG9ycyBhcmVcbiAgICAgKiB1c2VkIHRvIGNvbXBhcmUgZWxlbWVudHMuIEV4YW1wbGU6PC9wPlxuICAgICAqXG4gICAgICogPHByZT5cbiAgICAgKiBmdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgICAgKiAgaWYgKGEgaXMgbGVzcyB0aGFuIGIgYnkgc29tZSBvcmRlcmluZyBjcml0ZXJpb24pIHtcbiAgICAgKiAgICAgcmV0dXJuIC0xO1xuICAgICAqICB9IGlmIChhIGlzIGdyZWF0ZXIgdGhhbiBiIGJ5IHRoZSBvcmRlcmluZyBjcml0ZXJpb24pIHtcbiAgICAgKiAgICAgcmV0dXJuIDE7XG4gICAgICogIH1cbiAgICAgKiAgLy8gYSBtdXN0IGJlIGVxdWFsIHRvIGJcbiAgICAgKiAgcmV0dXJuIDA7XG4gICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogPHA+SWYgYSBNYXgtSGVhcCBpcyB3YW50ZWQgKGdyZWF0ZXIgZWxlbWVudHMgb24gdG9wKSB5b3UgY2FuIGEgcHJvdmlkZSBhXG4gICAgICogcmV2ZXJzZSBjb21wYXJlIGZ1bmN0aW9uIHRvIGFjY29tcGxpc2ggdGhhdCBiZWhhdmlvci4gRXhhbXBsZTo8L3A+XG4gICAgICpcbiAgICAgKiA8cHJlPlxuICAgICAqIGZ1bmN0aW9uIHJldmVyc2VDb21wYXJlKGEsIGIpIHtcbiAgICAgKiAgaWYgKGEgaXMgbGVzcyB0aGFuIGIgYnkgc29tZSBvcmRlcmluZyBjcml0ZXJpb24pIHtcbiAgICAgKiAgICAgcmV0dXJuIDE7XG4gICAgICogIH0gaWYgKGEgaXMgZ3JlYXRlciB0aGFuIGIgYnkgdGhlIG9yZGVyaW5nIGNyaXRlcmlvbikge1xuICAgICAqICAgICByZXR1cm4gLTE7XG4gICAgICogIH1cbiAgICAgKiAgLy8gYSBtdXN0IGJlIGVxdWFsIHRvIGJcbiAgICAgKiAgcmV0dXJuIDA7XG4gICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpudW1iZXI9fSBjb21wYXJlRnVuY3Rpb24gb3B0aW9uYWxcbiAgICAgKiBmdW5jdGlvbiB1c2VkIHRvIGNvbXBhcmUgdHdvIGVsZW1lbnRzLiBNdXN0IHJldHVybiBhIG5lZ2F0aXZlIGludGVnZXIsXG4gICAgICogemVybywgb3IgYSBwb3NpdGl2ZSBpbnRlZ2VyIGFzIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBsZXNzIHRoYW4sIGVxdWFsIHRvLFxuICAgICAqIG9yIGdyZWF0ZXIgdGhhbiB0aGUgc2Vjb25kLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEhlYXAoY29tcGFyZUZ1bmN0aW9uKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcnJheSB1c2VkIHRvIHN0b3JlIHRoZSBlbGVtZW50cyBvZCB0aGUgaGVhcC5cbiAgICAgICAgICogQHR5cGUge0FycmF5LjxPYmplY3Q+fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgICAgIHRoaXMuY29tcGFyZSA9IGNvbXBhcmVGdW5jdGlvbiB8fCBjb2xsZWN0aW9ucy5kZWZhdWx0Q29tcGFyZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGxlZnQgY2hpbGQgb2YgdGhlIG5vZGUgYXQgdGhlIGdpdmVuIGluZGV4LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBub2RlSW5kZXggVGhlIGluZGV4IG9mIHRoZSBub2RlIHRvIGdldCB0aGUgbGVmdCBjaGlsZFxuICAgICAqIGZvci5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBpbmRleCBvZiB0aGUgbGVmdCBjaGlsZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEhlYXAucHJvdG90eXBlLmxlZnRDaGlsZEluZGV4ID0gZnVuY3Rpb24gKG5vZGVJbmRleCkge1xuICAgICAgICByZXR1cm4gKDIgKiBub2RlSW5kZXgpICsgMTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSByaWdodCBjaGlsZCBvZiB0aGUgbm9kZSBhdCB0aGUgZ2l2ZW4gaW5kZXguXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5vZGVJbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gZ2V0IHRoZSByaWdodCBjaGlsZFxuICAgICAqIGZvci5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBpbmRleCBvZiB0aGUgcmlnaHQgY2hpbGQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5yaWdodENoaWxkSW5kZXggPSBmdW5jdGlvbiAobm9kZUluZGV4KSB7XG4gICAgICAgIHJldHVybiAoMiAqIG5vZGVJbmRleCkgKyAyO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIHBhcmVudCBvZiB0aGUgbm9kZSBhdCB0aGUgZ2l2ZW4gaW5kZXguXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5vZGVJbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gZ2V0IHRoZSBwYXJlbnQgZm9yLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGluZGV4IG9mIHRoZSBwYXJlbnQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5wYXJlbnRJbmRleCA9IGZ1bmN0aW9uIChub2RlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKG5vZGVJbmRleCAtIDEpIC8gMik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgc21hbGxlciBjaGlsZCBub2RlIChpZiBpdCBleGlzdHMpLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0Q2hpbGQgbGVmdCBjaGlsZCBpbmRleC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmlnaHRDaGlsZCByaWdodCBjaGlsZCBpbmRleC5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbmRleCB3aXRoIHRoZSBtaW5pbXVtIHZhbHVlIG9yIC0xIGlmIGl0IGRvZXNuJ3RcbiAgICAgKiBleGlzdHMuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5taW5JbmRleCA9IGZ1bmN0aW9uIChsZWZ0Q2hpbGQsIHJpZ2h0Q2hpbGQpIHtcbiAgICAgICAgaWYgKHJpZ2h0Q2hpbGQgPj0gdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGxlZnRDaGlsZCA+PSB0aGlzLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRDaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBhcmUodGhpcy5kYXRhW2xlZnRDaGlsZF0sIHRoaXMuZGF0YVtyaWdodENoaWxkXSkgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmlnaHRDaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogTW92ZXMgdGhlIG5vZGUgYXQgdGhlIGdpdmVuIGluZGV4IHVwIHRvIGl0cyBwcm9wZXIgcGxhY2UgaW4gdGhlIGhlYXAuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbm9kZSB0byBtb3ZlIHVwLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUuc2lmdFVwID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudEluZGV4KGluZGV4KTtcbiAgICAgICAgd2hpbGUgKGluZGV4ID4gMCAmJiB0aGlzLmNvbXBhcmUodGhpcy5kYXRhW3BhcmVudF0sIHRoaXMuZGF0YVtpbmRleF0pID4gMCkge1xuICAgICAgICAgICAgYXJyYXlzLnN3YXAodGhpcy5kYXRhLCBwYXJlbnQsIGluZGV4KTtcbiAgICAgICAgICAgIGluZGV4ID0gcGFyZW50O1xuICAgICAgICAgICAgcGFyZW50ID0gdGhpcy5wYXJlbnRJbmRleChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1vdmVzIHRoZSBub2RlIGF0IHRoZSBnaXZlbiBpbmRleCBkb3duIHRvIGl0cyBwcm9wZXIgcGxhY2UgaW4gdGhlIGhlYXAuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5vZGVJbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gbW92ZSBkb3duLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUuc2lmdERvd24gPSBmdW5jdGlvbiAobm9kZUluZGV4KSB7XG4gICAgICAgIC8vc21hbGxlciBjaGlsZCBpbmRleFxuICAgICAgICB2YXIgbWluID0gdGhpcy5taW5JbmRleCh0aGlzLmxlZnRDaGlsZEluZGV4KG5vZGVJbmRleCksIHRoaXMucmlnaHRDaGlsZEluZGV4KG5vZGVJbmRleCkpO1xuICAgICAgICB3aGlsZSAobWluID49IDAgJiYgdGhpcy5jb21wYXJlKHRoaXMuZGF0YVtub2RlSW5kZXhdLCB0aGlzLmRhdGFbbWluXSkgPiAwKSB7XG4gICAgICAgICAgICBhcnJheXMuc3dhcCh0aGlzLmRhdGEsIG1pbiwgbm9kZUluZGV4KTtcbiAgICAgICAgICAgIG5vZGVJbmRleCA9IG1pbjtcbiAgICAgICAgICAgIG1pbiA9IHRoaXMubWluSW5kZXgodGhpcy5sZWZ0Q2hpbGRJbmRleChub2RlSW5kZXgpLCB0aGlzLnJpZ2h0Q2hpbGRJbmRleChub2RlSW5kZXgpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGJ1dCBkb2VzIG5vdCByZW1vdmUgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGlzIGhlYXAuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIHZhbHVlIGF0IHRoZSByb290IG9mIHRoZSBoZWFwLiBSZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGVcbiAgICAgKiBoZWFwIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIEhlYXAucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVswXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIGdpdmVuIGVsZW1lbnQgaW50byB0aGUgaGVhcC5cbiAgICAgKiBAcGFyYW0geyp9IGVsZW1lbnQgdGhlIGVsZW1lbnQuXG4gICAgICogQHJldHVybiB0cnVlIGlmIHRoZSBlbGVtZW50IHdhcyBhZGRlZCBvciBmYWxzIGlmIGl0IGlzIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAoY29sbGVjdGlvbnMuaXNVbmRlZmluZWQoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhLnB1c2goZWxlbWVudCk7XG4gICAgICAgIHRoaXMuc2lmdFVwKHRoaXMuZGF0YS5sZW5ndGggLSAxKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgYW5kIHJlbW92ZXMgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGlzIGhlYXAuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIHZhbHVlIHJlbW92ZWQgZnJvbSB0aGUgcm9vdCBvZiB0aGUgaGVhcC4gUmV0dXJuc1xuICAgICAqIHVuZGVmaW5lZCBpZiB0aGUgaGVhcCBpcyBlbXB0eS5cbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5yZW1vdmVSb290ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBvYmogPSB0aGlzLmRhdGFbMF07XG4gICAgICAgICAgICB0aGlzLmRhdGFbMF0gPSB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgdGhpcy5kYXRhLnNwbGljZSh0aGlzLmRhdGEubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNpZnREb3duKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgaGVhcCBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBIZWFwIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCwgZmFsc2VcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICB2YXIgZXF1RiA9IGNvbGxlY3Rpb25zLmNvbXBhcmVUb0VxdWFscyh0aGlzLmNvbXBhcmUpO1xuICAgICAgICByZXR1cm4gYXJyYXlzLmNvbnRhaW5zKHRoaXMuZGF0YSwgZWxlbWVudCwgZXF1Rik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBoZWFwLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGhlYXAuXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhpcyBoZWFwIGlzIGVtcHR5LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5kIG9ubHkgaWYgdGhpcyBoZWFwIGNvbnRhaW5zIG5vIGl0ZW1zOyBmYWxzZVxuICAgICAqIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aCA8PSAwO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgb2YgdGhlIGVsZW1lbnRzIGZyb20gdGhpcyBoZWFwLlxuICAgICAqL1xuICAgIEhlYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRhdGEubGVuZ3RoID0gMDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIGhlYXAgaW5cbiAgICAgKiBubyBwYXJ0aWN1bGFyIG9yZGVyLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xuICAgICAqIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIGFycmF5cy5mb3JFYWNoKHRoaXMuZGF0YSwgY2FsbGJhY2spO1xuICAgIH07XG4gICAgcmV0dXJuIEhlYXA7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gSGVhcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUhlYXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBEaWN0aW9uYXJ5XzEgPSByZXF1aXJlKCcuL0RpY3Rpb25hcnknKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG4vKipcbiAqIFRoaXMgY2xhc3MgaXMgdXNlZCBieSB0aGUgTGlua2VkRGljdGlvbmFyeSBJbnRlcm5hbGx5XG4gKiBIYXMgdG8gYmUgYSBjbGFzcywgbm90IGFuIGludGVyZmFjZSwgYmVjYXVzZSBpdCBuZWVkcyB0byBoYXZlXG4gKiB0aGUgJ3VubGluaycgZnVuY3Rpb24gZGVmaW5lZC5cbiAqL1xudmFyIExpbmtlZERpY3Rpb25hcnlQYWlyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBMaW5rZWREaWN0aW9uYXJ5UGFpcihrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIExpbmtlZERpY3Rpb25hcnlQYWlyLnByb3RvdHlwZS51bmxpbmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucHJldi5uZXh0ID0gdGhpcy5uZXh0O1xuICAgICAgICB0aGlzLm5leHQucHJldiA9IHRoaXMucHJldjtcbiAgICB9O1xuICAgIHJldHVybiBMaW5rZWREaWN0aW9uYXJ5UGFpcjtcbn0oKSk7XG52YXIgTGlua2VkRGljdGlvbmFyeSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKExpbmtlZERpY3Rpb25hcnksIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTGlua2VkRGljdGlvbmFyeSh0b1N0ckZ1bmN0aW9uKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIHRvU3RyRnVuY3Rpb24pO1xuICAgICAgICB0aGlzLmhlYWQgPSBuZXcgTGlua2VkRGljdGlvbmFyeVBhaXIobnVsbCwgbnVsbCk7XG4gICAgICAgIHRoaXMudGFpbCA9IG5ldyBMaW5rZWREaWN0aW9uYXJ5UGFpcihudWxsLCBudWxsKTtcbiAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLnRhaWw7XG4gICAgICAgIHRoaXMudGFpbC5wcmV2ID0gdGhpcy5oZWFkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIHRoZSBuZXcgbm9kZSB0byB0aGUgJ3RhaWwnIG9mIHRoZSBsaXN0LCB1cGRhdGluZyB0aGVcbiAgICAgKiBuZWlnaGJvcnMsIGFuZCBtb3ZpbmcgJ3RoaXMudGFpbCcgKHRoZSBFbmQgb2YgTGlzdCBpbmRpY2F0b3IpIHRoYXRcbiAgICAgKiB0byB0aGUgZW5kLlxuICAgICAqL1xuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLmFwcGVuZFRvVGFpbCA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICB2YXIgbGFzdE5vZGUgPSB0aGlzLnRhaWwucHJldjtcbiAgICAgICAgbGFzdE5vZGUubmV4dCA9IGVudHJ5O1xuICAgICAgICBlbnRyeS5wcmV2ID0gbGFzdE5vZGU7XG4gICAgICAgIGVudHJ5Lm5leHQgPSB0aGlzLnRhaWw7XG4gICAgICAgIHRoaXMudGFpbC5wcmV2ID0gZW50cnk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgYSBsaW5rZWQgZGljdGlvbmFyeSBmcm9tIHRoZSB0YWJsZSBpbnRlcm5hbGx5XG4gICAgICovXG4gICAgTGlua2VkRGljdGlvbmFyeS5wcm90b3R5cGUuZ2V0TGlua2VkRGljdGlvbmFyeVBhaXIgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGsgPSAnJCcgKyB0aGlzLnRvU3RyKGtleSk7XG4gICAgICAgIHZhciBwYWlyID0gKHRoaXMudGFibGVba10pO1xuICAgICAgICByZXR1cm4gcGFpcjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHZhbHVlIHRvIHdoaWNoIHRoaXMgZGljdGlvbmFyeSBtYXBzIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICAqIFJldHVybnMgdW5kZWZpbmVkIGlmIHRoaXMgZGljdGlvbmFyeSBjb250YWlucyBubyBtYXBwaW5nIGZvciB0aGlzIGtleS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aG9zZSBhc3NvY2lhdGVkIHZhbHVlIGlzIHRvIGJlIHJldHVybmVkLlxuICAgICAqIEByZXR1cm4geyp9IHRoZSB2YWx1ZSB0byB3aGljaCB0aGlzIGRpY3Rpb25hcnkgbWFwcyB0aGUgc3BlY2lmaWVkIGtleSBvclxuICAgICAqIHVuZGVmaW5lZCBpZiB0aGUgbWFwIGNvbnRhaW5zIG5vIG1hcHBpbmcgZm9yIHRoaXMga2V5LlxuICAgICAqL1xuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgcGFpciA9IHRoaXMuZ2V0TGlua2VkRGljdGlvbmFyeVBhaXIoa2V5KTtcbiAgICAgICAgaWYgKCF1dGlsLmlzVW5kZWZpbmVkKHBhaXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFpci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgbWFwcGluZyBmb3IgdGhpcyBrZXkgZnJvbSB0aGlzIGRpY3Rpb25hcnkgaWYgaXQgaXMgcHJlc2VudC5cbiAgICAgKiBBbHNvLCBpZiBhIHZhbHVlIGlzIHByZXNlbnQgZm9yIHRoaXMga2V5LCB0aGUgZW50cnkgaXMgcmVtb3ZlZCBmcm9tIHRoZVxuICAgICAqIGluc2VydGlvbiBvcmRlcmluZy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aG9zZSBtYXBwaW5nIGlzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgKiBkaWN0aW9uYXJ5LlxuICAgICAqIEByZXR1cm4geyp9IHByZXZpb3VzIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBzcGVjaWZpZWQga2V5LCBvciB1bmRlZmluZWQgaWZcbiAgICAgKiB0aGVyZSB3YXMgbm8gbWFwcGluZyBmb3Iga2V5LlxuICAgICAqL1xuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHBhaXIgPSB0aGlzLmdldExpbmtlZERpY3Rpb25hcnlQYWlyKGtleSk7XG4gICAgICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZChwYWlyKSkge1xuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5yZW1vdmUuY2FsbCh0aGlzLCBrZXkpOyAvLyBUaGlzIHdpbGwgcmVtb3ZlIGl0IGZyb20gdGhlIHRhYmxlXG4gICAgICAgICAgICBwYWlyLnVubGluaygpOyAvLyBUaGlzIHdpbGwgdW5saW5rIGl0IGZyb20gdGhlIGNoYWluXG4gICAgICAgICAgICByZXR1cm4gcGFpci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBSZW1vdmVzIGFsbCBtYXBwaW5ncyBmcm9tIHRoaXMgTGlua2VkRGljdGlvbmFyeS5cbiAgICAqIEB0aGlzIHtjb2xsZWN0aW9ucy5MaW5rZWREaWN0aW9uYXJ5fVxuICAgICovXG4gICAgTGlua2VkRGljdGlvbmFyeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUuY2xlYXIuY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLnRhaWw7XG4gICAgICAgIHRoaXMudGFpbC5wcmV2ID0gdGhpcy5oZWFkO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgZnVuY3Rpb24gdXNlZCB3aGVuIHVwZGF0aW5nIGFuIGV4aXN0aW5nIEtleVZhbHVlIHBhaXIuXG4gICAgICogSXQgcGxhY2VzIHRoZSBuZXcgdmFsdWUgaW5kZXhlZCBieSBrZXkgaW50byB0aGUgdGFibGUsIGJ1dCBtYWludGFpbnNcbiAgICAgKiBpdHMgcGxhY2UgaW4gdGhlIGxpbmtlZCBvcmRlcmluZy5cbiAgICAgKi9cbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS5yZXBsYWNlID0gZnVuY3Rpb24gKG9sZFBhaXIsIG5ld1BhaXIpIHtcbiAgICAgICAgdmFyIGsgPSAnJCcgKyB0aGlzLnRvU3RyKG5ld1BhaXIua2V5KTtcbiAgICAgICAgLy8gc2V0IHRoZSBuZXcgUGFpcidzIGxpbmtzIHRvIGV4aXN0aW5nUGFpcidzIGxpbmtzXG4gICAgICAgIG5ld1BhaXIubmV4dCA9IG9sZFBhaXIubmV4dDtcbiAgICAgICAgbmV3UGFpci5wcmV2ID0gb2xkUGFpci5wcmV2O1xuICAgICAgICAvLyBEZWxldGUgRXhpc3RpbmcgUGFpciBmcm9tIHRoZSB0YWJsZSwgdW5saW5rIGl0IGZyb20gY2hhaW4uXG4gICAgICAgIC8vIEFzIGEgcmVzdWx0LCB0aGUgbkVsZW1lbnRzIGdldHMgZGVjcmVtZW50ZWQgYnkgdGhpcyBvcGVyYXRpb25cbiAgICAgICAgdGhpcy5yZW1vdmUob2xkUGFpci5rZXkpO1xuICAgICAgICAvLyBMaW5rIG5ldyBQYWlyIGluIHBsYWNlIG9mIHdoZXJlIG9sZFBhaXIgd2FzLFxuICAgICAgICAvLyBieSBwb2ludGluZyB0aGUgb2xkIHBhaXIncyBuZWlnaGJvcnMgdG8gaXQuXG4gICAgICAgIG5ld1BhaXIucHJldi5uZXh0ID0gbmV3UGFpcjtcbiAgICAgICAgbmV3UGFpci5uZXh0LnByZXYgPSBuZXdQYWlyO1xuICAgICAgICB0aGlzLnRhYmxlW2tdID0gbmV3UGFpcjtcbiAgICAgICAgLy8gVG8gbWFrZSB1cCBmb3IgdGhlIGZhY3QgdGhhdCB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHdhcyBkZWNyZW1lbnRlZCxcbiAgICAgICAgLy8gV2UgbmVlZCB0byBpbmNyZWFzZSBpdCBieSBvbmUuXG4gICAgICAgICsrdGhpcy5uRWxlbWVudHM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBc3NvY2lhdGVzIHRoZSBzcGVjaWZpZWQgdmFsdWUgd2l0aCB0aGUgc3BlY2lmaWVkIGtleSBpbiB0aGlzIGRpY3Rpb25hcnkuXG4gICAgICogSWYgdGhlIGRpY3Rpb25hcnkgcHJldmlvdXNseSBjb250YWluZWQgYSBtYXBwaW5nIGZvciB0aGlzIGtleSwgdGhlIG9sZFxuICAgICAqIHZhbHVlIGlzIHJlcGxhY2VkIGJ5IHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAgICogVXBkYXRpbmcgb2YgYSBrZXkgdGhhdCBhbHJlYWR5IGV4aXN0cyBtYWludGFpbnMgaXRzIHBsYWNlIGluIHRoZVxuICAgICAqIGluc2VydGlvbiBvcmRlciBpbnRvIHRoZSBtYXAuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2l0aCB3aGljaCB0aGUgc3BlY2lmaWVkIHZhbHVlIGlzIHRvIGJlXG4gICAgICogYXNzb2NpYXRlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgdmFsdWUgdG8gYmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICAqIEByZXR1cm4geyp9IHByZXZpb3VzIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleSwgb3IgdW5kZWZpbmVkIGlmXG4gICAgICogdGhlcmUgd2FzIG5vIG1hcHBpbmcgZm9yIHRoZSBrZXkgb3IgaWYgdGhlIGtleS92YWx1ZSBhcmUgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoa2V5KSB8fCB1dGlsLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXhpc3RpbmdQYWlyID0gdGhpcy5nZXRMaW5rZWREaWN0aW9uYXJ5UGFpcihrZXkpO1xuICAgICAgICB2YXIgbmV3UGFpciA9IG5ldyBMaW5rZWREaWN0aW9uYXJ5UGFpcihrZXksIHZhbHVlKTtcbiAgICAgICAgdmFyIGsgPSAnJCcgKyB0aGlzLnRvU3RyKGtleSk7XG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYW4gZWxlbWVudCBmb3IgdGhhdCBrZXksIHdlXG4gICAgICAgIC8vIGtlZXAgaXQncyBwbGFjZSBpbiB0aGUgTGlua2VkTGlzdFxuICAgICAgICBpZiAoIXV0aWwuaXNVbmRlZmluZWQoZXhpc3RpbmdQYWlyKSkge1xuICAgICAgICAgICAgdGhpcy5yZXBsYWNlKGV4aXN0aW5nUGFpciwgbmV3UGFpcik7XG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdQYWlyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmRUb1RhaWwobmV3UGFpcik7XG4gICAgICAgICAgICB0aGlzLnRhYmxlW2tdID0gbmV3UGFpcjtcbiAgICAgICAgICAgICsrdGhpcy5uRWxlbWVudHM7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBrZXlzIGluIHRoaXMgTGlua2VkRGljdGlvbmFyeSwgb3JkZXJlZFxuICAgICAqIGJ5IGluc2VydGlvbiBvcmRlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGtleXMgaW4gdGhpcyBMaW5rZWREaWN0aW9uYXJ5LFxuICAgICAqIG9yZGVyZWQgYnkgaW5zZXJ0aW9uIG9yZGVyLlxuICAgICAqL1xuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2goa2V5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIHZhbHVlcyBpbiB0aGlzIExpbmtlZERpY3Rpb25hcnksIG9yZGVyZWQgYnlcbiAgICAgKiBpbnNlcnRpb24gb3JkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB2YWx1ZXMgaW4gdGhpcyBMaW5rZWREaWN0aW9uYXJ5LFxuICAgICAqIG9yZGVyZWQgYnkgaW5zZXJ0aW9uIG9yZGVyLlxuICAgICAqL1xuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgYXJyYXkucHVzaCh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGtleS12YWx1ZSBwYWlyXG4gICAgKiBwcmVzZW50IGluIHRoaXMgTGlua2VkRGljdGlvbmFyeS4gSXQgaXMgZG9uZSBpbiB0aGUgb3JkZXIgb2YgaW5zZXJ0aW9uXG4gICAgKiBpbnRvIHRoZSBMaW5rZWREaWN0aW9uYXJ5XG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXG4gICAgKiBpbnZva2VkIHdpdGggdHdvIGFyZ3VtZW50czoga2V5IGFuZCB2YWx1ZS4gVG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuXG4gICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAqL1xuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNyYXdsTm9kZSA9IHRoaXMuaGVhZC5uZXh0O1xuICAgICAgICB3aGlsZSAoY3Jhd2xOb2RlLm5leHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHJldCA9IGNhbGxiYWNrKGNyYXdsTm9kZS5rZXksIGNyYXdsTm9kZS52YWx1ZSk7XG4gICAgICAgICAgICBpZiAocmV0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNyYXdsTm9kZSA9IGNyYXdsTm9kZS5uZXh0O1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gTGlua2VkRGljdGlvbmFyeTtcbn0oRGljdGlvbmFyeV8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IExpbmtlZERpY3Rpb25hcnk7IC8vIEVuZCBvZiBMaW5rZWREaWN0aW9uYXJ5XG4vLyAvKipcbi8vICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIGRpY3Rpb25hcnkuXG4vLyAgKiBUd28gZGljdGlvbmFyaWVzIGFyZSBlcXVhbCBpZiB0aGV5IGNvbnRhaW4gdGhlIHNhbWUgbWFwcGluZ3MuXG4vLyAgKiBAcGFyYW0ge2NvbGxlY3Rpb25zLkRpY3Rpb25hcnl9IG90aGVyIHRoZSBvdGhlciBkaWN0aW9uYXJ5LlxuLy8gICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gdmFsdWVzRXF1YWxGdW5jdGlvbiBvcHRpb25hbFxuLy8gICogZnVuY3Rpb24gdXNlZCB0byBjaGVjayBpZiB0d28gdmFsdWVzIGFyZSBlcXVhbC5cbi8vICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGlzIGVxdWFsIHRvIHRoZSBnaXZlbiBkaWN0aW9uYXJ5LlxuLy8gICovXG4vLyBjb2xsZWN0aW9ucy5EaWN0aW9uYXJ5LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihvdGhlcix2YWx1ZXNFcXVhbEZ1bmN0aW9uKSB7XG4vLyBcdGNvbnN0IGVxRiA9IHZhbHVlc0VxdWFsRnVuY3Rpb24gfHwgY29sbGVjdGlvbnMuZGVmYXVsdEVxdWFscztcbi8vIFx0aWYoIShvdGhlciBpbnN0YW5jZW9mIGNvbGxlY3Rpb25zLkRpY3Rpb25hcnkpKXtcbi8vIFx0XHRyZXR1cm4gZmFsc2U7XG4vLyBcdH1cbi8vIFx0aWYodGhpcy5zaXplKCkgIT09IG90aGVyLnNpemUoKSl7XG4vLyBcdFx0cmV0dXJuIGZhbHNlO1xuLy8gXHR9XG4vLyBcdHJldHVybiB0aGlzLmVxdWFsc0F1eCh0aGlzLmZpcnN0Tm9kZSxvdGhlci5maXJzdE5vZGUsZXFGKTtcbi8vIH1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxpbmtlZERpY3Rpb25hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGFycmF5cyA9IHJlcXVpcmUoJy4vYXJyYXlzJyk7XG52YXIgTGlua2VkTGlzdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGVtcHR5IExpbmtlZCBMaXN0LlxuICAgICogQGNsYXNzIEEgbGlua2VkIGxpc3QgaXMgYSBkYXRhIHN0cnVjdHVyZSBjb25zaXN0aW5nIG9mIGEgZ3JvdXAgb2Ygbm9kZXNcbiAgICAqIHdoaWNoIHRvZ2V0aGVyIHJlcHJlc2VudCBhIHNlcXVlbmNlLlxuICAgICogQGNvbnN0cnVjdG9yXG4gICAgKi9cbiAgICBmdW5jdGlvbiBMaW5rZWRMaXN0KCkge1xuICAgICAgICAvKipcbiAgICAgICAgKiBGaXJzdCBub2RlIGluIHRoZSBsaXN0XG4gICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAqL1xuICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAqIExhc3Qgbm9kZSBpbiB0aGUgbGlzdFxuICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAqIE51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgbGlzdFxuICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uRWxlbWVudHMgPSAwO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEFkZHMgYW4gZWxlbWVudCB0byB0aGlzIGxpc3QuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSBlbGVtZW50IHRvIGJlIGFkZGVkLlxuICAgICogQHBhcmFtIHtudW1iZXI9fSBpbmRleCBvcHRpb25hbCBpbmRleCB0byBhZGQgdGhlIGVsZW1lbnQuIElmIG5vIGluZGV4IGlzIHNwZWNpZmllZFxuICAgICogdGhlIGVsZW1lbnQgaXMgYWRkZWQgdG8gdGhlIGVuZCBvZiB0aGlzIGxpc3QuXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBlbGVtZW50IHdhcyBhZGRlZCBvciBmYWxzZSBpZiB0aGUgaW5kZXggaXMgaW52YWxpZFxuICAgICogb3IgaWYgdGhlIGVsZW1lbnQgaXMgdW5kZWZpbmVkLlxuICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGluZGV4KSkge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLm5FbGVtZW50cztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gdGhpcy5uRWxlbWVudHMgfHwgdXRpbC5pc1VuZGVmaW5lZChpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZXdOb2RlID0gdGhpcy5jcmVhdGVOb2RlKGl0ZW0pO1xuICAgICAgICBpZiAodGhpcy5uRWxlbWVudHMgPT09IDApIHtcbiAgICAgICAgICAgIC8vIEZpcnN0IG5vZGUgaW4gdGhlIGxpc3QuXG4gICAgICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IG5ld05vZGU7XG4gICAgICAgICAgICB0aGlzLmxhc3ROb2RlID0gbmV3Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbmRleCA9PT0gdGhpcy5uRWxlbWVudHMpIHtcbiAgICAgICAgICAgIC8vIEluc2VydCBhdCB0aGUgZW5kLlxuICAgICAgICAgICAgdGhpcy5sYXN0Tm9kZS5uZXh0ID0gbmV3Tm9kZTtcbiAgICAgICAgICAgIHRoaXMubGFzdE5vZGUgPSBuZXdOb2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgZmlyc3Qgbm9kZS5cbiAgICAgICAgICAgIG5ld05vZGUubmV4dCA9IHRoaXMuZmlyc3ROb2RlO1xuICAgICAgICAgICAgdGhpcy5maXJzdE5vZGUgPSBuZXdOb2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHByZXYgPSB0aGlzLm5vZGVBdEluZGV4KGluZGV4IC0gMSk7XG4gICAgICAgICAgICBuZXdOb2RlLm5leHQgPSBwcmV2Lm5leHQ7XG4gICAgICAgICAgICBwcmV2Lm5leHQgPSBuZXdOb2RlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubkVsZW1lbnRzKys7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoaXMgbGlzdC5cbiAgICAqIEByZXR1cm4geyp9IHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBsaXN0IG9yIHVuZGVmaW5lZCBpZiB0aGUgbGlzdCBpc1xuICAgICogZW1wdHkuXG4gICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZmlyc3ROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maXJzdE5vZGUuZWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBSZXR1cm5zIHRoZSBsYXN0IGVsZW1lbnQgaW4gdGhpcyBsaXN0LlxuICAgICogQHJldHVybiB7Kn0gdGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgbGlzdCBvciB1bmRlZmluZWQgaWYgdGhlIGxpc3QgaXNcbiAgICAqIGVtcHR5LlxuICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdE5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxhc3ROb2RlLmVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBwb3NpdGlvbiBpbiB0aGlzIGxpc3QuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGRlc2lyZWQgaW5kZXguXG4gICAgICogQHJldHVybiB7Kn0gdGhlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4IG9yIHVuZGVmaW5lZCBpZiB0aGUgaW5kZXggaXNcbiAgICAgKiBvdXQgb2YgYm91bmRzLlxuICAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmVsZW1lbnRBdEluZGV4ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlQXRJbmRleChpbmRleCk7XG4gICAgICAgIGlmIChub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlLmVsZW1lbnQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBpbmRleCBpbiB0aGlzIGxpc3Qgb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgdGhlXG4gICAgICogc3BlY2lmaWVkIGVsZW1lbnQsIG9yIC0xIGlmIHRoZSBMaXN0IGRvZXMgbm90IGNvbnRhaW4gdGhpcyBlbGVtZW50LlxuICAgICAqIDxwPklmIHRoZSBlbGVtZW50cyBpbnNpZGUgdGhpcyBsaXN0IGFyZVxuICAgICAqIG5vdCBjb21wYXJhYmxlIHdpdGggdGhlID09PSBvcGVyYXRvciBhIGN1c3RvbSBlcXVhbHMgZnVuY3Rpb24gc2hvdWxkIGJlXG4gICAgICogcHJvdmlkZWQgdG8gcGVyZm9ybSBzZWFyY2hlcywgdGhlIGZ1bmN0aW9uIG11c3QgcmVjZWl2ZSB0d28gYXJndW1lbnRzIGFuZFxuICAgICAqIHJldHVybiB0cnVlIGlmIHRoZXkgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuIEV4YW1wbGU6PC9wPlxuICAgICAqXG4gICAgICogPHByZT5cbiAgICAgKiBjb25zdCBwZXRzQXJlRXF1YWxCeU5hbWUgPSBmdW5jdGlvbihwZXQxLCBwZXQyKSB7XG4gICAgICogIHJldHVybiBwZXQxLm5hbWUgPT09IHBldDIubmFtZTtcbiAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIE9wdGlvbmFsXG4gICAgICogZnVuY3Rpb24gdXNlZCB0byBjaGVjayBpZiB0d28gZWxlbWVudHMgYXJlIGVxdWFsLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGluZGV4IGluIHRoaXMgbGlzdCBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZVxuICAgICAqIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudCwgb3IgLTEgaWYgdGhpcyBsaXN0IGRvZXMgbm90IGNvbnRhaW4gdGhlXG4gICAgICogZWxlbWVudC5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gKGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBlcXVhbHNGID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IHRoaXMuZmlyc3ROb2RlO1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoY3VycmVudE5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChlcXVhbHNGKGN1cnJlbnROb2RlLmVsZW1lbnQsIGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUubmV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGxpc3QgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICAgICAgICogPHA+SWYgdGhlIGVsZW1lbnRzIGluc2lkZSB0aGUgbGlzdCBhcmVcbiAgICAgICAqIG5vdCBjb21wYXJhYmxlIHdpdGggdGhlID09PSBvcGVyYXRvciBhIGN1c3RvbSBlcXVhbHMgZnVuY3Rpb24gc2hvdWxkIGJlXG4gICAgICAgKiBwcm92aWRlZCB0byBwZXJmb3JtIHNlYXJjaGVzLCB0aGUgZnVuY3Rpb24gbXVzdCByZWNlaXZlIHR3byBhcmd1bWVudHMgYW5kXG4gICAgICAgKiByZXR1cm4gdHJ1ZSBpZiB0aGV5IGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLiBFeGFtcGxlOjwvcD5cbiAgICAgICAqXG4gICAgICAgKiA8cHJlPlxuICAgICAgICogY29uc3QgcGV0c0FyZUVxdWFsQnlOYW1lID0gZnVuY3Rpb24ocGV0MSwgcGV0Mikge1xuICAgICAgICogIHJldHVybiBwZXQxLm5hbWUgPT09IHBldDIubmFtZTtcbiAgICAgICAqIH1cbiAgICAgICAqIDwvcHJlPlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gT3B0aW9uYWxcbiAgICAgICAqIGZ1bmN0aW9uIHVzZWQgdG8gY2hlY2sgaWYgdHdvIGVsZW1lbnRzIGFyZSBlcXVhbC5cbiAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBsaXN0IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCwgZmFsc2VcbiAgICAgICAqIG90aGVyd2lzZS5cbiAgICAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5pbmRleE9mKGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSA+PSAwKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgdGhlIHNwZWNpZmllZCBlbGVtZW50IGluIHRoaXMgbGlzdC5cbiAgICAgKiA8cD5JZiB0aGUgZWxlbWVudHMgaW5zaWRlIHRoZSBsaXN0IGFyZVxuICAgICAqIG5vdCBjb21wYXJhYmxlIHdpdGggdGhlID09PSBvcGVyYXRvciBhIGN1c3RvbSBlcXVhbHMgZnVuY3Rpb24gc2hvdWxkIGJlXG4gICAgICogcHJvdmlkZWQgdG8gcGVyZm9ybSBzZWFyY2hlcywgdGhlIGZ1bmN0aW9uIG11c3QgcmVjZWl2ZSB0d28gYXJndW1lbnRzIGFuZFxuICAgICAqIHJldHVybiB0cnVlIGlmIHRoZXkgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuIEV4YW1wbGU6PC9wPlxuICAgICAqXG4gICAgICogPHByZT5cbiAgICAgKiBjb25zdCBwZXRzQXJlRXF1YWxCeU5hbWUgPSBmdW5jdGlvbihwZXQxLCBwZXQyKSB7XG4gICAgICogIHJldHVybiBwZXQxLm5hbWUgPT09IHBldDIubmFtZTtcbiAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gZWxlbWVudCB0byBiZSByZW1vdmVkIGZyb20gdGhpcyBsaXN0LCBpZiBwcmVzZW50LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGxpc3QgY29udGFpbmVkIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaXRlbSwgZXF1YWxzRnVuY3Rpb24pIHtcbiAgICAgICAgdmFyIGVxdWFsc0YgPSBlcXVhbHNGdW5jdGlvbiB8fCB1dGlsLmRlZmF1bHRFcXVhbHM7XG4gICAgICAgIGlmICh0aGlzLm5FbGVtZW50cyA8IDEgfHwgdXRpbC5pc1VuZGVmaW5lZChpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcmV2aW91cyA9IG51bGw7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IHRoaXMuZmlyc3ROb2RlO1xuICAgICAgICB3aGlsZSAoY3VycmVudE5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChlcXVhbHNGKGN1cnJlbnROb2RlLmVsZW1lbnQsIGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlID09PSB0aGlzLmZpcnN0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IHRoaXMuZmlyc3ROb2RlLm5leHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gdGhpcy5sYXN0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY3VycmVudE5vZGUgPT09IHRoaXMubGFzdE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IHByZXZpb3VzO1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91cy5uZXh0ID0gY3VycmVudE5vZGUubmV4dDtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE5vZGUubmV4dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91cy5uZXh0ID0gY3VycmVudE5vZGUubmV4dDtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE5vZGUubmV4dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubkVsZW1lbnRzLS07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmV2aW91cyA9IGN1cnJlbnROb2RlO1xuICAgICAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIG9mIHRoZSBlbGVtZW50cyBmcm9tIHRoaXMgbGlzdC5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5maXJzdE5vZGUgPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3ROb2RlID0gbnVsbDtcbiAgICAgICAgdGhpcy5uRWxlbWVudHMgPSAwO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgbGlzdCBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gbGlzdC5cbiAgICAgKiBUd28gbGlzdHMgYXJlIGVxdWFsIGlmIHRoZXkgaGF2ZSB0aGUgc2FtZSBlbGVtZW50cyBpbiB0aGUgc2FtZSBvcmRlci5cbiAgICAgKiBAcGFyYW0ge0xpbmtlZExpc3R9IG90aGVyIHRoZSBvdGhlciBsaXN0LlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsXG4gICAgICogZnVuY3Rpb24gdXNlZCB0byBjaGVjayBpZiB0d28gZWxlbWVudHMgYXJlIGVxdWFsLiBJZiB0aGUgZWxlbWVudHMgaW4gdGhlIGxpc3RzXG4gICAgICogYXJlIGN1c3RvbSBvYmplY3RzIHlvdSBzaG91bGQgcHJvdmlkZSBhIGZ1bmN0aW9uLCBvdGhlcndpc2VcbiAgICAgKiB0aGUgPT09IG9wZXJhdG9yIGlzIHVzZWQgdG8gY2hlY2sgZXF1YWxpdHkgYmV0d2VlbiBlbGVtZW50cy5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgbGlzdCBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gbGlzdC5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAob3RoZXIsIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBlcUYgPSBlcXVhbHNGdW5jdGlvbiB8fCB1dGlsLmRlZmF1bHRFcXVhbHM7XG4gICAgICAgIGlmICghKG90aGVyIGluc3RhbmNlb2YgTGlua2VkTGlzdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zaXplKCkgIT09IG90aGVyLnNpemUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVxdWFsc0F1eCh0aGlzLmZpcnN0Tm9kZSwgb3RoZXIuZmlyc3ROb2RlLCBlcUYpO1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuZXF1YWxzQXV4ID0gZnVuY3Rpb24gKG4xLCBuMiwgZXFGKSB7XG4gICAgICAgIHdoaWxlIChuMSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKCFlcUYobjEuZWxlbWVudCwgbjIuZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuMSA9IG4xLm5leHQ7XG4gICAgICAgICAgICBuMiA9IG4yLm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgcG9zaXRpb24gaW4gdGhpcyBsaXN0LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBnaXZlbiBpbmRleC5cbiAgICAgKiBAcmV0dXJuIHsqfSByZW1vdmVkIGVsZW1lbnQgb3IgdW5kZWZpbmVkIGlmIHRoZSBpbmRleCBpcyBvdXQgb2YgYm91bmRzLlxuICAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnJlbW92ZUVsZW1lbnRBdEluZGV4ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5uRWxlbWVudHMpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsZW1lbnQ7XG4gICAgICAgIGlmICh0aGlzLm5FbGVtZW50cyA9PT0gMSkge1xuICAgICAgICAgICAgLy9GaXJzdCBub2RlIGluIHRoZSBsaXN0LlxuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuZmlyc3ROb2RlLmVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmxhc3ROb2RlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwcmV2aW91cyA9IHRoaXMubm9kZUF0SW5kZXgoaW5kZXggLSAxKTtcbiAgICAgICAgICAgIGlmIChwcmV2aW91cyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmZpcnN0Tm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3ROb2RlID0gdGhpcy5maXJzdE5vZGUubmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHByZXZpb3VzLm5leHQgPT09IHRoaXMubGFzdE5vZGUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5sYXN0Tm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdE5vZGUgPSBwcmV2aW91cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcmV2aW91cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBwcmV2aW91cy5uZXh0LmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgcHJldmlvdXMubmV4dCA9IHByZXZpb3VzLm5leHQubmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5FbGVtZW50cy0tO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIGxpc3QgaW4gb3JkZXIuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXG4gICAgICogaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxuICAgICAqIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGN1cnJlbnROb2RlID0gdGhpcy5maXJzdE5vZGU7XG4gICAgICAgIHdoaWxlIChjdXJyZW50Tm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKGN1cnJlbnROb2RlLmVsZW1lbnQpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0O1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXZlcnNlcyB0aGUgb3JkZXIgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgbGlua2VkIGxpc3QgKG1ha2VzIHRoZSBsYXN0XG4gICAgICogZWxlbWVudCBmaXJzdCwgYW5kIHRoZSBmaXJzdCBlbGVtZW50IGxhc3QpLlxuICAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmV2aW91cyA9IG51bGw7XG4gICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5maXJzdE5vZGU7XG4gICAgICAgIHZhciB0ZW1wID0gbnVsbDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRlbXAgPSBjdXJyZW50Lm5leHQ7XG4gICAgICAgICAgICBjdXJyZW50Lm5leHQgPSBwcmV2aW91cztcbiAgICAgICAgICAgIHByZXZpb3VzID0gY3VycmVudDtcbiAgICAgICAgICAgIGN1cnJlbnQgPSB0ZW1wO1xuICAgICAgICB9XG4gICAgICAgIHRlbXAgPSB0aGlzLmZpcnN0Tm9kZTtcbiAgICAgICAgdGhpcy5maXJzdE5vZGUgPSB0aGlzLmxhc3ROb2RlO1xuICAgICAgICB0aGlzLmxhc3ROb2RlID0gdGVtcDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgbGlzdCBpbiBwcm9wZXJcbiAgICAgKiBzZXF1ZW5jZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheS48Kj59IGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIGxpc3QsXG4gICAgICogaW4gcHJvcGVyIHNlcXVlbmNlLlxuICAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICB2YXIgY3VycmVudE5vZGUgPSB0aGlzLmZpcnN0Tm9kZTtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKGN1cnJlbnROb2RlLmVsZW1lbnQpO1xuICAgICAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGxpc3QuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgbGlzdC5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uRWxlbWVudHM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBsaXN0IGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBsaXN0IGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxuICAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5FbGVtZW50cyA8PSAwO1xuICAgIH07XG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcnJheXMudG9TdHJpbmcodGhpcy50b0FycmF5KCkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5ub2RlQXRJbmRleCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMubkVsZW1lbnRzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggPT09ICh0aGlzLm5FbGVtZW50cyAtIDEpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sYXN0Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZmlyc3ROb2RlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluZGV4OyBpKyspIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmNyZWF0ZU5vZGUgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWxlbWVudDogaXRlbSxcbiAgICAgICAgICAgIG5leHQ6IG51bGxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBMaW5rZWRMaXN0O1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IExpbmtlZExpc3Q7IC8vIEVuZCBvZiBsaW5rZWQgbGlzdFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TGlua2VkTGlzdC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgRGljdGlvbmFyeV8xID0gcmVxdWlyZSgnLi9EaWN0aW9uYXJ5Jyk7XG52YXIgYXJyYXlzID0gcmVxdWlyZSgnLi9hcnJheXMnKTtcbnZhciBNdWx0aURpY3Rpb25hcnkgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgbXVsdGkgZGljdGlvbmFyeS5cbiAgICAgKiBAY2xhc3MgPHA+QSBtdWx0aSBkaWN0aW9uYXJ5IGlzIGEgc3BlY2lhbCBraW5kIG9mIGRpY3Rpb25hcnkgdGhhdCBob2xkc1xuICAgICAqIG11bHRpcGxlIHZhbHVlcyBhZ2FpbnN0IGVhY2gga2V5LiBTZXR0aW5nIGEgdmFsdWUgaW50byB0aGUgZGljdGlvbmFyeSB3aWxsXG4gICAgICogYWRkIHRoZSB2YWx1ZSB0byBhbiBhcnJheSBhdCB0aGF0IGtleS4gR2V0dGluZyBhIGtleSB3aWxsIHJldHVybiBhbiBhcnJheSxcbiAgICAgKiBob2xkaW5nIGFsbCB0aGUgdmFsdWVzIHNldCB0byB0aGF0IGtleS5cbiAgICAgKiBZb3UgY2FuIGNvbmZpZ3VyZSB0byBhbGxvdyBkdXBsaWNhdGVzIGluIHRoZSB2YWx1ZXMuXG4gICAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiBhY2NlcHRzIGFueSBraW5kIG9mIG9iamVjdHMgYXMga2V5cy48L3A+XG4gICAgICpcbiAgICAgKiA8cD5JZiB0aGUga2V5cyBhcmUgY3VzdG9tIG9iamVjdHMgYSBmdW5jdGlvbiB3aGljaCBjb252ZXJ0cyBrZXlzIHRvIHN0cmluZ3MgbXVzdCBiZVxuICAgICAqIHByb3ZpZGVkLiBFeGFtcGxlOjwvcD5cbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogZnVuY3Rpb24gcGV0VG9TdHJpbmcocGV0KSB7XG4gICAgICAgKiAgcmV0dXJuIHBldC5uYW1lO1xuICAgICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqIDxwPklmIHRoZSB2YWx1ZXMgYXJlIGN1c3RvbSBvYmplY3RzIGEgZnVuY3Rpb24gdG8gY2hlY2sgZXF1YWxpdHkgYmV0d2VlbiB2YWx1ZXNcbiAgICAgKiBtdXN0IGJlIHByb3ZpZGVkLiBFeGFtcGxlOjwvcD5cbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogZnVuY3Rpb24gcGV0c0FyZUVxdWFsQnlBZ2UocGV0MSxwZXQyKSB7XG4gICAgICAgKiAgcmV0dXJuIHBldDEuYWdlPT09cGV0Mi5hZ2U7XG4gICAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOnN0cmluZz19IHRvU3RyRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb25cbiAgICAgKiB0byBjb252ZXJ0IGtleXMgdG8gc3RyaW5ncy4gSWYgdGhlIGtleXMgYXJlbid0IHN0cmluZ3Mgb3IgaWYgdG9TdHJpbmcoKVxuICAgICAqIGlzIG5vdCBhcHByb3ByaWF0ZSwgYSBjdXN0b20gZnVuY3Rpb24gd2hpY2ggcmVjZWl2ZXMgYSBrZXkgYW5kIHJldHVybnMgYVxuICAgICAqIHVuaXF1ZSBzdHJpbmcgbXVzdCBiZSBwcm92aWRlZC5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSB2YWx1ZXNFcXVhbHNGdW5jdGlvbiBvcHRpb25hbFxuICAgICAqIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHR3byB2YWx1ZXMgYXJlIGVxdWFsLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFsbG93RHVwbGljYXRlVmFsdWVzXG4gICAgICovXG4gICAgZnVuY3Rpb24gTXVsdGlEaWN0aW9uYXJ5KHRvU3RyRnVuY3Rpb24sIHZhbHVlc0VxdWFsc0Z1bmN0aW9uLCBhbGxvd0R1cGxpY2F0ZVZhbHVlcykge1xuICAgICAgICBpZiAoYWxsb3dEdXBsaWNhdGVWYWx1ZXMgPT09IHZvaWQgMCkgeyBhbGxvd0R1cGxpY2F0ZVZhbHVlcyA9IGZhbHNlOyB9XG4gICAgICAgIHRoaXMuZGljdCA9IG5ldyBEaWN0aW9uYXJ5XzEuZGVmYXVsdCh0b1N0ckZ1bmN0aW9uKTtcbiAgICAgICAgdGhpcy5lcXVhbHNGID0gdmFsdWVzRXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xuICAgICAgICB0aGlzLmFsbG93RHVwbGljYXRlID0gYWxsb3dEdXBsaWNhdGVWYWx1ZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICogUmV0dXJucyBhbiBhcnJheSBob2xkaW5nIHRoZSB2YWx1ZXMgdG8gd2hpY2ggdGhpcyBkaWN0aW9uYXJ5IG1hcHNcbiAgICAqIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICogUmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgbm8gbWFwcGluZ3MgZm9yIHRoaXMga2V5LlxuICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2hvc2UgYXNzb2NpYXRlZCB2YWx1ZXMgYXJlIHRvIGJlIHJldHVybmVkLlxuICAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IGhvbGRpbmcgdGhlIHZhbHVlcyB0byB3aGljaCB0aGlzIGRpY3Rpb25hcnkgbWFwc1xuICAgICogdGhlIHNwZWNpZmllZCBrZXkuXG4gICAgKi9cbiAgICBNdWx0aURpY3Rpb25hcnkucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5kaWN0LmdldFZhbHVlKGtleSk7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKHZhbHVlcykpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXlzLmNvcHkodmFsdWVzKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIHZhbHVlIHRvIHRoZSBhcnJheSBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZCBrZXksIGlmXG4gICAgICogaXQgaXMgbm90IGFscmVhZHkgcHJlc2VudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aXRoIHdoaWNoIHRoZSBzcGVjaWZpZWQgdmFsdWUgaXMgdG8gYmVcbiAgICAgKiBhc3NvY2lhdGVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSB0aGUgdmFsdWUgdG8gYWRkIHRvIHRoZSBhcnJheSBhdCB0aGUga2V5XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgdmFsdWUgd2FzIG5vdCBhbHJlYWR5IGFzc29jaWF0ZWQgd2l0aCB0aGF0IGtleS5cbiAgICAgKi9cbiAgICBNdWx0aURpY3Rpb25hcnkucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoa2V5KSB8fCB1dGlsLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5jb250YWluc0tleShrZXkpKSB7XG4gICAgICAgICAgICB0aGlzLmRpY3Quc2V0VmFsdWUoa2V5LCBbdmFsdWVdKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcnJheSA9IHRoaXMuZGljdC5nZXRWYWx1ZShrZXkpO1xuICAgICAgICBpZiAoIXRoaXMuYWxsb3dEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgIGlmIChhcnJheXMuY29udGFpbnMoYXJyYXksIHZhbHVlLCB0aGlzLmVxdWFsc0YpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFycmF5LnB1c2godmFsdWUpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCB2YWx1ZXMgZnJvbSB0aGUgYXJyYXkgb2YgdmFsdWVzIGFzc29jaWF0ZWQgd2l0aCB0aGVcbiAgICAgKiBzcGVjaWZpZWQga2V5LiBJZiBhIHZhbHVlIGlzbid0IGdpdmVuLCBhbGwgdmFsdWVzIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkXG4gICAgICoga2V5IGFyZSByZW1vdmVkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdob3NlIG1hcHBpbmcgaXMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZVxuICAgICAqIGRpY3Rpb25hcnkuXG4gICAgICogQHBhcmFtIHtPYmplY3Q9fSB2YWx1ZSBvcHRpb25hbCBhcmd1bWVudCB0byBzcGVjaWZ5IHRoZSB2YWx1ZSB0byByZW1vdmVcbiAgICAgKiBmcm9tIHRoZSBhcnJheSBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZCBrZXkuXG4gICAgICogQHJldHVybiB7Kn0gdHJ1ZSBpZiB0aGUgZGljdGlvbmFyeSBjaGFuZ2VkLCBmYWxzZSBpZiB0aGUga2V5IGRvZXNuJ3QgZXhpc3Qgb3JcbiAgICAgKiBpZiB0aGUgc3BlY2lmaWVkIHZhbHVlIGlzbid0IGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKi9cbiAgICBNdWx0aURpY3Rpb25hcnkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgdmFyIHYgPSB0aGlzLmRpY3QucmVtb3ZlKGtleSk7XG4gICAgICAgICAgICByZXR1cm4gIXV0aWwuaXNVbmRlZmluZWQodik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFycmF5ID0gdGhpcy5kaWN0LmdldFZhbHVlKGtleSk7XG4gICAgICAgIGlmIChhcnJheXMucmVtb3ZlKGFycmF5LCB2YWx1ZSwgdGhpcy5lcXVhbHNGKSkge1xuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGljdC5yZW1vdmUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGtleXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUga2V5cyBpbiB0aGlzIGRpY3Rpb25hcnkuXG4gICAgICovXG4gICAgTXVsdGlEaWN0aW9uYXJ5LnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0LmtleXMoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIHZhbHVlcyBpbiB0aGlzIGRpY3Rpb25hcnkuXG4gICAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB2YWx1ZXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqL1xuICAgIE11bHRpRGljdGlvbmFyeS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmFsdWVzID0gdGhpcy5kaWN0LnZhbHVlcygpO1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCB2YWx1ZXNfMSA9IHZhbHVlczsgX2kgPCB2YWx1ZXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciB2ID0gdmFsdWVzXzFbX2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCB2XzEgPSB2OyBfYSA8IHZfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdyA9IHZfMVtfYV07XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaCh3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGF0IGxlYXN0IG9uZSB2YWx1ZSBhc3NvY2lhdHRlZCB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aG9zZSBwcmVzZW5jZSBpbiB0aGlzIGRpY3Rpb25hcnkgaXMgdG8gYmVcbiAgICAgKiB0ZXN0ZWQuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgYXQgbGVhc3Qgb25lIHZhbHVlIGFzc29jaWF0dGVkXG4gICAgICogdGhlIHNwZWNpZmllZCBrZXkuXG4gICAgICovXG4gICAgTXVsdGlEaWN0aW9uYXJ5LnByb3RvdHlwZS5jb250YWluc0tleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdC5jb250YWluc0tleShrZXkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgbWFwcGluZ3MgZnJvbSB0aGlzIGRpY3Rpb25hcnkuXG4gICAgICovXG4gICAgTXVsdGlEaWN0aW9uYXJ5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kaWN0LmNsZWFyKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Yga2V5cyBpbiB0aGlzIGRpY3Rpb25hcnkuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGtleS12YWx1ZSBtYXBwaW5ncyBpbiB0aGlzIGRpY3Rpb25hcnkuXG4gICAgICovXG4gICAgTXVsdGlEaWN0aW9uYXJ5LnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0LnNpemUoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgbm8gbWFwcGluZ3MuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgbm8gbWFwcGluZ3MuXG4gICAgICovXG4gICAgTXVsdGlEaWN0aW9uYXJ5LnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0LmlzRW1wdHkoKTtcbiAgICB9O1xuICAgIHJldHVybiBNdWx0aURpY3Rpb25hcnk7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gTXVsdGlEaWN0aW9uYXJ5OyAvLyBlbmQgb2YgbXVsdGkgZGljdGlvbmFyeVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TXVsdGlEaWN0aW9uYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBIZWFwXzEgPSByZXF1aXJlKCcuL0hlYXAnKTtcbnZhciBQcmlvcml0eVF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVtcHR5IHByaW9yaXR5IHF1ZXVlLlxuICAgICAqIEBjbGFzcyA8cD5JbiBhIHByaW9yaXR5IHF1ZXVlIGVhY2ggZWxlbWVudCBpcyBhc3NvY2lhdGVkIHdpdGggYSBcInByaW9yaXR5XCIsXG4gICAgICogZWxlbWVudHMgYXJlIGRlcXVldWVkIGluIGhpZ2hlc3QtcHJpb3JpdHktZmlyc3Qgb3JkZXIgKHRoZSBlbGVtZW50cyB3aXRoIHRoZVxuICAgICAqIGhpZ2hlc3QgcHJpb3JpdHkgYXJlIGRlcXVldWVkIGZpcnN0KS4gUHJpb3JpdHkgUXVldWVzIGFyZSBpbXBsZW1lbnRlZCBhcyBoZWFwcy5cbiAgICAgKiBJZiB0aGUgaW5zZXJ0ZWQgZWxlbWVudHMgYXJlIGN1c3RvbSBvYmplY3RzIGEgY29tcGFyZSBmdW5jdGlvbiBtdXN0IGJlIHByb3ZpZGVkLFxuICAgICAqIG90aGVyd2lzZSB0aGUgPD0sID09PSBhbmQgPj0gb3BlcmF0b3JzIGFyZSB1c2VkIHRvIGNvbXBhcmUgb2JqZWN0IHByaW9yaXR5LjwvcD5cbiAgICAgKiA8cHJlPlxuICAgICAqIGZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICAgICAqICBpZiAoYSBpcyBsZXNzIHRoYW4gYiBieSBzb21lIG9yZGVyaW5nIGNyaXRlcmlvbikge1xuICAgICAqICAgICByZXR1cm4gLTE7XG4gICAgICogIH0gaWYgKGEgaXMgZ3JlYXRlciB0aGFuIGIgYnkgdGhlIG9yZGVyaW5nIGNyaXRlcmlvbikge1xuICAgICAqICAgICByZXR1cm4gMTtcbiAgICAgKiAgfVxuICAgICAqICAvLyBhIG11c3QgYmUgZXF1YWwgdG8gYlxuICAgICAqICByZXR1cm4gMDtcbiAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpudW1iZXI9fSBjb21wYXJlRnVuY3Rpb24gb3B0aW9uYWxcbiAgICAgKiBmdW5jdGlvbiB1c2VkIHRvIGNvbXBhcmUgdHdvIGVsZW1lbnQgcHJpb3JpdGllcy4gTXVzdCByZXR1cm4gYSBuZWdhdGl2ZSBpbnRlZ2VyLFxuICAgICAqIHplcm8sIG9yIGEgcG9zaXRpdmUgaW50ZWdlciBhcyB0aGUgZmlyc3QgYXJndW1lbnQgaXMgbGVzcyB0aGFuLCBlcXVhbCB0byxcbiAgICAgKiBvciBncmVhdGVyIHRoYW4gdGhlIHNlY29uZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBQcmlvcml0eVF1ZXVlKGNvbXBhcmVGdW5jdGlvbikge1xuICAgICAgICB0aGlzLmhlYXAgPSBuZXcgSGVhcF8xLmRlZmF1bHQodXRpbC5yZXZlcnNlQ29tcGFyZUZ1bmN0aW9uKGNvbXBhcmVGdW5jdGlvbikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBpbnRvIHRoaXMgcHJpb3JpdHkgcXVldWUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIGluc2VydGVkLCBvciBmYWxzZSBpZiBpdCBpcyB1bmRlZmluZWQuXG4gICAgICovXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlYXAuYWRkKGVsZW1lbnQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgaW50byB0aGlzIHByaW9yaXR5IHF1ZXVlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IHRoZSBlbGVtZW50IHRvIGluc2VydC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBlbGVtZW50IHdhcyBpbnNlcnRlZCwgb3IgZmFsc2UgaWYgaXQgaXMgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlYXAuYWRkKGVsZW1lbnQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGFuZCByZW1vdmVzIHRoZSBoaWdoZXN0IHByaW9yaXR5IGVsZW1lbnQgb2YgdGhpcyBxdWV1ZS5cbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgZWxlbWVudCBvZiB0aGlzIHF1ZXVlLFxuICAgICAqICBvciB1bmRlZmluZWQgaWYgdGhpcyBxdWV1ZSBpcyBlbXB0eS5cbiAgICAgKi9cbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5kZXF1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oZWFwLnNpemUoKSAhPT0gMCkge1xuICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5oZWFwLnBlZWsoKTtcbiAgICAgICAgICAgIHRoaXMuaGVhcC5yZW1vdmVSb290KCk7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcywgYnV0IGRvZXMgbm90IHJlbW92ZSwgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgZWxlbWVudCBvZiB0aGlzIHF1ZXVlLlxuICAgICAqIEByZXR1cm4geyp9IHRoZSBoaWdoZXN0IHByaW9yaXR5IGVsZW1lbnQgb2YgdGhpcyBxdWV1ZSwgb3IgdW5kZWZpbmVkIGlmIHRoaXMgcXVldWUgaXMgZW1wdHkuXG4gICAgICovXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhcC5wZWVrKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBwcmlvcml0eSBxdWV1ZSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBwcmlvcml0eSBxdWV1ZSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQsXG4gICAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhcC5jb250YWlucyhlbGVtZW50KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGlzIHByaW9yaXR5IHF1ZXVlIGlzIGVtcHR5LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5kIG9ubHkgaWYgdGhpcyBwcmlvcml0eSBxdWV1ZSBjb250YWlucyBubyBpdGVtczsgZmFsc2VcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICovXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhcC5pc0VtcHR5KCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBwcmlvcml0eSBxdWV1ZS5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBwcmlvcml0eSBxdWV1ZS5cbiAgICAgKi9cbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZWFwLnNpemUoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIG9mIHRoZSBlbGVtZW50cyBmcm9tIHRoaXMgcHJpb3JpdHkgcXVldWUuXG4gICAgICovXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGVhcC5jbGVhcigpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudCBwcmVzZW50IGluIHRoaXMgcXVldWUgaW5cbiAgICAgKiBubyBwYXJ0aWN1bGFyIG9yZGVyLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xuICAgICAqIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaGVhcC5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIHJldHVybiBQcmlvcml0eVF1ZXVlO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFByaW9yaXR5UXVldWU7IC8vIGVuZCBvZiBwcmlvcml0eSBxdWV1ZVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UHJpb3JpdHlRdWV1ZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBMaW5rZWRMaXN0XzEgPSByZXF1aXJlKCcuL0xpbmtlZExpc3QnKTtcbnZhciBRdWV1ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBxdWV1ZS5cbiAgICAgKiBAY2xhc3MgQSBxdWV1ZSBpcyBhIEZpcnN0LUluLUZpcnN0LU91dCAoRklGTykgZGF0YSBzdHJ1Y3R1cmUsIHRoZSBmaXJzdFxuICAgICAqIGVsZW1lbnQgYWRkZWQgdG8gdGhlIHF1ZXVlIHdpbGwgYmUgdGhlIGZpcnN0IG9uZSB0byBiZSByZW1vdmVkLiBUaGlzXG4gICAgICogaW1wbGVtZW50YXRpb24gdXNlcyBhIGxpbmtlZCBsaXN0IGFzIGEgY29udGFpbmVyLlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFF1ZXVlKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBuZXcgTGlua2VkTGlzdF8xLmRlZmF1bHQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgaW50byB0aGUgZW5kIG9mIHRoaXMgcXVldWUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gdGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIGluc2VydGVkLCBvciBmYWxzZSBpZiBpdCBpcyB1bmRlZmluZWQuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0LmFkZChlbGVtKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEluc2VydHMgdGhlIHNwZWNpZmllZCBlbGVtZW50IGludG8gdGhlIGVuZCBvZiB0aGlzIHF1ZXVlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIHRoZSBlbGVtZW50IHRvIGluc2VydC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBlbGVtZW50IHdhcyBpbnNlcnRlZCwgb3IgZmFsc2UgaWYgaXQgaXMgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0LmFkZChlbGVtKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBhbmQgcmVtb3ZlcyB0aGUgaGVhZCBvZiB0aGlzIHF1ZXVlLlxuICAgICAqIEByZXR1cm4geyp9IHRoZSBoZWFkIG9mIHRoaXMgcXVldWUsIG9yIHVuZGVmaW5lZCBpZiB0aGlzIHF1ZXVlIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5kZXF1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5saXN0LnNpemUoKSAhPT0gMCkge1xuICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5saXN0LmZpcnN0KCk7XG4gICAgICAgICAgICB0aGlzLmxpc3QucmVtb3ZlRWxlbWVudEF0SW5kZXgoMCk7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcywgYnV0IGRvZXMgbm90IHJlbW92ZSwgdGhlIGhlYWQgb2YgdGhpcyBxdWV1ZS5cbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgaGVhZCBvZiB0aGlzIHF1ZXVlLCBvciB1bmRlZmluZWQgaWYgdGhpcyBxdWV1ZSBpcyBlbXB0eS5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdC5zaXplKCkgIT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3QuZmlyc3QoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgcXVldWUuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgcXVldWUuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3Quc2l6ZSgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgcXVldWUgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICAgICAqIDxwPklmIHRoZSBlbGVtZW50cyBpbnNpZGUgdGhpcyBzdGFjayBhcmVcbiAgICAgKiBub3QgY29tcGFyYWJsZSB3aXRoIHRoZSA9PT0gb3BlcmF0b3IsIGEgY3VzdG9tIGVxdWFscyBmdW5jdGlvbiBzaG91bGQgYmVcbiAgICAgKiBwcm92aWRlZCB0byBwZXJmb3JtIHNlYXJjaGVzLCB0aGUgZnVuY3Rpb24gbXVzdCByZWNlaXZlIHR3byBhcmd1bWVudHMgYW5kXG4gICAgICogcmV0dXJuIHRydWUgaWYgdGhleSBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS4gRXhhbXBsZTo8L3A+XG4gICAgICpcbiAgICAgKiA8cHJlPlxuICAgICAqIGNvbnN0IHBldHNBcmVFcXVhbEJ5TmFtZSAocGV0MSwgcGV0Mikge1xuICAgICAqICByZXR1cm4gcGV0MS5uYW1lID09PSBwZXQyLm5hbWU7XG4gICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIGVsZW1lbnQgdG8gc2VhcmNoIGZvci5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSBlcXVhbHNGdW5jdGlvbiBvcHRpb25hbFxuICAgICAqIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHR3byBlbGVtZW50cyBhcmUgZXF1YWwuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHF1ZXVlIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCxcbiAgICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QuY29udGFpbnMoZWxlbSwgZXF1YWxzRnVuY3Rpb24pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoaXMgcXVldWUgaXMgZW1wdHkuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBhbmQgb25seSBpZiB0aGlzIHF1ZXVlIGNvbnRhaW5zIG5vIGl0ZW1zOyBmYWxzZVxuICAgICAqIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5zaXplKCkgPD0gMDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIG9mIHRoZSBlbGVtZW50cyBmcm9tIHRoaXMgcXVldWUuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxpc3QuY2xlYXIoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIHF1ZXVlIGluXG4gICAgICogRklGTyBvcmRlci5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiB0aGUgZWxlbWVudCB2YWx1ZSwgdG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goY2FsbGJhY2spO1xuICAgIH07XG4gICAgcmV0dXJuIFF1ZXVlO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFF1ZXVlOyAvLyBFbmQgb2YgcXVldWVcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVF1ZXVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBhcnJheXMgPSByZXF1aXJlKCcuL2FycmF5cycpO1xudmFyIERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoJy4vRGljdGlvbmFyeScpO1xudmFyIFNldCA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBzZXQuXG4gICAgICogQGNsYXNzIDxwPkEgc2V0IGlzIGEgZGF0YSBzdHJ1Y3R1cmUgdGhhdCBjb250YWlucyBubyBkdXBsaWNhdGUgaXRlbXMuPC9wPlxuICAgICAqIDxwPklmIHRoZSBpbnNlcnRlZCBlbGVtZW50cyBhcmUgY3VzdG9tIG9iamVjdHMgYSBmdW5jdGlvblxuICAgICAqIHdoaWNoIGNvbnZlcnRzIGVsZW1lbnRzIHRvIHN0cmluZ3MgbXVzdCBiZSBwcm92aWRlZC4gRXhhbXBsZTo8L3A+XG4gICAgICpcbiAgICAgKiA8cHJlPlxuICAgICAqIGZ1bmN0aW9uIHBldFRvU3RyaW5nKHBldCkge1xuICAgICAqICByZXR1cm4gcGV0Lm5hbWU7XG4gICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOnN0cmluZz19IHRvU3RyaW5nRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdXNlZFxuICAgICAqIHRvIGNvbnZlcnQgZWxlbWVudHMgdG8gc3RyaW5ncy4gSWYgdGhlIGVsZW1lbnRzIGFyZW4ndCBzdHJpbmdzIG9yIGlmIHRvU3RyaW5nKClcbiAgICAgKiBpcyBub3QgYXBwcm9wcmlhdGUsIGEgY3VzdG9tIGZ1bmN0aW9uIHdoaWNoIHJlY2VpdmVzIGEgb25qZWN0IGFuZCByZXR1cm5zIGFcbiAgICAgKiB1bmlxdWUgc3RyaW5nIG11c3QgYmUgcHJvdmlkZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gU2V0KHRvU3RyaW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5ID0gbmV3IERpY3Rpb25hcnlfMS5kZWZhdWx0KHRvU3RyaW5nRnVuY3Rpb24pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBzZXQgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IGVsZW1lbnQgdG8gc2VhcmNoIGZvci5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgc2V0IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCxcbiAgICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgU2V0LnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkuY29udGFpbnNLZXkoZWxlbWVudCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSBzcGVjaWZpZWQgZWxlbWVudCB0byB0aGlzIHNldCBpZiBpdCBpcyBub3QgYWxyZWFkeSBwcmVzZW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IHRoZSBlbGVtZW50IHRvIGluc2VydC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgc2V0IGRpZCBub3QgYWxyZWFkeSBjb250YWluIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGVsZW1lbnQpIHx8IHV0aWwuaXNVbmRlZmluZWQoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeS5zZXRWYWx1ZShlbGVtZW50LCBlbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBhbiBpbnRlcnNlY2lvbiBiZXR3ZWVuIHRoaXMgYW4gYW5vdGhlciBzZXQuXG4gICAgICogUmVtb3ZlcyBhbGwgdmFsdWVzIHRoYXQgYXJlIG5vdCBwcmVzZW50IHRoaXMgc2V0IGFuZCB0aGUgZ2l2ZW4gc2V0LlxuICAgICAqIEBwYXJhbSB7Y29sbGVjdGlvbnMuU2V0fSBvdGhlclNldCBvdGhlciBzZXQuXG4gICAgICovXG4gICAgU2V0LnByb3RvdHlwZS5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiAob3RoZXJTZXQpIHtcbiAgICAgICAgdmFyIHNldCA9IHRoaXM7XG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKCFvdGhlclNldC5jb250YWlucyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHNldC5yZW1vdmUoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyBhIHVuaW9uIGJldHdlZW4gdGhpcyBhbiBhbm90aGVyIHNldC5cbiAgICAgKiBBZGRzIGFsbCB2YWx1ZXMgZnJvbSB0aGUgZ2l2ZW4gc2V0IHRvIHRoaXMgc2V0LlxuICAgICAqIEBwYXJhbSB7Y29sbGVjdGlvbnMuU2V0fSBvdGhlclNldCBvdGhlciBzZXQuXG4gICAgICovXG4gICAgU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uIChvdGhlclNldCkge1xuICAgICAgICB2YXIgc2V0ID0gdGhpcztcbiAgICAgICAgb3RoZXJTZXQuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgc2V0LmFkZChlbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGEgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoaXMgYW4gYW5vdGhlciBzZXQuXG4gICAgICogUmVtb3ZlcyBmcm9tIHRoaXMgc2V0IGFsbCB0aGUgdmFsdWVzIHRoYXQgYXJlIHByZXNlbnQgaW4gdGhlIGdpdmVuIHNldC5cbiAgICAgKiBAcGFyYW0ge2NvbGxlY3Rpb25zLlNldH0gb3RoZXJTZXQgb3RoZXIgc2V0LlxuICAgICAqL1xuICAgIFNldC5wcm90b3R5cGUuZGlmZmVyZW5jZSA9IGZ1bmN0aW9uIChvdGhlclNldCkge1xuICAgICAgICB2YXIgc2V0ID0gdGhpcztcbiAgICAgICAgb3RoZXJTZXQuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgc2V0LnJlbW92ZShlbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBzZXQgY29udGFpbnMgYWxsIHRoZSBlbGVtZW50cyBpbiB0aGlzIHNldC5cbiAgICAgKiBAcGFyYW0ge2NvbGxlY3Rpb25zLlNldH0gb3RoZXJTZXQgb3RoZXIgc2V0LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBzZXQgaXMgYSBzdWJzZXQgb2YgdGhlIGdpdmVuIHNldC5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLmlzU3Vic2V0T2YgPSBmdW5jdGlvbiAob3RoZXJTZXQpIHtcbiAgICAgICAgaWYgKHRoaXMuc2l6ZSgpID4gb3RoZXJTZXQuc2l6ZSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlzU3ViID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoIW90aGVyU2V0LmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgaXNTdWIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpc1N1YjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCBlbGVtZW50IGZyb20gdGhpcyBzZXQgaWYgaXQgaXMgcHJlc2VudC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgc2V0IGNvbnRhaW5lZCB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICovXG4gICAgU2V0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeS5yZW1vdmUoZWxlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudFxuICAgICAqIHByZXNlbnQgaW4gdGhpcyBzZXQuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXG4gICAgICogaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudHM6IHRoZSBlbGVtZW50LiBUbyBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5LmZvckVhY2goZnVuY3Rpb24gKGssIHYpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayh2KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIHNldCBpbiBhcmJpdHJhcnkgb3JkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIHNldC5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkudmFsdWVzKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBzZXQgY29udGFpbnMgbm8gZWxlbWVudHMuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHNldCBjb250YWlucyBubyBlbGVtZW50cy5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkuaXNFbXB0eSgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgc2V0LlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIHNldC5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkuc2l6ZSgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgb2YgdGhlIGVsZW1lbnRzIGZyb20gdGhpcyBzZXQuXG4gICAgICovXG4gICAgU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5LmNsZWFyKCk7XG4gICAgfTtcbiAgICAvKlxuICAgICogUHJvdmlkZXMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gZm9yIGRpc3BsYXlcbiAgICAqL1xuICAgIFNldC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcnJheXMudG9TdHJpbmcodGhpcy50b0FycmF5KCkpO1xuICAgIH07XG4gICAgcmV0dXJuIFNldDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTZXQ7IC8vIGVuZCBvZiBTZXRcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVNldC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBMaW5rZWRMaXN0XzEgPSByZXF1aXJlKCcuL0xpbmtlZExpc3QnKTtcbnZhciBTdGFjayA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBTdGFjay5cbiAgICAgKiBAY2xhc3MgQSBTdGFjayBpcyBhIExhc3QtSW4tRmlyc3QtT3V0IChMSUZPKSBkYXRhIHN0cnVjdHVyZSwgdGhlIGxhc3RcbiAgICAgKiBlbGVtZW50IGFkZGVkIHRvIHRoZSBzdGFjayB3aWxsIGJlIHRoZSBmaXJzdCBvbmUgdG8gYmUgcmVtb3ZlZC4gVGhpc1xuICAgICAqIGltcGxlbWVudGF0aW9uIHVzZXMgYSBsaW5rZWQgbGlzdCBhcyBhIGNvbnRhaW5lci5cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTdGFjaygpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbmV3IExpbmtlZExpc3RfMS5kZWZhdWx0KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFB1c2hlcyBhbiBpdGVtIG9udG8gdGhlIHRvcCBvZiB0aGlzIHN0YWNrLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIHRoZSBlbGVtZW50IHRvIGJlIHB1c2hlZCBvbnRvIHRoaXMgc3RhY2suXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgcHVzaGVkIG9yIGZhbHNlIGlmIGl0IGlzIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBTdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QuYWRkKGVsZW0sIDApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUHVzaGVzIGFuIGl0ZW0gb250byB0aGUgdG9wIG9mIHRoaXMgc3RhY2suXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gdGhlIGVsZW1lbnQgdG8gYmUgcHVzaGVkIG9udG8gdGhpcyBzdGFjay5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBlbGVtZW50IHdhcyBwdXNoZWQgb3IgZmFsc2UgaWYgaXQgaXMgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIFN0YWNrLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0LmFkZChlbGVtLCAwKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIG9iamVjdCBhdCB0aGUgdG9wIG9mIHRoaXMgc3RhY2sgYW5kIHJldHVybnMgdGhhdCBvYmplY3QuXG4gICAgICogQHJldHVybiB7Kn0gdGhlIG9iamVjdCBhdCB0aGUgdG9wIG9mIHRoaXMgc3RhY2sgb3IgdW5kZWZpbmVkIGlmIHRoZVxuICAgICAqIHN0YWNrIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIFN0YWNrLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QucmVtb3ZlRWxlbWVudEF0SW5kZXgoMCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBMb29rcyBhdCB0aGUgb2JqZWN0IGF0IHRoZSB0b3Agb2YgdGhpcyBzdGFjayB3aXRob3V0IHJlbW92aW5nIGl0IGZyb20gdGhlXG4gICAgICogc3RhY2suXG4gICAgICogQHJldHVybiB7Kn0gdGhlIG9iamVjdCBhdCB0aGUgdG9wIG9mIHRoaXMgc3RhY2sgb3IgdW5kZWZpbmVkIGlmIHRoZVxuICAgICAqIHN0YWNrIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIFN0YWNrLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0LmZpcnN0KCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBzdGFjay5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBzdGFjay5cbiAgICAgKi9cbiAgICBTdGFjay5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5zaXplKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBzdGFjayBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICogPHA+SWYgdGhlIGVsZW1lbnRzIGluc2lkZSB0aGlzIHN0YWNrIGFyZVxuICAgICAqIG5vdCBjb21wYXJhYmxlIHdpdGggdGhlID09PSBvcGVyYXRvciwgYSBjdXN0b20gZXF1YWxzIGZ1bmN0aW9uIHNob3VsZCBiZVxuICAgICAqIHByb3ZpZGVkIHRvIHBlcmZvcm0gc2VhcmNoZXMsIHRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgdHdvIGFyZ3VtZW50cyBhbmRcbiAgICAgKiByZXR1cm4gdHJ1ZSBpZiB0aGV5IGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLiBFeGFtcGxlOjwvcD5cbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogY29uc3QgcGV0c0FyZUVxdWFsQnlOYW1lIChwZXQxLCBwZXQyKSB7XG4gICAgICogIHJldHVybiBwZXQxLm5hbWUgPT09IHBldDIubmFtZTtcbiAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsXG4gICAgICogZnVuY3Rpb24gdG8gY2hlY2sgaWYgdHdvIGVsZW1lbnRzIGFyZSBlcXVhbC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgc3RhY2sgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LFxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBTdGFjay5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoZWxlbSwgZXF1YWxzRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5jb250YWlucyhlbGVtLCBlcXVhbHNGdW5jdGlvbik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhpcyBzdGFjayBpcyBlbXB0eS5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIGFuZCBvbmx5IGlmIHRoaXMgc3RhY2sgY29udGFpbnMgbm8gaXRlbXM7IGZhbHNlXG4gICAgICogb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIFN0YWNrLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0LmlzRW1wdHkoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIG9mIHRoZSBlbGVtZW50cyBmcm9tIHRoaXMgc3RhY2suXG4gICAgICovXG4gICAgU3RhY2sucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxpc3QuY2xlYXIoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIHN0YWNrIGluXG4gICAgICogTElGTyBvcmRlci5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiB0aGUgZWxlbWVudCB2YWx1ZSwgdG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgU3RhY2sucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goY2FsbGJhY2spO1xuICAgIH07XG4gICAgcmV0dXJuIFN0YWNrO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFN0YWNrOyAvLyBFbmQgb2Ygc3RhY2tcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN0YWNrLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbi8qKlxuICogUmV0dXJucyB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgdGhlIHNwZWNpZmllZCBpdGVtXG4gKiB3aXRoaW4gdGhlIHNwZWNpZmllZCBhcnJheS40XG4gKiBAcGFyYW0geyp9IGFycmF5IHRoZSBhcnJheSBpbiB3aGljaCB0byBzZWFyY2ggdGhlIGVsZW1lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSB0aGUgZWxlbWVudCB0byBzZWFyY2guXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSBlcXVhbHNGdW5jdGlvbiBvcHRpb25hbCBmdW5jdGlvbiB1c2VkIHRvXG4gKiBjaGVjayBlcXVhbGl0eSBiZXR3ZWVuIDIgZWxlbWVudHMuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnRcbiAqIHdpdGhpbiB0aGUgc3BlY2lmaWVkIGFycmF5LCBvciAtMSBpZiBub3QgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIGluZGV4T2YoYXJyYXksIGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgdmFyIGVxdWFscyA9IGVxdWFsc0Z1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdEVxdWFscztcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGVxdWFscyhhcnJheVtpXSwgaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cbmV4cG9ydHMuaW5kZXhPZiA9IGluZGV4T2Y7XG4vKipcbiAqIFJldHVybnMgdGhlIHBvc2l0aW9uIG9mIHRoZSBsYXN0IG9jY3VycmVuY2Ugb2YgdGhlIHNwZWNpZmllZCBlbGVtZW50XG4gKiB3aXRoaW4gdGhlIHNwZWNpZmllZCBhcnJheS5cbiAqIEBwYXJhbSB7Kn0gYXJyYXkgdGhlIGFycmF5IGluIHdoaWNoIHRvIHNlYXJjaCB0aGUgZWxlbWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIHRoZSBlbGVtZW50IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWQgdG9cbiAqIGNoZWNrIGVxdWFsaXR5IGJldHdlZW4gMiBlbGVtZW50cy5cbiAqIEByZXR1cm4ge251bWJlcn0gdGhlIHBvc2l0aW9uIG9mIHRoZSBsYXN0IG9jY3VycmVuY2Ugb2YgdGhlIHNwZWNpZmllZCBlbGVtZW50XG4gKiB3aXRoaW4gdGhlIHNwZWNpZmllZCBhcnJheSBvciAtMSBpZiBub3QgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIGxhc3RJbmRleE9mKGFycmF5LCBpdGVtLCBlcXVhbHNGdW5jdGlvbikge1xuICAgIHZhciBlcXVhbHMgPSBlcXVhbHNGdW5jdGlvbiB8fCB1dGlsLmRlZmF1bHRFcXVhbHM7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gbGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKGVxdWFscyhhcnJheVtpXSwgaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cbmV4cG9ydHMubGFzdEluZGV4T2YgPSBsYXN0SW5kZXhPZjtcbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgYXJyYXkgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICogQHBhcmFtIHsqfSBhcnJheSB0aGUgYXJyYXkgaW4gd2hpY2ggdG8gc2VhcmNoIHRoZSBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gdGhlIGVsZW1lbnQgdG8gc2VhcmNoLlxuICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdG9cbiAqIGNoZWNrIGVxdWFsaXR5IGJldHdlZW4gMiBlbGVtZW50cy5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIHNwZWNpZmllZCBhcnJheSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGNvbnRhaW5zKGFycmF5LCBpdGVtLCBlcXVhbHNGdW5jdGlvbikge1xuICAgIHJldHVybiBpbmRleE9mKGFycmF5LCBpdGVtLCBlcXVhbHNGdW5jdGlvbikgPj0gMDtcbn1cbmV4cG9ydHMuY29udGFpbnMgPSBjb250YWlucztcbi8qKlxuICogUmVtb3ZlcyB0aGUgZmlyc3Qgb2N1cnJlbmNlIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBmcm9tIHRoZSBzcGVjaWZpZWQgYXJyYXkuXG4gKiBAcGFyYW0geyp9IGFycmF5IHRoZSBhcnJheSBpbiB3aGljaCB0byBzZWFyY2ggZWxlbWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIHRoZSBlbGVtZW50IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHRvXG4gKiBjaGVjayBlcXVhbGl0eSBiZXR3ZWVuIDIgZWxlbWVudHMuXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBhcnJheSBjaGFuZ2VkIGFmdGVyIHRoaXMgY2FsbC5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlKGFycmF5LCBpdGVtLCBlcXVhbHNGdW5jdGlvbikge1xuICAgIHZhciBpbmRleCA9IGluZGV4T2YoYXJyYXksIGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMucmVtb3ZlID0gcmVtb3ZlO1xuLyoqXG4gKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHNwZWNpZmllZCBhcnJheSBlcXVhbFxuICogdG8gdGhlIHNwZWNpZmllZCBvYmplY3QuXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSB0aGUgYXJyYXkgaW4gd2hpY2ggdG8gZGV0ZXJtaW5lIHRoZSBmcmVxdWVuY3kgb2YgdGhlIGVsZW1lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSB0aGUgZWxlbWVudCB3aG9zZSBmcmVxdWVuY3kgaXMgdG8gYmUgZGV0ZXJtaW5lZC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWQgdG9cbiAqIGNoZWNrIGVxdWFsaXR5IGJldHdlZW4gMiBlbGVtZW50cy5cbiAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIGFycmF5XG4gKiBlcXVhbCB0byB0aGUgc3BlY2lmaWVkIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZnJlcXVlbmN5KGFycmF5LCBpdGVtLCBlcXVhbHNGdW5jdGlvbikge1xuICAgIHZhciBlcXVhbHMgPSBlcXVhbHNGdW5jdGlvbiB8fCB1dGlsLmRlZmF1bHRFcXVhbHM7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICB2YXIgZnJlcSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZXF1YWxzKGFycmF5W2ldLCBpdGVtKSkge1xuICAgICAgICAgICAgZnJlcSsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmcmVxO1xufVxuZXhwb3J0cy5mcmVxdWVuY3kgPSBmcmVxdWVuY3k7XG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdHdvIHNwZWNpZmllZCBhcnJheXMgYXJlIGVxdWFsIHRvIG9uZSBhbm90aGVyLlxuICogVHdvIGFycmF5cyBhcmUgY29uc2lkZXJlZCBlcXVhbCBpZiBib3RoIGFycmF5cyBjb250YWluIHRoZSBzYW1lIG51bWJlclxuICogb2YgZWxlbWVudHMsIGFuZCBhbGwgY29ycmVzcG9uZGluZyBwYWlycyBvZiBlbGVtZW50cyBpbiB0aGUgdHdvXG4gKiBhcnJheXMgYXJlIGVxdWFsIGFuZCBhcmUgaW4gdGhlIHNhbWUgb3JkZXIuXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheTEgb25lIGFycmF5IHRvIGJlIHRlc3RlZCBmb3IgZXF1YWxpdHkuXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheTIgdGhlIG90aGVyIGFycmF5IHRvIGJlIHRlc3RlZCBmb3IgZXF1YWxpdHkuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSBlcXVhbHNGdW5jdGlvbiBvcHRpb25hbCBmdW5jdGlvbiB1c2VkIHRvXG4gKiBjaGVjayBlcXVhbGl0eSBiZXR3ZWVuIGVsZW1lbWVudHMgaW4gdGhlIGFycmF5cy5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIHR3byBhcnJheXMgYXJlIGVxdWFsXG4gKi9cbmZ1bmN0aW9uIGVxdWFscyhhcnJheTEsIGFycmF5MiwgZXF1YWxzRnVuY3Rpb24pIHtcbiAgICB2YXIgZXF1YWxzID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xuICAgIGlmIChhcnJheTEubGVuZ3RoICE9PSBhcnJheTIubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5MS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIWVxdWFscyhhcnJheTFbaV0sIGFycmF5MltpXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuZXF1YWxzID0gZXF1YWxzO1xuLyoqXG4gKiBSZXR1cm5zIHNoYWxsb3cgYSBjb3B5IG9mIHRoZSBzcGVjaWZpZWQgYXJyYXkuXG4gKiBAcGFyYW0geyp9IGFycmF5IHRoZSBhcnJheSB0byBjb3B5LlxuICogQHJldHVybiB7QXJyYXl9IGEgY29weSBvZiB0aGUgc3BlY2lmaWVkIGFycmF5XG4gKi9cbmZ1bmN0aW9uIGNvcHkoYXJyYXkpIHtcbiAgICByZXR1cm4gYXJyYXkuY29uY2F0KCk7XG59XG5leHBvcnRzLmNvcHkgPSBjb3B5O1xuLyoqXG4gKiBTd2FwcyB0aGUgZWxlbWVudHMgYXQgdGhlIHNwZWNpZmllZCBwb3NpdGlvbnMgaW4gdGhlIHNwZWNpZmllZCBhcnJheS5cbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSBpbiB3aGljaCB0byBzd2FwIGVsZW1lbnRzLlxuICogQHBhcmFtIHtudW1iZXJ9IGkgdGhlIGluZGV4IG9mIG9uZSBlbGVtZW50IHRvIGJlIHN3YXBwZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gaiB0aGUgaW5kZXggb2YgdGhlIG90aGVyIGVsZW1lbnQgdG8gYmUgc3dhcHBlZC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGFycmF5IGlzIGRlZmluZWQgYW5kIHRoZSBpbmRleGVzIGFyZSB2YWxpZC5cbiAqL1xuZnVuY3Rpb24gc3dhcChhcnJheSwgaSwgaikge1xuICAgIGlmIChpIDwgMCB8fCBpID49IGFycmF5Lmxlbmd0aCB8fCBqIDwgMCB8fCBqID49IGFycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciB0ZW1wID0gYXJyYXlbaV07XG4gICAgYXJyYXlbaV0gPSBhcnJheVtqXTtcbiAgICBhcnJheVtqXSA9IHRlbXA7XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLnN3YXAgPSBzd2FwO1xuZnVuY3Rpb24gdG9TdHJpbmcoYXJyYXkpIHtcbiAgICByZXR1cm4gJ1snICsgYXJyYXkudG9TdHJpbmcoKSArICddJztcbn1cbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8qKlxuICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudCBwcmVzZW50IGluIHRoaXMgYXJyYXlcbiAqIHN0YXJ0aW5nIGZyb20gaW5kZXggMCB0byBsZW5ndGggLSAxLlxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IGluIHdoaWNoIHRvIGl0ZXJhdGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcbiAqIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cbiAqIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxuICovXG5mdW5jdGlvbiBmb3JFYWNoKGFycmF5LCBjYWxsYmFjaykge1xuICAgIGZvciAodmFyIF9pID0gMCwgYXJyYXlfMSA9IGFycmF5OyBfaSA8IGFycmF5XzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBlbGUgPSBhcnJheV8xW19pXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKGVsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLmZvckVhY2ggPSBmb3JFYWNoO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJyYXlzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9oYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5leHBvcnRzLmhhcyA9IGZ1bmN0aW9uIChvYmosIHByb3ApIHtcbiAgICByZXR1cm4gX2hhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn07XG4vKipcbiAqIERlZmF1bHQgZnVuY3Rpb24gdG8gY29tcGFyZSBlbGVtZW50IG9yZGVyLlxuICogQGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlKGEsIGIpIHtcbiAgICBpZiAoYSA8IGIpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBlbHNlIGlmIChhID09PSBiKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0Q29tcGFyZSA9IGRlZmF1bHRDb21wYXJlO1xuLyoqXG4gKiBEZWZhdWx0IGZ1bmN0aW9uIHRvIHRlc3QgZXF1YWxpdHkuXG4gKiBAZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gZGVmYXVsdEVxdWFscyhhLCBiKSB7XG4gICAgcmV0dXJuIGEgPT09IGI7XG59XG5leHBvcnRzLmRlZmF1bHRFcXVhbHMgPSBkZWZhdWx0RXF1YWxzO1xuLyoqXG4gKiBEZWZhdWx0IGZ1bmN0aW9uIHRvIGNvbnZlcnQgYW4gb2JqZWN0IHRvIGEgc3RyaW5nLlxuICogQGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRUb1N0cmluZyhpdGVtKSB7XG4gICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICdDT0xMRUNUSU9OX05VTEwnO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1VuZGVmaW5lZChpdGVtKSkge1xuICAgICAgICByZXR1cm4gJ0NPTExFQ1RJT05fVU5ERUZJTkVEJztcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNTdHJpbmcoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuICckcycgKyBpdGVtO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuICckbycgKyBpdGVtLnRvU3RyaW5nKCk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0VG9TdHJpbmcgPSBkZWZhdWx0VG9TdHJpbmc7XG4vKipcbiogSm9pbnMgYWxsIHRoZSBwcm9wZXJpZXMgb2YgdGhlIG9iamVjdCB1c2luZyB0aGUgcHJvdmlkZWQgam9pbiBzdHJpbmdcbiovXG5mdW5jdGlvbiBtYWtlU3RyaW5nKGl0ZW0sIGpvaW4pIHtcbiAgICBpZiAoam9pbiA9PT0gdm9pZCAwKSB7IGpvaW4gPSAnLCc7IH1cbiAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJ0NPTExFQ1RJT05fTlVMTCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzVW5kZWZpbmVkKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiAnQ09MTEVDVElPTl9VTkRFRklORUQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1N0cmluZyhpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbS50b1N0cmluZygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHRvcmV0ID0gJ3snO1xuICAgICAgICB2YXIgZmlyc3QgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChleHBvcnRzLmhhcyhpdGVtLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9yZXQgPSB0b3JldCArIGpvaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRvcmV0ID0gdG9yZXQgKyBwcm9wICsgJzonICsgaXRlbVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9yZXQgKyAnfSc7XG4gICAgfVxufVxuZXhwb3J0cy5tYWtlU3RyaW5nID0gbWFrZVN0cmluZztcbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIGZ1bmN0aW9uLlxuICogQGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiAodHlwZW9mIGZ1bmMpID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyB1bmRlZmluZWQuXG4gKiBAZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKSB7XG4gICAgcmV0dXJuICh0eXBlb2Ygb2JqKSA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBzdHJpbmcuXG4gKiBAZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBTdHJpbmddJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbi8qKlxuICogUmV2ZXJzZXMgYSBjb21wYXJlIGZ1bmN0aW9uLlxuICogQGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIHJldmVyc2VDb21wYXJlRnVuY3Rpb24oY29tcGFyZUZ1bmN0aW9uKSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGNvbXBhcmVGdW5jdGlvbikpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBpZiAoYSA8IGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZCwgdikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVGdW5jdGlvbihkLCB2KSAqIC0xO1xuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMucmV2ZXJzZUNvbXBhcmVGdW5jdGlvbiA9IHJldmVyc2VDb21wYXJlRnVuY3Rpb247XG4vKipcbiAqIFJldHVybnMgYW4gZXF1YWwgZnVuY3Rpb24gZ2l2ZW4gYSBjb21wYXJlIGZ1bmN0aW9uLlxuICogQGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVUb0VxdWFscyhjb21wYXJlRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBhcmVGdW5jdGlvbihhLCBiKSA9PT0gMDtcbiAgICB9O1xufVxuZXhwb3J0cy5jb21wYXJlVG9FcXVhbHMgPSBjb21wYXJlVG9FcXVhbHM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IDIwMTMgQmFzYXJhdCBBbGkgU3llZC4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vXG4vLyBMaWNlbnNlZCB1bmRlciBNSVQgb3BlbiBzb3VyY2UgbGljZW5zZSBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4vL1xuLy8gT3JnaW5hbCBqYXZhc2NyaXB0IGNvZGUgd2FzIGJ5IE1hdXJpY2lvIFNhbnRvc1xuLy9cbnZhciBfYXJyYXlzID0gcmVxdWlyZSgnLi9hcnJheXMnKTtcbmV4cG9ydHMuYXJyYXlzID0gX2FycmF5cztcbnZhciBCYWdfMSA9IHJlcXVpcmUoJy4vQmFnJyk7XG5leHBvcnRzLkJhZyA9IEJhZ18xLmRlZmF1bHQ7XG52YXIgQlNUcmVlXzEgPSByZXF1aXJlKCcuL0JTVHJlZScpO1xuZXhwb3J0cy5CU1RyZWUgPSBCU1RyZWVfMS5kZWZhdWx0O1xudmFyIERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoJy4vRGljdGlvbmFyeScpO1xuZXhwb3J0cy5EaWN0aW9uYXJ5ID0gRGljdGlvbmFyeV8xLmRlZmF1bHQ7XG52YXIgSGVhcF8xID0gcmVxdWlyZSgnLi9IZWFwJyk7XG5leHBvcnRzLkhlYXAgPSBIZWFwXzEuZGVmYXVsdDtcbnZhciBMaW5rZWREaWN0aW9uYXJ5XzEgPSByZXF1aXJlKCcuL0xpbmtlZERpY3Rpb25hcnknKTtcbmV4cG9ydHMuTGlua2VkRGljdGlvbmFyeSA9IExpbmtlZERpY3Rpb25hcnlfMS5kZWZhdWx0O1xudmFyIExpbmtlZExpc3RfMSA9IHJlcXVpcmUoJy4vTGlua2VkTGlzdCcpO1xuZXhwb3J0cy5MaW5rZWRMaXN0ID0gTGlua2VkTGlzdF8xLmRlZmF1bHQ7XG52YXIgTXVsdGlEaWN0aW9uYXJ5XzEgPSByZXF1aXJlKCcuL011bHRpRGljdGlvbmFyeScpO1xuZXhwb3J0cy5NdWx0aURpY3Rpb25hcnkgPSBNdWx0aURpY3Rpb25hcnlfMS5kZWZhdWx0O1xudmFyIFF1ZXVlXzEgPSByZXF1aXJlKCcuL1F1ZXVlJyk7XG5leHBvcnRzLlF1ZXVlID0gUXVldWVfMS5kZWZhdWx0O1xudmFyIFByaW9yaXR5UXVldWVfMSA9IHJlcXVpcmUoJy4vUHJpb3JpdHlRdWV1ZScpO1xuZXhwb3J0cy5Qcmlvcml0eVF1ZXVlID0gUHJpb3JpdHlRdWV1ZV8xLmRlZmF1bHQ7XG52YXIgU2V0XzEgPSByZXF1aXJlKCcuL1NldCcpO1xuZXhwb3J0cy5TZXQgPSBTZXRfMS5kZWZhdWx0O1xudmFyIFN0YWNrXzEgPSByZXF1aXJlKCcuL1N0YWNrJyk7XG5leHBvcnRzLlN0YWNrID0gU3RhY2tfMS5kZWZhdWx0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl19
return require('typescript-collections');
});