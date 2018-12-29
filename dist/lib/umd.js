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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BSTreeKV_1 = require("./BSTreeKV");
/**
 * Special-case of the binary search tree in which the search key is equal to the element type.
 * This definition is suitable when the element type can not be split between what defines its order
 * and what does not (eg. primitive types as opposed to indexed records).
 *
 * The table below shows some use-case examples for both interfaces:
 *
 *           element type              |  most suitable interface
 * ------------------------------------|----------------------------
 *    number                           |  BSTree<number>
 *    string                           |  BSTree<string>
 * { order: number, data: string }     |  BSTreeKV<{order: number}, {order: number, data: string}>
 *
 * @see BSTreeKV
 */
var BSTree = /** @class */ (function (_super) {
    __extends(BSTree, _super);
    function BSTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BSTree;
}(BSTreeKV_1.default));
exports.default = BSTree;

},{"./BSTreeKV":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var Queue_1 = require("./Queue");
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
var BSTreeKV = /** @class */ (function () {
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
    function BSTreeKV(compareFunction) {
        this.root = null;
        this.compare = compareFunction || util.defaultCompare;
        this.nElements = 0;
    }
    /**
     * Adds the specified element to this tree if it is not already present.
     * @param {Object} element the element to insert.
     * @return {boolean} true if this tree did not already contain the specified element.
     */
    BSTreeKV.prototype.add = function (element) {
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
    BSTreeKV.prototype.clear = function () {
        this.root = null;
        this.nElements = 0;
    };
    /**
     * Returns true if this tree contains no elements.
     * @return {boolean} true if this tree contains no elements.
     */
    BSTreeKV.prototype.isEmpty = function () {
        return this.nElements === 0;
    };
    /**
     * Returns the number of elements in this tree.
     * @return {number} the number of elements in this tree.
     */
    BSTreeKV.prototype.size = function () {
        return this.nElements;
    };
    /**
     * Returns true if this tree contains the specified element.
     * @param {Object} element element to search for.
     * @return {boolean} true if this tree contains the specified element,
     * false otherwise.
     */
    BSTreeKV.prototype.contains = function (element) {
        if (util.isUndefined(element)) {
            return false;
        }
        return this.searchNode(this.root, element) !== null;
    };
    /**
     * Looks for the value with the provided search key.
     * @param {Object} element The key to look for
     * @return {Object} The value found or undefined if it was not found.
     */
    BSTreeKV.prototype.search = function (element) {
        var ret = this.searchNode(this.root, element);
        if (ret === null) {
            return undefined;
        }
        return ret.element;
    };
    /**
     * Removes the specified element from this tree if it is present.
     * @return {boolean} true if this tree contained the specified element.
     */
    BSTreeKV.prototype.remove = function (element) {
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
    BSTreeKV.prototype.inorderTraversal = function (callback) {
        this.inorderTraversalAux(this.root, callback, {
            stop: false
        });
    };
    /**
     * Executes the provided function once for each element present in this tree in pre-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    BSTreeKV.prototype.preorderTraversal = function (callback) {
        this.preorderTraversalAux(this.root, callback, {
            stop: false
        });
    };
    /**
     * Executes the provided function once for each element present in this tree in post-order.
     * @param {function(Object):*} callback function to execute, it is invoked with one
     * argument: the element value, to break the iteration you can optionally return false.
     */
    BSTreeKV.prototype.postorderTraversal = function (callback) {
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
    BSTreeKV.prototype.levelTraversal = function (callback) {
        this.levelTraversalAux(this.root, callback);
    };
    /**
     * Returns the minimum element of this tree.
     * @return {*} the minimum element of this tree or undefined if this tree is
     * is empty.
     */
    BSTreeKV.prototype.minimum = function () {
        if (this.isEmpty() || this.root === null) {
            return undefined;
        }
        return this.minimumAux(this.root).element;
    };
    /**
     * Returns the maximum element of this tree.
     * @return {*} the maximum element of this tree or undefined if this tree is
     * is empty.
     */
    BSTreeKV.prototype.maximum = function () {
        if (this.isEmpty() || this.root === null) {
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
    BSTreeKV.prototype.forEach = function (callback) {
        this.inorderTraversal(callback);
    };
    /**
     * Returns an array containing all of the elements in this tree in in-order.
     * @return {Array} an array containing all of the elements in this tree in in-order.
     */
    BSTreeKV.prototype.toArray = function () {
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
    BSTreeKV.prototype.height = function () {
        return this.heightAux(this.root);
    };
    /**
     * @private
     */
    BSTreeKV.prototype.searchNode = function (node, element) {
        var cmp = 1;
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
    BSTreeKV.prototype.transplant = function (n1, n2) {
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
    BSTreeKV.prototype.removeNode = function (node) {
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
    BSTreeKV.prototype.inorderTraversalAux = function (node, callback, signal) {
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
    BSTreeKV.prototype.levelTraversalAux = function (node, callback) {
        var queue = new Queue_1.default();
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
    };
    /**
     * @private
     */
    BSTreeKV.prototype.preorderTraversalAux = function (node, callback, signal) {
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
    BSTreeKV.prototype.postorderTraversalAux = function (node, callback, signal) {
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
    BSTreeKV.prototype.minimumAux = function (node) {
        while (node != null && node.leftCh !== null) {
            node = node.leftCh;
        }
        return node;
    };
    BSTreeKV.prototype.maximumAux = function (node) {
        while (node != null && node.rightCh !== null) {
            node = node.rightCh;
        }
        return node;
    };
    /**
     * @private
     */
    BSTreeKV.prototype.heightAux = function (node) {
        if (node === null) {
            return -1;
        }
        return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
    };
    /*
    * @private
    */
    BSTreeKV.prototype.insertNode = function (node) {
        var parent = null;
        var position = this.root;
        while (position !== null) {
            var cmp = this.compare(node.element, position.element);
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
    BSTreeKV.prototype.createNode = function (element) {
        return {
            element: element,
            leftCh: null,
            rightCh: null,
            parent: null
        };
    };
    return BSTreeKV;
}());
exports.default = BSTreeKV;

},{"./Queue":12,"./util":16}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var Dictionary_1 = require("./Dictionary");
var Set_1 = require("./Set");
var Bag = /** @class */ (function () {
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
}()); // End of bag
exports.default = Bag;

},{"./Dictionary":4,"./Set":13,"./util":16}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var Dictionary = /** @class */ (function () {
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
}()); // End of dictionary
exports.default = Dictionary;

},{"./util":16}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Dictionary_1 = require("./Dictionary");
var util = require("./util");
var FactoryDictionary = /** @class */ (function (_super) {
    __extends(FactoryDictionary, _super);
    /**
     * Creates an empty dictionary.
     * @class <p>Dictionaries map keys to values; each key can map to at most one value.
     * This implementation accepts any kind of objects as keys.</p>
     *
     * <p>The default factory function should return a new object of the provided
     * type. Example:</p>
     * <pre>
     * function petFactory() {
     *  return new Pet();
     * }
     * </pre>
     *
     * <p>If the keys are custom objects a function which converts keys to unique
     * strings must be provided. Example:</p>
     * <pre>
     * function petToString(pet) {
     *  return pet.name;
     * }
     * </pre>
     * @constructor
     * @param {function():V=} defaultFactoryFunction function used to create a
     * default object.
     * @param {function(Object):string=} toStrFunction optional function used
     * to convert keys to strings. If the keys aren't strings or if toString()
     * is not appropriate, a custom function which receives a key and returns a
     * unique string must be provided.
     */
    function FactoryDictionary(defaultFactoryFunction, toStrFunction) {
        var _this = _super.call(this, toStrFunction) || this;
        _this.defaultFactoryFunction = defaultFactoryFunction;
        return _this;
    }
    /**
     * Associates the specified default value with the specified key in this dictionary,
     * if it didn't contain the key yet. If the key existed, the existing value will be used.
     * @param {Object} key key with which the specified value is to be
     * associated.
     * @param {Object} defaultValue default value to be associated with the specified key.
     * @return {*} previous value associated with the specified key, or the default value,
     * if the key didn't exist yet.
     */
    FactoryDictionary.prototype.setDefault = function (key, defaultValue) {
        var currentValue = _super.prototype.getValue.call(this, key);
        if (util.isUndefined(currentValue)) {
            this.setValue(key, defaultValue);
            return defaultValue;
        }
        return currentValue;
    };
    /**
     * Returns the value to which this dictionary maps the specified key.
     * Returns a default value created by the factory passed in the constructor,
     * if this dictionary contains no mapping for this key. The missing key will
     * automatically be added to the dictionary.
     * @param {Object} key key whose associated value is to be returned.
     * @return {*} the value to which this dictionary maps the specified key or
     * a default value if the map contains no mapping for this key.
     */
    FactoryDictionary.prototype.getValue = function (key) {
        return this.setDefault(key, this.defaultFactoryFunction());
    };
    return FactoryDictionary;
}(Dictionary_1.default));
exports.default = FactoryDictionary;

},{"./Dictionary":4,"./util":16}],6:[function(require,module,exports){
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

},{"./arrays":15,"./util":16}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Dictionary_1 = require("./Dictionary");
var util = require("./util");
/**
 * This class is used by the LinkedDictionary Internally
 * Has to be a class, not an interface, because it needs to have
 * the 'unlink' function defined.
 */
var LinkedDictionaryPair = /** @class */ (function () {
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
/**
 * The head and tail elements of the list have null key and value properties but they
 * usually link to normal nodes.
 */
var HeadOrTailLinkedDictionaryPair = /** @class */ (function () {
    function HeadOrTailLinkedDictionaryPair() {
        this.key = null;
        this.value = null;
    }
    HeadOrTailLinkedDictionaryPair.prototype.unlink = function () {
        this.prev.next = this.next;
        this.next.prev = this.prev;
    };
    return HeadOrTailLinkedDictionaryPair;
}());
function isHeadOrTailLinkedDictionaryPair(p) {
    return !p.next;
}
var LinkedDictionary = /** @class */ (function (_super) {
    __extends(LinkedDictionary, _super);
    function LinkedDictionary(toStrFunction) {
        var _this = _super.call(this, toStrFunction) || this;
        _this.head = new HeadOrTailLinkedDictionaryPair();
        _this.tail = new HeadOrTailLinkedDictionaryPair();
        _this.head.next = _this.tail;
        _this.tail.prev = _this.head;
        return _this;
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
        while (!isHeadOrTailLinkedDictionaryPair(crawlNode)) {
            var ret = callback(crawlNode.key, crawlNode.value);
            if (ret === false) {
                return;
            }
            crawlNode = crawlNode.next;
        }
    };
    return LinkedDictionary;
}(Dictionary_1.default)); // End of LinkedDictionary
exports.default = LinkedDictionary;
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

},{"./Dictionary":4,"./util":16}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var arrays = require("./arrays");
var LinkedList = /** @class */ (function () {
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
        if (this.nElements === 0 || this.lastNode === null) {
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
            if (prev === null) {
                return false;
            }
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
                if (previous === null) {
                    this.firstNode = currentNode.next;
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
        while (n1 !== null && n2 !== null) {
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
        if (index < 0 || index >= this.nElements || this.firstNode === null || this.lastNode === null) {
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
            if (previous !== null && previous.next !== null) {
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
        for (var i = 0; i < index && node !== null; i++) {
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
}()); // End of linked list
exports.default = LinkedList;

},{"./arrays":15,"./util":16}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var Dictionary_1 = require("./Dictionary");
var arrays = require("./arrays");
var MultiDictionary = /** @class */ (function () {
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
     *     return pet.name;
     * }
     * </pre>
     * <p>If the values are custom objects a function to check equality between values
     * must be provided. Example:</p>
     *
     * <pre>
     * function petsAreEqualByAge(pet1,pet2) {
     *     return pet1.age === pet2.age;
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
        var array = this.dict.getValue(key);
        if (util.isUndefined(array)) {
            this.dict.setValue(key, [value]);
            return true;
        }
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
        if (!util.isUndefined(array) && arrays.remove(array, value, this.equalsF)) {
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
}()); // end of multi dictionary
exports.default = MultiDictionary;

},{"./Dictionary":4,"./arrays":15,"./util":16}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction[Direction["BEFORE"] = 0] = "BEFORE";
    Direction[Direction["AFTER"] = 1] = "AFTER";
    Direction[Direction["INSIDE_AT_END"] = 2] = "INSIDE_AT_END";
    Direction[Direction["INSIDE_AT_START"] = 3] = "INSIDE_AT_START";
})(Direction || (Direction = {}));
var MultiRootTree = /** @class */ (function () {
    function MultiRootTree(rootIds, nodes) {
        if (rootIds === void 0) { rootIds = []; }
        if (nodes === void 0) { nodes = {}; }
        this.rootIds = rootIds;
        this.nodes = nodes;
        this.initRootIds();
        this.initNodes();
    }
    MultiRootTree.prototype.initRootIds = function () {
        for (var _i = 0, _a = this.rootIds; _i < _a.length; _i++) {
            var rootId = _a[_i];
            this.createEmptyNodeIfNotExist(rootId);
        }
    };
    MultiRootTree.prototype.initNodes = function () {
        for (var nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                for (var _i = 0, _a = this.nodes[nodeKey]; _i < _a.length; _i++) {
                    var nodeListItem = _a[_i];
                    this.createEmptyNodeIfNotExist(nodeListItem);
                }
            }
        }
    };
    MultiRootTree.prototype.createEmptyNodeIfNotExist = function (nodeKey) {
        if (!this.nodes[nodeKey]) {
            this.nodes[nodeKey] = [];
        }
    };
    MultiRootTree.prototype.getRootIds = function () {
        var clone = this.rootIds.slice();
        return clone;
    };
    MultiRootTree.prototype.getNodes = function () {
        var clone = {};
        for (var nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                clone[nodeKey] = this.nodes[nodeKey].slice();
            }
        }
        return clone;
    };
    MultiRootTree.prototype.getObject = function () {
        return {
            rootIds: this.getRootIds(),
            nodes: this.getNodes(),
        };
    };
    MultiRootTree.prototype.toObject = function () {
        return this.getObject();
    };
    MultiRootTree.prototype.flatten = function () {
        var _this = this;
        var extraPropsObject = [];
        for (var i = 0; i < this.rootIds.length; i++) {
            var rootId = this.rootIds[i];
            extraPropsObject.push({
                id: rootId,
                level: 0,
                hasParent: false,
                childrenCount: 0,
            });
            traverse(rootId, this.nodes, extraPropsObject, 0);
        }
        for (var _i = 0, extraPropsObject_1 = extraPropsObject; _i < extraPropsObject_1.length; _i++) {
            var o = extraPropsObject_1[_i];
            o.childrenCount = countChildren(o.id);
        }
        return extraPropsObject;
        function countChildren(id) {
            if (!_this.nodes[id]) {
                return 0;
            }
            else {
                var childrenCount = _this.nodes[id].length;
                return childrenCount;
            }
        }
        function traverse(startId, nodes, returnArray, level) {
            if (level === void 0) { level = 0; }
            if (!startId || !nodes || !returnArray || !nodes[startId]) {
                return;
            }
            level++;
            var idsList = nodes[startId];
            for (var i = 0; i < idsList.length; i++) {
                var id = idsList[i];
                returnArray.push({ id: id, level: level, hasParent: true });
                traverse(id, nodes, returnArray, level);
            }
            level--;
        }
    };
    MultiRootTree.prototype.moveIdBeforeId = function (moveId, beforeId) {
        return this.moveId(moveId, beforeId, Direction.BEFORE);
    };
    MultiRootTree.prototype.moveIdAfterId = function (moveId, afterId) {
        return this.moveId(moveId, afterId, Direction.AFTER);
    };
    MultiRootTree.prototype.moveIdIntoId = function (moveId, insideId, atStart) {
        if (atStart === void 0) { atStart = true; }
        if (atStart) {
            return this.moveId(moveId, insideId, Direction.INSIDE_AT_START);
        }
        else {
            return this.moveId(moveId, insideId, Direction.INSIDE_AT_END);
        }
    };
    MultiRootTree.prototype.swapRootIdWithRootId = function (rootId, withRootId) {
        var leftIndex = this.findRootId(rootId);
        var rightIndex = this.findRootId(withRootId);
        this.swapRootPositionWithRootPosition(leftIndex, rightIndex);
    };
    MultiRootTree.prototype.swapRootPositionWithRootPosition = function (swapRootPosition, withRootPosition) {
        var temp = this.rootIds[withRootPosition];
        this.rootIds[withRootPosition] = this.rootIds[swapRootPosition];
        this.rootIds[swapRootPosition] = temp;
    };
    MultiRootTree.prototype.deleteId = function (id) {
        this.rootDeleteId(id);
        this.nodeAndSubNodesDelete(id);
        this.nodeRefrencesDelete(id);
    };
    MultiRootTree.prototype.insertIdBeforeId = function (beforeId, insertId) {
        var foundRootIdIndex = this.findRootId(beforeId);
        if (foundRootIdIndex > -1) {
            this.insertIdIntoRoot(insertId, foundRootIdIndex);
        }
        for (var nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                var foundNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                if (foundNodeIdIndex > -1) {
                    this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex);
                }
            }
        }
    };
    MultiRootTree.prototype.insertIdAfterId = function (belowId, insertId) {
        var foundRootIdIndex = this.findRootId(belowId);
        if (foundRootIdIndex > -1) {
            this.insertIdIntoRoot(insertId, foundRootIdIndex + 1);
        }
        for (var nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                var foundNodeIdIndex = this.findNodeId(nodeKey, belowId);
                if (foundNodeIdIndex > -1) {
                    this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex + 1);
                }
            }
        }
    };
    MultiRootTree.prototype.insertIdIntoId = function (insideId, insertId) {
        this.nodeInsertAtEnd(insideId, insertId);
        this.nodes[insertId] = [];
    };
    MultiRootTree.prototype.insertIdIntoRoot = function (id, position) {
        if (position === undefined) {
            this.rootInsertAtEnd(id);
        }
        else {
            if (position < 0) {
                var length_1 = this.rootIds.length;
                this.rootIds.splice((position + length_1 + 1), 0, id);
            }
            else {
                this.rootIds.splice(position, 0, id);
            }
        }
        this.nodes[id] = this.nodes[id] || [];
    };
    MultiRootTree.prototype.insertIdIntoNode = function (nodeKey, id, position) {
        this.nodes[nodeKey] = this.nodes[nodeKey] || [];
        this.nodes[id] = this.nodes[id] || [];
        if (position === undefined) {
            this.nodeInsertAtEnd(nodeKey, id);
        }
        else {
            if (position < 0) {
                var length_2 = this.nodes[nodeKey].length;
                this.nodes[nodeKey].splice((position + length_2 + 1), 0, id);
            }
            else {
                this.nodes[nodeKey].splice(position, 0, id);
            }
        }
    };
    MultiRootTree.prototype.moveId = function (moveId, beforeId, direction) {
        var sourceId = moveId;
        var sourceRootIndex = this.findRootId(sourceId);
        var sourceNodeKey;
        var sourceNodeIdIndex;
        if (this.nodes[beforeId]) {
            sourceNodeKey = beforeId;
        }
        for (var nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                sourceNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                break;
            }
        }
        // got all
        var targetId = beforeId;
        var targetRootIndex = this.findRootId(targetId);
        var targetNodeKey;
        var targetNodeIdIndex;
        if (this.nodes[beforeId]) {
            targetNodeKey = beforeId;
        }
        for (var nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                targetNodeIdIndex = this.findNodeId(nodeKey, beforeId);
                break;
            }
        }
        // got all
        if (sourceRootIndex > -1) {
            if (targetRootIndex > -1) {
                // moving root to root
                // console.log(`Moving ROOT to ROOT`);
                // console.log(`RootIds:`);
                // console.log(this.rootIds);
                // console.log(`TargetIndex=${targetRootIndex}, SourceIndex=${sourceRootIndex}`);
                // console.log(`TargetId=${targetId}, SourceId=${sourceId}`);
                this.rootDelete(sourceRootIndex); // indexes change now
                if (targetRootIndex > sourceRootIndex) {
                    targetRootIndex--;
                }
                else {
                }
                switch (direction) {
                    case Direction.BEFORE:
                        this.insertIdIntoRoot(sourceId, targetRootIndex);
                        break;
                    case Direction.AFTER:
                        this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
                        break;
                    case Direction.INSIDE_AT_START:
                        this.nodeInsertAtStart(targetId, sourceId);
                        break;
                    case Direction.INSIDE_AT_END:
                        this.nodeInsertAtEnd(targetId, sourceId);
                        break;
                }
            }
            else {
                // moving root (source) ABOVE node (target)
                // will remove one entry from roots
                this.rootDelete(sourceRootIndex);
                for (var nodeKey in this.nodes) {
                    if (this.nodes.hasOwnProperty(nodeKey)) {
                        var index = this.findNodeId(nodeKey, targetId);
                        if (index > -1) {
                            switch (direction) {
                                case Direction.BEFORE:
                                    this.insertIdIntoNode(nodeKey, sourceId, index);
                                    break;
                                case Direction.AFTER:
                                    this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                                    break;
                                case Direction.INSIDE_AT_START:
                                    this.nodeInsertAtStart(targetId, sourceId);
                                    break;
                                case Direction.INSIDE_AT_END:
                                    this.nodeInsertAtEnd(targetId, sourceId);
                                    break;
                            }
                            break;
                        }
                    }
                }
            }
        }
        else {
            if (targetRootIndex > -1) {
                // moving node (source) ABOVE root (target)
                // delete source id from each node
                for (var nodeKey in this.nodes) {
                    if (this.nodes.hasOwnProperty(nodeKey)) {
                        var index = this.findNodeId(nodeKey, sourceId);
                        if (index > -1) {
                            // this.nodeInsertId(nodeKey, sourceId, index);
                            this.nodeDeleteAtIndex(nodeKey, index);
                            break;
                        }
                    }
                }
                switch (direction) {
                    case Direction.BEFORE:
                        this.insertIdIntoRoot(sourceId, targetRootIndex);
                        break;
                    case Direction.AFTER:
                        this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
                        break;
                    case Direction.INSIDE_AT_START:
                        this.nodeInsertAtStart(targetId, sourceId);
                        break;
                    case Direction.INSIDE_AT_END:
                        this.nodeInsertAtEnd(targetId, sourceId);
                        break;
                }
            }
            else {
                // moving node (source) ABOVE node (target)
                // delete source id from each node
                for (var nodeKey in this.nodes) {
                    if (this.nodes.hasOwnProperty(nodeKey)) {
                        var index = this.findNodeId(nodeKey, sourceId);
                        if (index > -1) {
                            this.nodeDeleteAtIndex(nodeKey, index);
                            break;
                        }
                    }
                }
                for (var nodeKey in this.nodes) {
                    if (this.nodes.hasOwnProperty(nodeKey)) {
                        var index = this.findNodeId(nodeKey, targetId);
                        if (index > -1) {
                            switch (direction) {
                                case Direction.BEFORE:
                                    this.insertIdIntoNode(nodeKey, sourceId, index);
                                    break;
                                case Direction.AFTER:
                                    this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                                    break;
                                case Direction.INSIDE_AT_START:
                                    this.nodeInsertAtStart(targetId, sourceId);
                                    break;
                                case Direction.INSIDE_AT_END:
                                    this.nodeInsertAtEnd(targetId, sourceId);
                                    break;
                            }
                            break;
                        }
                    }
                }
            }
        }
    };
    MultiRootTree.prototype.swapArrayElements = function (arr, indexA, indexB) {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
        return arr;
    };
    MultiRootTree.prototype.rootDeleteId = function (id) {
        var index = this.findRootId(id);
        if (index > -1) {
            this.rootDelete(index);
        }
    };
    MultiRootTree.prototype.nodeAndSubNodesDelete = function (nodeKey) {
        var toDeleteLater = [];
        for (var i = 0; i < this.nodes[nodeKey].length; i++) {
            var id = this.nodes[nodeKey][i];
            this.nodeAndSubNodesDelete(id);
            toDeleteLater.push(nodeKey);
        }
        this.nodeDelete(nodeKey);
        for (var i = 0; i < toDeleteLater.length; i++) {
            this.nodeDelete(toDeleteLater[i]);
        }
    };
    MultiRootTree.prototype.nodeRefrencesDelete = function (id) {
        for (var nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
                for (var i = 0; i < this.nodes[nodeKey].length; i++) {
                    var targetId = this.nodes[nodeKey][i];
                    if (targetId === id) {
                        this.nodeDeleteAtIndex(nodeKey, i);
                    }
                }
            }
        }
    };
    MultiRootTree.prototype.nodeDelete = function (nodeKey) {
        delete this.nodes[nodeKey];
    };
    MultiRootTree.prototype.findRootId = function (id) {
        return this.rootIds.indexOf(id);
    };
    MultiRootTree.prototype.findNodeId = function (nodeKey, id) {
        return this.nodes[nodeKey].indexOf(id);
    };
    MultiRootTree.prototype.findNode = function (nodeKey) {
        return this.nodes[nodeKey];
    };
    MultiRootTree.prototype.nodeInsertAtStart = function (nodeKey, id) {
        this.nodes[nodeKey].unshift(id);
    };
    MultiRootTree.prototype.nodeInsertAtEnd = function (nodeKey, id) {
        this.nodes[nodeKey].push(id);
    };
    MultiRootTree.prototype.rootDelete = function (index) {
        this.rootIds.splice(index, 1);
    };
    MultiRootTree.prototype.nodeDeleteAtIndex = function (nodeKey, index) {
        this.nodes[nodeKey].splice(index, 1);
    };
    MultiRootTree.prototype.rootInsertAtStart = function (id) {
        this.rootIds.unshift(id);
    };
    MultiRootTree.prototype.rootInsertAtEnd = function (id) {
        this.rootIds.push(id);
    };
    return MultiRootTree;
}());
exports.default = MultiRootTree;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var Heap_1 = require("./Heap");
var PriorityQueue = /** @class */ (function () {
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
}()); // end of priority queue
exports.default = PriorityQueue;

},{"./Heap":6,"./util":16}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_1 = require("./LinkedList");
var Queue = /** @class */ (function () {
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
}()); // End of queue
exports.default = Queue;

},{"./LinkedList":8}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var arrays = require("./arrays");
var Dictionary_1 = require("./Dictionary");
var Set = /** @class */ (function () {
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
     * is not appropriate, a custom function which receives an object and returns a
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
     * Performs an intersecion between this and another set.
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
     * Performs a union between this and another set.
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
     * Performs a difference between this and another set.
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
}()); // end of Set
exports.default = Set;

},{"./Dictionary":4,"./arrays":15,"./util":16}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_1 = require("./LinkedList");
var Stack = /** @class */ (function () {
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
}()); // End of stack
exports.default = Stack;

},{"./LinkedList":8}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
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

},{"./util":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    if (isUndefined(compareFunction) || !isFunction(compareFunction)) {
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
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2013 Basarat Ali Syed. All Rights Reserved.
//
// Licensed under MIT open source license http://opensource.org/licenses/MIT
//
// Orginal javascript code was by Mauricio Santos
//
var _arrays = require("./arrays");
exports.arrays = _arrays;
var Bag_1 = require("./Bag");
exports.Bag = Bag_1.default;
var BSTree_1 = require("./BSTree");
exports.BSTree = BSTree_1.default;
var BSTreeKV_1 = require("./BSTreeKV");
exports.BSTreeKV = BSTreeKV_1.default;
var Dictionary_1 = require("./Dictionary");
exports.Dictionary = Dictionary_1.default;
var Heap_1 = require("./Heap");
exports.Heap = Heap_1.default;
var LinkedDictionary_1 = require("./LinkedDictionary");
exports.LinkedDictionary = LinkedDictionary_1.default;
var LinkedList_1 = require("./LinkedList");
exports.LinkedList = LinkedList_1.default;
var MultiDictionary_1 = require("./MultiDictionary");
exports.MultiDictionary = MultiDictionary_1.default;
var FactoryDictionary_1 = require("./FactoryDictionary");
exports.FactoryDictionary = FactoryDictionary_1.default;
var FactoryDictionary_2 = require("./FactoryDictionary");
exports.DefaultDictionary = FactoryDictionary_2.default;
var Queue_1 = require("./Queue");
exports.Queue = Queue_1.default;
var PriorityQueue_1 = require("./PriorityQueue");
exports.PriorityQueue = PriorityQueue_1.default;
var Set_1 = require("./Set");
exports.Set = Set_1.default;
var Stack_1 = require("./Stack");
exports.Stack = Stack_1.default;
var MultiRootTree_1 = require("./MultiRootTree");
exports.MultiRootTree = MultiRootTree_1.default;
var _util = require("./util");
exports.util = _util;

},{"./BSTree":1,"./BSTreeKV":2,"./Bag":3,"./Dictionary":4,"./FactoryDictionary":5,"./Heap":6,"./LinkedDictionary":7,"./LinkedList":8,"./MultiDictionary":9,"./MultiRootTree":10,"./PriorityQueue":11,"./Queue":12,"./Set":13,"./Stack":14,"./arrays":15,"./util":16}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2xpYi9CU1RyZWUuanMiLCJkaXN0L2xpYi9CU1RyZWVLVi5qcyIsImRpc3QvbGliL0JhZy5qcyIsImRpc3QvbGliL0RpY3Rpb25hcnkuanMiLCJkaXN0L2xpYi9GYWN0b3J5RGljdGlvbmFyeS5qcyIsImRpc3QvbGliL0hlYXAuanMiLCJkaXN0L2xpYi9MaW5rZWREaWN0aW9uYXJ5LmpzIiwiZGlzdC9saWIvTGlua2VkTGlzdC5qcyIsImRpc3QvbGliL011bHRpRGljdGlvbmFyeS5qcyIsImRpc3QvbGliL011bHRpUm9vdFRyZWUuanMiLCJkaXN0L2xpYi9Qcmlvcml0eVF1ZXVlLmpzIiwiZGlzdC9saWIvUXVldWUuanMiLCJkaXN0L2xpYi9TZXQuanMiLCJkaXN0L2xpYi9TdGFjay5qcyIsImRpc3QvbGliL2FycmF5cy5qcyIsImRpc3QvbGliL3V0aWwuanMiLCJkaXN0L2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9aQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIEJTVHJlZUtWXzEgPSByZXF1aXJlKFwiLi9CU1RyZWVLVlwiKTtcclxuLyoqXHJcbiAqIFNwZWNpYWwtY2FzZSBvZiB0aGUgYmluYXJ5IHNlYXJjaCB0cmVlIGluIHdoaWNoIHRoZSBzZWFyY2gga2V5IGlzIGVxdWFsIHRvIHRoZSBlbGVtZW50IHR5cGUuXHJcbiAqIFRoaXMgZGVmaW5pdGlvbiBpcyBzdWl0YWJsZSB3aGVuIHRoZSBlbGVtZW50IHR5cGUgY2FuIG5vdCBiZSBzcGxpdCBiZXR3ZWVuIHdoYXQgZGVmaW5lcyBpdHMgb3JkZXJcclxuICogYW5kIHdoYXQgZG9lcyBub3QgKGVnLiBwcmltaXRpdmUgdHlwZXMgYXMgb3Bwb3NlZCB0byBpbmRleGVkIHJlY29yZHMpLlxyXG4gKlxyXG4gKiBUaGUgdGFibGUgYmVsb3cgc2hvd3Mgc29tZSB1c2UtY2FzZSBleGFtcGxlcyBmb3IgYm90aCBpbnRlcmZhY2VzOlxyXG4gKlxyXG4gKiAgICAgICAgICAgZWxlbWVudCB0eXBlICAgICAgICAgICAgICB8ICBtb3N0IHN1aXRhYmxlIGludGVyZmFjZVxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiAgICBudW1iZXIgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICBCU1RyZWU8bnVtYmVyPlxyXG4gKiAgICBzdHJpbmcgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICBCU1RyZWU8c3RyaW5nPlxyXG4gKiB7IG9yZGVyOiBudW1iZXIsIGRhdGE6IHN0cmluZyB9ICAgICB8ICBCU1RyZWVLVjx7b3JkZXI6IG51bWJlcn0sIHtvcmRlcjogbnVtYmVyLCBkYXRhOiBzdHJpbmd9PlxyXG4gKlxyXG4gKiBAc2VlIEJTVHJlZUtWXHJcbiAqL1xyXG52YXIgQlNUcmVlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEJTVHJlZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEJTVHJlZSgpIHtcclxuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQlNUcmVlO1xyXG59KEJTVHJlZUtWXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBCU1RyZWU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJTVHJlZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbnZhciBRdWV1ZV8xID0gcmVxdWlyZShcIi4vUXVldWVcIik7XHJcbi8qKlxyXG4gKiBHZW5lcmFsIGJpbmFyeSBzZWFyY2ggdHJlZSBpbXBsZW1lbnRhdGlvbi5cclxuICpcclxuICogVGhpcyBpbnRlcmZhY2UgYWxsb3dzIG9uZSB0byBzZWFyY2ggZWxlbWVudHMgdXNpbmcgYSBzdWJzZXQgb2YgdGhlaXIgYXR0cmlidXRlcyAodGh1cyB0aGVcclxuICogdHJlZSBjYW4gYmUgdXNlZCBhcyBhbiBpbmRleCBmb3IgY29tcGxleCBvYmplY3RzKS5cclxuICogVGhlIGF0dHJpYnV0ZXMgcmVxdWlyZWQgdG8gZGVmaW5lIGFuIG9yZGVyaW5nIGluIHRoZSB0cmVlIG11c3QgYmUgZGVmaW5lZCBpbiB0aGUgdHlwZSBLLlxyXG4gKiBBbnkgYWRkaXRpb25hbCBhdHRyaWJ1dGUgbXVzdCBiZSBkZWZpbmVkIGluIHRoZSB0eXBlIFYuXHJcbiAqXHJcbiAqIEBzZWUgQlNUcmVlXHJcbiAqL1xyXG52YXIgQlNUcmVlS1YgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgYmluYXJ5IHNlYXJjaCB0cmVlLlxyXG4gICAgICogQGNsYXNzIDxwPkEgYmluYXJ5IHNlYXJjaCB0cmVlIGlzIGEgYmluYXJ5IHRyZWUgaW4gd2hpY2ggZWFjaFxyXG4gICAgICogaW50ZXJuYWwgbm9kZSBzdG9yZXMgYW4gZWxlbWVudCBzdWNoIHRoYXQgdGhlIGVsZW1lbnRzIHN0b3JlZCBpbiB0aGVcclxuICAgICAqIGxlZnQgc3VidHJlZSBhcmUgbGVzcyB0aGFuIGl0IGFuZCB0aGUgZWxlbWVudHNcclxuICAgICAqIHN0b3JlZCBpbiB0aGUgcmlnaHQgc3VidHJlZSBhcmUgZ3JlYXRlci48L3A+XHJcbiAgICAgKiA8cD5Gb3JtYWxseSwgYSBiaW5hcnkgc2VhcmNoIHRyZWUgaXMgYSBub2RlLWJhc2VkIGJpbmFyeSB0cmVlIGRhdGEgc3RydWN0dXJlIHdoaWNoXHJcbiAgICAgKiBoYXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOjwvcD5cclxuICAgICAqIDx1bD5cclxuICAgICAqIDxsaT5UaGUgbGVmdCBzdWJ0cmVlIG9mIGEgbm9kZSBjb250YWlucyBvbmx5IG5vZGVzIHdpdGggZWxlbWVudHMgbGVzc1xyXG4gICAgICogdGhhbiB0aGUgbm9kZSdzIGVsZW1lbnQ8L2xpPlxyXG4gICAgICogPGxpPlRoZSByaWdodCBzdWJ0cmVlIG9mIGEgbm9kZSBjb250YWlucyBvbmx5IG5vZGVzIHdpdGggZWxlbWVudHMgZ3JlYXRlclxyXG4gICAgICogdGhhbiB0aGUgbm9kZSdzIGVsZW1lbnQ8L2xpPlxyXG4gICAgICogPGxpPkJvdGggdGhlIGxlZnQgYW5kIHJpZ2h0IHN1YnRyZWVzIG11c3QgYWxzbyBiZSBiaW5hcnkgc2VhcmNoIHRyZWVzLjwvbGk+XHJcbiAgICAgKiA8L3VsPlxyXG4gICAgICogPHA+SWYgdGhlIGluc2VydGVkIGVsZW1lbnRzIGFyZSBjdXN0b20gb2JqZWN0cyBhIGNvbXBhcmUgZnVuY3Rpb24gbXVzdFxyXG4gICAgICogYmUgcHJvdmlkZWQgYXQgY29uc3RydWN0aW9uIHRpbWUsIG90aGVyd2lzZSB0aGUgPD0sID09PSBhbmQgPj0gb3BlcmF0b3JzIGFyZVxyXG4gICAgICogdXNlZCB0byBjb21wYXJlIGVsZW1lbnRzLiBFeGFtcGxlOjwvcD5cclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiBmdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcclxuICAgICAqICBpZiAoYSBpcyBsZXNzIHRoYW4gYiBieSBzb21lIG9yZGVyaW5nIGNyaXRlcmlvbikge1xyXG4gICAgICogICAgIHJldHVybiAtMTtcclxuICAgICAqICB9IGlmIChhIGlzIGdyZWF0ZXIgdGhhbiBiIGJ5IHRoZSBvcmRlcmluZyBjcml0ZXJpb24pIHtcclxuICAgICAqICAgICByZXR1cm4gMTtcclxuICAgICAqICB9XHJcbiAgICAgKiAgLy8gYSBtdXN0IGJlIGVxdWFsIHRvIGJcclxuICAgICAqICByZXR1cm4gMDtcclxuICAgICAqIH1cclxuICAgICAqIDwvcHJlPlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOm51bWJlcj19IGNvbXBhcmVGdW5jdGlvbiBvcHRpb25hbFxyXG4gICAgICogZnVuY3Rpb24gdXNlZCB0byBjb21wYXJlIHR3byBlbGVtZW50cy4gTXVzdCByZXR1cm4gYSBuZWdhdGl2ZSBpbnRlZ2VyLFxyXG4gICAgICogemVybywgb3IgYSBwb3NpdGl2ZSBpbnRlZ2VyIGFzIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBsZXNzIHRoYW4sIGVxdWFsIHRvLFxyXG4gICAgICogb3IgZ3JlYXRlciB0aGFuIHRoZSBzZWNvbmQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEJTVHJlZUtWKGNvbXBhcmVGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb21wYXJlID0gY29tcGFyZUZ1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdENvbXBhcmU7XHJcbiAgICAgICAgdGhpcy5uRWxlbWVudHMgPSAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBzcGVjaWZpZWQgZWxlbWVudCB0byB0aGlzIHRyZWUgaWYgaXQgaXMgbm90IGFscmVhZHkgcHJlc2VudC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IHRoZSBlbGVtZW50IHRvIGluc2VydC5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyB0cmVlIGRpZCBub3QgYWxyZWFkeSBjb250YWluIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbnNlcnROb2RlKHRoaXMuY3JlYXRlTm9kZShlbGVtZW50KSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5uRWxlbWVudHMrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIG9mIHRoZSBlbGVtZW50cyBmcm9tIHRoaXMgdHJlZS5cclxuICAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5uRWxlbWVudHMgPSAwO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgdHJlZSBjb250YWlucyBubyBlbGVtZW50cy5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyB0cmVlIGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxyXG4gICAgICovXHJcbiAgICBCU1RyZWVLVi5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5uRWxlbWVudHMgPT09IDA7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyB0cmVlLlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgdHJlZS5cclxuICAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgdHJlZSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBlbGVtZW50IHRvIHNlYXJjaCBmb3IuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgdHJlZSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQsXHJcbiAgICAgKiBmYWxzZSBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hOb2RlKHRoaXMucm9vdCwgZWxlbWVudCkgIT09IG51bGw7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBMb29rcyBmb3IgdGhlIHZhbHVlIHdpdGggdGhlIHByb3ZpZGVkIHNlYXJjaCBrZXkuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBUaGUga2V5IHRvIGxvb2sgZm9yXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB2YWx1ZSBmb3VuZCBvciB1bmRlZmluZWQgaWYgaXQgd2FzIG5vdCBmb3VuZC5cclxuICAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLnNlYXJjaCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIHJldCA9IHRoaXMuc2VhcmNoTm9kZSh0aGlzLnJvb3QsIGVsZW1lbnQpO1xyXG4gICAgICAgIGlmIChyZXQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldC5lbGVtZW50O1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgZnJvbSB0aGlzIHRyZWUgaWYgaXQgaXMgcHJlc2VudC5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyB0cmVlIGNvbnRhaW5lZCB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5zZWFyY2hOb2RlKHRoaXMucm9vdCwgZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbW92ZU5vZGUobm9kZSk7XHJcbiAgICAgICAgdGhpcy5uRWxlbWVudHMtLTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIHRyZWUgaW5cclxuICAgICAqIGluLW9yZGVyLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzIGludm9rZWQgd2l0aCBvbmVcclxuICAgICAqIGFyZ3VtZW50OiB0aGUgZWxlbWVudCB2YWx1ZSwgdG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBCU1RyZWVLVi5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuaW5vcmRlclRyYXZlcnNhbEF1eCh0aGlzLnJvb3QsIGNhbGxiYWNrLCB7XHJcbiAgICAgICAgICAgIHN0b3A6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyB0cmVlIGluIHByZS1vcmRlci5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpcyBpbnZva2VkIHdpdGggb25lXHJcbiAgICAgKiBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhbiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLnByZW9yZGVyVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eCh0aGlzLnJvb3QsIGNhbGxiYWNrLCB7XHJcbiAgICAgICAgICAgIHN0b3A6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyB0cmVlIGluIHBvc3Qtb3JkZXIuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXMgaW52b2tlZCB3aXRoIG9uZVxyXG4gICAgICogYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW4gb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5wb3N0b3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eCh0aGlzLnJvb3QsIGNhbGxiYWNrLCB7XHJcbiAgICAgICAgICAgIHN0b3A6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyB0cmVlIGluXHJcbiAgICAgKiBsZXZlbC1vcmRlci5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpcyBpbnZva2VkIHdpdGggb25lXHJcbiAgICAgKiBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhbiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLmxldmVsVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5sZXZlbFRyYXZlcnNhbEF1eCh0aGlzLnJvb3QsIGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1pbmltdW0gZWxlbWVudCBvZiB0aGlzIHRyZWUuXHJcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgbWluaW11bSBlbGVtZW50IG9mIHRoaXMgdHJlZSBvciB1bmRlZmluZWQgaWYgdGhpcyB0cmVlIGlzXHJcbiAgICAgKiBpcyBlbXB0eS5cclxuICAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLm1pbmltdW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpIHx8IHRoaXMucm9vdCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5taW5pbXVtQXV4KHRoaXMucm9vdCkuZWxlbWVudDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG1heGltdW0gZWxlbWVudCBvZiB0aGlzIHRyZWUuXHJcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgbWF4aW11bSBlbGVtZW50IG9mIHRoaXMgdHJlZSBvciB1bmRlZmluZWQgaWYgdGhpcyB0cmVlIGlzXHJcbiAgICAgKiBpcyBlbXB0eS5cclxuICAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLm1heGltdW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpIHx8IHRoaXMucm9vdCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tYXhpbXVtQXV4KHRoaXMucm9vdCkuZWxlbWVudDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIHRyZWUgaW4gaW5vcmRlci5cclxuICAgICAqIEVxdWl2YWxlbnQgdG8gaW5vcmRlclRyYXZlcnNhbC5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xyXG4gICAgICogaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxyXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsKGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgdHJlZSBpbiBpbi1vcmRlci5cclxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgZWxlbWVudHMgaW4gdGhpcyB0cmVlIGluIGluLW9yZGVyLlxyXG4gICAgICovXHJcbiAgICBCU1RyZWVLVi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWwoZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChlbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoaXMgdHJlZS5cclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGhlaWdodCBvZiB0aGlzIHRyZWUgb3IgLTEgaWYgaXMgZW1wdHkuXHJcbiAgICAgKi9cclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5oZWlnaHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0QXV4KHRoaXMucm9vdCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBCU1RyZWVLVi5wcm90b3R5cGUuc2VhcmNoTm9kZSA9IGZ1bmN0aW9uIChub2RlLCBlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIGNtcCA9IDE7XHJcbiAgICAgICAgd2hpbGUgKG5vZGUgIT09IG51bGwgJiYgY21wICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGNtcCA9IHRoaXMuY29tcGFyZShlbGVtZW50LCBub2RlLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoY21wIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubGVmdENoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNtcCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnJpZ2h0Q2g7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBCU1RyZWVLVi5wcm90b3R5cGUudHJhbnNwbGFudCA9IGZ1bmN0aW9uIChuMSwgbjIpIHtcclxuICAgICAgICBpZiAobjEucGFyZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG4yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChuMSA9PT0gbjEucGFyZW50LmxlZnRDaCkge1xyXG4gICAgICAgICAgICBuMS5wYXJlbnQubGVmdENoID0gbjI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBuMS5wYXJlbnQucmlnaHRDaCA9IG4yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobjIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgbjIucGFyZW50ID0gbjEucGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5yZW1vdmVOb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICBpZiAobm9kZS5sZWZ0Q2ggPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50cmFuc3BsYW50KG5vZGUsIG5vZGUucmlnaHRDaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5vZGUucmlnaHRDaCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zcGxhbnQobm9kZSwgbm9kZS5sZWZ0Q2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLm1pbmltdW1BdXgobm9kZS5yaWdodENoKTtcclxuICAgICAgICAgICAgaWYgKHkucGFyZW50ICE9PSBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcGxhbnQoeSwgeS5yaWdodENoKTtcclxuICAgICAgICAgICAgICAgIHkucmlnaHRDaCA9IG5vZGUucmlnaHRDaDtcclxuICAgICAgICAgICAgICAgIHkucmlnaHRDaC5wYXJlbnQgPSB5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNwbGFudChub2RlLCB5KTtcclxuICAgICAgICAgICAgeS5sZWZ0Q2ggPSBub2RlLmxlZnRDaDtcclxuICAgICAgICAgICAgeS5sZWZ0Q2gucGFyZW50ID0geTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBCU1RyZWVLVi5wcm90b3R5cGUuaW5vcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwgfHwgc2lnbmFsLnN0b3ApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgobm9kZS5sZWZ0Q2gsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNpZ25hbC5zdG9wID0gY2FsbGJhY2sobm9kZS5lbGVtZW50KSA9PT0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KG5vZGUucmlnaHRDaCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBCU1RyZWVLVi5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgcXVldWUgPSBuZXcgUXVldWVfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKG5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcXVldWUuZW5xdWV1ZShub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZSA9IHF1ZXVlLmRlcXVldWUoKSB8fCBudWxsO1xyXG4gICAgICAgIHdoaWxlIChub2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKG5vZGUuZWxlbWVudCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vZGUubGVmdENoICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBxdWV1ZS5lbnF1ZXVlKG5vZGUubGVmdENoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm9kZS5yaWdodENoICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBxdWV1ZS5lbnF1ZXVlKG5vZGUucmlnaHRDaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZSA9IHF1ZXVlLmRlcXVldWUoKSB8fCBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5wcmVvcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaywgc2lnbmFsKSB7XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwgfHwgc2lnbmFsLnN0b3ApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaWduYWwuc3RvcCA9IGNhbGxiYWNrKG5vZGUuZWxlbWVudCkgPT09IGZhbHNlO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgobm9kZS5sZWZ0Q2gsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgobm9kZS5yaWdodENoLCBjYWxsYmFjaywgc2lnbmFsKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5wb3N0b3JkZXJUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2ssIHNpZ25hbCkge1xyXG4gICAgICAgIGlmIChub2RlID09PSBudWxsIHx8IHNpZ25hbC5zdG9wKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3N0b3JkZXJUcmF2ZXJzYWxBdXgobm9kZS5sZWZ0Q2gsIGNhbGxiYWNrLCBzaWduYWwpO1xyXG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KG5vZGUucmlnaHRDaCwgY2FsbGJhY2ssIHNpZ25hbCk7XHJcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2lnbmFsLnN0b3AgPSBjYWxsYmFjayhub2RlLmVsZW1lbnQpID09PSBmYWxzZTtcclxuICAgIH07XHJcbiAgICBCU1RyZWVLVi5wcm90b3R5cGUubWluaW11bUF1eCA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgd2hpbGUgKG5vZGUgIT0gbnVsbCAmJiBub2RlLmxlZnRDaCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBub2RlID0gbm9kZS5sZWZ0Q2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfTtcclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5tYXhpbXVtQXV4ID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICB3aGlsZSAobm9kZSAhPSBudWxsICYmIG5vZGUucmlnaHRDaCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBub2RlID0gbm9kZS5yaWdodENoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEJTVHJlZUtWLnByb3RvdHlwZS5oZWlnaHRBdXggPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgIGlmIChub2RlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMuaGVpZ2h0QXV4KG5vZGUubGVmdENoKSwgdGhpcy5oZWlnaHRBdXgobm9kZS5yaWdodENoKSkgKyAxO1xyXG4gICAgfTtcclxuICAgIC8qXHJcbiAgICAqIEBwcml2YXRlXHJcbiAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLmluc2VydE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucm9vdDtcclxuICAgICAgICB3aGlsZSAocG9zaXRpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGNtcCA9IHRoaXMuY29tcGFyZShub2RlLmVsZW1lbnQsIHBvc2l0aW9uLmVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoY21wID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjbXAgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gcG9zaXRpb24ubGVmdENoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uLnJpZ2h0Q2g7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyB0cmVlIGlzIGVtcHR5XHJcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY29tcGFyZShub2RlLmVsZW1lbnQsIHBhcmVudC5lbGVtZW50KSA8IDApIHtcclxuICAgICAgICAgICAgcGFyZW50LmxlZnRDaCA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJlbnQucmlnaHRDaCA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgQlNUcmVlS1YucHJvdG90eXBlLmNyZWF0ZU5vZGUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXHJcbiAgICAgICAgICAgIGxlZnRDaDogbnVsbCxcclxuICAgICAgICAgICAgcmlnaHRDaDogbnVsbCxcclxuICAgICAgICAgICAgcGFyZW50OiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQlNUcmVlS1Y7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEJTVHJlZUtWO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1CU1RyZWVLVi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbnZhciBEaWN0aW9uYXJ5XzEgPSByZXF1aXJlKFwiLi9EaWN0aW9uYXJ5XCIpO1xyXG52YXIgU2V0XzEgPSByZXF1aXJlKFwiLi9TZXRcIik7XHJcbnZhciBCYWcgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgYmFnLlxyXG4gICAgICogQGNsYXNzIDxwPkEgYmFnIGlzIGEgc3BlY2lhbCBraW5kIG9mIHNldCBpbiB3aGljaCBtZW1iZXJzIGFyZVxyXG4gICAgICogYWxsb3dlZCB0byBhcHBlYXIgbW9yZSB0aGFuIG9uY2UuPC9wPlxyXG4gICAgICogPHA+SWYgdGhlIGluc2VydGVkIGVsZW1lbnRzIGFyZSBjdXN0b20gb2JqZWN0cyBhIGZ1bmN0aW9uXHJcbiAgICAgKiB3aGljaCBjb252ZXJ0cyBlbGVtZW50cyB0byB1bmlxdWUgc3RyaW5ncyBtdXN0IGJlIHByb3ZpZGVkLiBFeGFtcGxlOjwvcD5cclxuICAgICAqXHJcbiAgICAgKiA8cHJlPlxyXG4gICAgICogZnVuY3Rpb24gcGV0VG9TdHJpbmcocGV0KSB7XHJcbiAgICAgKiAgcmV0dXJuIHBldC5uYW1lO1xyXG4gICAgICogfVxyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6c3RyaW5nPX0gdG9TdHJGdW5jdGlvbiBvcHRpb25hbCBmdW5jdGlvbiB1c2VkXHJcbiAgICAgKiB0byBjb252ZXJ0IGVsZW1lbnRzIHRvIHN0cmluZ3MuIElmIHRoZSBlbGVtZW50cyBhcmVuJ3Qgc3RyaW5ncyBvciBpZiB0b1N0cmluZygpXHJcbiAgICAgKiBpcyBub3QgYXBwcm9wcmlhdGUsIGEgY3VzdG9tIGZ1bmN0aW9uIHdoaWNoIHJlY2VpdmVzIGFuIG9iamVjdCBhbmQgcmV0dXJucyBhXHJcbiAgICAgKiB1bmlxdWUgc3RyaW5nIG11c3QgYmUgcHJvdmlkZWQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEJhZyh0b1N0ckZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy50b1N0ckYgPSB0b1N0ckZ1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdFRvU3RyaW5nO1xyXG4gICAgICAgIHRoaXMuZGljdGlvbmFyeSA9IG5ldyBEaWN0aW9uYXJ5XzEuZGVmYXVsdCh0aGlzLnRvU3RyRik7XHJcbiAgICAgICAgdGhpcy5uRWxlbWVudHMgPSAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIG5Db3BpZXMgb2YgdGhlIHNwZWNpZmllZCBvYmplY3QgdG8gdGhpcyBiYWcuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBlbGVtZW50IHRvIGFkZC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gbkNvcGllcyB0aGUgbnVtYmVyIG9mIGNvcGllcyB0byBhZGQsIGlmIHRoaXMgYXJndW1lbnQgaXNcclxuICAgICAqIHVuZGVmaW5lZCAxIGNvcHkgaXMgYWRkZWQuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIHVubGVzcyBlbGVtZW50IGlzIHVuZGVmaW5lZC5cclxuICAgICAqL1xyXG4gICAgQmFnLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbWVudCwgbkNvcGllcykge1xyXG4gICAgICAgIGlmIChuQ29waWVzID09PSB2b2lkIDApIHsgbkNvcGllcyA9IDE7IH1cclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChlbGVtZW50KSB8fCBuQ29waWVzIDw9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnMoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogZWxlbWVudCxcclxuICAgICAgICAgICAgICAgIGNvcGllczogbkNvcGllc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLmRpY3Rpb25hcnkuc2V0VmFsdWUoZWxlbWVudCwgbm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRpY3Rpb25hcnkuZ2V0VmFsdWUoZWxlbWVudCkuY29waWVzICs9IG5Db3BpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubkVsZW1lbnRzICs9IG5Db3BpZXM7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb3VudHMgdGhlIG51bWJlciBvZiBjb3BpZXMgb2YgdGhlIHNwZWNpZmllZCBvYmplY3QgaW4gdGhpcyBiYWcuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCB0aGUgb2JqZWN0IHRvIHNlYXJjaCBmb3IuLlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGNvcGllcyBvZiB0aGUgb2JqZWN0LCAwIGlmIG5vdCBmb3VuZFxyXG4gICAgICovXHJcbiAgICBCYWcucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnMoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5LmdldFZhbHVlKGVsZW1lbnQpLmNvcGllcztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBiYWcgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgZWxlbWVudCB0byBzZWFyY2ggZm9yLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGJhZyBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQsXHJcbiAgICAgKiBmYWxzZSBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIEJhZy5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkuY29udGFpbnNLZXkoZWxlbWVudCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIG5Db3BpZXMgb2YgdGhlIHNwZWNpZmllZCBvYmplY3QgdG8gdGhpcyBiYWcuXHJcbiAgICAgKiBJZiB0aGUgbnVtYmVyIG9mIGNvcGllcyB0byByZW1vdmUgaXMgZ3JlYXRlciB0aGFuIHRoZSBhY3R1YWwgbnVtYmVyXHJcbiAgICAgKiBvZiBjb3BpZXMgaW4gdGhlIEJhZywgYWxsIGNvcGllcyBhcmUgcmVtb3ZlZC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IGVsZW1lbnQgdG8gcmVtb3ZlLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXI9fSBuQ29waWVzIHRoZSBudW1iZXIgb2YgY29waWVzIHRvIHJlbW92ZSwgaWYgdGhpcyBhcmd1bWVudCBpc1xyXG4gICAgICogdW5kZWZpbmVkIDEgY29weSBpcyByZW1vdmVkLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBhdCBsZWFzdCAxIGVsZW1lbnQgd2FzIHJlbW92ZWQuXHJcbiAgICAgKi9cclxuICAgIEJhZy5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG5Db3BpZXMpIHtcclxuICAgICAgICBpZiAobkNvcGllcyA9PT0gdm9pZCAwKSB7IG5Db3BpZXMgPSAxOyB9XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoZWxlbWVudCkgfHwgbkNvcGllcyA8PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5zKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5kaWN0aW9uYXJ5LmdldFZhbHVlKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAobkNvcGllcyA+IG5vZGUuY29waWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5FbGVtZW50cyAtPSBub2RlLmNvcGllcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubkVsZW1lbnRzIC09IG5Db3BpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZS5jb3BpZXMgLT0gbkNvcGllcztcclxuICAgICAgICAgICAgaWYgKG5vZGUuY29waWVzIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeS5yZW1vdmUoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgZWxlbWVudHMgaW4gdGhpcyBiaWcgaW4gYXJiaXRyYXJ5IG9yZGVyLFxyXG4gICAgICogaW5jbHVkaW5nIG11bHRpcGxlIGNvcGllcy5cclxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgZWxlbWVudHMgaW4gdGhpcyBiYWcuXHJcbiAgICAgKi9cclxuICAgIEJhZy5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYSA9IFtdO1xyXG4gICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLmRpY3Rpb25hcnkudmFsdWVzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCB2YWx1ZXNfMSA9IHZhbHVlczsgX2kgPCB2YWx1ZXNfMS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSB2YWx1ZXNfMVtfaV07XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbm9kZS52YWx1ZTtcclxuICAgICAgICAgICAgdmFyIGNvcGllcyA9IG5vZGUuY29waWVzO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvcGllczsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBhLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgc2V0IG9mIHVuaXF1ZSBlbGVtZW50cyBpbiB0aGlzIGJhZy5cclxuICAgICAqIEByZXR1cm4ge2NvbGxlY3Rpb25zLlNldDxUPn0gYSBzZXQgb2YgdW5pcXVlIGVsZW1lbnRzIGluIHRoaXMgYmFnLlxyXG4gICAgICovXHJcbiAgICBCYWcucHJvdG90eXBlLnRvU2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0b3JldCA9IG5ldyBTZXRfMS5kZWZhdWx0KHRoaXMudG9TdHJGKTtcclxuICAgICAgICB2YXIgZWxlbWVudHMgPSB0aGlzLmRpY3Rpb25hcnkudmFsdWVzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBlbGVtZW50c18xID0gZWxlbWVudHM7IF9pIDwgZWxlbWVudHNfMS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIGVsZSA9IGVsZW1lbnRzXzFbX2ldO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBlbGUudmFsdWU7XHJcbiAgICAgICAgICAgIHRvcmV0LmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b3JldDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnRcclxuICAgICAqIHByZXNlbnQgaW4gdGhpcyBiYWcsIGluY2x1ZGluZyBtdWx0aXBsZSBjb3BpZXMuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcclxuICAgICAqIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6IHRoZSBlbGVtZW50LiBUbyBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cclxuICAgICAqIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBCYWcucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLmRpY3Rpb25hcnkuZm9yRWFjaChmdW5jdGlvbiAoaywgdikge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2LnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgY29waWVzID0gdi5jb3BpZXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29waWVzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgYmFnLlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgYmFnLlxyXG4gICAgICovXHJcbiAgICBCYWcucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgYmFnIGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGJhZyBjb250YWlucyBubyBlbGVtZW50cy5cclxuICAgICAqL1xyXG4gICAgQmFnLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5FbGVtZW50cyA9PT0gMDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIG9mIHRoZSBlbGVtZW50cyBmcm9tIHRoaXMgYmFnLlxyXG4gICAgICovXHJcbiAgICBCYWcucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMubkVsZW1lbnRzID0gMDtcclxuICAgICAgICB0aGlzLmRpY3Rpb25hcnkuY2xlYXIoKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQmFnO1xyXG59KCkpOyAvLyBFbmQgb2YgYmFnXHJcbmV4cG9ydHMuZGVmYXVsdCA9IEJhZztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmFnLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB1dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcclxudmFyIERpY3Rpb25hcnkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgZGljdGlvbmFyeS5cclxuICAgICAqIEBjbGFzcyA8cD5EaWN0aW9uYXJpZXMgbWFwIGtleXMgdG8gdmFsdWVzOyBlYWNoIGtleSBjYW4gbWFwIHRvIGF0IG1vc3Qgb25lIHZhbHVlLlxyXG4gICAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiBhY2NlcHRzIGFueSBraW5kIG9mIG9iamVjdHMgYXMga2V5cy48L3A+XHJcbiAgICAgKlxyXG4gICAgICogPHA+SWYgdGhlIGtleXMgYXJlIGN1c3RvbSBvYmplY3RzIGEgZnVuY3Rpb24gd2hpY2ggY29udmVydHMga2V5cyB0byB1bmlxdWVcclxuICAgICAqIHN0cmluZ3MgbXVzdCBiZSBwcm92aWRlZC4gRXhhbXBsZTo8L3A+XHJcbiAgICAgKiA8cHJlPlxyXG4gICAgICogZnVuY3Rpb24gcGV0VG9TdHJpbmcocGV0KSB7XHJcbiAgICAgKiAgcmV0dXJuIHBldC5uYW1lO1xyXG4gICAgICogfVxyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KTpzdHJpbmc9fSB0b1N0ckZ1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWRcclxuICAgICAqIHRvIGNvbnZlcnQga2V5cyB0byBzdHJpbmdzLiBJZiB0aGUga2V5cyBhcmVuJ3Qgc3RyaW5ncyBvciBpZiB0b1N0cmluZygpXHJcbiAgICAgKiBpcyBub3QgYXBwcm9wcmlhdGUsIGEgY3VzdG9tIGZ1bmN0aW9uIHdoaWNoIHJlY2VpdmVzIGEga2V5IGFuZCByZXR1cm5zIGFcclxuICAgICAqIHVuaXF1ZSBzdHJpbmcgbXVzdCBiZSBwcm92aWRlZC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRGljdGlvbmFyeSh0b1N0ckZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy50YWJsZSA9IHt9O1xyXG4gICAgICAgIHRoaXMubkVsZW1lbnRzID0gMDtcclxuICAgICAgICB0aGlzLnRvU3RyID0gdG9TdHJGdW5jdGlvbiB8fCB1dGlsLmRlZmF1bHRUb1N0cmluZztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgdmFsdWUgdG8gd2hpY2ggdGhpcyBkaWN0aW9uYXJ5IG1hcHMgdGhlIHNwZWNpZmllZCBrZXkuXHJcbiAgICAgKiBSZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgbm8gbWFwcGluZyBmb3IgdGhpcyBrZXkuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aG9zZSBhc3NvY2lhdGVkIHZhbHVlIGlzIHRvIGJlIHJldHVybmVkLlxyXG4gICAgICogQHJldHVybiB7Kn0gdGhlIHZhbHVlIHRvIHdoaWNoIHRoaXMgZGljdGlvbmFyeSBtYXBzIHRoZSBzcGVjaWZpZWQga2V5IG9yXHJcbiAgICAgKiB1bmRlZmluZWQgaWYgdGhlIG1hcCBjb250YWlucyBubyBtYXBwaW5nIGZvciB0aGlzIGtleS5cclxuICAgICAqL1xyXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgdmFyIHBhaXIgPSB0aGlzLnRhYmxlWyckJyArIHRoaXMudG9TdHIoa2V5KV07XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQocGFpcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBhaXIudmFsdWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBBc3NvY2lhdGVzIHRoZSBzcGVjaWZpZWQgdmFsdWUgd2l0aCB0aGUgc3BlY2lmaWVkIGtleSBpbiB0aGlzIGRpY3Rpb25hcnkuXHJcbiAgICAgKiBJZiB0aGUgZGljdGlvbmFyeSBwcmV2aW91c2x5IGNvbnRhaW5lZCBhIG1hcHBpbmcgZm9yIHRoaXMga2V5LCB0aGUgb2xkXHJcbiAgICAgKiB2YWx1ZSBpcyByZXBsYWNlZCBieSB0aGUgc3BlY2lmaWVkIHZhbHVlLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2l0aCB3aGljaCB0aGUgc3BlY2lmaWVkIHZhbHVlIGlzIHRvIGJlXHJcbiAgICAgKiBhc3NvY2lhdGVkLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIHZhbHVlIHRvIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleS5cclxuICAgICAqIEByZXR1cm4geyp9IHByZXZpb3VzIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleSwgb3IgdW5kZWZpbmVkIGlmXHJcbiAgICAgKiB0aGVyZSB3YXMgbm8gbWFwcGluZyBmb3IgdGhlIGtleSBvciBpZiB0aGUga2V5L3ZhbHVlIGFyZSB1bmRlZmluZWQuXHJcbiAgICAgKi9cclxuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChrZXkpIHx8IHV0aWwuaXNVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXQ7XHJcbiAgICAgICAgdmFyIGsgPSAnJCcgKyB0aGlzLnRvU3RyKGtleSk7XHJcbiAgICAgICAgdmFyIHByZXZpb3VzRWxlbWVudCA9IHRoaXMudGFibGVba107XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQocHJldmlvdXNFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB0aGlzLm5FbGVtZW50cysrO1xyXG4gICAgICAgICAgICByZXQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXQgPSBwcmV2aW91c0VsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFibGVba10gPSB7XHJcbiAgICAgICAgICAgIGtleToga2V5LFxyXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBtYXBwaW5nIGZvciB0aGlzIGtleSBmcm9tIHRoaXMgZGljdGlvbmFyeSBpZiBpdCBpcyBwcmVzZW50LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2hvc2UgbWFwcGluZyBpcyB0byBiZSByZW1vdmVkIGZyb20gdGhlXHJcbiAgICAgKiBkaWN0aW9uYXJ5LlxyXG4gICAgICogQHJldHVybiB7Kn0gcHJldmlvdXMgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHNwZWNpZmllZCBrZXksIG9yIHVuZGVmaW5lZCBpZlxyXG4gICAgICogdGhlcmUgd2FzIG5vIG1hcHBpbmcgZm9yIGtleS5cclxuICAgICAqL1xyXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHZhciBrID0gJyQnICsgdGhpcy50b1N0cihrZXkpO1xyXG4gICAgICAgIHZhciBwcmV2aW91c0VsZW1lbnQgPSB0aGlzLnRhYmxlW2tdO1xyXG4gICAgICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZChwcmV2aW91c0VsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRhYmxlW2tdO1xyXG4gICAgICAgICAgICB0aGlzLm5FbGVtZW50cy0tO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJldmlvdXNFbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUga2V5cyBpbiB0aGlzIGRpY3Rpb25hcnkuXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGtleXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxyXG4gICAgICovXHJcbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIG5hbWVfMSBpbiB0aGlzLnRhYmxlKSB7XHJcbiAgICAgICAgICAgIGlmICh1dGlsLmhhcyh0aGlzLnRhYmxlLCBuYW1lXzEpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFpciA9IHRoaXMudGFibGVbbmFtZV8xXTtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gocGFpci5rZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIHZhbHVlcyBpbiB0aGlzIGRpY3Rpb25hcnkuXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIHZhbHVlcyBpbiB0aGlzIGRpY3Rpb25hcnkuXHJcbiAgICAgKi9cclxuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBuYW1lXzIgaW4gdGhpcy50YWJsZSkge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5oYXModGhpcy50YWJsZSwgbmFtZV8yKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhaXIgPSB0aGlzLnRhYmxlW25hbWVfMl07XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHBhaXIudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGtleS12YWx1ZSBwYWlyXHJcbiAgICAgKiBwcmVzZW50IGluIHRoaXMgZGljdGlvbmFyeS5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcclxuICAgICAqIGludm9rZWQgd2l0aCB0d28gYXJndW1lbnRzOiBrZXkgYW5kIHZhbHVlLiBUbyBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cclxuICAgICAqIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgbmFtZV8zIGluIHRoaXMudGFibGUpIHtcclxuICAgICAgICAgICAgaWYgKHV0aWwuaGFzKHRoaXMudGFibGUsIG5hbWVfMykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYWlyID0gdGhpcy50YWJsZVtuYW1lXzNdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IGNhbGxiYWNrKHBhaXIua2V5LCBwYWlyLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBjb250YWlucyBhIG1hcHBpbmcgZm9yIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2hvc2UgcHJlc2VuY2UgaW4gdGhpcyBkaWN0aW9uYXJ5IGlzIHRvIGJlXHJcbiAgICAgKiB0ZXN0ZWQuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBjb250YWlucyBhIG1hcHBpbmcgZm9yIHRoZVxyXG4gICAgICogc3BlY2lmaWVkIGtleS5cclxuICAgICAqL1xyXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUuY29udGFpbnNLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuICF1dGlsLmlzVW5kZWZpbmVkKHRoaXMuZ2V0VmFsdWUoa2V5KSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBtYXBwaW5ncyBmcm9tIHRoaXMgZGljdGlvbmFyeS5cclxuICAgICAqIEB0aGlzIHtjb2xsZWN0aW9ucy5EaWN0aW9uYXJ5fVxyXG4gICAgICovXHJcbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnRhYmxlID0ge307XHJcbiAgICAgICAgdGhpcy5uRWxlbWVudHMgPSAwO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGtleXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGtleS12YWx1ZSBtYXBwaW5ncyBpbiB0aGlzIGRpY3Rpb25hcnkuXHJcbiAgICAgKi9cclxuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBjb250YWlucyBubyBtYXBwaW5ncy5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGNvbnRhaW5zIG5vIG1hcHBpbmdzLlxyXG4gICAgICovXHJcbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5FbGVtZW50cyA8PSAwO1xyXG4gICAgfTtcclxuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0b3JldCA9ICd7JztcclxuICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGssIHYpIHtcclxuICAgICAgICAgICAgdG9yZXQgKz0gXCJcXG5cXHRcIiArIGsgKyBcIiA6IFwiICsgdjtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdG9yZXQgKyAnXFxufSc7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERpY3Rpb25hcnk7XHJcbn0oKSk7IC8vIEVuZCBvZiBkaWN0aW9uYXJ5XHJcbmV4cG9ydHMuZGVmYXVsdCA9IERpY3Rpb25hcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURpY3Rpb25hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBEaWN0aW9uYXJ5XzEgPSByZXF1aXJlKFwiLi9EaWN0aW9uYXJ5XCIpO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbnZhciBGYWN0b3J5RGljdGlvbmFyeSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhGYWN0b3J5RGljdGlvbmFyeSwgX3N1cGVyKTtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBkaWN0aW9uYXJ5LlxyXG4gICAgICogQGNsYXNzIDxwPkRpY3Rpb25hcmllcyBtYXAga2V5cyB0byB2YWx1ZXM7IGVhY2gga2V5IGNhbiBtYXAgdG8gYXQgbW9zdCBvbmUgdmFsdWUuXHJcbiAgICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIGFjY2VwdHMgYW55IGtpbmQgb2Ygb2JqZWN0cyBhcyBrZXlzLjwvcD5cclxuICAgICAqXHJcbiAgICAgKiA8cD5UaGUgZGVmYXVsdCBmYWN0b3J5IGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gYSBuZXcgb2JqZWN0IG9mIHRoZSBwcm92aWRlZFxyXG4gICAgICogdHlwZS4gRXhhbXBsZTo8L3A+XHJcbiAgICAgKiA8cHJlPlxyXG4gICAgICogZnVuY3Rpb24gcGV0RmFjdG9yeSgpIHtcclxuICAgICAqICByZXR1cm4gbmV3IFBldCgpO1xyXG4gICAgICogfVxyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKlxyXG4gICAgICogPHA+SWYgdGhlIGtleXMgYXJlIGN1c3RvbSBvYmplY3RzIGEgZnVuY3Rpb24gd2hpY2ggY29udmVydHMga2V5cyB0byB1bmlxdWVcclxuICAgICAqIHN0cmluZ3MgbXVzdCBiZSBwcm92aWRlZC4gRXhhbXBsZTo8L3A+XHJcbiAgICAgKiA8cHJlPlxyXG4gICAgICogZnVuY3Rpb24gcGV0VG9TdHJpbmcocGV0KSB7XHJcbiAgICAgKiAgcmV0dXJuIHBldC5uYW1lO1xyXG4gICAgICogfVxyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTpWPX0gZGVmYXVsdEZhY3RvcnlGdW5jdGlvbiBmdW5jdGlvbiB1c2VkIHRvIGNyZWF0ZSBhXHJcbiAgICAgKiBkZWZhdWx0IG9iamVjdC5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KTpzdHJpbmc9fSB0b1N0ckZ1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWRcclxuICAgICAqIHRvIGNvbnZlcnQga2V5cyB0byBzdHJpbmdzLiBJZiB0aGUga2V5cyBhcmVuJ3Qgc3RyaW5ncyBvciBpZiB0b1N0cmluZygpXHJcbiAgICAgKiBpcyBub3QgYXBwcm9wcmlhdGUsIGEgY3VzdG9tIGZ1bmN0aW9uIHdoaWNoIHJlY2VpdmVzIGEga2V5IGFuZCByZXR1cm5zIGFcclxuICAgICAqIHVuaXF1ZSBzdHJpbmcgbXVzdCBiZSBwcm92aWRlZC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRmFjdG9yeURpY3Rpb25hcnkoZGVmYXVsdEZhY3RvcnlGdW5jdGlvbiwgdG9TdHJGdW5jdGlvbikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHRvU3RyRnVuY3Rpb24pIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuZGVmYXVsdEZhY3RvcnlGdW5jdGlvbiA9IGRlZmF1bHRGYWN0b3J5RnVuY3Rpb247XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBBc3NvY2lhdGVzIHRoZSBzcGVjaWZpZWQgZGVmYXVsdCB2YWx1ZSB3aXRoIHRoZSBzcGVjaWZpZWQga2V5IGluIHRoaXMgZGljdGlvbmFyeSxcclxuICAgICAqIGlmIGl0IGRpZG4ndCBjb250YWluIHRoZSBrZXkgeWV0LiBJZiB0aGUga2V5IGV4aXN0ZWQsIHRoZSBleGlzdGluZyB2YWx1ZSB3aWxsIGJlIHVzZWQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aXRoIHdoaWNoIHRoZSBzcGVjaWZpZWQgdmFsdWUgaXMgdG8gYmVcclxuICAgICAqIGFzc29jaWF0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdFZhbHVlIGRlZmF1bHQgdmFsdWUgdG8gYmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAgICogQHJldHVybiB7Kn0gcHJldmlvdXMgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LCBvciB0aGUgZGVmYXVsdCB2YWx1ZSxcclxuICAgICAqIGlmIHRoZSBrZXkgZGlkbid0IGV4aXN0IHlldC5cclxuICAgICAqL1xyXG4gICAgRmFjdG9yeURpY3Rpb25hcnkucHJvdG90eXBlLnNldERlZmF1bHQgPSBmdW5jdGlvbiAoa2V5LCBkZWZhdWx0VmFsdWUpIHtcclxuICAgICAgICB2YXIgY3VycmVudFZhbHVlID0gX3N1cGVyLnByb3RvdHlwZS5nZXRWYWx1ZS5jYWxsKHRoaXMsIGtleSk7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoY3VycmVudFZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKGtleSwgZGVmYXVsdFZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHZhbHVlIHRvIHdoaWNoIHRoaXMgZGljdGlvbmFyeSBtYXBzIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAgICogUmV0dXJucyBhIGRlZmF1bHQgdmFsdWUgY3JlYXRlZCBieSB0aGUgZmFjdG9yeSBwYXNzZWQgaW4gdGhlIGNvbnN0cnVjdG9yLFxyXG4gICAgICogaWYgdGhpcyBkaWN0aW9uYXJ5IGNvbnRhaW5zIG5vIG1hcHBpbmcgZm9yIHRoaXMga2V5LiBUaGUgbWlzc2luZyBrZXkgd2lsbFxyXG4gICAgICogYXV0b21hdGljYWxseSBiZSBhZGRlZCB0byB0aGUgZGljdGlvbmFyeS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdob3NlIGFzc29jaWF0ZWQgdmFsdWUgaXMgdG8gYmUgcmV0dXJuZWQuXHJcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgdmFsdWUgdG8gd2hpY2ggdGhpcyBkaWN0aW9uYXJ5IG1hcHMgdGhlIHNwZWNpZmllZCBrZXkgb3JcclxuICAgICAqIGEgZGVmYXVsdCB2YWx1ZSBpZiB0aGUgbWFwIGNvbnRhaW5zIG5vIG1hcHBpbmcgZm9yIHRoaXMga2V5LlxyXG4gICAgICovXHJcbiAgICBGYWN0b3J5RGljdGlvbmFyeS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0RGVmYXVsdChrZXksIHRoaXMuZGVmYXVsdEZhY3RvcnlGdW5jdGlvbigpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRmFjdG9yeURpY3Rpb25hcnk7XHJcbn0oRGljdGlvbmFyeV8xLmRlZmF1bHQpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRmFjdG9yeURpY3Rpb25hcnk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUZhY3RvcnlEaWN0aW9uYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBjb2xsZWN0aW9ucyA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbnZhciBhcnJheXMgPSByZXF1aXJlKFwiLi9hcnJheXNcIik7XHJcbnZhciBIZWFwID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGVtcHR5IEhlYXAuXHJcbiAgICAgKiBAY2xhc3NcclxuICAgICAqIDxwPkEgaGVhcCBpcyBhIGJpbmFyeSB0cmVlLCB3aGVyZSB0aGUgbm9kZXMgbWFpbnRhaW4gdGhlIGhlYXAgcHJvcGVydHk6XHJcbiAgICAgKiBlYWNoIG5vZGUgaXMgc21hbGxlciB0aGFuIGVhY2ggb2YgaXRzIGNoaWxkcmVuIGFuZCB0aGVyZWZvcmUgYSBNaW5IZWFwXHJcbiAgICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIHVzZXMgYW4gYXJyYXkgdG8gc3RvcmUgZWxlbWVudHMuPC9wPlxyXG4gICAgICogPHA+SWYgdGhlIGluc2VydGVkIGVsZW1lbnRzIGFyZSBjdXN0b20gb2JqZWN0cyBhIGNvbXBhcmUgZnVuY3Rpb24gbXVzdCBiZSBwcm92aWRlZCxcclxuICAgICAqICBhdCBjb25zdHJ1Y3Rpb24gdGltZSwgb3RoZXJ3aXNlIHRoZSA8PSwgPT09IGFuZCA+PSBvcGVyYXRvcnMgYXJlXHJcbiAgICAgKiB1c2VkIHRvIGNvbXBhcmUgZWxlbWVudHMuIEV4YW1wbGU6PC9wPlxyXG4gICAgICpcclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiBmdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcclxuICAgICAqICBpZiAoYSBpcyBsZXNzIHRoYW4gYiBieSBzb21lIG9yZGVyaW5nIGNyaXRlcmlvbikge1xyXG4gICAgICogICAgIHJldHVybiAtMTtcclxuICAgICAqICB9IGlmIChhIGlzIGdyZWF0ZXIgdGhhbiBiIGJ5IHRoZSBvcmRlcmluZyBjcml0ZXJpb24pIHtcclxuICAgICAqICAgICByZXR1cm4gMTtcclxuICAgICAqICB9XHJcbiAgICAgKiAgLy8gYSBtdXN0IGJlIGVxdWFsIHRvIGJcclxuICAgICAqICByZXR1cm4gMDtcclxuICAgICAqIH1cclxuICAgICAqIDwvcHJlPlxyXG4gICAgICpcclxuICAgICAqIDxwPklmIGEgTWF4LUhlYXAgaXMgd2FudGVkIChncmVhdGVyIGVsZW1lbnRzIG9uIHRvcCkgeW91IGNhbiBhIHByb3ZpZGUgYVxyXG4gICAgICogcmV2ZXJzZSBjb21wYXJlIGZ1bmN0aW9uIHRvIGFjY29tcGxpc2ggdGhhdCBiZWhhdmlvci4gRXhhbXBsZTo8L3A+XHJcbiAgICAgKlxyXG4gICAgICogPHByZT5cclxuICAgICAqIGZ1bmN0aW9uIHJldmVyc2VDb21wYXJlKGEsIGIpIHtcclxuICAgICAqICBpZiAoYSBpcyBsZXNzIHRoYW4gYiBieSBzb21lIG9yZGVyaW5nIGNyaXRlcmlvbikge1xyXG4gICAgICogICAgIHJldHVybiAxO1xyXG4gICAgICogIH0gaWYgKGEgaXMgZ3JlYXRlciB0aGFuIGIgYnkgdGhlIG9yZGVyaW5nIGNyaXRlcmlvbikge1xyXG4gICAgICogICAgIHJldHVybiAtMTtcclxuICAgICAqICB9XHJcbiAgICAgKiAgLy8gYSBtdXN0IGJlIGVxdWFsIHRvIGJcclxuICAgICAqICByZXR1cm4gMDtcclxuICAgICAqIH1cclxuICAgICAqIDwvcHJlPlxyXG4gICAgICpcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpudW1iZXI9fSBjb21wYXJlRnVuY3Rpb24gb3B0aW9uYWxcclxuICAgICAqIGZ1bmN0aW9uIHVzZWQgdG8gY29tcGFyZSB0d28gZWxlbWVudHMuIE11c3QgcmV0dXJuIGEgbmVnYXRpdmUgaW50ZWdlcixcclxuICAgICAqIHplcm8sIG9yIGEgcG9zaXRpdmUgaW50ZWdlciBhcyB0aGUgZmlyc3QgYXJndW1lbnQgaXMgbGVzcyB0aGFuLCBlcXVhbCB0byxcclxuICAgICAqIG9yIGdyZWF0ZXIgdGhhbiB0aGUgc2Vjb25kLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBIZWFwKGNvbXBhcmVGdW5jdGlvbikge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5IHVzZWQgdG8gc3RvcmUgdGhlIGVsZW1lbnRzIG9mIHRoZSBoZWFwLlxyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn1cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29tcGFyZSA9IGNvbXBhcmVGdW5jdGlvbiB8fCBjb2xsZWN0aW9ucy5kZWZhdWx0Q29tcGFyZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGxlZnQgY2hpbGQgb2YgdGhlIG5vZGUgYXQgdGhlIGdpdmVuIGluZGV4LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5vZGVJbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gZ2V0IHRoZSBsZWZ0IGNoaWxkXHJcbiAgICAgKiBmb3IuXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBpbmRleCBvZiB0aGUgbGVmdCBjaGlsZC5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEhlYXAucHJvdG90eXBlLmxlZnRDaGlsZEluZGV4ID0gZnVuY3Rpb24gKG5vZGVJbmRleCkge1xyXG4gICAgICAgIHJldHVybiAoMiAqIG5vZGVJbmRleCkgKyAxO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIHJpZ2h0IGNoaWxkIG9mIHRoZSBub2RlIGF0IHRoZSBnaXZlbiBpbmRleC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBub2RlSW5kZXggVGhlIGluZGV4IG9mIHRoZSBub2RlIHRvIGdldCB0aGUgcmlnaHQgY2hpbGRcclxuICAgICAqIGZvci5cclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGluZGV4IG9mIHRoZSByaWdodCBjaGlsZC5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEhlYXAucHJvdG90eXBlLnJpZ2h0Q2hpbGRJbmRleCA9IGZ1bmN0aW9uIChub2RlSW5kZXgpIHtcclxuICAgICAgICByZXR1cm4gKDIgKiBub2RlSW5kZXgpICsgMjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBwYXJlbnQgb2YgdGhlIG5vZGUgYXQgdGhlIGdpdmVuIGluZGV4LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5vZGVJbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gZ2V0IHRoZSBwYXJlbnQgZm9yLlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgaW5kZXggb2YgdGhlIHBhcmVudC5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEhlYXAucHJvdG90eXBlLnBhcmVudEluZGV4ID0gZnVuY3Rpb24gKG5vZGVJbmRleCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKChub2RlSW5kZXggLSAxKSAvIDIpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIHNtYWxsZXIgY2hpbGQgbm9kZSAoaWYgaXQgZXhpc3RzKS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0Q2hpbGQgbGVmdCBjaGlsZCBpbmRleC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByaWdodENoaWxkIHJpZ2h0IGNoaWxkIGluZGV4LlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW5kZXggd2l0aCB0aGUgbWluaW11bSB2YWx1ZSBvciAtMSBpZiBpdCBkb2Vzbid0XHJcbiAgICAgKiBleGlzdHMuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBIZWFwLnByb3RvdHlwZS5taW5JbmRleCA9IGZ1bmN0aW9uIChsZWZ0Q2hpbGQsIHJpZ2h0Q2hpbGQpIHtcclxuICAgICAgICBpZiAocmlnaHRDaGlsZCA+PSB0aGlzLmRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmIChsZWZ0Q2hpbGQgPj0gdGhpcy5kYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRDaGlsZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29tcGFyZSh0aGlzLmRhdGFbbGVmdENoaWxkXSwgdGhpcy5kYXRhW3JpZ2h0Q2hpbGRdKSA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdENoaWxkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJpZ2h0Q2hpbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBNb3ZlcyB0aGUgbm9kZSBhdCB0aGUgZ2l2ZW4gaW5kZXggdXAgdG8gaXRzIHByb3BlciBwbGFjZSBpbiB0aGUgaGVhcC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gbW92ZSB1cC5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIEhlYXAucHJvdG90eXBlLnNpZnRVcCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudEluZGV4KGluZGV4KTtcclxuICAgICAgICB3aGlsZSAoaW5kZXggPiAwICYmIHRoaXMuY29tcGFyZSh0aGlzLmRhdGFbcGFyZW50XSwgdGhpcy5kYXRhW2luZGV4XSkgPiAwKSB7XHJcbiAgICAgICAgICAgIGFycmF5cy5zd2FwKHRoaXMuZGF0YSwgcGFyZW50LCBpbmRleCk7XHJcbiAgICAgICAgICAgIGluZGV4ID0gcGFyZW50O1xyXG4gICAgICAgICAgICBwYXJlbnQgPSB0aGlzLnBhcmVudEluZGV4KGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBNb3ZlcyB0aGUgbm9kZSBhdCB0aGUgZ2l2ZW4gaW5kZXggZG93biB0byBpdHMgcHJvcGVyIHBsYWNlIGluIHRoZSBoZWFwLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG5vZGVJbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gbW92ZSBkb3duLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgSGVhcC5wcm90b3R5cGUuc2lmdERvd24gPSBmdW5jdGlvbiAobm9kZUluZGV4KSB7XHJcbiAgICAgICAgLy9zbWFsbGVyIGNoaWxkIGluZGV4XHJcbiAgICAgICAgdmFyIG1pbiA9IHRoaXMubWluSW5kZXgodGhpcy5sZWZ0Q2hpbGRJbmRleChub2RlSW5kZXgpLCB0aGlzLnJpZ2h0Q2hpbGRJbmRleChub2RlSW5kZXgpKTtcclxuICAgICAgICB3aGlsZSAobWluID49IDAgJiYgdGhpcy5jb21wYXJlKHRoaXMuZGF0YVtub2RlSW5kZXhdLCB0aGlzLmRhdGFbbWluXSkgPiAwKSB7XHJcbiAgICAgICAgICAgIGFycmF5cy5zd2FwKHRoaXMuZGF0YSwgbWluLCBub2RlSW5kZXgpO1xyXG4gICAgICAgICAgICBub2RlSW5kZXggPSBtaW47XHJcbiAgICAgICAgICAgIG1pbiA9IHRoaXMubWluSW5kZXgodGhpcy5sZWZ0Q2hpbGRJbmRleChub2RlSW5kZXgpLCB0aGlzLnJpZ2h0Q2hpbGRJbmRleChub2RlSW5kZXgpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgYnV0IGRvZXMgbm90IHJlbW92ZSB0aGUgcm9vdCBlbGVtZW50IG9mIHRoaXMgaGVhcC5cclxuICAgICAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSBhdCB0aGUgcm9vdCBvZiB0aGUgaGVhcC4gUmV0dXJucyB1bmRlZmluZWQgaWYgdGhlXHJcbiAgICAgKiBoZWFwIGlzIGVtcHR5LlxyXG4gICAgICovXHJcbiAgICBIZWFwLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBnaXZlbiBlbGVtZW50IGludG8gdGhlIGhlYXAuXHJcbiAgICAgKiBAcGFyYW0geyp9IGVsZW1lbnQgdGhlIGVsZW1lbnQuXHJcbiAgICAgKiBAcmV0dXJuIHRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIGFkZGVkIG9yIGZhbHMgaWYgaXQgaXMgdW5kZWZpbmVkLlxyXG4gICAgICovXHJcbiAgICBIZWFwLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIGlmIChjb2xsZWN0aW9ucy5pc1VuZGVmaW5lZChlbGVtZW50KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGF0YS5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuc2lmdFVwKHRoaXMuZGF0YS5sZW5ndGggLSAxKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyBhbmQgcmVtb3ZlcyB0aGUgcm9vdCBlbGVtZW50IG9mIHRoaXMgaGVhcC5cclxuICAgICAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSByZW1vdmVkIGZyb20gdGhlIHJvb3Qgb2YgdGhlIGhlYXAuIFJldHVybnNcclxuICAgICAqIHVuZGVmaW5lZCBpZiB0aGUgaGVhcCBpcyBlbXB0eS5cclxuICAgICAqL1xyXG4gICAgSGVhcC5wcm90b3R5cGUucmVtb3ZlUm9vdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGF0YVswXTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhWzBdID0gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNwbGljZSh0aGlzLmRhdGEubGVuZ3RoIC0gMSwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaWZ0RG93bigwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgaGVhcCBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBlbGVtZW50IHRvIHNlYXJjaCBmb3IuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgSGVhcCBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQsIGZhbHNlXHJcbiAgICAgKiBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIEhlYXAucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgZXF1RiA9IGNvbGxlY3Rpb25zLmNvbXBhcmVUb0VxdWFscyh0aGlzLmNvbXBhcmUpO1xyXG4gICAgICAgIHJldHVybiBhcnJheXMuY29udGFpbnModGhpcy5kYXRhLCBlbGVtZW50LCBlcXVGKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGhlYXAuXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBoZWFwLlxyXG4gICAgICovXHJcbiAgICBIZWFwLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIHRoaXMgaGVhcCBpcyBlbXB0eS5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5kIG9ubHkgaWYgdGhpcyBoZWFwIGNvbnRhaW5zIG5vIGl0ZW1zOyBmYWxzZVxyXG4gICAgICogb3RoZXJ3aXNlLlxyXG4gICAgICovXHJcbiAgICBIZWFwLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoIDw9IDA7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBvZiB0aGUgZWxlbWVudHMgZnJvbSB0aGlzIGhlYXAuXHJcbiAgICAgKi9cclxuICAgIEhlYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZGF0YS5sZW5ndGggPSAwO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudCBwcmVzZW50IGluIHRoaXMgaGVhcCBpblxyXG4gICAgICogbm8gcGFydGljdWxhciBvcmRlci5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xyXG4gICAgICogaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxyXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIEhlYXAucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICBhcnJheXMuZm9yRWFjaCh0aGlzLmRhdGEsIGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gSGVhcDtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gSGVhcDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SGVhcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoXCIuL0RpY3Rpb25hcnlcIik7XHJcbnZhciB1dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcclxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgaXMgdXNlZCBieSB0aGUgTGlua2VkRGljdGlvbmFyeSBJbnRlcm5hbGx5XHJcbiAqIEhhcyB0byBiZSBhIGNsYXNzLCBub3QgYW4gaW50ZXJmYWNlLCBiZWNhdXNlIGl0IG5lZWRzIHRvIGhhdmVcclxuICogdGhlICd1bmxpbmsnIGZ1bmN0aW9uIGRlZmluZWQuXHJcbiAqL1xyXG52YXIgTGlua2VkRGljdGlvbmFyeVBhaXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBMaW5rZWREaWN0aW9uYXJ5UGFpcihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgTGlua2VkRGljdGlvbmFyeVBhaXIucHJvdG90eXBlLnVubGluayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnByZXYubmV4dCA9IHRoaXMubmV4dDtcclxuICAgICAgICB0aGlzLm5leHQucHJldiA9IHRoaXMucHJldjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlua2VkRGljdGlvbmFyeVBhaXI7XHJcbn0oKSk7XHJcbi8qKlxyXG4gKiBUaGUgaGVhZCBhbmQgdGFpbCBlbGVtZW50cyBvZiB0aGUgbGlzdCBoYXZlIG51bGwga2V5IGFuZCB2YWx1ZSBwcm9wZXJ0aWVzIGJ1dCB0aGV5XHJcbiAqIHVzdWFsbHkgbGluayB0byBub3JtYWwgbm9kZXMuXHJcbiAqL1xyXG52YXIgSGVhZE9yVGFpbExpbmtlZERpY3Rpb25hcnlQYWlyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gSGVhZE9yVGFpbExpbmtlZERpY3Rpb25hcnlQYWlyKCkge1xyXG4gICAgICAgIHRoaXMua2V5ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcclxuICAgIH1cclxuICAgIEhlYWRPclRhaWxMaW5rZWREaWN0aW9uYXJ5UGFpci5wcm90b3R5cGUudW5saW5rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJldi5uZXh0ID0gdGhpcy5uZXh0O1xyXG4gICAgICAgIHRoaXMubmV4dC5wcmV2ID0gdGhpcy5wcmV2O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBIZWFkT3JUYWlsTGlua2VkRGljdGlvbmFyeVBhaXI7XHJcbn0oKSk7XHJcbmZ1bmN0aW9uIGlzSGVhZE9yVGFpbExpbmtlZERpY3Rpb25hcnlQYWlyKHApIHtcclxuICAgIHJldHVybiAhcC5uZXh0O1xyXG59XHJcbnZhciBMaW5rZWREaWN0aW9uYXJ5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKExpbmtlZERpY3Rpb25hcnksIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBMaW5rZWREaWN0aW9uYXJ5KHRvU3RyRnVuY3Rpb24pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0b1N0ckZ1bmN0aW9uKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmhlYWQgPSBuZXcgSGVhZE9yVGFpbExpbmtlZERpY3Rpb25hcnlQYWlyKCk7XHJcbiAgICAgICAgX3RoaXMudGFpbCA9IG5ldyBIZWFkT3JUYWlsTGlua2VkRGljdGlvbmFyeVBhaXIoKTtcclxuICAgICAgICBfdGhpcy5oZWFkLm5leHQgPSBfdGhpcy50YWlsO1xyXG4gICAgICAgIF90aGlzLnRhaWwucHJldiA9IF90aGlzLmhlYWQ7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnRzIHRoZSBuZXcgbm9kZSB0byB0aGUgJ3RhaWwnIG9mIHRoZSBsaXN0LCB1cGRhdGluZyB0aGVcclxuICAgICAqIG5laWdoYm9ycywgYW5kIG1vdmluZyAndGhpcy50YWlsJyAodGhlIEVuZCBvZiBMaXN0IGluZGljYXRvcikgdGhhdFxyXG4gICAgICogdG8gdGhlIGVuZC5cclxuICAgICAqL1xyXG4gICAgTGlua2VkRGljdGlvbmFyeS5wcm90b3R5cGUuYXBwZW5kVG9UYWlsID0gZnVuY3Rpb24gKGVudHJ5KSB7XHJcbiAgICAgICAgdmFyIGxhc3ROb2RlID0gdGhpcy50YWlsLnByZXY7XHJcbiAgICAgICAgbGFzdE5vZGUubmV4dCA9IGVudHJ5O1xyXG4gICAgICAgIGVudHJ5LnByZXYgPSBsYXN0Tm9kZTtcclxuICAgICAgICBlbnRyeS5uZXh0ID0gdGhpcy50YWlsO1xyXG4gICAgICAgIHRoaXMudGFpbC5wcmV2ID0gZW50cnk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgYSBsaW5rZWQgZGljdGlvbmFyeSBmcm9tIHRoZSB0YWJsZSBpbnRlcm5hbGx5XHJcbiAgICAgKi9cclxuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLmdldExpbmtlZERpY3Rpb25hcnlQYWlyID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGtleSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGsgPSAnJCcgKyB0aGlzLnRvU3RyKGtleSk7XHJcbiAgICAgICAgdmFyIHBhaXIgPSAodGhpcy50YWJsZVtrXSk7XHJcbiAgICAgICAgcmV0dXJuIHBhaXI7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSB0byB3aGljaCB0aGlzIGRpY3Rpb25hcnkgbWFwcyB0aGUgc3BlY2lmaWVkIGtleS5cclxuICAgICAqIFJldHVybnMgdW5kZWZpbmVkIGlmIHRoaXMgZGljdGlvbmFyeSBjb250YWlucyBubyBtYXBwaW5nIGZvciB0aGlzIGtleS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdob3NlIGFzc29jaWF0ZWQgdmFsdWUgaXMgdG8gYmUgcmV0dXJuZWQuXHJcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgdmFsdWUgdG8gd2hpY2ggdGhpcyBkaWN0aW9uYXJ5IG1hcHMgdGhlIHNwZWNpZmllZCBrZXkgb3JcclxuICAgICAqIHVuZGVmaW5lZCBpZiB0aGUgbWFwIGNvbnRhaW5zIG5vIG1hcHBpbmcgZm9yIHRoaXMga2V5LlxyXG4gICAgICovXHJcbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICB2YXIgcGFpciA9IHRoaXMuZ2V0TGlua2VkRGljdGlvbmFyeVBhaXIoa2V5KTtcclxuICAgICAgICBpZiAoIXV0aWwuaXNVbmRlZmluZWQocGFpcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhaXIudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBtYXBwaW5nIGZvciB0aGlzIGtleSBmcm9tIHRoaXMgZGljdGlvbmFyeSBpZiBpdCBpcyBwcmVzZW50LlxyXG4gICAgICogQWxzbywgaWYgYSB2YWx1ZSBpcyBwcmVzZW50IGZvciB0aGlzIGtleSwgdGhlIGVudHJ5IGlzIHJlbW92ZWQgZnJvbSB0aGVcclxuICAgICAqIGluc2VydGlvbiBvcmRlcmluZy5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdob3NlIG1hcHBpbmcgaXMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZVxyXG4gICAgICogZGljdGlvbmFyeS5cclxuICAgICAqIEByZXR1cm4geyp9IHByZXZpb3VzIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBzcGVjaWZpZWQga2V5LCBvciB1bmRlZmluZWQgaWZcclxuICAgICAqIHRoZXJlIHdhcyBubyBtYXBwaW5nIGZvciBrZXkuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICB2YXIgcGFpciA9IHRoaXMuZ2V0TGlua2VkRGljdGlvbmFyeVBhaXIoa2V5KTtcclxuICAgICAgICBpZiAoIXV0aWwuaXNVbmRlZmluZWQocGFpcikpIHtcclxuICAgICAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5yZW1vdmUuY2FsbCh0aGlzLCBrZXkpOyAvLyBUaGlzIHdpbGwgcmVtb3ZlIGl0IGZyb20gdGhlIHRhYmxlXHJcbiAgICAgICAgICAgIHBhaXIudW5saW5rKCk7IC8vIFRoaXMgd2lsbCB1bmxpbmsgaXQgZnJvbSB0aGUgY2hhaW5cclxuICAgICAgICAgICAgcmV0dXJuIHBhaXIudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBtYXBwaW5ncyBmcm9tIHRoaXMgTGlua2VkRGljdGlvbmFyeS5cclxuICAgICAqIEB0aGlzIHtjb2xsZWN0aW9ucy5MaW5rZWREaWN0aW9uYXJ5fVxyXG4gICAgICovXHJcbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmNsZWFyLmNhbGwodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oZWFkLm5leHQgPSB0aGlzLnRhaWw7XHJcbiAgICAgICAgdGhpcy50YWlsLnByZXYgPSB0aGlzLmhlYWQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB1c2VkIHdoZW4gdXBkYXRpbmcgYW4gZXhpc3RpbmcgS2V5VmFsdWUgcGFpci5cclxuICAgICAqIEl0IHBsYWNlcyB0aGUgbmV3IHZhbHVlIGluZGV4ZWQgYnkga2V5IGludG8gdGhlIHRhYmxlLCBidXQgbWFpbnRhaW5zXHJcbiAgICAgKiBpdHMgcGxhY2UgaW4gdGhlIGxpbmtlZCBvcmRlcmluZy5cclxuICAgICAqL1xyXG4gICAgTGlua2VkRGljdGlvbmFyeS5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uIChvbGRQYWlyLCBuZXdQYWlyKSB7XHJcbiAgICAgICAgdmFyIGsgPSAnJCcgKyB0aGlzLnRvU3RyKG5ld1BhaXIua2V5KTtcclxuICAgICAgICAvLyBzZXQgdGhlIG5ldyBQYWlyJ3MgbGlua3MgdG8gZXhpc3RpbmdQYWlyJ3MgbGlua3NcclxuICAgICAgICBuZXdQYWlyLm5leHQgPSBvbGRQYWlyLm5leHQ7XHJcbiAgICAgICAgbmV3UGFpci5wcmV2ID0gb2xkUGFpci5wcmV2O1xyXG4gICAgICAgIC8vIERlbGV0ZSBFeGlzdGluZyBQYWlyIGZyb20gdGhlIHRhYmxlLCB1bmxpbmsgaXQgZnJvbSBjaGFpbi5cclxuICAgICAgICAvLyBBcyBhIHJlc3VsdCwgdGhlIG5FbGVtZW50cyBnZXRzIGRlY3JlbWVudGVkIGJ5IHRoaXMgb3BlcmF0aW9uXHJcbiAgICAgICAgdGhpcy5yZW1vdmUob2xkUGFpci5rZXkpO1xyXG4gICAgICAgIC8vIExpbmsgbmV3IFBhaXIgaW4gcGxhY2Ugb2Ygd2hlcmUgb2xkUGFpciB3YXMsXHJcbiAgICAgICAgLy8gYnkgcG9pbnRpbmcgdGhlIG9sZCBwYWlyJ3MgbmVpZ2hib3JzIHRvIGl0LlxyXG4gICAgICAgIG5ld1BhaXIucHJldi5uZXh0ID0gbmV3UGFpcjtcclxuICAgICAgICBuZXdQYWlyLm5leHQucHJldiA9IG5ld1BhaXI7XHJcbiAgICAgICAgdGhpcy50YWJsZVtrXSA9IG5ld1BhaXI7XHJcbiAgICAgICAgLy8gVG8gbWFrZSB1cCBmb3IgdGhlIGZhY3QgdGhhdCB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHdhcyBkZWNyZW1lbnRlZCxcclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGluY3JlYXNlIGl0IGJ5IG9uZS5cclxuICAgICAgICArK3RoaXMubkVsZW1lbnRzO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQXNzb2NpYXRlcyB0aGUgc3BlY2lmaWVkIHZhbHVlIHdpdGggdGhlIHNwZWNpZmllZCBrZXkgaW4gdGhpcyBkaWN0aW9uYXJ5LlxyXG4gICAgICogSWYgdGhlIGRpY3Rpb25hcnkgcHJldmlvdXNseSBjb250YWluZWQgYSBtYXBwaW5nIGZvciB0aGlzIGtleSwgdGhlIG9sZFxyXG4gICAgICogdmFsdWUgaXMgcmVwbGFjZWQgYnkgdGhlIHNwZWNpZmllZCB2YWx1ZS5cclxuICAgICAqIFVwZGF0aW5nIG9mIGEga2V5IHRoYXQgYWxyZWFkeSBleGlzdHMgbWFpbnRhaW5zIGl0cyBwbGFjZSBpbiB0aGVcclxuICAgICAqIGluc2VydGlvbiBvcmRlciBpbnRvIHRoZSBtYXAuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aXRoIHdoaWNoIHRoZSBzcGVjaWZpZWQgdmFsdWUgaXMgdG8gYmVcclxuICAgICAqIGFzc29jaWF0ZWQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgdmFsdWUgdG8gYmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAgICogQHJldHVybiB7Kn0gcHJldmlvdXMgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LCBvciB1bmRlZmluZWQgaWZcclxuICAgICAqIHRoZXJlIHdhcyBubyBtYXBwaW5nIGZvciB0aGUga2V5IG9yIGlmIHRoZSBrZXkvdmFsdWUgYXJlIHVuZGVmaW5lZC5cclxuICAgICAqL1xyXG4gICAgTGlua2VkRGljdGlvbmFyeS5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGtleSkgfHwgdXRpbC5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGV4aXN0aW5nUGFpciA9IHRoaXMuZ2V0TGlua2VkRGljdGlvbmFyeVBhaXIoa2V5KTtcclxuICAgICAgICB2YXIgbmV3UGFpciA9IG5ldyBMaW5rZWREaWN0aW9uYXJ5UGFpcihrZXksIHZhbHVlKTtcclxuICAgICAgICB2YXIgayA9ICckJyArIHRoaXMudG9TdHIoa2V5KTtcclxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGFuIGVsZW1lbnQgZm9yIHRoYXQga2V5LCB3ZVxyXG4gICAgICAgIC8vIGtlZXAgaXQncyBwbGFjZSBpbiB0aGUgTGlua2VkTGlzdFxyXG4gICAgICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZChleGlzdGluZ1BhaXIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVwbGFjZShleGlzdGluZ1BhaXIsIG5ld1BhaXIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdQYWlyLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5hcHBlbmRUb1RhaWwobmV3UGFpcik7XHJcbiAgICAgICAgICAgIHRoaXMudGFibGVba10gPSBuZXdQYWlyO1xyXG4gICAgICAgICAgICArK3RoaXMubkVsZW1lbnRzO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGtleXMgaW4gdGhpcyBMaW5rZWREaWN0aW9uYXJ5LCBvcmRlcmVkXHJcbiAgICAgKiBieSBpbnNlcnRpb24gb3JkZXIuXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGtleXMgaW4gdGhpcyBMaW5rZWREaWN0aW9uYXJ5LFxyXG4gICAgICogb3JkZXJlZCBieSBpbnNlcnRpb24gb3JkZXIuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goa2V5KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB2YWx1ZXMgaW4gdGhpcyBMaW5rZWREaWN0aW9uYXJ5LCBvcmRlcmVkIGJ5XHJcbiAgICAgKiBpbnNlcnRpb24gb3JkZXIuXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIHZhbHVlcyBpbiB0aGlzIExpbmtlZERpY3Rpb25hcnksXHJcbiAgICAgKiBvcmRlcmVkIGJ5IGluc2VydGlvbiBvcmRlci5cclxuICAgICAqL1xyXG4gICAgTGlua2VkRGljdGlvbmFyeS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBrZXktdmFsdWUgcGFpclxyXG4gICAgICogcHJlc2VudCBpbiB0aGlzIExpbmtlZERpY3Rpb25hcnkuIEl0IGlzIGRvbmUgaW4gdGhlIG9yZGVyIG9mIGluc2VydGlvblxyXG4gICAgICogaW50byB0aGUgTGlua2VkRGljdGlvbmFyeVxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xyXG4gICAgICogaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM6IGtleSBhbmQgdmFsdWUuIFRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxyXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgY3Jhd2xOb2RlID0gdGhpcy5oZWFkLm5leHQ7XHJcbiAgICAgICAgd2hpbGUgKCFpc0hlYWRPclRhaWxMaW5rZWREaWN0aW9uYXJ5UGFpcihjcmF3bE5vZGUpKSB7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSBjYWxsYmFjayhjcmF3bE5vZGUua2V5LCBjcmF3bE5vZGUudmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAocmV0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNyYXdsTm9kZSA9IGNyYXdsTm9kZS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlua2VkRGljdGlvbmFyeTtcclxufShEaWN0aW9uYXJ5XzEuZGVmYXVsdCkpOyAvLyBFbmQgb2YgTGlua2VkRGljdGlvbmFyeVxyXG5leHBvcnRzLmRlZmF1bHQgPSBMaW5rZWREaWN0aW9uYXJ5O1xyXG4vLyAvKipcclxuLy8gICogUmV0dXJucyB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gZGljdGlvbmFyeS5cclxuLy8gICogVHdvIGRpY3Rpb25hcmllcyBhcmUgZXF1YWwgaWYgdGhleSBjb250YWluIHRoZSBzYW1lIG1hcHBpbmdzLlxyXG4vLyAgKiBAcGFyYW0ge2NvbGxlY3Rpb25zLkRpY3Rpb25hcnl9IG90aGVyIHRoZSBvdGhlciBkaWN0aW9uYXJ5LlxyXG4vLyAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSB2YWx1ZXNFcXVhbEZ1bmN0aW9uIG9wdGlvbmFsXHJcbi8vICAqIGZ1bmN0aW9uIHVzZWQgdG8gY2hlY2sgaWYgdHdvIHZhbHVlcyBhcmUgZXF1YWwuXHJcbi8vICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGlzIGVxdWFsIHRvIHRoZSBnaXZlbiBkaWN0aW9uYXJ5LlxyXG4vLyAgKi9cclxuLy8gY29sbGVjdGlvbnMuRGljdGlvbmFyeS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24ob3RoZXIsdmFsdWVzRXF1YWxGdW5jdGlvbikge1xyXG4vLyBcdGNvbnN0IGVxRiA9IHZhbHVlc0VxdWFsRnVuY3Rpb24gfHwgY29sbGVjdGlvbnMuZGVmYXVsdEVxdWFscztcclxuLy8gXHRpZighKG90aGVyIGluc3RhbmNlb2YgY29sbGVjdGlvbnMuRGljdGlvbmFyeSkpe1xyXG4vLyBcdFx0cmV0dXJuIGZhbHNlO1xyXG4vLyBcdH1cclxuLy8gXHRpZih0aGlzLnNpemUoKSAhPT0gb3RoZXIuc2l6ZSgpKXtcclxuLy8gXHRcdHJldHVybiBmYWxzZTtcclxuLy8gXHR9XHJcbi8vIFx0cmV0dXJuIHRoaXMuZXF1YWxzQXV4KHRoaXMuZmlyc3ROb2RlLG90aGVyLmZpcnN0Tm9kZSxlcUYpO1xyXG4vLyB9XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxpbmtlZERpY3Rpb25hcnkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHV0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xyXG52YXIgYXJyYXlzID0gcmVxdWlyZShcIi4vYXJyYXlzXCIpO1xyXG52YXIgTGlua2VkTGlzdCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBMaW5rZWQgTGlzdC5cclxuICAgICAqIEBjbGFzcyBBIGxpbmtlZCBsaXN0IGlzIGEgZGF0YSBzdHJ1Y3R1cmUgY29uc2lzdGluZyBvZiBhIGdyb3VwIG9mIG5vZGVzXHJcbiAgICAgKiB3aGljaCB0b2dldGhlciByZXByZXNlbnQgYSBzZXF1ZW5jZS5cclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBMaW5rZWRMaXN0KCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEZpcnN0IG5vZGUgaW4gdGhlIGxpc3RcclxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5maXJzdE5vZGUgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExhc3Qgbm9kZSBpbiB0aGUgbGlzdFxyXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxhc3ROb2RlID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBOdW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGxpc3RcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5uRWxlbWVudHMgPSAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGFuIGVsZW1lbnQgdG8gdGhpcyBsaXN0LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gZWxlbWVudCB0byBiZSBhZGRlZC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gaW5kZXggb3B0aW9uYWwgaW5kZXggdG8gYWRkIHRoZSBlbGVtZW50LiBJZiBubyBpbmRleCBpcyBzcGVjaWZpZWRcclxuICAgICAqIHRoZSBlbGVtZW50IGlzIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhpcyBsaXN0LlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgYWRkZWQgb3IgZmFsc2UgaWYgdGhlIGluZGV4IGlzIGludmFsaWRcclxuICAgICAqIG9yIGlmIHRoZSBlbGVtZW50IGlzIHVuZGVmaW5lZC5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoaW5kZXgpKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5uRWxlbWVudHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLm5FbGVtZW50cyB8fCB1dGlsLmlzVW5kZWZpbmVkKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld05vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoaXRlbSk7XHJcbiAgICAgICAgaWYgKHRoaXMubkVsZW1lbnRzID09PSAwIHx8IHRoaXMubGFzdE5vZGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gRmlyc3Qgbm9kZSBpbiB0aGUgbGlzdC5cclxuICAgICAgICAgICAgdGhpcy5maXJzdE5vZGUgPSBuZXdOb2RlO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3ROb2RlID0gbmV3Tm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaW5kZXggPT09IHRoaXMubkVsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgIC8vIEluc2VydCBhdCB0aGUgZW5kLlxyXG4gICAgICAgICAgICB0aGlzLmxhc3ROb2RlLm5leHQgPSBuZXdOb2RlO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3ROb2RlID0gbmV3Tm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gQ2hhbmdlIGZpcnN0IG5vZGUuXHJcbiAgICAgICAgICAgIG5ld05vZGUubmV4dCA9IHRoaXMuZmlyc3ROb2RlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IG5ld05vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcHJldiA9IHRoaXMubm9kZUF0SW5kZXgoaW5kZXggLSAxKTtcclxuICAgICAgICAgICAgaWYgKHByZXYgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdOb2RlLm5leHQgPSBwcmV2Lm5leHQ7XHJcbiAgICAgICAgICAgIHByZXYubmV4dCA9IG5ld05vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubkVsZW1lbnRzKys7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoaXMgbGlzdC5cclxuICAgICAqIEByZXR1cm4geyp9IHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBsaXN0IG9yIHVuZGVmaW5lZCBpZiB0aGUgbGlzdCBpc1xyXG4gICAgICogZW1wdHkuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmZpcnN0Tm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maXJzdE5vZGUuZWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGxhc3QgZWxlbWVudCBpbiB0aGlzIGxpc3QuXHJcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgbGFzdCBlbGVtZW50IGluIHRoZSBsaXN0IG9yIHVuZGVmaW5lZCBpZiB0aGUgbGlzdCBpc1xyXG4gICAgICogZW1wdHkuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdE5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFzdE5vZGUuZWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBwb3NpdGlvbiBpbiB0aGlzIGxpc3QuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggZGVzaXJlZCBpbmRleC5cclxuICAgICAqIEByZXR1cm4geyp9IHRoZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBpbmRleCBvciB1bmRlZmluZWQgaWYgdGhlIGluZGV4IGlzXHJcbiAgICAgKiBvdXQgb2YgYm91bmRzLlxyXG4gICAgICovXHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5lbGVtZW50QXRJbmRleCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlQXRJbmRleChpbmRleCk7XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuZWxlbWVudDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGluZGV4IGluIHRoaXMgbGlzdCBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiB0aGVcclxuICAgICAqIHNwZWNpZmllZCBlbGVtZW50LCBvciAtMSBpZiB0aGUgTGlzdCBkb2VzIG5vdCBjb250YWluIHRoaXMgZWxlbWVudC5cclxuICAgICAqIDxwPklmIHRoZSBlbGVtZW50cyBpbnNpZGUgdGhpcyBsaXN0IGFyZVxyXG4gICAgICogbm90IGNvbXBhcmFibGUgd2l0aCB0aGUgPT09IG9wZXJhdG9yIGEgY3VzdG9tIGVxdWFscyBmdW5jdGlvbiBzaG91bGQgYmVcclxuICAgICAqIHByb3ZpZGVkIHRvIHBlcmZvcm0gc2VhcmNoZXMsIHRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgdHdvIGFyZ3VtZW50cyBhbmRcclxuICAgICAqIHJldHVybiB0cnVlIGlmIHRoZXkgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuIEV4YW1wbGU6PC9wPlxyXG4gICAgICpcclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiBjb25zdCBwZXRzQXJlRXF1YWxCeU5hbWUgPSBmdW5jdGlvbihwZXQxLCBwZXQyKSB7XHJcbiAgICAgKiAgcmV0dXJuIHBldDEubmFtZSA9PT0gcGV0Mi5uYW1lO1xyXG4gICAgICogfVxyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSBlbGVtZW50IHRvIHNlYXJjaCBmb3IuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSBlcXVhbHNGdW5jdGlvbiBPcHRpb25hbFxyXG4gICAgICogZnVuY3Rpb24gdXNlZCB0byBjaGVjayBpZiB0d28gZWxlbWVudHMgYXJlIGVxdWFsLlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW5kZXggaW4gdGhpcyBsaXN0IG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlXHJcbiAgICAgKiBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQsIG9yIC0xIGlmIHRoaXMgbGlzdCBkb2VzIG5vdCBjb250YWluIHRoZVxyXG4gICAgICogZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChpdGVtLCBlcXVhbHNGdW5jdGlvbikge1xyXG4gICAgICAgIHZhciBlcXVhbHNGID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xyXG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGN1cnJlbnROb2RlID0gdGhpcy5maXJzdE5vZGU7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICB3aGlsZSAoY3VycmVudE5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKGVxdWFsc0YoY3VycmVudE5vZGUuZWxlbWVudCwgaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGxpc3QgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxyXG4gICAgICogPHA+SWYgdGhlIGVsZW1lbnRzIGluc2lkZSB0aGUgbGlzdCBhcmVcclxuICAgICAqIG5vdCBjb21wYXJhYmxlIHdpdGggdGhlID09PSBvcGVyYXRvciBhIGN1c3RvbSBlcXVhbHMgZnVuY3Rpb24gc2hvdWxkIGJlXHJcbiAgICAgKiBwcm92aWRlZCB0byBwZXJmb3JtIHNlYXJjaGVzLCB0aGUgZnVuY3Rpb24gbXVzdCByZWNlaXZlIHR3byBhcmd1bWVudHMgYW5kXHJcbiAgICAgKiByZXR1cm4gdHJ1ZSBpZiB0aGV5IGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLiBFeGFtcGxlOjwvcD5cclxuICAgICAqXHJcbiAgICAgKiA8cHJlPlxyXG4gICAgICogY29uc3QgcGV0c0FyZUVxdWFsQnlOYW1lID0gZnVuY3Rpb24ocGV0MSwgcGV0Mikge1xyXG4gICAgICogIHJldHVybiBwZXQxLm5hbWUgPT09IHBldDIubmFtZTtcclxuICAgICAqIH1cclxuICAgICAqIDwvcHJlPlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gZWxlbWVudCB0byBzZWFyY2ggZm9yLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gT3B0aW9uYWxcclxuICAgICAqIGZ1bmN0aW9uIHVzZWQgdG8gY2hlY2sgaWYgdHdvIGVsZW1lbnRzIGFyZSBlcXVhbC5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBsaXN0IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCwgZmFsc2VcclxuICAgICAqIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoaXRlbSwgZXF1YWxzRnVuY3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuaW5kZXhPZihpdGVtLCBlcXVhbHNGdW5jdGlvbikgPj0gMCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBpbiB0aGlzIGxpc3QuXHJcbiAgICAgKiA8cD5JZiB0aGUgZWxlbWVudHMgaW5zaWRlIHRoZSBsaXN0IGFyZVxyXG4gICAgICogbm90IGNvbXBhcmFibGUgd2l0aCB0aGUgPT09IG9wZXJhdG9yIGEgY3VzdG9tIGVxdWFscyBmdW5jdGlvbiBzaG91bGQgYmVcclxuICAgICAqIHByb3ZpZGVkIHRvIHBlcmZvcm0gc2VhcmNoZXMsIHRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgdHdvIGFyZ3VtZW50cyBhbmRcclxuICAgICAqIHJldHVybiB0cnVlIGlmIHRoZXkgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuIEV4YW1wbGU6PC9wPlxyXG4gICAgICpcclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiBjb25zdCBwZXRzQXJlRXF1YWxCeU5hbWUgPSBmdW5jdGlvbihwZXQxLCBwZXQyKSB7XHJcbiAgICAgKiAgcmV0dXJuIHBldDEubmFtZSA9PT0gcGV0Mi5uYW1lO1xyXG4gICAgICogfVxyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaXRlbSBlbGVtZW50IHRvIGJlIHJlbW92ZWQgZnJvbSB0aGlzIGxpc3QsIGlmIHByZXNlbnQuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBsaXN0IGNvbnRhaW5lZCB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtLCBlcXVhbHNGdW5jdGlvbikge1xyXG4gICAgICAgIHZhciBlcXVhbHNGID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xyXG4gICAgICAgIGlmICh0aGlzLm5FbGVtZW50cyA8IDEgfHwgdXRpbC5pc1VuZGVmaW5lZChpdGVtKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcmV2aW91cyA9IG51bGw7XHJcbiAgICAgICAgdmFyIGN1cnJlbnROb2RlID0gdGhpcy5maXJzdE5vZGU7XHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnROb2RlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChlcXVhbHNGKGN1cnJlbnROb2RlLmVsZW1lbnQsIGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJldmlvdXMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IGN1cnJlbnROb2RlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnROb2RlID09PSB0aGlzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE5vZGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnROb2RlID09PSB0aGlzLmxhc3ROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IHByZXZpb3VzO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzLm5leHQgPSBjdXJyZW50Tm9kZS5uZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlLm5leHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMubmV4dCA9IGN1cnJlbnROb2RlLm5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE5vZGUubmV4dCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5FbGVtZW50cy0tO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJldmlvdXMgPSBjdXJyZW50Tm9kZTtcclxuICAgICAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBvZiB0aGUgZWxlbWVudHMgZnJvbSB0aGlzIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZmlyc3ROb2RlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmxhc3ROb2RlID0gbnVsbDtcclxuICAgICAgICB0aGlzLm5FbGVtZW50cyA9IDA7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBsaXN0IGlzIGVxdWFsIHRvIHRoZSBnaXZlbiBsaXN0LlxyXG4gICAgICogVHdvIGxpc3RzIGFyZSBlcXVhbCBpZiB0aGV5IGhhdmUgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgb3JkZXIuXHJcbiAgICAgKiBAcGFyYW0ge0xpbmtlZExpc3R9IG90aGVyIHRoZSBvdGhlciBsaXN0LlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gb3B0aW9uYWxcclxuICAgICAqIGZ1bmN0aW9uIHVzZWQgdG8gY2hlY2sgaWYgdHdvIGVsZW1lbnRzIGFyZSBlcXVhbC4gSWYgdGhlIGVsZW1lbnRzIGluIHRoZSBsaXN0c1xyXG4gICAgICogYXJlIGN1c3RvbSBvYmplY3RzIHlvdSBzaG91bGQgcHJvdmlkZSBhIGZ1bmN0aW9uLCBvdGhlcndpc2VcclxuICAgICAqIHRoZSA9PT0gb3BlcmF0b3IgaXMgdXNlZCB0byBjaGVjayBlcXVhbGl0eSBiZXR3ZWVuIGVsZW1lbnRzLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGxpc3QgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIChvdGhlciwgZXF1YWxzRnVuY3Rpb24pIHtcclxuICAgICAgICB2YXIgZXFGID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xyXG4gICAgICAgIGlmICghKG90aGVyIGluc3RhbmNlb2YgTGlua2VkTGlzdCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zaXplKCkgIT09IG90aGVyLnNpemUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmVxdWFsc0F1eCh0aGlzLmZpcnN0Tm9kZSwgb3RoZXIuZmlyc3ROb2RlLCBlcUYpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuZXF1YWxzQXV4ID0gZnVuY3Rpb24gKG4xLCBuMiwgZXFGKSB7XHJcbiAgICAgICAgd2hpbGUgKG4xICE9PSBudWxsICYmIG4yICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmICghZXFGKG4xLmVsZW1lbnQsIG4yLmVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbjEgPSBuMS5uZXh0O1xyXG4gICAgICAgICAgICBuMiA9IG4yLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIHBvc2l0aW9uIGluIHRoaXMgbGlzdC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBnaXZlbiBpbmRleC5cclxuICAgICAqIEByZXR1cm4geyp9IHJlbW92ZWQgZWxlbWVudCBvciB1bmRlZmluZWQgaWYgdGhlIGluZGV4IGlzIG91dCBvZiBib3VuZHMuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnJlbW92ZUVsZW1lbnRBdEluZGV4ID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLm5FbGVtZW50cyB8fCB0aGlzLmZpcnN0Tm9kZSA9PT0gbnVsbCB8fCB0aGlzLmxhc3ROb2RlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBlbGVtZW50O1xyXG4gICAgICAgIGlmICh0aGlzLm5FbGVtZW50cyA9PT0gMSkge1xyXG4gICAgICAgICAgICAvL0ZpcnN0IG5vZGUgaW4gdGhlIGxpc3QuXHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmZpcnN0Tm9kZS5lbGVtZW50O1xyXG4gICAgICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdE5vZGUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5ub2RlQXRJbmRleChpbmRleCAtIDEpO1xyXG4gICAgICAgICAgICBpZiAocHJldmlvdXMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmZpcnN0Tm9kZS5lbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdE5vZGUgPSB0aGlzLmZpcnN0Tm9kZS5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHByZXZpb3VzLm5leHQgPT09IHRoaXMubGFzdE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmxhc3ROb2RlLmVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3ROb2RlID0gcHJldmlvdXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByZXZpb3VzICE9PSBudWxsICYmIHByZXZpb3VzLm5leHQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBwcmV2aW91cy5uZXh0LmVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91cy5uZXh0ID0gcHJldmlvdXMubmV4dC5uZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubkVsZW1lbnRzLS07XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyBsaXN0IGluIG9yZGVyLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXHJcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiB0aGUgZWxlbWVudCB2YWx1ZSwgdG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuXHJcbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IHRoaXMuZmlyc3ROb2RlO1xyXG4gICAgICAgIHdoaWxlIChjdXJyZW50Tm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2soY3VycmVudE5vZGUuZWxlbWVudCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV2ZXJzZXMgdGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIGxpbmtlZCBsaXN0IChtYWtlcyB0aGUgbGFzdFxyXG4gICAgICogZWxlbWVudCBmaXJzdCwgYW5kIHRoZSBmaXJzdCBlbGVtZW50IGxhc3QpLlxyXG4gICAgICovXHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwcmV2aW91cyA9IG51bGw7XHJcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmZpcnN0Tm9kZTtcclxuICAgICAgICB2YXIgdGVtcCA9IG51bGw7XHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGVtcCA9IGN1cnJlbnQubmV4dDtcclxuICAgICAgICAgICAgY3VycmVudC5uZXh0ID0gcHJldmlvdXM7XHJcbiAgICAgICAgICAgIHByZXZpb3VzID0gY3VycmVudDtcclxuICAgICAgICAgICAgY3VycmVudCA9IHRlbXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlbXAgPSB0aGlzLmZpcnN0Tm9kZTtcclxuICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IHRoaXMubGFzdE5vZGU7XHJcbiAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IHRlbXA7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIGxpc3QgaW4gcHJvcGVyXHJcbiAgICAgKiBzZXF1ZW5jZS5cclxuICAgICAqIEByZXR1cm4ge0FycmF5LjwqPn0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgbGlzdCxcclxuICAgICAqIGluIHByb3BlciBzZXF1ZW5jZS5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICB2YXIgY3VycmVudE5vZGUgPSB0aGlzLmZpcnN0Tm9kZTtcclxuICAgICAgICB3aGlsZSAoY3VycmVudE5vZGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChjdXJyZW50Tm9kZS5lbGVtZW50KTtcclxuICAgICAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBsaXN0LlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgbGlzdC5cclxuICAgICAqL1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5uRWxlbWVudHM7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBsaXN0IGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGxpc3QgY29udGFpbnMgbm8gZWxlbWVudHMuXHJcbiAgICAgKi9cclxuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzIDw9IDA7XHJcbiAgICB9O1xyXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5cy50b1N0cmluZyh0aGlzLnRvQXJyYXkoKSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5ub2RlQXRJbmRleCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5uRWxlbWVudHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbmRleCA9PT0gKHRoaXMubkVsZW1lbnRzIC0gMSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFzdE5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5maXJzdE5vZGU7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbmRleCAmJiBub2RlICE9PSBudWxsOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5jcmVhdGVOb2RlID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBlbGVtZW50OiBpdGVtLFxyXG4gICAgICAgICAgICBuZXh0OiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTGlua2VkTGlzdDtcclxufSgpKTsgLy8gRW5kIG9mIGxpbmtlZCBsaXN0XHJcbmV4cG9ydHMuZGVmYXVsdCA9IExpbmtlZExpc3Q7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxpbmtlZExpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHV0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xyXG52YXIgRGljdGlvbmFyeV8xID0gcmVxdWlyZShcIi4vRGljdGlvbmFyeVwiKTtcclxudmFyIGFycmF5cyA9IHJlcXVpcmUoXCIuL2FycmF5c1wiKTtcclxudmFyIE11bHRpRGljdGlvbmFyeSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBtdWx0aSBkaWN0aW9uYXJ5LlxyXG4gICAgICogQGNsYXNzIDxwPkEgbXVsdGkgZGljdGlvbmFyeSBpcyBhIHNwZWNpYWwga2luZCBvZiBkaWN0aW9uYXJ5IHRoYXQgaG9sZHNcclxuICAgICAqIG11bHRpcGxlIHZhbHVlcyBhZ2FpbnN0IGVhY2gga2V5LiBTZXR0aW5nIGEgdmFsdWUgaW50byB0aGUgZGljdGlvbmFyeSB3aWxsXHJcbiAgICAgKiBhZGQgdGhlIHZhbHVlIHRvIGFuIGFycmF5IGF0IHRoYXQga2V5LiBHZXR0aW5nIGEga2V5IHdpbGwgcmV0dXJuIGFuIGFycmF5LFxyXG4gICAgICogaG9sZGluZyBhbGwgdGhlIHZhbHVlcyBzZXQgdG8gdGhhdCBrZXkuXHJcbiAgICAgKiBZb3UgY2FuIGNvbmZpZ3VyZSB0byBhbGxvdyBkdXBsaWNhdGVzIGluIHRoZSB2YWx1ZXMuXHJcbiAgICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIGFjY2VwdHMgYW55IGtpbmQgb2Ygb2JqZWN0cyBhcyBrZXlzLjwvcD5cclxuICAgICAqXHJcbiAgICAgKiA8cD5JZiB0aGUga2V5cyBhcmUgY3VzdG9tIG9iamVjdHMgYSBmdW5jdGlvbiB3aGljaCBjb252ZXJ0cyBrZXlzIHRvIHN0cmluZ3MgbXVzdCBiZVxyXG4gICAgICogcHJvdmlkZWQuIEV4YW1wbGU6PC9wPlxyXG4gICAgICpcclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiBmdW5jdGlvbiBwZXRUb1N0cmluZyhwZXQpIHtcclxuICAgICAqICAgICByZXR1cm4gcGV0Lm5hbWU7XHJcbiAgICAgKiB9XHJcbiAgICAgKiA8L3ByZT5cclxuICAgICAqIDxwPklmIHRoZSB2YWx1ZXMgYXJlIGN1c3RvbSBvYmplY3RzIGEgZnVuY3Rpb24gdG8gY2hlY2sgZXF1YWxpdHkgYmV0d2VlbiB2YWx1ZXNcclxuICAgICAqIG11c3QgYmUgcHJvdmlkZWQuIEV4YW1wbGU6PC9wPlxyXG4gICAgICpcclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiBmdW5jdGlvbiBwZXRzQXJlRXF1YWxCeUFnZShwZXQxLHBldDIpIHtcclxuICAgICAqICAgICByZXR1cm4gcGV0MS5hZ2UgPT09IHBldDIuYWdlO1xyXG4gICAgICogfVxyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KTpzdHJpbmc9fSB0b1N0ckZ1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uXHJcbiAgICAgKiB0byBjb252ZXJ0IGtleXMgdG8gc3RyaW5ncy4gSWYgdGhlIGtleXMgYXJlbid0IHN0cmluZ3Mgb3IgaWYgdG9TdHJpbmcoKVxyXG4gICAgICogaXMgbm90IGFwcHJvcHJpYXRlLCBhIGN1c3RvbSBmdW5jdGlvbiB3aGljaCByZWNlaXZlcyBhIGtleSBhbmQgcmV0dXJucyBhXHJcbiAgICAgKiB1bmlxdWUgc3RyaW5nIG11c3QgYmUgcHJvdmlkZWQuXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSB2YWx1ZXNFcXVhbHNGdW5jdGlvbiBvcHRpb25hbFxyXG4gICAgICogZnVuY3Rpb24gdG8gY2hlY2sgaWYgdHdvIHZhbHVlcyBhcmUgZXF1YWwuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGFsbG93RHVwbGljYXRlVmFsdWVzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIE11bHRpRGljdGlvbmFyeSh0b1N0ckZ1bmN0aW9uLCB2YWx1ZXNFcXVhbHNGdW5jdGlvbiwgYWxsb3dEdXBsaWNhdGVWYWx1ZXMpIHtcclxuICAgICAgICBpZiAoYWxsb3dEdXBsaWNhdGVWYWx1ZXMgPT09IHZvaWQgMCkgeyBhbGxvd0R1cGxpY2F0ZVZhbHVlcyA9IGZhbHNlOyB9XHJcbiAgICAgICAgdGhpcy5kaWN0ID0gbmV3IERpY3Rpb25hcnlfMS5kZWZhdWx0KHRvU3RyRnVuY3Rpb24pO1xyXG4gICAgICAgIHRoaXMuZXF1YWxzRiA9IHZhbHVlc0VxdWFsc0Z1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdEVxdWFscztcclxuICAgICAgICB0aGlzLmFsbG93RHVwbGljYXRlID0gYWxsb3dEdXBsaWNhdGVWYWx1ZXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgaG9sZGluZyB0aGUgdmFsdWVzIHRvIHdoaWNoIHRoaXMgZGljdGlvbmFyeSBtYXBzXHJcbiAgICAgKiB0aGUgc3BlY2lmaWVkIGtleS5cclxuICAgICAqIFJldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgdGhpcyBkaWN0aW9uYXJ5IGNvbnRhaW5zIG5vIG1hcHBpbmdzIGZvciB0aGlzIGtleS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdob3NlIGFzc29jaWF0ZWQgdmFsdWVzIGFyZSB0byBiZSByZXR1cm5lZC5cclxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBob2xkaW5nIHRoZSB2YWx1ZXMgdG8gd2hpY2ggdGhpcyBkaWN0aW9uYXJ5IG1hcHNcclxuICAgICAqIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAgICovXHJcbiAgICBNdWx0aURpY3Rpb25hcnkucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLmRpY3QuZ2V0VmFsdWUoa2V5KTtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZCh2YWx1ZXMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5cy5jb3B5KHZhbHVlcyk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSB2YWx1ZSB0byB0aGUgYXJyYXkgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LCBpZlxyXG4gICAgICogaXQgaXMgbm90IGFscmVhZHkgcHJlc2VudC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdpdGggd2hpY2ggdGhlIHNwZWNpZmllZCB2YWx1ZSBpcyB0byBiZVxyXG4gICAgICogYXNzb2NpYXRlZC5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSB0aGUgdmFsdWUgdG8gYWRkIHRvIHRoZSBhcnJheSBhdCB0aGUga2V5XHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSB2YWx1ZSB3YXMgbm90IGFscmVhZHkgYXNzb2NpYXRlZCB3aXRoIHRoYXQga2V5LlxyXG4gICAgICovXHJcbiAgICBNdWx0aURpY3Rpb25hcnkucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChrZXkpIHx8IHV0aWwuaXNVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFycmF5ID0gdGhpcy5kaWN0LmdldFZhbHVlKGtleSk7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoYXJyYXkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGljdC5zZXRWYWx1ZShrZXksIFt2YWx1ZV0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmFsbG93RHVwbGljYXRlKSB7XHJcbiAgICAgICAgICAgIGlmIChhcnJheXMuY29udGFpbnMoYXJyYXksIHZhbHVlLCB0aGlzLmVxdWFsc0YpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYXJyYXkucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBzcGVjaWZpZWQgdmFsdWVzIGZyb20gdGhlIGFycmF5IG9mIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggdGhlXHJcbiAgICAgKiBzcGVjaWZpZWQga2V5LiBJZiBhIHZhbHVlIGlzbid0IGdpdmVuLCBhbGwgdmFsdWVzIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkXHJcbiAgICAgKiBrZXkgYXJlIHJlbW92ZWQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aG9zZSBtYXBwaW5nIGlzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGVcclxuICAgICAqIGRpY3Rpb25hcnkuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdD19IHZhbHVlIG9wdGlvbmFsIGFyZ3VtZW50IHRvIHNwZWNpZnkgdGhlIHZhbHVlIHRvIHJlbW92ZVxyXG4gICAgICogZnJvbSB0aGUgYXJyYXkgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAgICogQHJldHVybiB7Kn0gdHJ1ZSBpZiB0aGUgZGljdGlvbmFyeSBjaGFuZ2VkLCBmYWxzZSBpZiB0aGUga2V5IGRvZXNuJ3QgZXhpc3Qgb3JcclxuICAgICAqIGlmIHRoZSBzcGVjaWZpZWQgdmFsdWUgaXNuJ3QgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAgICovXHJcbiAgICBNdWx0aURpY3Rpb25hcnkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhciB2ID0gdGhpcy5kaWN0LnJlbW92ZShrZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gIXV0aWwuaXNVbmRlZmluZWQodik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcnJheSA9IHRoaXMuZGljdC5nZXRWYWx1ZShrZXkpO1xyXG4gICAgICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZChhcnJheSkgJiYgYXJyYXlzLnJlbW92ZShhcnJheSwgdmFsdWUsIHRoaXMuZXF1YWxzRikpIHtcclxuICAgICAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaWN0LnJlbW92ZShrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBrZXlzIGluIHRoaXMgZGljdGlvbmFyeS5cclxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUga2V5cyBpbiB0aGlzIGRpY3Rpb25hcnkuXHJcbiAgICAgKi9cclxuICAgIE11bHRpRGljdGlvbmFyeS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0LmtleXMoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIHZhbHVlcyBpbiB0aGlzIGRpY3Rpb25hcnkuXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIHZhbHVlcyBpbiB0aGlzIGRpY3Rpb25hcnkuXHJcbiAgICAgKi9cclxuICAgIE11bHRpRGljdGlvbmFyeS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLmRpY3QudmFsdWVzKCk7XHJcbiAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCB2YWx1ZXNfMSA9IHZhbHVlczsgX2kgPCB2YWx1ZXNfMS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIHYgPSB2YWx1ZXNfMVtfaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgdl8xID0gdjsgX2EgPCB2XzEubGVuZ3RoOyBfYSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdyA9IHZfMVtfYV07XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgYXQgbGVhc3Qgb25lIHZhbHVlIGFzc29jaWF0dGVkIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2hvc2UgcHJlc2VuY2UgaW4gdGhpcyBkaWN0aW9uYXJ5IGlzIHRvIGJlXHJcbiAgICAgKiB0ZXN0ZWQuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBhdCBsZWFzdCBvbmUgdmFsdWUgYXNzb2NpYXR0ZWRcclxuICAgICAqIHRoZSBzcGVjaWZpZWQga2V5LlxyXG4gICAgICovXHJcbiAgICBNdWx0aURpY3Rpb25hcnkucHJvdG90eXBlLmNvbnRhaW5zS2V5ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3QuY29udGFpbnNLZXkoa2V5KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIG1hcHBpbmdzIGZyb20gdGhpcyBkaWN0aW9uYXJ5LlxyXG4gICAgICovXHJcbiAgICBNdWx0aURpY3Rpb25hcnkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZGljdC5jbGVhcigpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGtleXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGtleS12YWx1ZSBtYXBwaW5ncyBpbiB0aGlzIGRpY3Rpb25hcnkuXHJcbiAgICAgKi9cclxuICAgIE11bHRpRGljdGlvbmFyeS5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0LnNpemUoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgbm8gbWFwcGluZ3MuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBjb250YWlucyBubyBtYXBwaW5ncy5cclxuICAgICAqL1xyXG4gICAgTXVsdGlEaWN0aW9uYXJ5LnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3QuaXNFbXB0eSgpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBNdWx0aURpY3Rpb25hcnk7XHJcbn0oKSk7IC8vIGVuZCBvZiBtdWx0aSBkaWN0aW9uYXJ5XHJcbmV4cG9ydHMuZGVmYXVsdCA9IE11bHRpRGljdGlvbmFyeTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TXVsdGlEaWN0aW9uYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBEaXJlY3Rpb247XHJcbihmdW5jdGlvbiAoRGlyZWN0aW9uKSB7XHJcbiAgICBEaXJlY3Rpb25bRGlyZWN0aW9uW1wiQkVGT1JFXCJdID0gMF0gPSBcIkJFRk9SRVwiO1xyXG4gICAgRGlyZWN0aW9uW0RpcmVjdGlvbltcIkFGVEVSXCJdID0gMV0gPSBcIkFGVEVSXCI7XHJcbiAgICBEaXJlY3Rpb25bRGlyZWN0aW9uW1wiSU5TSURFX0FUX0VORFwiXSA9IDJdID0gXCJJTlNJREVfQVRfRU5EXCI7XHJcbiAgICBEaXJlY3Rpb25bRGlyZWN0aW9uW1wiSU5TSURFX0FUX1NUQVJUXCJdID0gM10gPSBcIklOU0lERV9BVF9TVEFSVFwiO1xyXG59KShEaXJlY3Rpb24gfHwgKERpcmVjdGlvbiA9IHt9KSk7XHJcbnZhciBNdWx0aVJvb3RUcmVlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTXVsdGlSb290VHJlZShyb290SWRzLCBub2Rlcykge1xyXG4gICAgICAgIGlmIChyb290SWRzID09PSB2b2lkIDApIHsgcm9vdElkcyA9IFtdOyB9XHJcbiAgICAgICAgaWYgKG5vZGVzID09PSB2b2lkIDApIHsgbm9kZXMgPSB7fTsgfVxyXG4gICAgICAgIHRoaXMucm9vdElkcyA9IHJvb3RJZHM7XHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IG5vZGVzO1xyXG4gICAgICAgIHRoaXMuaW5pdFJvb3RJZHMoKTtcclxuICAgICAgICB0aGlzLmluaXROb2RlcygpO1xyXG4gICAgfVxyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUuaW5pdFJvb3RJZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucm9vdElkczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIHJvb3RJZCA9IF9hW19pXTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVFbXB0eU5vZGVJZk5vdEV4aXN0KHJvb3RJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmluaXROb2RlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBub2RlS2V5IGluIHRoaXMubm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkobm9kZUtleSkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLm5vZGVzW25vZGVLZXldOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlTGlzdEl0ZW0gPSBfYVtfaV07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVFbXB0eU5vZGVJZk5vdEV4aXN0KG5vZGVMaXN0SXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUuY3JlYXRlRW1wdHlOb2RlSWZOb3RFeGlzdCA9IGZ1bmN0aW9uIChub2RlS2V5KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm5vZGVzW25vZGVLZXldKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZXNbbm9kZUtleV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUuZ2V0Um9vdElkcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgY2xvbmUgPSB0aGlzLnJvb3RJZHMuc2xpY2UoKTtcclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUuZ2V0Tm9kZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNsb25lID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgbm9kZUtleSBpbiB0aGlzLm5vZGVzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjbG9uZVtub2RlS2V5XSA9IHRoaXMubm9kZXNbbm9kZUtleV0uc2xpY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUuZ2V0T2JqZWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJvb3RJZHM6IHRoaXMuZ2V0Um9vdElkcygpLFxyXG4gICAgICAgICAgICBub2RlczogdGhpcy5nZXROb2RlcygpLFxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUudG9PYmplY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0T2JqZWN0KCk7XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUuZmxhdHRlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBleHRyYVByb3BzT2JqZWN0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvb3RJZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJvb3RJZCA9IHRoaXMucm9vdElkc1tpXTtcclxuICAgICAgICAgICAgZXh0cmFQcm9wc09iamVjdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkOiByb290SWQsXHJcbiAgICAgICAgICAgICAgICBsZXZlbDogMCxcclxuICAgICAgICAgICAgICAgIGhhc1BhcmVudDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbkNvdW50OiAwLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdHJhdmVyc2Uocm9vdElkLCB0aGlzLm5vZGVzLCBleHRyYVByb3BzT2JqZWN0LCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBleHRyYVByb3BzT2JqZWN0XzEgPSBleHRyYVByb3BzT2JqZWN0OyBfaSA8IGV4dHJhUHJvcHNPYmplY3RfMS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIG8gPSBleHRyYVByb3BzT2JqZWN0XzFbX2ldO1xyXG4gICAgICAgICAgICBvLmNoaWxkcmVuQ291bnQgPSBjb3VudENoaWxkcmVuKG8uaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZXh0cmFQcm9wc09iamVjdDtcclxuICAgICAgICBmdW5jdGlvbiBjb3VudENoaWxkcmVuKGlkKSB7XHJcbiAgICAgICAgICAgIGlmICghX3RoaXMubm9kZXNbaWRdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbkNvdW50ID0gX3RoaXMubm9kZXNbaWRdLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbkNvdW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHRyYXZlcnNlKHN0YXJ0SWQsIG5vZGVzLCByZXR1cm5BcnJheSwgbGV2ZWwpIHtcclxuICAgICAgICAgICAgaWYgKGxldmVsID09PSB2b2lkIDApIHsgbGV2ZWwgPSAwOyB9XHJcbiAgICAgICAgICAgIGlmICghc3RhcnRJZCB8fCAhbm9kZXMgfHwgIXJldHVybkFycmF5IHx8ICFub2Rlc1tzdGFydElkXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldmVsKys7XHJcbiAgICAgICAgICAgIHZhciBpZHNMaXN0ID0gbm9kZXNbc3RhcnRJZF07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaWRzTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gaWRzTGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybkFycmF5LnB1c2goeyBpZDogaWQsIGxldmVsOiBsZXZlbCwgaGFzUGFyZW50OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICAgICAgdHJhdmVyc2UoaWQsIG5vZGVzLCByZXR1cm5BcnJheSwgbGV2ZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldmVsLS07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLm1vdmVJZEJlZm9yZUlkID0gZnVuY3Rpb24gKG1vdmVJZCwgYmVmb3JlSWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb3ZlSWQobW92ZUlkLCBiZWZvcmVJZCwgRGlyZWN0aW9uLkJFRk9SRSk7XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUubW92ZUlkQWZ0ZXJJZCA9IGZ1bmN0aW9uIChtb3ZlSWQsIGFmdGVySWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb3ZlSWQobW92ZUlkLCBhZnRlcklkLCBEaXJlY3Rpb24uQUZURVIpO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLm1vdmVJZEludG9JZCA9IGZ1bmN0aW9uIChtb3ZlSWQsIGluc2lkZUlkLCBhdFN0YXJ0KSB7XHJcbiAgICAgICAgaWYgKGF0U3RhcnQgPT09IHZvaWQgMCkgeyBhdFN0YXJ0ID0gdHJ1ZTsgfVxyXG4gICAgICAgIGlmIChhdFN0YXJ0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdmVJZChtb3ZlSWQsIGluc2lkZUlkLCBEaXJlY3Rpb24uSU5TSURFX0FUX1NUQVJUKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vdmVJZChtb3ZlSWQsIGluc2lkZUlkLCBEaXJlY3Rpb24uSU5TSURFX0FUX0VORCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLnN3YXBSb290SWRXaXRoUm9vdElkID0gZnVuY3Rpb24gKHJvb3RJZCwgd2l0aFJvb3RJZCkge1xyXG4gICAgICAgIHZhciBsZWZ0SW5kZXggPSB0aGlzLmZpbmRSb290SWQocm9vdElkKTtcclxuICAgICAgICB2YXIgcmlnaHRJbmRleCA9IHRoaXMuZmluZFJvb3RJZCh3aXRoUm9vdElkKTtcclxuICAgICAgICB0aGlzLnN3YXBSb290UG9zaXRpb25XaXRoUm9vdFBvc2l0aW9uKGxlZnRJbmRleCwgcmlnaHRJbmRleCk7XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUuc3dhcFJvb3RQb3NpdGlvbldpdGhSb290UG9zaXRpb24gPSBmdW5jdGlvbiAoc3dhcFJvb3RQb3NpdGlvbiwgd2l0aFJvb3RQb3NpdGlvbikge1xyXG4gICAgICAgIHZhciB0ZW1wID0gdGhpcy5yb290SWRzW3dpdGhSb290UG9zaXRpb25dO1xyXG4gICAgICAgIHRoaXMucm9vdElkc1t3aXRoUm9vdFBvc2l0aW9uXSA9IHRoaXMucm9vdElkc1tzd2FwUm9vdFBvc2l0aW9uXTtcclxuICAgICAgICB0aGlzLnJvb3RJZHNbc3dhcFJvb3RQb3NpdGlvbl0gPSB0ZW1wO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmRlbGV0ZUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdGhpcy5yb290RGVsZXRlSWQoaWQpO1xyXG4gICAgICAgIHRoaXMubm9kZUFuZFN1Yk5vZGVzRGVsZXRlKGlkKTtcclxuICAgICAgICB0aGlzLm5vZGVSZWZyZW5jZXNEZWxldGUoaWQpO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmluc2VydElkQmVmb3JlSWQgPSBmdW5jdGlvbiAoYmVmb3JlSWQsIGluc2VydElkKSB7XHJcbiAgICAgICAgdmFyIGZvdW5kUm9vdElkSW5kZXggPSB0aGlzLmZpbmRSb290SWQoYmVmb3JlSWQpO1xyXG4gICAgICAgIGlmIChmb3VuZFJvb3RJZEluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Sb290KGluc2VydElkLCBmb3VuZFJvb3RJZEluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgbm9kZUtleSBpbiB0aGlzLm5vZGVzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZm91bmROb2RlSWRJbmRleCA9IHRoaXMuZmluZE5vZGVJZChub2RlS2V5LCBiZWZvcmVJZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm91bmROb2RlSWRJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Ob2RlKG5vZGVLZXksIGluc2VydElkLCBmb3VuZE5vZGVJZEluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5pbnNlcnRJZEFmdGVySWQgPSBmdW5jdGlvbiAoYmVsb3dJZCwgaW5zZXJ0SWQpIHtcclxuICAgICAgICB2YXIgZm91bmRSb290SWRJbmRleCA9IHRoaXMuZmluZFJvb3RJZChiZWxvd0lkKTtcclxuICAgICAgICBpZiAoZm91bmRSb290SWRJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SWRJbnRvUm9vdChpbnNlcnRJZCwgZm91bmRSb290SWRJbmRleCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBub2RlS2V5IGluIHRoaXMubm9kZXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkobm9kZUtleSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmb3VuZE5vZGVJZEluZGV4ID0gdGhpcy5maW5kTm9kZUlkKG5vZGVLZXksIGJlbG93SWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kTm9kZUlkSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0SWRJbnRvTm9kZShub2RlS2V5LCBpbnNlcnRJZCwgZm91bmROb2RlSWRJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmluc2VydElkSW50b0lkID0gZnVuY3Rpb24gKGluc2lkZUlkLCBpbnNlcnRJZCkge1xyXG4gICAgICAgIHRoaXMubm9kZUluc2VydEF0RW5kKGluc2lkZUlkLCBpbnNlcnRJZCk7XHJcbiAgICAgICAgdGhpcy5ub2Rlc1tpbnNlcnRJZF0gPSBbXTtcclxuICAgIH07XHJcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5pbnNlcnRJZEludG9Sb290ID0gZnVuY3Rpb24gKGlkLCBwb3NpdGlvbikge1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdEluc2VydEF0RW5kKGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbiA8IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBsZW5ndGhfMSA9IHRoaXMucm9vdElkcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3RJZHMuc3BsaWNlKChwb3NpdGlvbiArIGxlbmd0aF8xICsgMSksIDAsIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdElkcy5zcGxpY2UocG9zaXRpb24sIDAsIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5vZGVzW2lkXSA9IHRoaXMubm9kZXNbaWRdIHx8IFtdO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmluc2VydElkSW50b05vZGUgPSBmdW5jdGlvbiAobm9kZUtleSwgaWQsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5ub2Rlc1tub2RlS2V5XSA9IHRoaXMubm9kZXNbbm9kZUtleV0gfHwgW107XHJcbiAgICAgICAgdGhpcy5ub2Rlc1tpZF0gPSB0aGlzLm5vZGVzW2lkXSB8fCBbXTtcclxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVJbnNlcnRBdEVuZChub2RlS2V5LCBpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoXzIgPSB0aGlzLm5vZGVzW25vZGVLZXldLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZXNbbm9kZUtleV0uc3BsaWNlKChwb3NpdGlvbiArIGxlbmd0aF8yICsgMSksIDAsIGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZXNbbm9kZUtleV0uc3BsaWNlKHBvc2l0aW9uLCAwLCBpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUubW92ZUlkID0gZnVuY3Rpb24gKG1vdmVJZCwgYmVmb3JlSWQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHZhciBzb3VyY2VJZCA9IG1vdmVJZDtcclxuICAgICAgICB2YXIgc291cmNlUm9vdEluZGV4ID0gdGhpcy5maW5kUm9vdElkKHNvdXJjZUlkKTtcclxuICAgICAgICB2YXIgc291cmNlTm9kZUtleTtcclxuICAgICAgICB2YXIgc291cmNlTm9kZUlkSW5kZXg7XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZXNbYmVmb3JlSWRdKSB7XHJcbiAgICAgICAgICAgIHNvdXJjZU5vZGVLZXkgPSBiZWZvcmVJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgbm9kZUtleSBpbiB0aGlzLm5vZGVzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VOb2RlSWRJbmRleCA9IHRoaXMuZmluZE5vZGVJZChub2RlS2V5LCBiZWZvcmVJZCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBnb3QgYWxsXHJcbiAgICAgICAgdmFyIHRhcmdldElkID0gYmVmb3JlSWQ7XHJcbiAgICAgICAgdmFyIHRhcmdldFJvb3RJbmRleCA9IHRoaXMuZmluZFJvb3RJZCh0YXJnZXRJZCk7XHJcbiAgICAgICAgdmFyIHRhcmdldE5vZGVLZXk7XHJcbiAgICAgICAgdmFyIHRhcmdldE5vZGVJZEluZGV4O1xyXG4gICAgICAgIGlmICh0aGlzLm5vZGVzW2JlZm9yZUlkXSkge1xyXG4gICAgICAgICAgICB0YXJnZXROb2RlS2V5ID0gYmVmb3JlSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIG5vZGVLZXkgaW4gdGhpcy5ub2Rlcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShub2RlS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZUlkSW5kZXggPSB0aGlzLmZpbmROb2RlSWQobm9kZUtleSwgYmVmb3JlSWQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZ290IGFsbFxyXG4gICAgICAgIGlmIChzb3VyY2VSb290SW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0Um9vdEluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vIG1vdmluZyByb290IHRvIHJvb3RcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBNb3ZpbmcgUk9PVCB0byBST09UYCk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgUm9vdElkczpgKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucm9vdElkcyk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgVGFyZ2V0SW5kZXg9JHt0YXJnZXRSb290SW5kZXh9LCBTb3VyY2VJbmRleD0ke3NvdXJjZVJvb3RJbmRleH1gKTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBUYXJnZXRJZD0ke3RhcmdldElkfSwgU291cmNlSWQ9JHtzb3VyY2VJZH1gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucm9vdERlbGV0ZShzb3VyY2VSb290SW5kZXgpOyAvLyBpbmRleGVzIGNoYW5nZSBub3dcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRSb290SW5kZXggPiBzb3VyY2VSb290SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRSb290SW5kZXgtLTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5CRUZPUkU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0SWRJbnRvUm9vdChzb3VyY2VJZCwgdGFyZ2V0Um9vdEluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uQUZURVI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0SWRJbnRvUm9vdChzb3VyY2VJZCwgdGFyZ2V0Um9vdEluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLklOU0lERV9BVF9TVEFSVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlSW5zZXJ0QXRTdGFydCh0YXJnZXRJZCwgc291cmNlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5JTlNJREVfQVRfRU5EOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVJbnNlcnRBdEVuZCh0YXJnZXRJZCwgc291cmNlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIG1vdmluZyByb290IChzb3VyY2UpIEFCT1ZFIG5vZGUgKHRhcmdldClcclxuICAgICAgICAgICAgICAgIC8vIHdpbGwgcmVtb3ZlIG9uZSBlbnRyeSBmcm9tIHJvb3RzXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3REZWxldGUoc291cmNlUm9vdEluZGV4KTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIG5vZGVLZXkgaW4gdGhpcy5ub2Rlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZmluZE5vZGVJZChub2RlS2V5LCB0YXJnZXRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLkJFRk9SRTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Ob2RlKG5vZGVLZXksIHNvdXJjZUlkLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLkFGVEVSOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydElkSW50b05vZGUobm9kZUtleSwgc291cmNlSWQsIGluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLklOU0lERV9BVF9TVEFSVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlSW5zZXJ0QXRTdGFydCh0YXJnZXRJZCwgc291cmNlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5JTlNJREVfQVRfRU5EOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVJbnNlcnRBdEVuZCh0YXJnZXRJZCwgc291cmNlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0Um9vdEluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vIG1vdmluZyBub2RlIChzb3VyY2UpIEFCT1ZFIHJvb3QgKHRhcmdldClcclxuICAgICAgICAgICAgICAgIC8vIGRlbGV0ZSBzb3VyY2UgaWQgZnJvbSBlYWNoIG5vZGVcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIG5vZGVLZXkgaW4gdGhpcy5ub2Rlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZmluZE5vZGVJZChub2RlS2V5LCBzb3VyY2VJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLm5vZGVJbnNlcnRJZChub2RlS2V5LCBzb3VyY2VJZCwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlRGVsZXRlQXRJbmRleChub2RlS2V5LCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uQkVGT1JFOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydElkSW50b1Jvb3Qoc291cmNlSWQsIHRhcmdldFJvb3RJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLkFGVEVSOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydElkSW50b1Jvb3Qoc291cmNlSWQsIHRhcmdldFJvb3RJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5JTlNJREVfQVRfU1RBUlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZUluc2VydEF0U3RhcnQodGFyZ2V0SWQsIHNvdXJjZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uSU5TSURFX0FUX0VORDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlSW5zZXJ0QXRFbmQodGFyZ2V0SWQsIHNvdXJjZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBtb3Zpbmcgbm9kZSAoc291cmNlKSBBQk9WRSBub2RlICh0YXJnZXQpXHJcbiAgICAgICAgICAgICAgICAvLyBkZWxldGUgc291cmNlIGlkIGZyb20gZWFjaCBub2RlXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBub2RlS2V5IGluIHRoaXMubm9kZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShub2RlS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmZpbmROb2RlSWQobm9kZUtleSwgc291cmNlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlRGVsZXRlQXRJbmRleChub2RlS2V5LCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIG5vZGVLZXkgaW4gdGhpcy5ub2Rlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZmluZE5vZGVJZChub2RlS2V5LCB0YXJnZXRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLkJFRk9SRTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Ob2RlKG5vZGVLZXksIHNvdXJjZUlkLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLkFGVEVSOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydElkSW50b05vZGUobm9kZUtleSwgc291cmNlSWQsIGluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLklOU0lERV9BVF9TVEFSVDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlSW5zZXJ0QXRTdGFydCh0YXJnZXRJZCwgc291cmNlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5JTlNJREVfQVRfRU5EOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVJbnNlcnRBdEVuZCh0YXJnZXRJZCwgc291cmNlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLnN3YXBBcnJheUVsZW1lbnRzID0gZnVuY3Rpb24gKGFyciwgaW5kZXhBLCBpbmRleEIpIHtcclxuICAgICAgICB2YXIgdGVtcCA9IGFycltpbmRleEFdO1xyXG4gICAgICAgIGFycltpbmRleEFdID0gYXJyW2luZGV4Ql07XHJcbiAgICAgICAgYXJyW2luZGV4Ql0gPSB0ZW1wO1xyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUucm9vdERlbGV0ZUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5maW5kUm9vdElkKGlkKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvb3REZWxldGUoaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5ub2RlQW5kU3ViTm9kZXNEZWxldGUgPSBmdW5jdGlvbiAobm9kZUtleSkge1xyXG4gICAgICAgIHZhciB0b0RlbGV0ZUxhdGVyID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzW25vZGVLZXldLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMubm9kZXNbbm9kZUtleV1baV07XHJcbiAgICAgICAgICAgIHRoaXMubm9kZUFuZFN1Yk5vZGVzRGVsZXRlKGlkKTtcclxuICAgICAgICAgICAgdG9EZWxldGVMYXRlci5wdXNoKG5vZGVLZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5vZGVEZWxldGUobm9kZUtleSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b0RlbGV0ZUxhdGVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZURlbGV0ZSh0b0RlbGV0ZUxhdGVyW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUubm9kZVJlZnJlbmNlc0RlbGV0ZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGZvciAodmFyIG5vZGVLZXkgaW4gdGhpcy5ub2Rlcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShub2RlS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzW25vZGVLZXldLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldElkID0gdGhpcy5ub2Rlc1tub2RlS2V5XVtpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0SWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZURlbGV0ZUF0SW5kZXgobm9kZUtleSwgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLm5vZGVEZWxldGUgPSBmdW5jdGlvbiAobm9kZUtleSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLm5vZGVzW25vZGVLZXldO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmZpbmRSb290SWQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb290SWRzLmluZGV4T2YoaWQpO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmZpbmROb2RlSWQgPSBmdW5jdGlvbiAobm9kZUtleSwgaWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2Rlc1tub2RlS2V5XS5pbmRleE9mKGlkKTtcclxuICAgIH07XHJcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5maW5kTm9kZSA9IGZ1bmN0aW9uIChub2RlS2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZXNbbm9kZUtleV07XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUubm9kZUluc2VydEF0U3RhcnQgPSBmdW5jdGlvbiAobm9kZUtleSwgaWQpIHtcclxuICAgICAgICB0aGlzLm5vZGVzW25vZGVLZXldLnVuc2hpZnQoaWQpO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLm5vZGVJbnNlcnRBdEVuZCA9IGZ1bmN0aW9uIChub2RlS2V5LCBpZCkge1xyXG4gICAgICAgIHRoaXMubm9kZXNbbm9kZUtleV0ucHVzaChpZCk7XHJcbiAgICB9O1xyXG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUucm9vdERlbGV0ZSA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHRoaXMucm9vdElkcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLm5vZGVEZWxldGVBdEluZGV4ID0gZnVuY3Rpb24gKG5vZGVLZXksIGluZGV4KSB7XHJcbiAgICAgICAgdGhpcy5ub2Rlc1tub2RlS2V5XS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLnJvb3RJbnNlcnRBdFN0YXJ0ID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdGhpcy5yb290SWRzLnVuc2hpZnQoaWQpO1xyXG4gICAgfTtcclxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLnJvb3RJbnNlcnRBdEVuZCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHRoaXMucm9vdElkcy5wdXNoKGlkKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTXVsdGlSb290VHJlZTtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gTXVsdGlSb290VHJlZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TXVsdGlSb290VHJlZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbnZhciBIZWFwXzEgPSByZXF1aXJlKFwiLi9IZWFwXCIpO1xyXG52YXIgUHJpb3JpdHlRdWV1ZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBwcmlvcml0eSBxdWV1ZS5cclxuICAgICAqIEBjbGFzcyA8cD5JbiBhIHByaW9yaXR5IHF1ZXVlIGVhY2ggZWxlbWVudCBpcyBhc3NvY2lhdGVkIHdpdGggYSBcInByaW9yaXR5XCIsXHJcbiAgICAgKiBlbGVtZW50cyBhcmUgZGVxdWV1ZWQgaW4gaGlnaGVzdC1wcmlvcml0eS1maXJzdCBvcmRlciAodGhlIGVsZW1lbnRzIHdpdGggdGhlXHJcbiAgICAgKiBoaWdoZXN0IHByaW9yaXR5IGFyZSBkZXF1ZXVlZCBmaXJzdCkuIFByaW9yaXR5IFF1ZXVlcyBhcmUgaW1wbGVtZW50ZWQgYXMgaGVhcHMuXHJcbiAgICAgKiBJZiB0aGUgaW5zZXJ0ZWQgZWxlbWVudHMgYXJlIGN1c3RvbSBvYmplY3RzIGEgY29tcGFyZSBmdW5jdGlvbiBtdXN0IGJlIHByb3ZpZGVkLFxyXG4gICAgICogb3RoZXJ3aXNlIHRoZSA8PSwgPT09IGFuZCA+PSBvcGVyYXRvcnMgYXJlIHVzZWQgdG8gY29tcGFyZSBvYmplY3QgcHJpb3JpdHkuPC9wPlxyXG4gICAgICogPHByZT5cclxuICAgICAqIGZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xyXG4gICAgICogIGlmIChhIGlzIGxlc3MgdGhhbiBiIGJ5IHNvbWUgb3JkZXJpbmcgY3JpdGVyaW9uKSB7XHJcbiAgICAgKiAgICAgcmV0dXJuIC0xO1xyXG4gICAgICogIH0gaWYgKGEgaXMgZ3JlYXRlciB0aGFuIGIgYnkgdGhlIG9yZGVyaW5nIGNyaXRlcmlvbikge1xyXG4gICAgICogICAgIHJldHVybiAxO1xyXG4gICAgICogIH1cclxuICAgICAqICAvLyBhIG11c3QgYmUgZXF1YWwgdG8gYlxyXG4gICAgICogIHJldHVybiAwO1xyXG4gICAgICogfVxyXG4gICAgICogPC9wcmU+XHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6bnVtYmVyPX0gY29tcGFyZUZ1bmN0aW9uIG9wdGlvbmFsXHJcbiAgICAgKiBmdW5jdGlvbiB1c2VkIHRvIGNvbXBhcmUgdHdvIGVsZW1lbnQgcHJpb3JpdGllcy4gTXVzdCByZXR1cm4gYSBuZWdhdGl2ZSBpbnRlZ2VyLFxyXG4gICAgICogemVybywgb3IgYSBwb3NpdGl2ZSBpbnRlZ2VyIGFzIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBsZXNzIHRoYW4sIGVxdWFsIHRvLFxyXG4gICAgICogb3IgZ3JlYXRlciB0aGFuIHRoZSBzZWNvbmQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFByaW9yaXR5UXVldWUoY29tcGFyZUZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5oZWFwID0gbmV3IEhlYXBfMS5kZWZhdWx0KHV0aWwucmV2ZXJzZUNvbXBhcmVGdW5jdGlvbihjb21wYXJlRnVuY3Rpb24pKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0cyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgaW50byB0aGlzIHByaW9yaXR5IHF1ZXVlLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgaW5zZXJ0ZWQsIG9yIGZhbHNlIGlmIGl0IGlzIHVuZGVmaW5lZC5cclxuICAgICAqL1xyXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhcC5hZGQoZWxlbWVudCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnRzIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBpbnRvIHRoaXMgcHJpb3JpdHkgcXVldWUuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCB0aGUgZWxlbWVudCB0byBpbnNlcnQuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBlbGVtZW50IHdhcyBpbnNlcnRlZCwgb3IgZmFsc2UgaWYgaXQgaXMgdW5kZWZpbmVkLlxyXG4gICAgICovXHJcbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlYXAuYWRkKGVsZW1lbnQpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIGFuZCByZW1vdmVzIHRoZSBoaWdoZXN0IHByaW9yaXR5IGVsZW1lbnQgb2YgdGhpcyBxdWV1ZS5cclxuICAgICAqIEByZXR1cm4geyp9IHRoZSB0aGUgaGlnaGVzdCBwcmlvcml0eSBlbGVtZW50IG9mIHRoaXMgcXVldWUsXHJcbiAgICAgKiAgb3IgdW5kZWZpbmVkIGlmIHRoaXMgcXVldWUgaXMgZW1wdHkuXHJcbiAgICAgKi9cclxuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLmRlcXVldWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhcC5zaXplKCkgIT09IDApIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5oZWFwLnBlZWsoKTtcclxuICAgICAgICAgICAgdGhpcy5oZWFwLnJlbW92ZVJvb3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzLCBidXQgZG9lcyBub3QgcmVtb3ZlLCB0aGUgaGlnaGVzdCBwcmlvcml0eSBlbGVtZW50IG9mIHRoaXMgcXVldWUuXHJcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgaGlnaGVzdCBwcmlvcml0eSBlbGVtZW50IG9mIHRoaXMgcXVldWUsIG9yIHVuZGVmaW5lZCBpZiB0aGlzIHF1ZXVlIGlzIGVtcHR5LlxyXG4gICAgICovXHJcbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlYXAucGVlaygpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgcHJpb3JpdHkgcXVldWUgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgZWxlbWVudCB0byBzZWFyY2ggZm9yLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHByaW9yaXR5IHF1ZXVlIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCxcclxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlYXAuY29udGFpbnMoZWxlbWVudCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdGhpcyBwcmlvcml0eSBxdWV1ZSBpcyBlbXB0eS5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5kIG9ubHkgaWYgdGhpcyBwcmlvcml0eSBxdWV1ZSBjb250YWlucyBubyBpdGVtczsgZmFsc2VcclxuICAgICAqIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWFwLmlzRW1wdHkoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIHByaW9yaXR5IHF1ZXVlLlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgcHJpb3JpdHkgcXVldWUuXHJcbiAgICAgKi9cclxuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhcC5zaXplKCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBvZiB0aGUgZWxlbWVudHMgZnJvbSB0aGlzIHByaW9yaXR5IHF1ZXVlLlxyXG4gICAgICovXHJcbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmhlYXAuY2xlYXIoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIHF1ZXVlIGluXHJcbiAgICAgKiBubyBwYXJ0aWN1bGFyIG9yZGVyLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXHJcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiB0aGUgZWxlbWVudCB2YWx1ZSwgdG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuXHJcbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuaGVhcC5mb3JFYWNoKGNhbGxiYWNrKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUHJpb3JpdHlRdWV1ZTtcclxufSgpKTsgLy8gZW5kIG9mIHByaW9yaXR5IHF1ZXVlXHJcbmV4cG9ydHMuZGVmYXVsdCA9IFByaW9yaXR5UXVldWU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVByaW9yaXR5UXVldWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIExpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL0xpbmtlZExpc3RcIik7XHJcbnZhciBRdWV1ZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBxdWV1ZS5cclxuICAgICAqIEBjbGFzcyBBIHF1ZXVlIGlzIGEgRmlyc3QtSW4tRmlyc3QtT3V0IChGSUZPKSBkYXRhIHN0cnVjdHVyZSwgdGhlIGZpcnN0XHJcbiAgICAgKiBlbGVtZW50IGFkZGVkIHRvIHRoZSBxdWV1ZSB3aWxsIGJlIHRoZSBmaXJzdCBvbmUgdG8gYmUgcmVtb3ZlZC4gVGhpc1xyXG4gICAgICogaW1wbGVtZW50YXRpb24gdXNlcyBhIGxpbmtlZCBsaXN0IGFzIGEgY29udGFpbmVyLlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFF1ZXVlKCkge1xyXG4gICAgICAgIHRoaXMubGlzdCA9IG5ldyBMaW5rZWRMaXN0XzEuZGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnRzIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBpbnRvIHRoZSBlbmQgb2YgdGhpcyBxdWV1ZS5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIHRoZSBlbGVtZW50IHRvIGluc2VydC5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIGluc2VydGVkLCBvciBmYWxzZSBpZiBpdCBpcyB1bmRlZmluZWQuXHJcbiAgICAgKi9cclxuICAgIFF1ZXVlLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5saXN0LmFkZChlbGVtKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEluc2VydHMgdGhlIHNwZWNpZmllZCBlbGVtZW50IGludG8gdGhlIGVuZCBvZiB0aGlzIHF1ZXVlLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gdGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgaW5zZXJ0ZWQsIG9yIGZhbHNlIGlmIGl0IGlzIHVuZGVmaW5lZC5cclxuICAgICAqL1xyXG4gICAgUXVldWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5hZGQoZWxlbSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgYW5kIHJlbW92ZXMgdGhlIGhlYWQgb2YgdGhpcyBxdWV1ZS5cclxuICAgICAqIEByZXR1cm4geyp9IHRoZSBoZWFkIG9mIHRoaXMgcXVldWUsIG9yIHVuZGVmaW5lZCBpZiB0aGlzIHF1ZXVlIGlzIGVtcHR5LlxyXG4gICAgICovXHJcbiAgICBRdWV1ZS5wcm90b3R5cGUuZGVxdWV1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5saXN0LnNpemUoKSAhPT0gMCkge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSB0aGlzLmxpc3QuZmlyc3QoKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0LnJlbW92ZUVsZW1lbnRBdEluZGV4KDApO1xyXG4gICAgICAgICAgICByZXR1cm4gZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMsIGJ1dCBkb2VzIG5vdCByZW1vdmUsIHRoZSBoZWFkIG9mIHRoaXMgcXVldWUuXHJcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgaGVhZCBvZiB0aGlzIHF1ZXVlLCBvciB1bmRlZmluZWQgaWYgdGhpcyBxdWV1ZSBpcyBlbXB0eS5cclxuICAgICAqL1xyXG4gICAgUXVldWUucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGlzdC5zaXplKCkgIT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5maXJzdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgcXVldWUuXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBxdWV1ZS5cclxuICAgICAqL1xyXG4gICAgUXVldWUucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5zaXplKCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBxdWV1ZSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcbiAgICAgKiA8cD5JZiB0aGUgZWxlbWVudHMgaW5zaWRlIHRoaXMgc3RhY2sgYXJlXHJcbiAgICAgKiBub3QgY29tcGFyYWJsZSB3aXRoIHRoZSA9PT0gb3BlcmF0b3IsIGEgY3VzdG9tIGVxdWFscyBmdW5jdGlvbiBzaG91bGQgYmVcclxuICAgICAqIHByb3ZpZGVkIHRvIHBlcmZvcm0gc2VhcmNoZXMsIHRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgdHdvIGFyZ3VtZW50cyBhbmRcclxuICAgICAqIHJldHVybiB0cnVlIGlmIHRoZXkgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuIEV4YW1wbGU6PC9wPlxyXG4gICAgICpcclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiBjb25zdCBwZXRzQXJlRXF1YWxCeU5hbWUgKHBldDEsIHBldDIpIHtcclxuICAgICAqICByZXR1cm4gcGV0MS5uYW1lID09PSBwZXQyLm5hbWU7XHJcbiAgICAgKiB9XHJcbiAgICAgKiA8L3ByZT5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIGVsZW1lbnQgdG8gc2VhcmNoIGZvci5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsXHJcbiAgICAgKiBmdW5jdGlvbiB0byBjaGVjayBpZiB0d28gZWxlbWVudHMgYXJlIGVxdWFsLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHF1ZXVlIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCxcclxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgUXVldWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5jb250YWlucyhlbGVtLCBlcXVhbHNGdW5jdGlvbik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdGhpcyBxdWV1ZSBpcyBlbXB0eS5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5kIG9ubHkgaWYgdGhpcyBxdWV1ZSBjb250YWlucyBubyBpdGVtczsgZmFsc2VcclxuICAgICAqIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgUXVldWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5zaXplKCkgPD0gMDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYWxsIG9mIHRoZSBlbGVtZW50cyBmcm9tIHRoaXMgcXVldWUuXHJcbiAgICAgKi9cclxuICAgIFF1ZXVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxpc3QuY2xlYXIoKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIHF1ZXVlIGluXHJcbiAgICAgKiBGSUZPIG9yZGVyLlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXHJcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiB0aGUgZWxlbWVudCB2YWx1ZSwgdG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuXHJcbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUXVldWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLmxpc3QuZm9yRWFjaChjYWxsYmFjayk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFF1ZXVlO1xyXG59KCkpOyAvLyBFbmQgb2YgcXVldWVcclxuZXhwb3J0cy5kZWZhdWx0ID0gUXVldWU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVF1ZXVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB1dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcclxudmFyIGFycmF5cyA9IHJlcXVpcmUoXCIuL2FycmF5c1wiKTtcclxudmFyIERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoXCIuL0RpY3Rpb25hcnlcIik7XHJcbnZhciBTZXQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgc2V0LlxyXG4gICAgICogQGNsYXNzIDxwPkEgc2V0IGlzIGEgZGF0YSBzdHJ1Y3R1cmUgdGhhdCBjb250YWlucyBubyBkdXBsaWNhdGUgaXRlbXMuPC9wPlxyXG4gICAgICogPHA+SWYgdGhlIGluc2VydGVkIGVsZW1lbnRzIGFyZSBjdXN0b20gb2JqZWN0cyBhIGZ1bmN0aW9uXHJcbiAgICAgKiB3aGljaCBjb252ZXJ0cyBlbGVtZW50cyB0byBzdHJpbmdzIG11c3QgYmUgcHJvdmlkZWQuIEV4YW1wbGU6PC9wPlxyXG4gICAgICpcclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiBmdW5jdGlvbiBwZXRUb1N0cmluZyhwZXQpIHtcclxuICAgICAqICByZXR1cm4gcGV0Lm5hbWU7XHJcbiAgICAgKiB9XHJcbiAgICAgKiA8L3ByZT5cclxuICAgICAqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KTpzdHJpbmc9fSB0b1N0cmluZ0Z1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWRcclxuICAgICAqIHRvIGNvbnZlcnQgZWxlbWVudHMgdG8gc3RyaW5ncy4gSWYgdGhlIGVsZW1lbnRzIGFyZW4ndCBzdHJpbmdzIG9yIGlmIHRvU3RyaW5nKClcclxuICAgICAqIGlzIG5vdCBhcHByb3ByaWF0ZSwgYSBjdXN0b20gZnVuY3Rpb24gd2hpY2ggcmVjZWl2ZXMgYW4gb2JqZWN0IGFuZCByZXR1cm5zIGFcclxuICAgICAqIHVuaXF1ZSBzdHJpbmcgbXVzdCBiZSBwcm92aWRlZC5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gU2V0KHRvU3RyaW5nRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmRpY3Rpb25hcnkgPSBuZXcgRGljdGlvbmFyeV8xLmRlZmF1bHQodG9TdHJpbmdGdW5jdGlvbik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHNldCBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBlbGVtZW50IHRvIHNlYXJjaCBmb3IuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgc2V0IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCxcclxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgU2V0LnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeS5jb250YWluc0tleShlbGVtZW50KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIHNwZWNpZmllZCBlbGVtZW50IHRvIHRoaXMgc2V0IGlmIGl0IGlzIG5vdCBhbHJlYWR5IHByZXNlbnQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCB0aGUgZWxlbWVudCB0byBpbnNlcnQuXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgc2V0IGRpZCBub3QgYWxyZWFkeSBjb250YWluIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGVsZW1lbnQpIHx8IHV0aWwuaXNVbmRlZmluZWQoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5kaWN0aW9uYXJ5LnNldFZhbHVlKGVsZW1lbnQsIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtcyBhbiBpbnRlcnNlY2lvbiBiZXR3ZWVuIHRoaXMgYW5kIGFub3RoZXIgc2V0LlxyXG4gICAgICogUmVtb3ZlcyBhbGwgdmFsdWVzIHRoYXQgYXJlIG5vdCBwcmVzZW50IHRoaXMgc2V0IGFuZCB0aGUgZ2l2ZW4gc2V0LlxyXG4gICAgICogQHBhcmFtIHtjb2xsZWN0aW9ucy5TZXR9IG90aGVyU2V0IG90aGVyIHNldC5cclxuICAgICAqL1xyXG4gICAgU2V0LnByb3RvdHlwZS5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiAob3RoZXJTZXQpIHtcclxuICAgICAgICB2YXIgc2V0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKCFvdGhlclNldC5jb250YWlucyhlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgc2V0LnJlbW92ZShlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIGEgdW5pb24gYmV0d2VlbiB0aGlzIGFuZCBhbm90aGVyIHNldC5cclxuICAgICAqIEFkZHMgYWxsIHZhbHVlcyBmcm9tIHRoZSBnaXZlbiBzZXQgdG8gdGhpcyBzZXQuXHJcbiAgICAgKiBAcGFyYW0ge2NvbGxlY3Rpb25zLlNldH0gb3RoZXJTZXQgb3RoZXIgc2V0LlxyXG4gICAgICovXHJcbiAgICBTZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24gKG90aGVyU2V0KSB7XHJcbiAgICAgICAgdmFyIHNldCA9IHRoaXM7XHJcbiAgICAgICAgb3RoZXJTZXQuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBzZXQuYWRkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIGEgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoaXMgYW5kIGFub3RoZXIgc2V0LlxyXG4gICAgICogUmVtb3ZlcyBmcm9tIHRoaXMgc2V0IGFsbCB0aGUgdmFsdWVzIHRoYXQgYXJlIHByZXNlbnQgaW4gdGhlIGdpdmVuIHNldC5cclxuICAgICAqIEBwYXJhbSB7Y29sbGVjdGlvbnMuU2V0fSBvdGhlclNldCBvdGhlciBzZXQuXHJcbiAgICAgKi9cclxuICAgIFNldC5wcm90b3R5cGUuZGlmZmVyZW5jZSA9IGZ1bmN0aW9uIChvdGhlclNldCkge1xyXG4gICAgICAgIHZhciBzZXQgPSB0aGlzO1xyXG4gICAgICAgIG90aGVyU2V0LmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgc2V0LnJlbW92ZShlbGVtZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gc2V0IGNvbnRhaW5zIGFsbCB0aGUgZWxlbWVudHMgaW4gdGhpcyBzZXQuXHJcbiAgICAgKiBAcGFyYW0ge2NvbGxlY3Rpb25zLlNldH0gb3RoZXJTZXQgb3RoZXIgc2V0LlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHNldCBpcyBhIHN1YnNldCBvZiB0aGUgZ2l2ZW4gc2V0LlxyXG4gICAgICovXHJcbiAgICBTZXQucHJvdG90eXBlLmlzU3Vic2V0T2YgPSBmdW5jdGlvbiAob3RoZXJTZXQpIHtcclxuICAgICAgICBpZiAodGhpcy5zaXplKCkgPiBvdGhlclNldC5zaXplKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaXNTdWIgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoIW90aGVyU2V0LmNvbnRhaW5zKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBpc1N1YiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBpc1N1YjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCBlbGVtZW50IGZyb20gdGhpcyBzZXQgaWYgaXQgaXMgcHJlc2VudC5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBzZXQgY29udGFpbmVkIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgU2V0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhlbGVtZW50KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRpY3Rpb25hcnkucmVtb3ZlKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50XHJcbiAgICAgKiBwcmVzZW50IGluIHRoaXMgc2V0LlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXHJcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50czogdGhlIGVsZW1lbnQuIFRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxyXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFNldC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuZGljdGlvbmFyeS5mb3JFYWNoKGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayh2KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgc2V0IGluIGFyYml0cmFyeSBvcmRlci5cclxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgZWxlbWVudHMgaW4gdGhpcyBzZXQuXHJcbiAgICAgKi9cclxuICAgIFNldC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5LnZhbHVlcygpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgc2V0IGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHNldCBjb250YWlucyBubyBlbGVtZW50cy5cclxuICAgICAqL1xyXG4gICAgU2V0LnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnkuaXNFbXB0eSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgc2V0LlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgc2V0LlxyXG4gICAgICovXHJcbiAgICBTZXQucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeS5zaXplKCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBvZiB0aGUgZWxlbWVudHMgZnJvbSB0aGlzIHNldC5cclxuICAgICAqL1xyXG4gICAgU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmRpY3Rpb25hcnkuY2xlYXIoKTtcclxuICAgIH07XHJcbiAgICAvKlxyXG4gICAgKiBQcm92aWRlcyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBmb3IgZGlzcGxheVxyXG4gICAgKi9cclxuICAgIFNldC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5cy50b1N0cmluZyh0aGlzLnRvQXJyYXkoKSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNldDtcclxufSgpKTsgLy8gZW5kIG9mIFNldFxyXG5leHBvcnRzLmRlZmF1bHQgPSBTZXQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVNldC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgTGlua2VkTGlzdF8xID0gcmVxdWlyZShcIi4vTGlua2VkTGlzdFwiKTtcclxudmFyIFN0YWNrID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGVtcHR5IFN0YWNrLlxyXG4gICAgICogQGNsYXNzIEEgU3RhY2sgaXMgYSBMYXN0LUluLUZpcnN0LU91dCAoTElGTykgZGF0YSBzdHJ1Y3R1cmUsIHRoZSBsYXN0XHJcbiAgICAgKiBlbGVtZW50IGFkZGVkIHRvIHRoZSBzdGFjayB3aWxsIGJlIHRoZSBmaXJzdCBvbmUgdG8gYmUgcmVtb3ZlZC4gVGhpc1xyXG4gICAgICogaW1wbGVtZW50YXRpb24gdXNlcyBhIGxpbmtlZCBsaXN0IGFzIGEgY29udGFpbmVyLlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFN0YWNrKCkge1xyXG4gICAgICAgIHRoaXMubGlzdCA9IG5ldyBMaW5rZWRMaXN0XzEuZGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBQdXNoZXMgYW4gaXRlbSBvbnRvIHRoZSB0b3Agb2YgdGhpcyBzdGFjay5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIHRoZSBlbGVtZW50IHRvIGJlIHB1c2hlZCBvbnRvIHRoaXMgc3RhY2suXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBlbGVtZW50IHdhcyBwdXNoZWQgb3IgZmFsc2UgaWYgaXQgaXMgdW5kZWZpbmVkLlxyXG4gICAgICovXHJcbiAgICBTdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5hZGQoZWxlbSwgMCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBQdXNoZXMgYW4gaXRlbSBvbnRvIHRoZSB0b3Agb2YgdGhpcyBzdGFjay5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIHRoZSBlbGVtZW50IHRvIGJlIHB1c2hlZCBvbnRvIHRoaXMgc3RhY2suXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBlbGVtZW50IHdhcyBwdXNoZWQgb3IgZmFsc2UgaWYgaXQgaXMgdW5kZWZpbmVkLlxyXG4gICAgICovXHJcbiAgICBTdGFjay5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5saXN0LmFkZChlbGVtLCAwKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIG9iamVjdCBhdCB0aGUgdG9wIG9mIHRoaXMgc3RhY2sgYW5kIHJldHVybnMgdGhhdCBvYmplY3QuXHJcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgb2JqZWN0IGF0IHRoZSB0b3Agb2YgdGhpcyBzdGFjayBvciB1bmRlZmluZWQgaWYgdGhlXHJcbiAgICAgKiBzdGFjayBpcyBlbXB0eS5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5saXN0LnJlbW92ZUVsZW1lbnRBdEluZGV4KDApO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogTG9va3MgYXQgdGhlIG9iamVjdCBhdCB0aGUgdG9wIG9mIHRoaXMgc3RhY2sgd2l0aG91dCByZW1vdmluZyBpdCBmcm9tIHRoZVxyXG4gICAgICogc3RhY2suXHJcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgb2JqZWN0IGF0IHRoZSB0b3Agb2YgdGhpcyBzdGFjayBvciB1bmRlZmluZWQgaWYgdGhlXHJcbiAgICAgKiBzdGFjayBpcyBlbXB0eS5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5maXJzdCgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgc3RhY2suXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBzdGFjay5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5zaXplKCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBzdGFjayBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcbiAgICAgKiA8cD5JZiB0aGUgZWxlbWVudHMgaW5zaWRlIHRoaXMgc3RhY2sgYXJlXHJcbiAgICAgKiBub3QgY29tcGFyYWJsZSB3aXRoIHRoZSA9PT0gb3BlcmF0b3IsIGEgY3VzdG9tIGVxdWFscyBmdW5jdGlvbiBzaG91bGQgYmVcclxuICAgICAqIHByb3ZpZGVkIHRvIHBlcmZvcm0gc2VhcmNoZXMsIHRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgdHdvIGFyZ3VtZW50cyBhbmRcclxuICAgICAqIHJldHVybiB0cnVlIGlmIHRoZXkgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuIEV4YW1wbGU6PC9wPlxyXG4gICAgICpcclxuICAgICAqIDxwcmU+XHJcbiAgICAgKiBjb25zdCBwZXRzQXJlRXF1YWxCeU5hbWUgKHBldDEsIHBldDIpIHtcclxuICAgICAqICByZXR1cm4gcGV0MS5uYW1lID09PSBwZXQyLm5hbWU7XHJcbiAgICAgKiB9XHJcbiAgICAgKiA8L3ByZT5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIGVsZW1lbnQgdG8gc2VhcmNoIGZvci5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsXHJcbiAgICAgKiBmdW5jdGlvbiB0byBjaGVjayBpZiB0d28gZWxlbWVudHMgYXJlIGVxdWFsLlxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHN0YWNrIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCxcclxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5jb250YWlucyhlbGVtLCBlcXVhbHNGdW5jdGlvbik7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdGhpcyBzdGFjayBpcyBlbXB0eS5cclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5kIG9ubHkgaWYgdGhpcyBzdGFjayBjb250YWlucyBubyBpdGVtczsgZmFsc2VcclxuICAgICAqIG90aGVyd2lzZS5cclxuICAgICAqL1xyXG4gICAgU3RhY2sucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5pc0VtcHR5KCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFsbCBvZiB0aGUgZWxlbWVudHMgZnJvbSB0aGlzIHN0YWNrLlxyXG4gICAgICovXHJcbiAgICBTdGFjay5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0LmNsZWFyKCk7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyBzdGFjayBpblxyXG4gICAgICogTElGTyBvcmRlci5cclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xyXG4gICAgICogaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxyXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFN0YWNrLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goY2FsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTdGFjaztcclxufSgpKTsgLy8gRW5kIG9mIHN0YWNrXHJcbmV4cG9ydHMuZGVmYXVsdCA9IFN0YWNrO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdGFjay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiB0aGUgc3BlY2lmaWVkIGl0ZW1cclxuICogd2l0aGluIHRoZSBzcGVjaWZpZWQgYXJyYXkuNFxyXG4gKiBAcGFyYW0geyp9IGFycmF5IHRoZSBhcnJheSBpbiB3aGljaCB0byBzZWFyY2ggdGhlIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIHRoZSBlbGVtZW50IHRvIHNlYXJjaC5cclxuICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdXNlZCB0b1xyXG4gKiBjaGVjayBlcXVhbGl0eSBiZXR3ZWVuIDIgZWxlbWVudHMuXHJcbiAqIEByZXR1cm4ge251bWJlcn0gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudFxyXG4gKiB3aXRoaW4gdGhlIHNwZWNpZmllZCBhcnJheSwgb3IgLTEgaWYgbm90IGZvdW5kLlxyXG4gKi9cclxuZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgaXRlbSwgZXF1YWxzRnVuY3Rpb24pIHtcclxuICAgIHZhciBlcXVhbHMgPSBlcXVhbHNGdW5jdGlvbiB8fCB1dGlsLmRlZmF1bHRFcXVhbHM7XHJcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChlcXVhbHMoYXJyYXlbaV0sIGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxufVxyXG5leHBvcnRzLmluZGV4T2YgPSBpbmRleE9mO1xyXG4vKipcclxuICogUmV0dXJucyB0aGUgcG9zaXRpb24gb2YgdGhlIGxhc3Qgb2NjdXJyZW5jZSBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnRcclxuICogd2l0aGluIHRoZSBzcGVjaWZpZWQgYXJyYXkuXHJcbiAqIEBwYXJhbSB7Kn0gYXJyYXkgdGhlIGFycmF5IGluIHdoaWNoIHRvIHNlYXJjaCB0aGUgZWxlbWVudC5cclxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gdGhlIGVsZW1lbnQgdG8gc2VhcmNoLlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSBlcXVhbHNGdW5jdGlvbiBvcHRpb25hbCBmdW5jdGlvbiB1c2VkIHRvXHJcbiAqIGNoZWNrIGVxdWFsaXR5IGJldHdlZW4gMiBlbGVtZW50cy5cclxuICogQHJldHVybiB7bnVtYmVyfSB0aGUgcG9zaXRpb24gb2YgdGhlIGxhc3Qgb2NjdXJyZW5jZSBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnRcclxuICogd2l0aGluIHRoZSBzcGVjaWZpZWQgYXJyYXkgb3IgLTEgaWYgbm90IGZvdW5kLlxyXG4gKi9cclxuZnVuY3Rpb24gbGFzdEluZGV4T2YoYXJyYXksIGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XHJcbiAgICB2YXIgZXF1YWxzID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xyXG4gICAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSBsZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIGlmIChlcXVhbHMoYXJyYXlbaV0sIGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxufVxyXG5leHBvcnRzLmxhc3RJbmRleE9mID0gbGFzdEluZGV4T2Y7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBhcnJheSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7Kn0gYXJyYXkgdGhlIGFycmF5IGluIHdoaWNoIHRvIHNlYXJjaCB0aGUgZWxlbWVudC5cclxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gdGhlIGVsZW1lbnQgdG8gc2VhcmNoLlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSBlcXVhbHNGdW5jdGlvbiBvcHRpb25hbCBmdW5jdGlvbiB0b1xyXG4gKiBjaGVjayBlcXVhbGl0eSBiZXR3ZWVuIDIgZWxlbWVudHMuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIHNwZWNpZmllZCBhcnJheSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBjb250YWlucyhhcnJheSwgaXRlbSwgZXF1YWxzRnVuY3Rpb24pIHtcclxuICAgIHJldHVybiBpbmRleE9mKGFycmF5LCBpdGVtLCBlcXVhbHNGdW5jdGlvbikgPj0gMDtcclxufVxyXG5leHBvcnRzLmNvbnRhaW5zID0gY29udGFpbnM7XHJcbi8qKlxyXG4gKiBSZW1vdmVzIHRoZSBmaXJzdCBvY3VycmVuY2Ugb2YgdGhlIHNwZWNpZmllZCBlbGVtZW50IGZyb20gdGhlIHNwZWNpZmllZCBhcnJheS5cclxuICogQHBhcmFtIHsqfSBhcnJheSB0aGUgYXJyYXkgaW4gd2hpY2ggdG8gc2VhcmNoIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIHRoZSBlbGVtZW50IHRvIHNlYXJjaC5cclxuICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdG9cclxuICogY2hlY2sgZXF1YWxpdHkgYmV0d2VlbiAyIGVsZW1lbnRzLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBhcnJheSBjaGFuZ2VkIGFmdGVyIHRoaXMgY2FsbC5cclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZShhcnJheSwgaXRlbSwgZXF1YWxzRnVuY3Rpb24pIHtcclxuICAgIHZhciBpbmRleCA9IGluZGV4T2YoYXJyYXksIGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKTtcclxuICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZXhwb3J0cy5yZW1vdmUgPSByZW1vdmU7XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIHNwZWNpZmllZCBhcnJheSBlcXVhbFxyXG4gKiB0byB0aGUgc3BlY2lmaWVkIG9iamVjdC5cclxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgdGhlIGFycmF5IGluIHdoaWNoIHRvIGRldGVybWluZSB0aGUgZnJlcXVlbmN5IG9mIHRoZSBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSB0aGUgZWxlbWVudCB3aG9zZSBmcmVxdWVuY3kgaXMgdG8gYmUgZGV0ZXJtaW5lZC5cclxuICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdXNlZCB0b1xyXG4gKiBjaGVjayBlcXVhbGl0eSBiZXR3ZWVuIDIgZWxlbWVudHMuXHJcbiAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIGFycmF5XHJcbiAqIGVxdWFsIHRvIHRoZSBzcGVjaWZpZWQgb2JqZWN0LlxyXG4gKi9cclxuZnVuY3Rpb24gZnJlcXVlbmN5KGFycmF5LCBpdGVtLCBlcXVhbHNGdW5jdGlvbikge1xyXG4gICAgdmFyIGVxdWFscyA9IGVxdWFsc0Z1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdEVxdWFscztcclxuICAgIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcbiAgICB2YXIgZnJlcSA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGVxdWFscyhhcnJheVtpXSwgaXRlbSkpIHtcclxuICAgICAgICAgICAgZnJlcSsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmcmVxO1xyXG59XHJcbmV4cG9ydHMuZnJlcXVlbmN5ID0gZnJlcXVlbmN5O1xyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB0d28gc3BlY2lmaWVkIGFycmF5cyBhcmUgZXF1YWwgdG8gb25lIGFub3RoZXIuXHJcbiAqIFR3byBhcnJheXMgYXJlIGNvbnNpZGVyZWQgZXF1YWwgaWYgYm90aCBhcnJheXMgY29udGFpbiB0aGUgc2FtZSBudW1iZXJcclxuICogb2YgZWxlbWVudHMsIGFuZCBhbGwgY29ycmVzcG9uZGluZyBwYWlycyBvZiBlbGVtZW50cyBpbiB0aGUgdHdvXHJcbiAqIGFycmF5cyBhcmUgZXF1YWwgYW5kIGFyZSBpbiB0aGUgc2FtZSBvcmRlci5cclxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkxIG9uZSBhcnJheSB0byBiZSB0ZXN0ZWQgZm9yIGVxdWFsaXR5LlxyXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheTIgdGhlIG90aGVyIGFycmF5IHRvIGJlIHRlc3RlZCBmb3IgZXF1YWxpdHkuXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWQgdG9cclxuICogY2hlY2sgZXF1YWxpdHkgYmV0d2VlbiBlbGVtZW1lbnRzIGluIHRoZSBhcnJheXMuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIHR3byBhcnJheXMgYXJlIGVxdWFsXHJcbiAqL1xyXG5mdW5jdGlvbiBlcXVhbHMoYXJyYXkxLCBhcnJheTIsIGVxdWFsc0Z1bmN0aW9uKSB7XHJcbiAgICB2YXIgZXF1YWxzID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xyXG4gICAgaWYgKGFycmF5MS5sZW5ndGggIT09IGFycmF5Mi5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkxLmxlbmd0aDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoIWVxdWFscyhhcnJheTFbaV0sIGFycmF5MltpXSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmV4cG9ydHMuZXF1YWxzID0gZXF1YWxzO1xyXG4vKipcclxuICogUmV0dXJucyBzaGFsbG93IGEgY29weSBvZiB0aGUgc3BlY2lmaWVkIGFycmF5LlxyXG4gKiBAcGFyYW0geyp9IGFycmF5IHRoZSBhcnJheSB0byBjb3B5LlxyXG4gKiBAcmV0dXJuIHtBcnJheX0gYSBjb3B5IG9mIHRoZSBzcGVjaWZpZWQgYXJyYXlcclxuICovXHJcbmZ1bmN0aW9uIGNvcHkoYXJyYXkpIHtcclxuICAgIHJldHVybiBhcnJheS5jb25jYXQoKTtcclxufVxyXG5leHBvcnRzLmNvcHkgPSBjb3B5O1xyXG4vKipcclxuICogU3dhcHMgdGhlIGVsZW1lbnRzIGF0IHRoZSBzcGVjaWZpZWQgcG9zaXRpb25zIGluIHRoZSBzcGVjaWZpZWQgYXJyYXkuXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSBpbiB3aGljaCB0byBzd2FwIGVsZW1lbnRzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gaSB0aGUgaW5kZXggb2Ygb25lIGVsZW1lbnQgdG8gYmUgc3dhcHBlZC5cclxuICogQHBhcmFtIHtudW1iZXJ9IGogdGhlIGluZGV4IG9mIHRoZSBvdGhlciBlbGVtZW50IHRvIGJlIHN3YXBwZWQuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGFycmF5IGlzIGRlZmluZWQgYW5kIHRoZSBpbmRleGVzIGFyZSB2YWxpZC5cclxuICovXHJcbmZ1bmN0aW9uIHN3YXAoYXJyYXksIGksIGopIHtcclxuICAgIGlmIChpIDwgMCB8fCBpID49IGFycmF5Lmxlbmd0aCB8fCBqIDwgMCB8fCBqID49IGFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHZhciB0ZW1wID0gYXJyYXlbaV07XHJcbiAgICBhcnJheVtpXSA9IGFycmF5W2pdO1xyXG4gICAgYXJyYXlbal0gPSB0ZW1wO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZXhwb3J0cy5zd2FwID0gc3dhcDtcclxuZnVuY3Rpb24gdG9TdHJpbmcoYXJyYXkpIHtcclxuICAgIHJldHVybiAnWycgKyBhcnJheS50b1N0cmluZygpICsgJ10nO1xyXG59XHJcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcclxuLyoqXHJcbiAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIGFycmF5XHJcbiAqIHN0YXJ0aW5nIGZyb20gaW5kZXggMCB0byBsZW5ndGggLSAxLlxyXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgaW4gd2hpY2ggdG8gaXRlcmF0ZS5cclxuICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXHJcbiAqIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cclxuICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBmb3JFYWNoKGFycmF5LCBjYWxsYmFjaykge1xyXG4gICAgZm9yICh2YXIgX2kgPSAwLCBhcnJheV8xID0gYXJyYXk7IF9pIDwgYXJyYXlfMS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICB2YXIgZWxlID0gYXJyYXlfMVtfaV07XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKGVsZSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5mb3JFYWNoID0gZm9yRWFjaDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJyYXlzLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBfaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xyXG5leHBvcnRzLmhhcyA9IGZ1bmN0aW9uIChvYmosIHByb3ApIHtcclxuICAgIHJldHVybiBfaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xyXG59O1xyXG4vKipcclxuICogRGVmYXVsdCBmdW5jdGlvbiB0byBjb21wYXJlIGVsZW1lbnQgb3JkZXIuXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoYSwgYikge1xyXG4gICAgaWYgKGEgPCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gYikge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0Q29tcGFyZSA9IGRlZmF1bHRDb21wYXJlO1xyXG4vKipcclxuICogRGVmYXVsdCBmdW5jdGlvbiB0byB0ZXN0IGVxdWFsaXR5LlxyXG4gKiBAZnVuY3Rpb25cclxuICovXHJcbmZ1bmN0aW9uIGRlZmF1bHRFcXVhbHMoYSwgYikge1xyXG4gICAgcmV0dXJuIGEgPT09IGI7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0RXF1YWxzID0gZGVmYXVsdEVxdWFscztcclxuLyoqXHJcbiAqIERlZmF1bHQgZnVuY3Rpb24gdG8gY29udmVydCBhbiBvYmplY3QgdG8gYSBzdHJpbmcuXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gZGVmYXVsdFRvU3RyaW5nKGl0ZW0pIHtcclxuICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuICdDT0xMRUNUSU9OX05VTEwnO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNVbmRlZmluZWQoaXRlbSkpIHtcclxuICAgICAgICByZXR1cm4gJ0NPTExFQ1RJT05fVU5ERUZJTkVEJztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzU3RyaW5nKGl0ZW0pKSB7XHJcbiAgICAgICAgcmV0dXJuICckcycgKyBpdGVtO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICckbycgKyBpdGVtLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0VG9TdHJpbmcgPSBkZWZhdWx0VG9TdHJpbmc7XHJcbi8qKlxyXG4gKiBKb2lucyBhbGwgdGhlIHByb3BlcmllcyBvZiB0aGUgb2JqZWN0IHVzaW5nIHRoZSBwcm92aWRlZCBqb2luIHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gbWFrZVN0cmluZyhpdGVtLCBqb2luKSB7XHJcbiAgICBpZiAoam9pbiA9PT0gdm9pZCAwKSB7IGpvaW4gPSAnLCc7IH1cclxuICAgIGlmIChpdGVtID09PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuICdDT0xMRUNUSU9OX05VTEwnO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNVbmRlZmluZWQoaXRlbSkpIHtcclxuICAgICAgICByZXR1cm4gJ0NPTExFQ1RJT05fVU5ERUZJTkVEJztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzU3RyaW5nKGl0ZW0pKSB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0udG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciB0b3JldCA9ICd7JztcclxuICAgICAgICB2YXIgZmlyc3QgPSB0cnVlO1xyXG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoZXhwb3J0cy5oYXMoaXRlbSwgcHJvcCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChmaXJzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3JldCA9IHRvcmV0ICsgam9pbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRvcmV0ID0gdG9yZXQgKyBwcm9wICsgJzonICsgaXRlbVtwcm9wXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG9yZXQgKyAnfSc7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5tYWtlU3RyaW5nID0gbWFrZVN0cmluZztcclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBmdW5jdGlvbi5cclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZ1bmMpIHtcclxuICAgIHJldHVybiAodHlwZW9mIGZ1bmMpID09PSAnZnVuY3Rpb24nO1xyXG59XHJcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIHVuZGVmaW5lZC5cclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcclxuICAgIHJldHVybiAodHlwZW9mIG9iaikgPT09ICd1bmRlZmluZWQnO1xyXG59XHJcbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBzdHJpbmcuXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG59XHJcbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcclxuLyoqXHJcbiAqIFJldmVyc2VzIGEgY29tcGFyZSBmdW5jdGlvbi5cclxuICogQGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiByZXZlcnNlQ29tcGFyZUZ1bmN0aW9uKGNvbXBhcmVGdW5jdGlvbikge1xyXG4gICAgaWYgKGlzVW5kZWZpbmVkKGNvbXBhcmVGdW5jdGlvbikgfHwgIWlzRnVuY3Rpb24oY29tcGFyZUZ1bmN0aW9uKSkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICBpZiAoYSA8IGIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGEgPT09IGIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZCwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcGFyZUZ1bmN0aW9uKGQsIHYpICogLTE7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLnJldmVyc2VDb21wYXJlRnVuY3Rpb24gPSByZXZlcnNlQ29tcGFyZUZ1bmN0aW9uO1xyXG4vKipcclxuICogUmV0dXJucyBhbiBlcXVhbCBmdW5jdGlvbiBnaXZlbiBhIGNvbXBhcmUgZnVuY3Rpb24uXHJcbiAqIEBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGFyZVRvRXF1YWxzKGNvbXBhcmVGdW5jdGlvbikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbXBhcmVGdW5jdGlvbihhLCBiKSA9PT0gMDtcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5jb21wYXJlVG9FcXVhbHMgPSBjb21wYXJlVG9FcXVhbHM7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLy8gQ29weXJpZ2h0IDIwMTMgQmFzYXJhdCBBbGkgU3llZC4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuLy9cclxuLy8gTGljZW5zZWQgdW5kZXIgTUlUIG9wZW4gc291cmNlIGxpY2Vuc2UgaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4vL1xyXG4vLyBPcmdpbmFsIGphdmFzY3JpcHQgY29kZSB3YXMgYnkgTWF1cmljaW8gU2FudG9zXHJcbi8vXHJcbnZhciBfYXJyYXlzID0gcmVxdWlyZShcIi4vYXJyYXlzXCIpO1xyXG5leHBvcnRzLmFycmF5cyA9IF9hcnJheXM7XHJcbnZhciBCYWdfMSA9IHJlcXVpcmUoXCIuL0JhZ1wiKTtcclxuZXhwb3J0cy5CYWcgPSBCYWdfMS5kZWZhdWx0O1xyXG52YXIgQlNUcmVlXzEgPSByZXF1aXJlKFwiLi9CU1RyZWVcIik7XHJcbmV4cG9ydHMuQlNUcmVlID0gQlNUcmVlXzEuZGVmYXVsdDtcclxudmFyIEJTVHJlZUtWXzEgPSByZXF1aXJlKFwiLi9CU1RyZWVLVlwiKTtcclxuZXhwb3J0cy5CU1RyZWVLViA9IEJTVHJlZUtWXzEuZGVmYXVsdDtcclxudmFyIERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoXCIuL0RpY3Rpb25hcnlcIik7XHJcbmV4cG9ydHMuRGljdGlvbmFyeSA9IERpY3Rpb25hcnlfMS5kZWZhdWx0O1xyXG52YXIgSGVhcF8xID0gcmVxdWlyZShcIi4vSGVhcFwiKTtcclxuZXhwb3J0cy5IZWFwID0gSGVhcF8xLmRlZmF1bHQ7XHJcbnZhciBMaW5rZWREaWN0aW9uYXJ5XzEgPSByZXF1aXJlKFwiLi9MaW5rZWREaWN0aW9uYXJ5XCIpO1xyXG5leHBvcnRzLkxpbmtlZERpY3Rpb25hcnkgPSBMaW5rZWREaWN0aW9uYXJ5XzEuZGVmYXVsdDtcclxudmFyIExpbmtlZExpc3RfMSA9IHJlcXVpcmUoXCIuL0xpbmtlZExpc3RcIik7XHJcbmV4cG9ydHMuTGlua2VkTGlzdCA9IExpbmtlZExpc3RfMS5kZWZhdWx0O1xyXG52YXIgTXVsdGlEaWN0aW9uYXJ5XzEgPSByZXF1aXJlKFwiLi9NdWx0aURpY3Rpb25hcnlcIik7XHJcbmV4cG9ydHMuTXVsdGlEaWN0aW9uYXJ5ID0gTXVsdGlEaWN0aW9uYXJ5XzEuZGVmYXVsdDtcclxudmFyIEZhY3RvcnlEaWN0aW9uYXJ5XzEgPSByZXF1aXJlKFwiLi9GYWN0b3J5RGljdGlvbmFyeVwiKTtcclxuZXhwb3J0cy5GYWN0b3J5RGljdGlvbmFyeSA9IEZhY3RvcnlEaWN0aW9uYXJ5XzEuZGVmYXVsdDtcclxudmFyIEZhY3RvcnlEaWN0aW9uYXJ5XzIgPSByZXF1aXJlKFwiLi9GYWN0b3J5RGljdGlvbmFyeVwiKTtcclxuZXhwb3J0cy5EZWZhdWx0RGljdGlvbmFyeSA9IEZhY3RvcnlEaWN0aW9uYXJ5XzIuZGVmYXVsdDtcclxudmFyIFF1ZXVlXzEgPSByZXF1aXJlKFwiLi9RdWV1ZVwiKTtcclxuZXhwb3J0cy5RdWV1ZSA9IFF1ZXVlXzEuZGVmYXVsdDtcclxudmFyIFByaW9yaXR5UXVldWVfMSA9IHJlcXVpcmUoXCIuL1ByaW9yaXR5UXVldWVcIik7XHJcbmV4cG9ydHMuUHJpb3JpdHlRdWV1ZSA9IFByaW9yaXR5UXVldWVfMS5kZWZhdWx0O1xyXG52YXIgU2V0XzEgPSByZXF1aXJlKFwiLi9TZXRcIik7XHJcbmV4cG9ydHMuU2V0ID0gU2V0XzEuZGVmYXVsdDtcclxudmFyIFN0YWNrXzEgPSByZXF1aXJlKFwiLi9TdGFja1wiKTtcclxuZXhwb3J0cy5TdGFjayA9IFN0YWNrXzEuZGVmYXVsdDtcclxudmFyIE11bHRpUm9vdFRyZWVfMSA9IHJlcXVpcmUoXCIuL011bHRpUm9vdFRyZWVcIik7XHJcbmV4cG9ydHMuTXVsdGlSb290VHJlZSA9IE11bHRpUm9vdFRyZWVfMS5kZWZhdWx0O1xyXG52YXIgX3V0aWwgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xyXG5leHBvcnRzLnV0aWwgPSBfdXRpbDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl19
return require('typescript-collections');
});