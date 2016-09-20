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

},{"./Queue":11,"./util":15}],2:[function(require,module,exports){
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

},{"./Dictionary":3,"./Set":12,"./util":15}],3:[function(require,module,exports){
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

},{"./util":15}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dictionary_1 = require('./Dictionary');
var util = require('./util');
var FactoryDictionary = (function (_super) {
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
        _super.call(this, toStrFunction);
        this.defaultFactoryFunction = defaultFactoryFunction;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FactoryDictionary;

},{"./Dictionary":3,"./util":15}],5:[function(require,module,exports){
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

},{"./arrays":14,"./util":15}],6:[function(require,module,exports){
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

},{"./Dictionary":3,"./util":15}],7:[function(require,module,exports){
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

},{"./arrays":14,"./util":15}],8:[function(require,module,exports){
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

},{"./Dictionary":3,"./arrays":14,"./util":15}],9:[function(require,module,exports){
"use strict";
(function (Direction) {
    Direction[Direction["BEFORE"] = 0] = "BEFORE";
    Direction[Direction["AFTER"] = 1] = "AFTER";
    Direction[Direction["INSIDE_AT_END"] = 2] = "INSIDE_AT_END";
    Direction[Direction["INSIDE_AT_START"] = 3] = "INSIDE_AT_START";
})(exports.Direction || (exports.Direction = {}));
var Direction = exports.Direction;
var MultiRootTree = (function () {
    function MultiRootTree() {
        // ids must be unique
        this.rootIds = [];
        this.nodes = {};
    }
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
                this.rootDelete(sourceRootIndex);
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
    ;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MultiRootTree;

},{}],10:[function(require,module,exports){
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

},{"./Heap":5,"./util":15}],11:[function(require,module,exports){
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

},{"./LinkedList":7}],12:[function(require,module,exports){
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

},{"./Dictionary":3,"./arrays":14,"./util":15}],13:[function(require,module,exports){
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

},{"./LinkedList":7}],14:[function(require,module,exports){
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

},{"./util":15}],15:[function(require,module,exports){
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
var FactoryDictionary_1 = require('./FactoryDictionary');
exports.FactoryDictionary = FactoryDictionary_1.default;
var FactoryDictionary_2 = require('./FactoryDictionary');
exports.DefaultDictionary = FactoryDictionary_2.default;
var Queue_1 = require('./Queue');
exports.Queue = Queue_1.default;
var PriorityQueue_1 = require('./PriorityQueue');
exports.PriorityQueue = PriorityQueue_1.default;
var Set_1 = require('./Set');
exports.Set = Set_1.default;
var Stack_1 = require('./Stack');
exports.Stack = Stack_1.default;
var MultiRootTree_1 = require('./MultiRootTree');
exports.MultiRootTree = MultiRootTree_1.default;
var _util = require('./util');
exports.util = _util;

},{"./BSTree":1,"./Bag":2,"./Dictionary":3,"./FactoryDictionary":4,"./Heap":5,"./LinkedDictionary":6,"./LinkedList":7,"./MultiDictionary":8,"./MultiRootTree":9,"./PriorityQueue":10,"./Queue":11,"./Set":12,"./Stack":13,"./arrays":14,"./util":15}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2xpYi9CU1RyZWUuanMiLCJkaXN0L2xpYi9CYWcuanMiLCJkaXN0L2xpYi9EaWN0aW9uYXJ5LmpzIiwiZGlzdC9saWIvRmFjdG9yeURpY3Rpb25hcnkuanMiLCJkaXN0L2xpYi9IZWFwLmpzIiwiZGlzdC9saWIvTGlua2VkRGljdGlvbmFyeS5qcyIsImRpc3QvbGliL0xpbmtlZExpc3QuanMiLCJkaXN0L2xpYi9NdWx0aURpY3Rpb25hcnkuanMiLCJkaXN0L2xpYi9NdWx0aVJvb3RUcmVlLmpzIiwiZGlzdC9saWIvUHJpb3JpdHlRdWV1ZS5qcyIsImRpc3QvbGliL1F1ZXVlLmpzIiwiZGlzdC9saWIvU2V0LmpzIiwiZGlzdC9saWIvU3RhY2suanMiLCJkaXN0L2xpYi9hcnJheXMuanMiLCJkaXN0L2xpYi91dGlsLmpzIiwiZGlzdC9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBRdWV1ZV8xID0gcmVxdWlyZSgnLi9RdWV1ZScpO1xudmFyIEJTVHJlZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBiaW5hcnkgc2VhcmNoIHRyZWUuXG4gICAgICogQGNsYXNzIDxwPkEgYmluYXJ5IHNlYXJjaCB0cmVlIGlzIGEgYmluYXJ5IHRyZWUgaW4gd2hpY2ggZWFjaFxuICAgICAqIGludGVybmFsIG5vZGUgc3RvcmVzIGFuIGVsZW1lbnQgc3VjaCB0aGF0IHRoZSBlbGVtZW50cyBzdG9yZWQgaW4gdGhlXG4gICAgICogbGVmdCBzdWJ0cmVlIGFyZSBsZXNzIHRoYW4gaXQgYW5kIHRoZSBlbGVtZW50c1xuICAgICAqIHN0b3JlZCBpbiB0aGUgcmlnaHQgc3VidHJlZSBhcmUgZ3JlYXRlci48L3A+XG4gICAgICogPHA+Rm9ybWFsbHksIGEgYmluYXJ5IHNlYXJjaCB0cmVlIGlzIGEgbm9kZS1iYXNlZCBiaW5hcnkgdHJlZSBkYXRhIHN0cnVjdHVyZSB3aGljaFxuICAgICAqIGhhcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6PC9wPlxuICAgICAqIDx1bD5cbiAgICAgKiA8bGk+VGhlIGxlZnQgc3VidHJlZSBvZiBhIG5vZGUgY29udGFpbnMgb25seSBub2RlcyB3aXRoIGVsZW1lbnRzIGxlc3NcbiAgICAgKiB0aGFuIHRoZSBub2RlJ3MgZWxlbWVudDwvbGk+XG4gICAgICogPGxpPlRoZSByaWdodCBzdWJ0cmVlIG9mIGEgbm9kZSBjb250YWlucyBvbmx5IG5vZGVzIHdpdGggZWxlbWVudHMgZ3JlYXRlclxuICAgICAqIHRoYW4gdGhlIG5vZGUncyBlbGVtZW50PC9saT5cbiAgICAgKiA8bGk+Qm90aCB0aGUgbGVmdCBhbmQgcmlnaHQgc3VidHJlZXMgbXVzdCBhbHNvIGJlIGJpbmFyeSBzZWFyY2ggdHJlZXMuPC9saT5cbiAgICAgKiA8L3VsPlxuICAgICAqIDxwPklmIHRoZSBpbnNlcnRlZCBlbGVtZW50cyBhcmUgY3VzdG9tIG9iamVjdHMgYSBjb21wYXJlIGZ1bmN0aW9uIG11c3RcbiAgICAgKiBiZSBwcm92aWRlZCBhdCBjb25zdHJ1Y3Rpb24gdGltZSwgb3RoZXJ3aXNlIHRoZSA8PSwgPT09IGFuZCA+PSBvcGVyYXRvcnMgYXJlXG4gICAgICogdXNlZCB0byBjb21wYXJlIGVsZW1lbnRzLiBFeGFtcGxlOjwvcD5cbiAgICAgKiA8cHJlPlxuICAgICAqIGZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICAgICAqICBpZiAoYSBpcyBsZXNzIHRoYW4gYiBieSBzb21lIG9yZGVyaW5nIGNyaXRlcmlvbikge1xuICAgICAqICAgICByZXR1cm4gLTE7XG4gICAgICogIH0gaWYgKGEgaXMgZ3JlYXRlciB0aGFuIGIgYnkgdGhlIG9yZGVyaW5nIGNyaXRlcmlvbikge1xuICAgICAqICAgICByZXR1cm4gMTtcbiAgICAgKiAgfVxuICAgICAqICAvLyBhIG11c3QgYmUgZXF1YWwgdG8gYlxuICAgICAqICByZXR1cm4gMDtcbiAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpudW1iZXI9fSBjb21wYXJlRnVuY3Rpb24gb3B0aW9uYWxcbiAgICAgKiBmdW5jdGlvbiB1c2VkIHRvIGNvbXBhcmUgdHdvIGVsZW1lbnRzLiBNdXN0IHJldHVybiBhIG5lZ2F0aXZlIGludGVnZXIsXG4gICAgICogemVybywgb3IgYSBwb3NpdGl2ZSBpbnRlZ2VyIGFzIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBsZXNzIHRoYW4sIGVxdWFsIHRvLFxuICAgICAqIG9yIGdyZWF0ZXIgdGhhbiB0aGUgc2Vjb25kLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEJTVHJlZShjb21wYXJlRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb21wYXJlID0gY29tcGFyZUZ1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdENvbXBhcmU7XG4gICAgICAgIHRoaXMubkVsZW1lbnRzID0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgdG8gdGhpcyB0cmVlIGlmIGl0IGlzIG5vdCBhbHJlYWR5IHByZXNlbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyB0cmVlIGRpZCBub3QgYWxyZWFkeSBjb250YWluIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW5zZXJ0Tm9kZSh0aGlzLmNyZWF0ZU5vZGUoZWxlbWVudCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm5FbGVtZW50cysrO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgb2YgdGhlIGVsZW1lbnRzIGZyb20gdGhpcyB0cmVlLlxuICAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IG51bGw7XG4gICAgICAgIHRoaXMubkVsZW1lbnRzID0gMDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHRyZWUgY29udGFpbnMgbm8gZWxlbWVudHMuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHRyZWUgY29udGFpbnMgbm8gZWxlbWVudHMuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uRWxlbWVudHMgPT09IDA7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyB0cmVlLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIHRyZWUuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uRWxlbWVudHM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyB0cmVlIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBlbGVtZW50IHRvIHNlYXJjaCBmb3IuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHRyZWUgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LFxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hOb2RlKHRoaXMucm9vdCwgZWxlbWVudCkgIT09IG51bGw7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBmcm9tIHRoaXMgdHJlZSBpZiBpdCBpcyBwcmVzZW50LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyB0cmVlIGNvbnRhaW5lZCB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuc2VhcmNoTm9kZSh0aGlzLnJvb3QsIGVsZW1lbnQpO1xuICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlTm9kZShub2RlKTtcbiAgICAgICAgdGhpcy5uRWxlbWVudHMtLTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyB0cmVlIGluXG4gICAgICogaW4tb3JkZXIuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzIGludm9rZWQgd2l0aCBvbmVcbiAgICAgKiBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhbiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLmlub3JkZXJUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsQXV4KHRoaXMucm9vdCwgY2FsbGJhY2ssIHtcbiAgICAgICAgICAgIHN0b3A6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudCBwcmVzZW50IGluIHRoaXMgdHJlZSBpbiBwcmUtb3JkZXIuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzIGludm9rZWQgd2l0aCBvbmVcbiAgICAgKiBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhbiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLnByZW9yZGVyVHJhdmVyc2FsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgodGhpcy5yb290LCBjYWxsYmFjaywge1xuICAgICAgICAgICAgc3RvcDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyB0cmVlIGluIHBvc3Qtb3JkZXIuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzIGludm9rZWQgd2l0aCBvbmVcbiAgICAgKiBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhbiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLnBvc3RvcmRlclRyYXZlcnNhbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eCh0aGlzLnJvb3QsIGNhbGxiYWNrLCB7XG4gICAgICAgICAgICBzdG9wOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGlzIHRyZWUgaW5cbiAgICAgKiBsZXZlbC1vcmRlci5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXMgaW52b2tlZCB3aXRoIG9uZVxuICAgICAqIGFyZ3VtZW50OiB0aGUgZWxlbWVudCB2YWx1ZSwgdG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5sZXZlbFRyYXZlcnNhbEF1eCh0aGlzLnJvb3QsIGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG1pbmltdW0gZWxlbWVudCBvZiB0aGlzIHRyZWUuXG4gICAgICogQHJldHVybiB7Kn0gdGhlIG1pbmltdW0gZWxlbWVudCBvZiB0aGlzIHRyZWUgb3IgdW5kZWZpbmVkIGlmIHRoaXMgdHJlZSBpc1xuICAgICAqIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUubWluaW11bSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm1pbmltdW1BdXgodGhpcy5yb290KS5lbGVtZW50O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbWF4aW11bSBlbGVtZW50IG9mIHRoaXMgdHJlZS5cbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgbWF4aW11bSBlbGVtZW50IG9mIHRoaXMgdHJlZSBvciB1bmRlZmluZWQgaWYgdGhpcyB0cmVlIGlzXG4gICAgICogaXMgZW1wdHkuXG4gICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5tYXhpbXVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWF4aW11bUF1eCh0aGlzLnJvb3QpLmVsZW1lbnQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyB0cmVlIGluIGlub3JkZXIuXG4gICAgICogRXF1aXZhbGVudCB0byBpbm9yZGVyVHJhdmVyc2FsLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xuICAgICAqIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5pbm9yZGVyVHJhdmVyc2FsKGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgdHJlZSBpbiBpbi1vcmRlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgdHJlZSBpbiBpbi1vcmRlci5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWwoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGlzIHRyZWUuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaGVpZ2h0IG9mIHRoaXMgdHJlZSBvciAtMSBpZiBpcyBlbXB0eS5cbiAgICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLmhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0QXV4KHRoaXMucm9vdCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLnNlYXJjaE5vZGUgPSBmdW5jdGlvbiAobm9kZSwgZWxlbWVudCkge1xuICAgICAgICB2YXIgY21wID0gbnVsbDtcbiAgICAgICAgd2hpbGUgKG5vZGUgIT09IG51bGwgJiYgY21wICE9PSAwKSB7XG4gICAgICAgICAgICBjbXAgPSB0aGlzLmNvbXBhcmUoZWxlbWVudCwgbm9kZS5lbGVtZW50KTtcbiAgICAgICAgICAgIGlmIChjbXAgPCAwKSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubGVmdENoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY21wID4gMCkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnJpZ2h0Q2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLnRyYW5zcGxhbnQgPSBmdW5jdGlvbiAobjEsIG4yKSB7XG4gICAgICAgIGlmIChuMS5wYXJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG4yO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG4xID09PSBuMS5wYXJlbnQubGVmdENoKSB7XG4gICAgICAgICAgICBuMS5wYXJlbnQubGVmdENoID0gbjI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuMS5wYXJlbnQucmlnaHRDaCA9IG4yO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuMiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbjIucGFyZW50ID0gbjEucGFyZW50O1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLnJlbW92ZU5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5sZWZ0Q2ggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHJhbnNwbGFudChub2RlLCBub2RlLnJpZ2h0Q2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUucmlnaHRDaCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50cmFuc3BsYW50KG5vZGUsIG5vZGUubGVmdENoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5taW5pbXVtQXV4KG5vZGUucmlnaHRDaCk7XG4gICAgICAgICAgICBpZiAoeS5wYXJlbnQgIT09IG5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zcGxhbnQoeSwgeS5yaWdodENoKTtcbiAgICAgICAgICAgICAgICB5LnJpZ2h0Q2ggPSBub2RlLnJpZ2h0Q2g7XG4gICAgICAgICAgICAgICAgeS5yaWdodENoLnBhcmVudCA9IHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRyYW5zcGxhbnQobm9kZSwgeSk7XG4gICAgICAgICAgICB5LmxlZnRDaCA9IG5vZGUubGVmdENoO1xuICAgICAgICAgICAgeS5sZWZ0Q2gucGFyZW50ID0geTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5pbm9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrLCBzaWduYWwpIHtcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwgfHwgc2lnbmFsLnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgobm9kZS5sZWZ0Q2gsIGNhbGxiYWNrLCBzaWduYWwpO1xuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzaWduYWwuc3RvcCA9IGNhbGxiYWNrKG5vZGUuZWxlbWVudCkgPT09IGZhbHNlO1xuICAgICAgICBpZiAoc2lnbmFsLnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlub3JkZXJUcmF2ZXJzYWxBdXgobm9kZS5yaWdodENoLCBjYWxsYmFjaywgc2lnbmFsKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICogQHByaXZhdGVcbiAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUubGV2ZWxUcmF2ZXJzYWxBdXggPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gbmV3IFF1ZXVlXzEuZGVmYXVsdCgpO1xuICAgICAgICBpZiAobm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcXVldWUuZW5xdWV1ZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoIXF1ZXVlLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgbm9kZSA9IHF1ZXVlLmRlcXVldWUoKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhub2RlLmVsZW1lbnQpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLmxlZnRDaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHF1ZXVlLmVucXVldWUobm9kZS5sZWZ0Q2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUucmlnaHRDaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHF1ZXVlLmVucXVldWUobm9kZS5yaWdodENoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5wcmVvcmRlclRyYXZlcnNhbEF1eCA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaywgc2lnbmFsKSB7XG4gICAgICAgIGlmIChub2RlID09PSBudWxsIHx8IHNpZ25hbC5zdG9wKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2lnbmFsLnN0b3AgPSBjYWxsYmFjayhub2RlLmVsZW1lbnQpID09PSBmYWxzZTtcbiAgICAgICAgaWYgKHNpZ25hbC5zdG9wKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmVvcmRlclRyYXZlcnNhbEF1eChub2RlLmxlZnRDaCwgY2FsbGJhY2ssIHNpZ25hbCk7XG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJlb3JkZXJUcmF2ZXJzYWxBdXgobm9kZS5yaWdodENoLCBjYWxsYmFjaywgc2lnbmFsKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICogQHByaXZhdGVcbiAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUucG9zdG9yZGVyVHJhdmVyc2FsQXV4ID0gZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrLCBzaWduYWwpIHtcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwgfHwgc2lnbmFsLnN0b3ApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvc3RvcmRlclRyYXZlcnNhbEF1eChub2RlLmxlZnRDaCwgY2FsbGJhY2ssIHNpZ25hbCk7XG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9zdG9yZGVyVHJhdmVyc2FsQXV4KG5vZGUucmlnaHRDaCwgY2FsbGJhY2ssIHNpZ25hbCk7XG4gICAgICAgIGlmIChzaWduYWwuc3RvcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNpZ25hbC5zdG9wID0gY2FsbGJhY2sobm9kZS5lbGVtZW50KSA9PT0gZmFsc2U7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLm1pbmltdW1BdXggPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB3aGlsZSAobm9kZS5sZWZ0Q2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmxlZnRDaDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICogQHByaXZhdGVcbiAgICAqL1xuICAgIEJTVHJlZS5wcm90b3R5cGUubWF4aW11bUF1eCA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHdoaWxlIChub2RlLnJpZ2h0Q2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLnJpZ2h0Q2g7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgICogQHByaXZhdGVcbiAgICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5oZWlnaHRBdXggPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLmhlaWdodEF1eChub2RlLmxlZnRDaCksIHRoaXMuaGVpZ2h0QXV4KG5vZGUucmlnaHRDaCkpICsgMTtcbiAgICB9O1xuICAgIC8qXG4gICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgQlNUcmVlLnByb3RvdHlwZS5pbnNlcnROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IG51bGw7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMucm9vdDtcbiAgICAgICAgdmFyIGNtcCA9IG51bGw7XG4gICAgICAgIHdoaWxlIChwb3NpdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY21wID0gdGhpcy5jb21wYXJlKG5vZGUuZWxlbWVudCwgcG9zaXRpb24uZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoY21wID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjbXAgPCAwKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gcG9zaXRpb247XG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbi5sZWZ0Q2g7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwb3NpdGlvbjtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uLnJpZ2h0Q2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIHRyZWUgaXMgZW1wdHlcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5jb21wYXJlKG5vZGUuZWxlbWVudCwgcGFyZW50LmVsZW1lbnQpIDwgMCkge1xuICAgICAgICAgICAgcGFyZW50LmxlZnRDaCA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQucmlnaHRDaCA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICAvKipcbiAgICAqIEBwcml2YXRlXG4gICAgKi9cbiAgICBCU1RyZWUucHJvdG90eXBlLmNyZWF0ZU5vZGUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgICAgICAgIGxlZnRDaDogbnVsbCxcbiAgICAgICAgICAgIHJpZ2h0Q2g6IG51bGwsXG4gICAgICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBCU1RyZWU7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQlNUcmVlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QlNUcmVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBEaWN0aW9uYXJ5XzEgPSByZXF1aXJlKCcuL0RpY3Rpb25hcnknKTtcbnZhciBTZXRfMSA9IHJlcXVpcmUoJy4vU2V0Jyk7XG52YXIgQmFnID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVtcHR5IGJhZy5cbiAgICAgKiBAY2xhc3MgPHA+QSBiYWcgaXMgYSBzcGVjaWFsIGtpbmQgb2Ygc2V0IGluIHdoaWNoIG1lbWJlcnMgYXJlXG4gICAgICogYWxsb3dlZCB0byBhcHBlYXIgbW9yZSB0aGFuIG9uY2UuPC9wPlxuICAgICAqIDxwPklmIHRoZSBpbnNlcnRlZCBlbGVtZW50cyBhcmUgY3VzdG9tIG9iamVjdHMgYSBmdW5jdGlvblxuICAgICAqIHdoaWNoIGNvbnZlcnRzIGVsZW1lbnRzIHRvIHVuaXF1ZSBzdHJpbmdzIG11c3QgYmUgcHJvdmlkZWQuIEV4YW1wbGU6PC9wPlxuICAgICAqXG4gICAgICogPHByZT5cbiAgICAgKiBmdW5jdGlvbiBwZXRUb1N0cmluZyhwZXQpIHtcbiAgICAgKiAgcmV0dXJuIHBldC5uYW1lO1xuICAgICAqIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KTpzdHJpbmc9fSB0b1N0ckZ1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWRcbiAgICAgKiB0byBjb252ZXJ0IGVsZW1lbnRzIHRvIHN0cmluZ3MuIElmIHRoZSBlbGVtZW50cyBhcmVuJ3Qgc3RyaW5ncyBvciBpZiB0b1N0cmluZygpXG4gICAgICogaXMgbm90IGFwcHJvcHJpYXRlLCBhIGN1c3RvbSBmdW5jdGlvbiB3aGljaCByZWNlaXZlcyBhbiBvYmplY3QgYW5kIHJldHVybnMgYVxuICAgICAqIHVuaXF1ZSBzdHJpbmcgbXVzdCBiZSBwcm92aWRlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBCYWcodG9TdHJGdW5jdGlvbikge1xuICAgICAgICB0aGlzLnRvU3RyRiA9IHRvU3RyRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0VG9TdHJpbmc7XG4gICAgICAgIHRoaXMuZGljdGlvbmFyeSA9IG5ldyBEaWN0aW9uYXJ5XzEuZGVmYXVsdCh0aGlzLnRvU3RyRik7XG4gICAgICAgIHRoaXMubkVsZW1lbnRzID0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBBZGRzIG5Db3BpZXMgb2YgdGhlIHNwZWNpZmllZCBvYmplY3QgdG8gdGhpcyBiYWcuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBlbGVtZW50IHRvIGFkZC5cbiAgICAqIEBwYXJhbSB7bnVtYmVyPX0gbkNvcGllcyB0aGUgbnVtYmVyIG9mIGNvcGllcyB0byBhZGQsIGlmIHRoaXMgYXJndW1lbnQgaXNcbiAgICAqIHVuZGVmaW5lZCAxIGNvcHkgaXMgYWRkZWQuXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIHVubGVzcyBlbGVtZW50IGlzIHVuZGVmaW5lZC5cbiAgICAqL1xuICAgIEJhZy5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVsZW1lbnQsIG5Db3BpZXMpIHtcbiAgICAgICAgaWYgKG5Db3BpZXMgPT09IHZvaWQgMCkgeyBuQ29waWVzID0gMTsgfVxuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChlbGVtZW50KSB8fCBuQ29waWVzIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBlbGVtZW50LFxuICAgICAgICAgICAgICAgIGNvcGllczogbkNvcGllc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeS5zZXRWYWx1ZShlbGVtZW50LCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeS5nZXRWYWx1ZShlbGVtZW50KS5jb3BpZXMgKz0gbkNvcGllcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5FbGVtZW50cyArPSBuQ29waWVzO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICogQ291bnRzIHRoZSBudW1iZXIgb2YgY29waWVzIG9mIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGluIHRoaXMgYmFnLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgdGhlIG9iamVjdCB0byBzZWFyY2ggZm9yLi5cbiAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBjb3BpZXMgb2YgdGhlIG9iamVjdCwgMCBpZiBub3QgZm91bmRcbiAgICAqL1xuICAgIEJhZy5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeS5nZXRWYWx1ZShlbGVtZW50KS5jb3BpZXM7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGJhZyBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBiYWcgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LFxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBCYWcucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeS5jb250YWluc0tleShlbGVtZW50KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICogUmVtb3ZlcyBuQ29waWVzIG9mIHRoZSBzcGVjaWZpZWQgb2JqZWN0IHRvIHRoaXMgYmFnLlxuICAgICogSWYgdGhlIG51bWJlciBvZiBjb3BpZXMgdG8gcmVtb3ZlIGlzIGdyZWF0ZXIgdGhhbiB0aGUgYWN0dWFsIG51bWJlclxuICAgICogb2YgY29waWVzIGluIHRoZSBCYWcsIGFsbCBjb3BpZXMgYXJlIHJlbW92ZWQuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBlbGVtZW50IHRvIHJlbW92ZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyPX0gbkNvcGllcyB0aGUgbnVtYmVyIG9mIGNvcGllcyB0byByZW1vdmUsIGlmIHRoaXMgYXJndW1lbnQgaXNcbiAgICAqIHVuZGVmaW5lZCAxIGNvcHkgaXMgcmVtb3ZlZC5cbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYXQgbGVhc3QgMSBlbGVtZW50IHdhcyByZW1vdmVkLlxuICAgICovXG4gICAgQmFnLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgbkNvcGllcykge1xuICAgICAgICBpZiAobkNvcGllcyA9PT0gdm9pZCAwKSB7IG5Db3BpZXMgPSAxOyB9XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGVsZW1lbnQpIHx8IG5Db3BpZXMgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhlbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmRpY3Rpb25hcnkuZ2V0VmFsdWUoZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAobkNvcGllcyA+IG5vZGUuY29waWVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uRWxlbWVudHMgLT0gbm9kZS5jb3BpZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5FbGVtZW50cyAtPSBuQ29waWVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5jb3BpZXMgLT0gbkNvcGllcztcbiAgICAgICAgICAgIGlmIChub2RlLmNvcGllcyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaWN0aW9uYXJ5LnJlbW92ZShlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIGJpZyBpbiBhcmJpdHJhcnkgb3JkZXIsXG4gICAgICogaW5jbHVkaW5nIG11bHRpcGxlIGNvcGllcy5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgYmFnLlxuICAgICAqL1xuICAgIEJhZy5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMuZGljdGlvbmFyeS52YWx1ZXMoKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCB2YWx1ZXNfMSA9IHZhbHVlczsgX2kgPCB2YWx1ZXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdmFsdWVzXzFbX2ldO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBub2RlLnZhbHVlO1xuICAgICAgICAgICAgdmFyIGNvcGllcyA9IG5vZGUuY29waWVzO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb3BpZXM7IGorKykge1xuICAgICAgICAgICAgICAgIGEucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzZXQgb2YgdW5pcXVlIGVsZW1lbnRzIGluIHRoaXMgYmFnLlxuICAgICAqIEByZXR1cm4ge2NvbGxlY3Rpb25zLlNldDxUPn0gYSBzZXQgb2YgdW5pcXVlIGVsZW1lbnRzIGluIHRoaXMgYmFnLlxuICAgICAqL1xuICAgIEJhZy5wcm90b3R5cGUudG9TZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0b3JldCA9IG5ldyBTZXRfMS5kZWZhdWx0KHRoaXMudG9TdHJGKTtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gdGhpcy5kaWN0aW9uYXJ5LnZhbHVlcygpO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGVsZW1lbnRzXzEgPSBlbGVtZW50czsgX2kgPCBlbGVtZW50c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGVsZSA9IGVsZW1lbnRzXzFbX2ldO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gZWxlLnZhbHVlO1xuICAgICAgICAgICAgdG9yZXQuYWRkKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9yZXQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50XG4gICAgICogcHJlc2VudCBpbiB0aGlzIGJhZywgaW5jbHVkaW5nIG11bHRpcGxlIGNvcGllcy5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiB0aGUgZWxlbWVudC4gVG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgQmFnLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZGljdGlvbmFyeS5mb3JFYWNoKGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2LnZhbHVlO1xuICAgICAgICAgICAgdmFyIGNvcGllcyA9IHYuY29waWVzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3BpZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBiYWcuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgYmFnLlxuICAgICAqL1xuICAgIEJhZy5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgYmFnIGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBiYWcgY29udGFpbnMgbm8gZWxlbWVudHMuXG4gICAgICovXG4gICAgQmFnLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uRWxlbWVudHMgPT09IDA7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBvZiB0aGUgZWxlbWVudHMgZnJvbSB0aGlzIGJhZy5cbiAgICAgKi9cbiAgICBCYWcucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5FbGVtZW50cyA9IDA7XG4gICAgICAgIHRoaXMuZGljdGlvbmFyeS5jbGVhcigpO1xuICAgIH07XG4gICAgcmV0dXJuIEJhZztcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBCYWc7IC8vIEVuZCBvZiBiYWdcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJhZy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgRGljdGlvbmFyeSA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBlbXB0eSBkaWN0aW9uYXJ5LlxuICAgICAqIEBjbGFzcyA8cD5EaWN0aW9uYXJpZXMgbWFwIGtleXMgdG8gdmFsdWVzOyBlYWNoIGtleSBjYW4gbWFwIHRvIGF0IG1vc3Qgb25lIHZhbHVlLlxuICAgICAqIFRoaXMgaW1wbGVtZW50YXRpb24gYWNjZXB0cyBhbnkga2luZCBvZiBvYmplY3RzIGFzIGtleXMuPC9wPlxuICAgICAqXG4gICAgICogPHA+SWYgdGhlIGtleXMgYXJlIGN1c3RvbSBvYmplY3RzIGEgZnVuY3Rpb24gd2hpY2ggY29udmVydHMga2V5cyB0byB1bmlxdWVcbiAgICAgKiBzdHJpbmdzIG11c3QgYmUgcHJvdmlkZWQuIEV4YW1wbGU6PC9wPlxuICAgICAqIDxwcmU+XG4gICAgICogZnVuY3Rpb24gcGV0VG9TdHJpbmcocGV0KSB7XG4gICAgICogIHJldHVybiBwZXQubmFtZTtcbiAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOnN0cmluZz19IHRvU3RyRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdXNlZFxuICAgICAqIHRvIGNvbnZlcnQga2V5cyB0byBzdHJpbmdzLiBJZiB0aGUga2V5cyBhcmVuJ3Qgc3RyaW5ncyBvciBpZiB0b1N0cmluZygpXG4gICAgICogaXMgbm90IGFwcHJvcHJpYXRlLCBhIGN1c3RvbSBmdW5jdGlvbiB3aGljaCByZWNlaXZlcyBhIGtleSBhbmQgcmV0dXJucyBhXG4gICAgICogdW5pcXVlIHN0cmluZyBtdXN0IGJlIHByb3ZpZGVkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIERpY3Rpb25hcnkodG9TdHJGdW5jdGlvbikge1xuICAgICAgICB0aGlzLnRhYmxlID0ge307XG4gICAgICAgIHRoaXMubkVsZW1lbnRzID0gMDtcbiAgICAgICAgdGhpcy50b1N0ciA9IHRvU3RyRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0VG9TdHJpbmc7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHZhbHVlIHRvIHdoaWNoIHRoaXMgZGljdGlvbmFyeSBtYXBzIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICAqIFJldHVybnMgdW5kZWZpbmVkIGlmIHRoaXMgZGljdGlvbmFyeSBjb250YWlucyBubyBtYXBwaW5nIGZvciB0aGlzIGtleS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aG9zZSBhc3NvY2lhdGVkIHZhbHVlIGlzIHRvIGJlIHJldHVybmVkLlxuICAgICAqIEByZXR1cm4geyp9IHRoZSB2YWx1ZSB0byB3aGljaCB0aGlzIGRpY3Rpb25hcnkgbWFwcyB0aGUgc3BlY2lmaWVkIGtleSBvclxuICAgICAqIHVuZGVmaW5lZCBpZiB0aGUgbWFwIGNvbnRhaW5zIG5vIG1hcHBpbmcgZm9yIHRoaXMga2V5LlxuICAgICAqL1xuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgcGFpciA9IHRoaXMudGFibGVbJyQnICsgdGhpcy50b1N0cihrZXkpXTtcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQocGFpcikpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhaXIudmFsdWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBc3NvY2lhdGVzIHRoZSBzcGVjaWZpZWQgdmFsdWUgd2l0aCB0aGUgc3BlY2lmaWVkIGtleSBpbiB0aGlzIGRpY3Rpb25hcnkuXG4gICAgICogSWYgdGhlIGRpY3Rpb25hcnkgcHJldmlvdXNseSBjb250YWluZWQgYSBtYXBwaW5nIGZvciB0aGlzIGtleSwgdGhlIG9sZFxuICAgICAqIHZhbHVlIGlzIHJlcGxhY2VkIGJ5IHRoZSBzcGVjaWZpZWQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2l0aCB3aGljaCB0aGUgc3BlY2lmaWVkIHZhbHVlIGlzIHRvIGJlXG4gICAgICogYXNzb2NpYXRlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgdmFsdWUgdG8gYmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICAqIEByZXR1cm4geyp9IHByZXZpb3VzIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleSwgb3IgdW5kZWZpbmVkIGlmXG4gICAgICogdGhlcmUgd2FzIG5vIG1hcHBpbmcgZm9yIHRoZSBrZXkgb3IgaWYgdGhlIGtleS92YWx1ZSBhcmUgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoa2V5KSB8fCB1dGlsLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmV0O1xuICAgICAgICB2YXIgayA9ICckJyArIHRoaXMudG9TdHIoa2V5KTtcbiAgICAgICAgdmFyIHByZXZpb3VzRWxlbWVudCA9IHRoaXMudGFibGVba107XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKHByZXZpb3VzRWxlbWVudCkpIHtcbiAgICAgICAgICAgIHRoaXMubkVsZW1lbnRzKys7XG4gICAgICAgICAgICByZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXQgPSBwcmV2aW91c0VsZW1lbnQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YWJsZVtrXSA9IHtcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBtYXBwaW5nIGZvciB0aGlzIGtleSBmcm9tIHRoaXMgZGljdGlvbmFyeSBpZiBpdCBpcyBwcmVzZW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdob3NlIG1hcHBpbmcgaXMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZVxuICAgICAqIGRpY3Rpb25hcnkuXG4gICAgICogQHJldHVybiB7Kn0gcHJldmlvdXMgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHNwZWNpZmllZCBrZXksIG9yIHVuZGVmaW5lZCBpZlxuICAgICAqIHRoZXJlIHdhcyBubyBtYXBwaW5nIGZvciBrZXkuXG4gICAgICovXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgayA9ICckJyArIHRoaXMudG9TdHIoa2V5KTtcbiAgICAgICAgdmFyIHByZXZpb3VzRWxlbWVudCA9IHRoaXMudGFibGVba107XG4gICAgICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZChwcmV2aW91c0VsZW1lbnQpKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy50YWJsZVtrXTtcbiAgICAgICAgICAgIHRoaXMubkVsZW1lbnRzLS07XG4gICAgICAgICAgICByZXR1cm4gcHJldmlvdXNFbGVtZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBrZXlzIGluIHRoaXMgZGljdGlvbmFyeS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGtleXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqL1xuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBuYW1lXzEgaW4gdGhpcy50YWJsZSkge1xuICAgICAgICAgICAgaWYgKHV0aWwuaGFzKHRoaXMudGFibGUsIG5hbWVfMSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpciA9IHRoaXMudGFibGVbbmFtZV8xXTtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHBhaXIua2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB2YWx1ZXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgdmFsdWVzIGluIHRoaXMgZGljdGlvbmFyeS5cbiAgICAgKi9cbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBuYW1lXzIgaW4gdGhpcy50YWJsZSkge1xuICAgICAgICAgICAgaWYgKHV0aWwuaGFzKHRoaXMudGFibGUsIG5hbWVfMikpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpciA9IHRoaXMudGFibGVbbmFtZV8yXTtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHBhaXIudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9O1xuICAgIC8qKlxuICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2gga2V5LXZhbHVlIHBhaXJcbiAgICAqIHByZXNlbnQgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xuICAgICogaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM6IGtleSBhbmQgdmFsdWUuIFRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxuICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgKi9cbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIGZvciAodmFyIG5hbWVfMyBpbiB0aGlzLnRhYmxlKSB7XG4gICAgICAgICAgICBpZiAodXRpbC5oYXModGhpcy50YWJsZSwgbmFtZV8zKSkge1xuICAgICAgICAgICAgICAgIHZhciBwYWlyID0gdGhpcy50YWJsZVtuYW1lXzNdO1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBjYWxsYmFjayhwYWlyLmtleSwgcGFpci52YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBjb250YWlucyBhIG1hcHBpbmcgZm9yIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdob3NlIHByZXNlbmNlIGluIHRoaXMgZGljdGlvbmFyeSBpcyB0byBiZVxuICAgICAqIHRlc3RlZC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBjb250YWlucyBhIG1hcHBpbmcgZm9yIHRoZVxuICAgICAqIHNwZWNpZmllZCBrZXkuXG4gICAgICovXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUuY29udGFpbnNLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiAhdXRpbC5pc1VuZGVmaW5lZCh0aGlzLmdldFZhbHVlKGtleSkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBSZW1vdmVzIGFsbCBtYXBwaW5ncyBmcm9tIHRoaXMgZGljdGlvbmFyeS5cbiAgICAqIEB0aGlzIHtjb2xsZWN0aW9ucy5EaWN0aW9uYXJ5fVxuICAgICovXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudGFibGUgPSB7fTtcbiAgICAgICAgdGhpcy5uRWxlbWVudHMgPSAwO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGtleXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBrZXktdmFsdWUgbWFwcGluZ3MgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqL1xuICAgIERpY3Rpb25hcnkucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5FbGVtZW50cztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgbm8gbWFwcGluZ3MuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgbm8gbWFwcGluZ3MuXG4gICAgICovXG4gICAgRGljdGlvbmFyeS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzIDw9IDA7XG4gICAgfTtcbiAgICBEaWN0aW9uYXJ5LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvcmV0ID0gJ3snO1xuICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGssIHYpIHtcbiAgICAgICAgICAgIHRvcmV0ICs9IFwiXFxuXFx0XCIgKyBrICsgXCIgOiBcIiArIHY7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdG9yZXQgKyAnXFxufSc7XG4gICAgfTtcbiAgICByZXR1cm4gRGljdGlvbmFyeTtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBEaWN0aW9uYXJ5OyAvLyBFbmQgb2YgZGljdGlvbmFyeVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RGljdGlvbmFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoJy4vRGljdGlvbmFyeScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBGYWN0b3J5RGljdGlvbmFyeSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEZhY3RvcnlEaWN0aW9uYXJ5LCBfc3VwZXIpO1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgZGljdGlvbmFyeS5cbiAgICAgKiBAY2xhc3MgPHA+RGljdGlvbmFyaWVzIG1hcCBrZXlzIHRvIHZhbHVlczsgZWFjaCBrZXkgY2FuIG1hcCB0byBhdCBtb3N0IG9uZSB2YWx1ZS5cbiAgICAgKiBUaGlzIGltcGxlbWVudGF0aW9uIGFjY2VwdHMgYW55IGtpbmQgb2Ygb2JqZWN0cyBhcyBrZXlzLjwvcD5cbiAgICAgKlxuICAgICAqIDxwPlRoZSBkZWZhdWx0IGZhY3RvcnkgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIG5ldyBvYmplY3Qgb2YgdGhlIHByb3ZpZGVkXG4gICAgICogdHlwZS4gRXhhbXBsZTo8L3A+XG4gICAgICogPHByZT5cbiAgICAgKiBmdW5jdGlvbiBwZXRGYWN0b3J5KCkge1xuICAgICAqICByZXR1cm4gbmV3IFBldCgpO1xuICAgICAqIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIDxwPklmIHRoZSBrZXlzIGFyZSBjdXN0b20gb2JqZWN0cyBhIGZ1bmN0aW9uIHdoaWNoIGNvbnZlcnRzIGtleXMgdG8gdW5pcXVlXG4gICAgICogc3RyaW5ncyBtdXN0IGJlIHByb3ZpZGVkLiBFeGFtcGxlOjwvcD5cbiAgICAgKiA8cHJlPlxuICAgICAqIGZ1bmN0aW9uIHBldFRvU3RyaW5nKHBldCkge1xuICAgICAqICByZXR1cm4gcGV0Lm5hbWU7XG4gICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTpWPX0gZGVmYXVsdEZhY3RvcnlGdW5jdGlvbiBmdW5jdGlvbiB1c2VkIHRvIGNyZWF0ZSBhXG4gICAgICogZGVmYXVsdCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOnN0cmluZz19IHRvU3RyRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdXNlZFxuICAgICAqIHRvIGNvbnZlcnQga2V5cyB0byBzdHJpbmdzLiBJZiB0aGUga2V5cyBhcmVuJ3Qgc3RyaW5ncyBvciBpZiB0b1N0cmluZygpXG4gICAgICogaXMgbm90IGFwcHJvcHJpYXRlLCBhIGN1c3RvbSBmdW5jdGlvbiB3aGljaCByZWNlaXZlcyBhIGtleSBhbmQgcmV0dXJucyBhXG4gICAgICogdW5pcXVlIHN0cmluZyBtdXN0IGJlIHByb3ZpZGVkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZhY3RvcnlEaWN0aW9uYXJ5KGRlZmF1bHRGYWN0b3J5RnVuY3Rpb24sIHRvU3RyRnVuY3Rpb24pIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgdG9TdHJGdW5jdGlvbik7XG4gICAgICAgIHRoaXMuZGVmYXVsdEZhY3RvcnlGdW5jdGlvbiA9IGRlZmF1bHRGYWN0b3J5RnVuY3Rpb247XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFzc29jaWF0ZXMgdGhlIHNwZWNpZmllZCBkZWZhdWx0IHZhbHVlIHdpdGggdGhlIHNwZWNpZmllZCBrZXkgaW4gdGhpcyBkaWN0aW9uYXJ5LFxuICAgICAqIGlmIGl0IGRpZG4ndCBjb250YWluIHRoZSBrZXkgeWV0LiBJZiB0aGUga2V5IGV4aXN0ZWQsIHRoZSBleGlzdGluZyB2YWx1ZSB3aWxsIGJlIHVzZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2l0aCB3aGljaCB0aGUgc3BlY2lmaWVkIHZhbHVlIGlzIHRvIGJlXG4gICAgICogYXNzb2NpYXRlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdFZhbHVlIGRlZmF1bHQgdmFsdWUgdG8gYmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICAqIEByZXR1cm4geyp9IHByZXZpb3VzIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleSwgb3IgdGhlIGRlZmF1bHQgdmFsdWUsXG4gICAgICogaWYgdGhlIGtleSBkaWRuJ3QgZXhpc3QgeWV0LlxuICAgICAqL1xuICAgIEZhY3RvcnlEaWN0aW9uYXJ5LnByb3RvdHlwZS5zZXREZWZhdWx0ID0gZnVuY3Rpb24gKGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIHZhciBjdXJyZW50VmFsdWUgPSBfc3VwZXIucHJvdG90eXBlLmdldFZhbHVlLmNhbGwodGhpcywga2V5KTtcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJyZW50VmFsdWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSB0byB3aGljaCB0aGlzIGRpY3Rpb25hcnkgbWFwcyB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKiBSZXR1cm5zIGEgZGVmYXVsdCB2YWx1ZSBjcmVhdGVkIGJ5IHRoZSBmYWN0b3J5IHBhc3NlZCBpbiB0aGUgY29uc3RydWN0b3IsXG4gICAgICogaWYgdGhpcyBkaWN0aW9uYXJ5IGNvbnRhaW5zIG5vIG1hcHBpbmcgZm9yIHRoaXMga2V5LiBUaGUgbWlzc2luZyBrZXkgd2lsbFxuICAgICAqIGF1dG9tYXRpY2FsbHkgYmUgYWRkZWQgdG8gdGhlIGRpY3Rpb25hcnkuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2hvc2UgYXNzb2NpYXRlZCB2YWx1ZSBpcyB0byBiZSByZXR1cm5lZC5cbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgdmFsdWUgdG8gd2hpY2ggdGhpcyBkaWN0aW9uYXJ5IG1hcHMgdGhlIHNwZWNpZmllZCBrZXkgb3JcbiAgICAgKiBhIGRlZmF1bHQgdmFsdWUgaWYgdGhlIG1hcCBjb250YWlucyBubyBtYXBwaW5nIGZvciB0aGlzIGtleS5cbiAgICAgKi9cbiAgICBGYWN0b3J5RGljdGlvbmFyeS5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldERlZmF1bHQoa2V5LCB0aGlzLmRlZmF1bHRGYWN0b3J5RnVuY3Rpb24oKSk7XG4gICAgfTtcbiAgICByZXR1cm4gRmFjdG9yeURpY3Rpb25hcnk7XG59KERpY3Rpb25hcnlfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBGYWN0b3J5RGljdGlvbmFyeTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUZhY3RvcnlEaWN0aW9uYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNvbGxlY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgYXJyYXlzID0gcmVxdWlyZSgnLi9hcnJheXMnKTtcbnZhciBIZWFwID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVtcHR5IEhlYXAuXG4gICAgICogQGNsYXNzXG4gICAgICogPHA+QSBoZWFwIGlzIGEgYmluYXJ5IHRyZWUsIHdoZXJlIHRoZSBub2RlcyBtYWludGFpbiB0aGUgaGVhcCBwcm9wZXJ0eTpcbiAgICAgKiBlYWNoIG5vZGUgaXMgc21hbGxlciB0aGFuIGVhY2ggb2YgaXRzIGNoaWxkcmVuIGFuZCB0aGVyZWZvcmUgYSBNaW5IZWFwXG4gICAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiB1c2VzIGFuIGFycmF5IHRvIHN0b3JlIGVsZW1lbnRzLjwvcD5cbiAgICAgKiA8cD5JZiB0aGUgaW5zZXJ0ZWQgZWxlbWVudHMgYXJlIGN1c3RvbSBvYmplY3RzIGEgY29tcGFyZSBmdW5jdGlvbiBtdXN0IGJlIHByb3ZpZGVkLFxuICAgICAqICBhdCBjb25zdHJ1Y3Rpb24gdGltZSwgb3RoZXJ3aXNlIHRoZSA8PSwgPT09IGFuZCA+PSBvcGVyYXRvcnMgYXJlXG4gICAgICogdXNlZCB0byBjb21wYXJlIGVsZW1lbnRzLiBFeGFtcGxlOjwvcD5cbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gICAgICogIGlmIChhIGlzIGxlc3MgdGhhbiBiIGJ5IHNvbWUgb3JkZXJpbmcgY3JpdGVyaW9uKSB7XG4gICAgICogICAgIHJldHVybiAtMTtcbiAgICAgKiAgfSBpZiAoYSBpcyBncmVhdGVyIHRoYW4gYiBieSB0aGUgb3JkZXJpbmcgY3JpdGVyaW9uKSB7XG4gICAgICogICAgIHJldHVybiAxO1xuICAgICAqICB9XG4gICAgICogIC8vIGEgbXVzdCBiZSBlcXVhbCB0byBiXG4gICAgICogIHJldHVybiAwO1xuICAgICAqIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIDxwPklmIGEgTWF4LUhlYXAgaXMgd2FudGVkIChncmVhdGVyIGVsZW1lbnRzIG9uIHRvcCkgeW91IGNhbiBhIHByb3ZpZGUgYVxuICAgICAqIHJldmVyc2UgY29tcGFyZSBmdW5jdGlvbiB0byBhY2NvbXBsaXNoIHRoYXQgYmVoYXZpb3IuIEV4YW1wbGU6PC9wPlxuICAgICAqXG4gICAgICogPHByZT5cbiAgICAgKiBmdW5jdGlvbiByZXZlcnNlQ29tcGFyZShhLCBiKSB7XG4gICAgICogIGlmIChhIGlzIGxlc3MgdGhhbiBiIGJ5IHNvbWUgb3JkZXJpbmcgY3JpdGVyaW9uKSB7XG4gICAgICogICAgIHJldHVybiAxO1xuICAgICAqICB9IGlmIChhIGlzIGdyZWF0ZXIgdGhhbiBiIGJ5IHRoZSBvcmRlcmluZyBjcml0ZXJpb24pIHtcbiAgICAgKiAgICAgcmV0dXJuIC0xO1xuICAgICAqICB9XG4gICAgICogIC8vIGEgbXVzdCBiZSBlcXVhbCB0byBiXG4gICAgICogIHJldHVybiAwO1xuICAgICAqIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6bnVtYmVyPX0gY29tcGFyZUZ1bmN0aW9uIG9wdGlvbmFsXG4gICAgICogZnVuY3Rpb24gdXNlZCB0byBjb21wYXJlIHR3byBlbGVtZW50cy4gTXVzdCByZXR1cm4gYSBuZWdhdGl2ZSBpbnRlZ2VyLFxuICAgICAqIHplcm8sIG9yIGEgcG9zaXRpdmUgaW50ZWdlciBhcyB0aGUgZmlyc3QgYXJndW1lbnQgaXMgbGVzcyB0aGFuLCBlcXVhbCB0byxcbiAgICAgKiBvciBncmVhdGVyIHRoYW4gdGhlIHNlY29uZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBIZWFwKGNvbXBhcmVGdW5jdGlvbikge1xuICAgICAgICAvKipcbiAgICAgICAgICogQXJyYXkgdXNlZCB0byBzdG9yZSB0aGUgZWxlbWVudHMgb2QgdGhlIGhlYXAuXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICB0aGlzLmNvbXBhcmUgPSBjb21wYXJlRnVuY3Rpb24gfHwgY29sbGVjdGlvbnMuZGVmYXVsdENvbXBhcmU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsZWZ0IGNoaWxkIG9mIHRoZSBub2RlIGF0IHRoZSBnaXZlbiBpbmRleC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbm9kZUluZGV4IFRoZSBpbmRleCBvZiB0aGUgbm9kZSB0byBnZXQgdGhlIGxlZnQgY2hpbGRcbiAgICAgKiBmb3IuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgaW5kZXggb2YgdGhlIGxlZnQgY2hpbGQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5sZWZ0Q2hpbGRJbmRleCA9IGZ1bmN0aW9uIChub2RlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuICgyICogbm9kZUluZGV4KSArIDE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgcmlnaHQgY2hpbGQgb2YgdGhlIG5vZGUgYXQgdGhlIGdpdmVuIGluZGV4LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBub2RlSW5kZXggVGhlIGluZGV4IG9mIHRoZSBub2RlIHRvIGdldCB0aGUgcmlnaHQgY2hpbGRcbiAgICAgKiBmb3IuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBUaGUgaW5kZXggb2YgdGhlIHJpZ2h0IGNoaWxkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUucmlnaHRDaGlsZEluZGV4ID0gZnVuY3Rpb24gKG5vZGVJbmRleCkge1xuICAgICAgICByZXR1cm4gKDIgKiBub2RlSW5kZXgpICsgMjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBwYXJlbnQgb2YgdGhlIG5vZGUgYXQgdGhlIGdpdmVuIGluZGV4LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBub2RlSW5kZXggVGhlIGluZGV4IG9mIHRoZSBub2RlIHRvIGdldCB0aGUgcGFyZW50IGZvci5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBpbmRleCBvZiB0aGUgcGFyZW50LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUucGFyZW50SW5kZXggPSBmdW5jdGlvbiAobm9kZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKChub2RlSW5kZXggLSAxKSAvIDIpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIHNtYWxsZXIgY2hpbGQgbm9kZSAoaWYgaXQgZXhpc3RzKS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVmdENoaWxkIGxlZnQgY2hpbGQgaW5kZXguXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJpZ2h0Q2hpbGQgcmlnaHQgY2hpbGQgaW5kZXguXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW5kZXggd2l0aCB0aGUgbWluaW11bSB2YWx1ZSBvciAtMSBpZiBpdCBkb2Vzbid0XG4gICAgICogZXhpc3RzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUubWluSW5kZXggPSBmdW5jdGlvbiAobGVmdENoaWxkLCByaWdodENoaWxkKSB7XG4gICAgICAgIGlmIChyaWdodENoaWxkID49IHRoaXMuZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChsZWZ0Q2hpbGQgPj0gdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb21wYXJlKHRoaXMuZGF0YVtsZWZ0Q2hpbGRdLCB0aGlzLmRhdGFbcmlnaHRDaGlsZF0pIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdENoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJpZ2h0Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1vdmVzIHRoZSBub2RlIGF0IHRoZSBnaXZlbiBpbmRleCB1cCB0byBpdHMgcHJvcGVyIHBsYWNlIGluIHRoZSBoZWFwLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gbW92ZSB1cC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEhlYXAucHJvdG90eXBlLnNpZnRVcCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnRJbmRleChpbmRleCk7XG4gICAgICAgIHdoaWxlIChpbmRleCA+IDAgJiYgdGhpcy5jb21wYXJlKHRoaXMuZGF0YVtwYXJlbnRdLCB0aGlzLmRhdGFbaW5kZXhdKSA+IDApIHtcbiAgICAgICAgICAgIGFycmF5cy5zd2FwKHRoaXMuZGF0YSwgcGFyZW50LCBpbmRleCk7XG4gICAgICAgICAgICBpbmRleCA9IHBhcmVudDtcbiAgICAgICAgICAgIHBhcmVudCA9IHRoaXMucGFyZW50SW5kZXgoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNb3ZlcyB0aGUgbm9kZSBhdCB0aGUgZ2l2ZW4gaW5kZXggZG93biB0byBpdHMgcHJvcGVyIHBsYWNlIGluIHRoZSBoZWFwLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBub2RlSW5kZXggVGhlIGluZGV4IG9mIHRoZSBub2RlIHRvIG1vdmUgZG93bi5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEhlYXAucHJvdG90eXBlLnNpZnREb3duID0gZnVuY3Rpb24gKG5vZGVJbmRleCkge1xuICAgICAgICAvL3NtYWxsZXIgY2hpbGQgaW5kZXhcbiAgICAgICAgdmFyIG1pbiA9IHRoaXMubWluSW5kZXgodGhpcy5sZWZ0Q2hpbGRJbmRleChub2RlSW5kZXgpLCB0aGlzLnJpZ2h0Q2hpbGRJbmRleChub2RlSW5kZXgpKTtcbiAgICAgICAgd2hpbGUgKG1pbiA+PSAwICYmIHRoaXMuY29tcGFyZSh0aGlzLmRhdGFbbm9kZUluZGV4XSwgdGhpcy5kYXRhW21pbl0pID4gMCkge1xuICAgICAgICAgICAgYXJyYXlzLnN3YXAodGhpcy5kYXRhLCBtaW4sIG5vZGVJbmRleCk7XG4gICAgICAgICAgICBub2RlSW5kZXggPSBtaW47XG4gICAgICAgICAgICBtaW4gPSB0aGlzLm1pbkluZGV4KHRoaXMubGVmdENoaWxkSW5kZXgobm9kZUluZGV4KSwgdGhpcy5yaWdodENoaWxkSW5kZXgobm9kZUluZGV4KSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBidXQgZG9lcyBub3QgcmVtb3ZlIHRoZSByb290IGVsZW1lbnQgb2YgdGhpcyBoZWFwLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSBhdCB0aGUgcm9vdCBvZiB0aGUgaGVhcC4gUmV0dXJucyB1bmRlZmluZWQgaWYgdGhlXG4gICAgICogaGVhcCBpcyBlbXB0eS5cbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGFbMF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSBnaXZlbiBlbGVtZW50IGludG8gdGhlIGhlYXAuXG4gICAgICogQHBhcmFtIHsqfSBlbGVtZW50IHRoZSBlbGVtZW50LlxuICAgICAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgYWRkZWQgb3IgZmFscyBpZiBpdCBpcyB1bmRlZmluZWQuXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGNvbGxlY3Rpb25zLmlzVW5kZWZpbmVkKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YS5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLnNpZnRVcCh0aGlzLmRhdGEubGVuZ3RoIC0gMSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGFuZCByZW1vdmVzIHRoZSByb290IGVsZW1lbnQgb2YgdGhpcyBoZWFwLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSByZW1vdmVkIGZyb20gdGhlIHJvb3Qgb2YgdGhlIGhlYXAuIFJldHVybnNcbiAgICAgKiB1bmRlZmluZWQgaWYgdGhlIGhlYXAgaXMgZW1wdHkuXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUucmVtb3ZlUm9vdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gdGhpcy5kYXRhWzBdO1xuICAgICAgICAgICAgdGhpcy5kYXRhWzBdID0gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zcGxpY2UodGhpcy5kYXRhLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaWZ0RG93bigwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGhlYXAgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IGVsZW1lbnQgdG8gc2VhcmNoIGZvci5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgSGVhcCBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQsIGZhbHNlXG4gICAgICogb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIEhlYXAucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGVxdUYgPSBjb2xsZWN0aW9ucy5jb21wYXJlVG9FcXVhbHModGhpcy5jb21wYXJlKTtcbiAgICAgICAgcmV0dXJuIGFycmF5cy5jb250YWlucyh0aGlzLmRhdGEsIGVsZW1lbnQsIGVxdUYpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgaGVhcC5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBoZWFwLlxuICAgICAqL1xuICAgIEhlYXAucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubGVuZ3RoO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoaXMgaGVhcCBpcyBlbXB0eS5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIGFuZCBvbmx5IGlmIHRoaXMgaGVhcCBjb250YWlucyBubyBpdGVtczsgZmFsc2VcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGggPD0gMDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIG9mIHRoZSBlbGVtZW50cyBmcm9tIHRoaXMgaGVhcC5cbiAgICAgKi9cbiAgICBIZWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kYXRhLmxlbmd0aCA9IDA7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyBoZWFwIGluXG4gICAgICogbm8gcGFydGljdWxhciBvcmRlci5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiB0aGUgZWxlbWVudCB2YWx1ZSwgdG8gYnJlYWsgdGhlIGl0ZXJhdGlvbiB5b3UgY2FuXG4gICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgSGVhcC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBhcnJheXMuZm9yRWFjaCh0aGlzLmRhdGEsIGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIHJldHVybiBIZWFwO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEhlYXA7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1IZWFwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgRGljdGlvbmFyeV8xID0gcmVxdWlyZSgnLi9EaWN0aW9uYXJ5Jyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuLyoqXG4gKiBUaGlzIGNsYXNzIGlzIHVzZWQgYnkgdGhlIExpbmtlZERpY3Rpb25hcnkgSW50ZXJuYWxseVxuICogSGFzIHRvIGJlIGEgY2xhc3MsIG5vdCBhbiBpbnRlcmZhY2UsIGJlY2F1c2UgaXQgbmVlZHMgdG8gaGF2ZVxuICogdGhlICd1bmxpbmsnIGZ1bmN0aW9uIGRlZmluZWQuXG4gKi9cbnZhciBMaW5rZWREaWN0aW9uYXJ5UGFpciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTGlua2VkRGljdGlvbmFyeVBhaXIoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBMaW5rZWREaWN0aW9uYXJ5UGFpci5wcm90b3R5cGUudW5saW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnByZXYubmV4dCA9IHRoaXMubmV4dDtcbiAgICAgICAgdGhpcy5uZXh0LnByZXYgPSB0aGlzLnByZXY7XG4gICAgfTtcbiAgICByZXR1cm4gTGlua2VkRGljdGlvbmFyeVBhaXI7XG59KCkpO1xudmFyIExpbmtlZERpY3Rpb25hcnkgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhMaW5rZWREaWN0aW9uYXJ5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIExpbmtlZERpY3Rpb25hcnkodG9TdHJGdW5jdGlvbikge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCB0b1N0ckZ1bmN0aW9uKTtcbiAgICAgICAgdGhpcy5oZWFkID0gbmV3IExpbmtlZERpY3Rpb25hcnlQYWlyKG51bGwsIG51bGwpO1xuICAgICAgICB0aGlzLnRhaWwgPSBuZXcgTGlua2VkRGljdGlvbmFyeVBhaXIobnVsbCwgbnVsbCk7XG4gICAgICAgIHRoaXMuaGVhZC5uZXh0ID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwucHJldiA9IHRoaXMuaGVhZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyB0aGUgbmV3IG5vZGUgdG8gdGhlICd0YWlsJyBvZiB0aGUgbGlzdCwgdXBkYXRpbmcgdGhlXG4gICAgICogbmVpZ2hib3JzLCBhbmQgbW92aW5nICd0aGlzLnRhaWwnICh0aGUgRW5kIG9mIExpc3QgaW5kaWNhdG9yKSB0aGF0XG4gICAgICogdG8gdGhlIGVuZC5cbiAgICAgKi9cbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS5hcHBlbmRUb1RhaWwgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgdmFyIGxhc3ROb2RlID0gdGhpcy50YWlsLnByZXY7XG4gICAgICAgIGxhc3ROb2RlLm5leHQgPSBlbnRyeTtcbiAgICAgICAgZW50cnkucHJldiA9IGxhc3ROb2RlO1xuICAgICAgICBlbnRyeS5uZXh0ID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwucHJldiA9IGVudHJ5O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGEgbGlua2VkIGRpY3Rpb25hcnkgZnJvbSB0aGUgdGFibGUgaW50ZXJuYWxseVxuICAgICAqL1xuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLmdldExpbmtlZERpY3Rpb25hcnlQYWlyID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrID0gJyQnICsgdGhpcy50b1N0cihrZXkpO1xuICAgICAgICB2YXIgcGFpciA9ICh0aGlzLnRhYmxlW2tdKTtcbiAgICAgICAgcmV0dXJuIHBhaXI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSB0byB3aGljaCB0aGlzIGRpY3Rpb25hcnkgbWFwcyB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKiBSZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGlzIGRpY3Rpb25hcnkgY29udGFpbnMgbm8gbWFwcGluZyBmb3IgdGhpcyBrZXkuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2hvc2UgYXNzb2NpYXRlZCB2YWx1ZSBpcyB0byBiZSByZXR1cm5lZC5cbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgdmFsdWUgdG8gd2hpY2ggdGhpcyBkaWN0aW9uYXJ5IG1hcHMgdGhlIHNwZWNpZmllZCBrZXkgb3JcbiAgICAgKiB1bmRlZmluZWQgaWYgdGhlIG1hcCBjb250YWlucyBubyBtYXBwaW5nIGZvciB0aGlzIGtleS5cbiAgICAgKi9cbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHBhaXIgPSB0aGlzLmdldExpbmtlZERpY3Rpb25hcnlQYWlyKGtleSk7XG4gICAgICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZChwYWlyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhaXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIG1hcHBpbmcgZm9yIHRoaXMga2V5IGZyb20gdGhpcyBkaWN0aW9uYXJ5IGlmIGl0IGlzIHByZXNlbnQuXG4gICAgICogQWxzbywgaWYgYSB2YWx1ZSBpcyBwcmVzZW50IGZvciB0aGlzIGtleSwgdGhlIGVudHJ5IGlzIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgKiBpbnNlcnRpb24gb3JkZXJpbmcuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2hvc2UgbWFwcGluZyBpcyB0byBiZSByZW1vdmVkIGZyb20gdGhlXG4gICAgICogZGljdGlvbmFyeS5cbiAgICAgKiBAcmV0dXJuIHsqfSBwcmV2aW91cyB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggc3BlY2lmaWVkIGtleSwgb3IgdW5kZWZpbmVkIGlmXG4gICAgICogdGhlcmUgd2FzIG5vIG1hcHBpbmcgZm9yIGtleS5cbiAgICAgKi9cbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciBwYWlyID0gdGhpcy5nZXRMaW5rZWREaWN0aW9uYXJ5UGFpcihrZXkpO1xuICAgICAgICBpZiAoIXV0aWwuaXNVbmRlZmluZWQocGFpcikpIHtcbiAgICAgICAgICAgIF9zdXBlci5wcm90b3R5cGUucmVtb3ZlLmNhbGwodGhpcywga2V5KTsgLy8gVGhpcyB3aWxsIHJlbW92ZSBpdCBmcm9tIHRoZSB0YWJsZVxuICAgICAgICAgICAgcGFpci51bmxpbmsoKTsgLy8gVGhpcyB3aWxsIHVubGluayBpdCBmcm9tIHRoZSBjaGFpblxuICAgICAgICAgICAgcmV0dXJuIHBhaXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICogUmVtb3ZlcyBhbGwgbWFwcGluZ3MgZnJvbSB0aGlzIExpbmtlZERpY3Rpb25hcnkuXG4gICAgKiBAdGhpcyB7Y29sbGVjdGlvbnMuTGlua2VkRGljdGlvbmFyeX1cbiAgICAqL1xuICAgIExpbmtlZERpY3Rpb25hcnkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmNsZWFyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuaGVhZC5uZXh0ID0gdGhpcy50YWlsO1xuICAgICAgICB0aGlzLnRhaWwucHJldiA9IHRoaXMuaGVhZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEludGVybmFsIGZ1bmN0aW9uIHVzZWQgd2hlbiB1cGRhdGluZyBhbiBleGlzdGluZyBLZXlWYWx1ZSBwYWlyLlxuICAgICAqIEl0IHBsYWNlcyB0aGUgbmV3IHZhbHVlIGluZGV4ZWQgYnkga2V5IGludG8gdGhlIHRhYmxlLCBidXQgbWFpbnRhaW5zXG4gICAgICogaXRzIHBsYWNlIGluIHRoZSBsaW5rZWQgb3JkZXJpbmcuXG4gICAgICovXG4gICAgTGlua2VkRGljdGlvbmFyeS5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uIChvbGRQYWlyLCBuZXdQYWlyKSB7XG4gICAgICAgIHZhciBrID0gJyQnICsgdGhpcy50b1N0cihuZXdQYWlyLmtleSk7XG4gICAgICAgIC8vIHNldCB0aGUgbmV3IFBhaXIncyBsaW5rcyB0byBleGlzdGluZ1BhaXIncyBsaW5rc1xuICAgICAgICBuZXdQYWlyLm5leHQgPSBvbGRQYWlyLm5leHQ7XG4gICAgICAgIG5ld1BhaXIucHJldiA9IG9sZFBhaXIucHJldjtcbiAgICAgICAgLy8gRGVsZXRlIEV4aXN0aW5nIFBhaXIgZnJvbSB0aGUgdGFibGUsIHVubGluayBpdCBmcm9tIGNoYWluLlxuICAgICAgICAvLyBBcyBhIHJlc3VsdCwgdGhlIG5FbGVtZW50cyBnZXRzIGRlY3JlbWVudGVkIGJ5IHRoaXMgb3BlcmF0aW9uXG4gICAgICAgIHRoaXMucmVtb3ZlKG9sZFBhaXIua2V5KTtcbiAgICAgICAgLy8gTGluayBuZXcgUGFpciBpbiBwbGFjZSBvZiB3aGVyZSBvbGRQYWlyIHdhcyxcbiAgICAgICAgLy8gYnkgcG9pbnRpbmcgdGhlIG9sZCBwYWlyJ3MgbmVpZ2hib3JzIHRvIGl0LlxuICAgICAgICBuZXdQYWlyLnByZXYubmV4dCA9IG5ld1BhaXI7XG4gICAgICAgIG5ld1BhaXIubmV4dC5wcmV2ID0gbmV3UGFpcjtcbiAgICAgICAgdGhpcy50YWJsZVtrXSA9IG5ld1BhaXI7XG4gICAgICAgIC8vIFRvIG1ha2UgdXAgZm9yIHRoZSBmYWN0IHRoYXQgdGhlIG51bWJlciBvZiBlbGVtZW50cyB3YXMgZGVjcmVtZW50ZWQsXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gaW5jcmVhc2UgaXQgYnkgb25lLlxuICAgICAgICArK3RoaXMubkVsZW1lbnRzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQXNzb2NpYXRlcyB0aGUgc3BlY2lmaWVkIHZhbHVlIHdpdGggdGhlIHNwZWNpZmllZCBrZXkgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqIElmIHRoZSBkaWN0aW9uYXJ5IHByZXZpb3VzbHkgY29udGFpbmVkIGEgbWFwcGluZyBmb3IgdGhpcyBrZXksIHRoZSBvbGRcbiAgICAgKiB2YWx1ZSBpcyByZXBsYWNlZCBieSB0aGUgc3BlY2lmaWVkIHZhbHVlLlxuICAgICAqIFVwZGF0aW5nIG9mIGEga2V5IHRoYXQgYWxyZWFkeSBleGlzdHMgbWFpbnRhaW5zIGl0cyBwbGFjZSBpbiB0aGVcbiAgICAgKiBpbnNlcnRpb24gb3JkZXIgaW50byB0aGUgbWFwLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdpdGggd2hpY2ggdGhlIHNwZWNpZmllZCB2YWx1ZSBpcyB0byBiZVxuICAgICAqIGFzc29jaWF0ZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIHZhbHVlIHRvIGJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKiBAcmV0dXJuIHsqfSBwcmV2aW91cyB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZCBrZXksIG9yIHVuZGVmaW5lZCBpZlxuICAgICAqIHRoZXJlIHdhcyBubyBtYXBwaW5nIGZvciB0aGUga2V5IG9yIGlmIHRoZSBrZXkvdmFsdWUgYXJlIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGtleSkgfHwgdXRpbC5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGV4aXN0aW5nUGFpciA9IHRoaXMuZ2V0TGlua2VkRGljdGlvbmFyeVBhaXIoa2V5KTtcbiAgICAgICAgdmFyIG5ld1BhaXIgPSBuZXcgTGlua2VkRGljdGlvbmFyeVBhaXIoa2V5LCB2YWx1ZSk7XG4gICAgICAgIHZhciBrID0gJyQnICsgdGhpcy50b1N0cihrZXkpO1xuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGFuIGVsZW1lbnQgZm9yIHRoYXQga2V5LCB3ZVxuICAgICAgICAvLyBrZWVwIGl0J3MgcGxhY2UgaW4gdGhlIExpbmtlZExpc3RcbiAgICAgICAgaWYgKCF1dGlsLmlzVW5kZWZpbmVkKGV4aXN0aW5nUGFpcikpIHtcbiAgICAgICAgICAgIHRoaXMucmVwbGFjZShleGlzdGluZ1BhaXIsIG5ld1BhaXIpO1xuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nUGFpci52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kVG9UYWlsKG5ld1BhaXIpO1xuICAgICAgICAgICAgdGhpcy50YWJsZVtrXSA9IG5ld1BhaXI7XG4gICAgICAgICAgICArK3RoaXMubkVsZW1lbnRzO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUga2V5cyBpbiB0aGlzIExpbmtlZERpY3Rpb25hcnksIG9yZGVyZWRcbiAgICAgKiBieSBpbnNlcnRpb24gb3JkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBrZXlzIGluIHRoaXMgTGlua2VkRGljdGlvbmFyeSxcbiAgICAgKiBvcmRlcmVkIGJ5IGluc2VydGlvbiBvcmRlci5cbiAgICAgKi9cbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBhcnJheS5wdXNoKGtleSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB2YWx1ZXMgaW4gdGhpcyBMaW5rZWREaWN0aW9uYXJ5LCBvcmRlcmVkIGJ5XG4gICAgICogaW5zZXJ0aW9uIG9yZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgdmFsdWVzIGluIHRoaXMgTGlua2VkRGljdGlvbmFyeSxcbiAgICAgKiBvcmRlcmVkIGJ5IGluc2VydGlvbiBvcmRlci5cbiAgICAgKi9cbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2godmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH07XG4gICAgLyoqXG4gICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBrZXktdmFsdWUgcGFpclxuICAgICogcHJlc2VudCBpbiB0aGlzIExpbmtlZERpY3Rpb25hcnkuIEl0IGlzIGRvbmUgaW4gdGhlIG9yZGVyIG9mIGluc2VydGlvblxuICAgICogaW50byB0aGUgTGlua2VkRGljdGlvbmFyeVxuICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xuICAgICogaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM6IGtleSBhbmQgdmFsdWUuIFRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxuICAgICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gICAgKi9cbiAgICBMaW5rZWREaWN0aW9uYXJ5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjcmF3bE5vZGUgPSB0aGlzLmhlYWQubmV4dDtcbiAgICAgICAgd2hpbGUgKGNyYXdsTm9kZS5uZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciByZXQgPSBjYWxsYmFjayhjcmF3bE5vZGUua2V5LCBjcmF3bE5vZGUudmFsdWUpO1xuICAgICAgICAgICAgaWYgKHJldCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjcmF3bE5vZGUgPSBjcmF3bE5vZGUubmV4dDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIExpbmtlZERpY3Rpb25hcnk7XG59KERpY3Rpb25hcnlfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBMaW5rZWREaWN0aW9uYXJ5OyAvLyBFbmQgb2YgTGlua2VkRGljdGlvbmFyeVxuLy8gLyoqXG4vLyAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGlzIGVxdWFsIHRvIHRoZSBnaXZlbiBkaWN0aW9uYXJ5LlxuLy8gICogVHdvIGRpY3Rpb25hcmllcyBhcmUgZXF1YWwgaWYgdGhleSBjb250YWluIHRoZSBzYW1lIG1hcHBpbmdzLlxuLy8gICogQHBhcmFtIHtjb2xsZWN0aW9ucy5EaWN0aW9uYXJ5fSBvdGhlciB0aGUgb3RoZXIgZGljdGlvbmFyeS5cbi8vICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IHZhbHVlc0VxdWFsRnVuY3Rpb24gb3B0aW9uYWxcbi8vICAqIGZ1bmN0aW9uIHVzZWQgdG8gY2hlY2sgaWYgdHdvIHZhbHVlcyBhcmUgZXF1YWwuXG4vLyAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBpcyBlcXVhbCB0byB0aGUgZ2l2ZW4gZGljdGlvbmFyeS5cbi8vICAqL1xuLy8gY29sbGVjdGlvbnMuRGljdGlvbmFyeS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24ob3RoZXIsdmFsdWVzRXF1YWxGdW5jdGlvbikge1xuLy8gXHRjb25zdCBlcUYgPSB2YWx1ZXNFcXVhbEZ1bmN0aW9uIHx8IGNvbGxlY3Rpb25zLmRlZmF1bHRFcXVhbHM7XG4vLyBcdGlmKCEob3RoZXIgaW5zdGFuY2VvZiBjb2xsZWN0aW9ucy5EaWN0aW9uYXJ5KSl7XG4vLyBcdFx0cmV0dXJuIGZhbHNlO1xuLy8gXHR9XG4vLyBcdGlmKHRoaXMuc2l6ZSgpICE9PSBvdGhlci5zaXplKCkpe1xuLy8gXHRcdHJldHVybiBmYWxzZTtcbi8vIFx0fVxuLy8gXHRyZXR1cm4gdGhpcy5lcXVhbHNBdXgodGhpcy5maXJzdE5vZGUsb3RoZXIuZmlyc3ROb2RlLGVxRik7XG4vLyB9XG4vLyMgc291cmNlTWFwcGluZ1VSTD1MaW5rZWREaWN0aW9uYXJ5LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBhcnJheXMgPSByZXF1aXJlKCcuL2FycmF5cycpO1xudmFyIExpbmtlZExpc3QgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICogQ3JlYXRlcyBhbiBlbXB0eSBMaW5rZWQgTGlzdC5cbiAgICAqIEBjbGFzcyBBIGxpbmtlZCBsaXN0IGlzIGEgZGF0YSBzdHJ1Y3R1cmUgY29uc2lzdGluZyBvZiBhIGdyb3VwIG9mIG5vZGVzXG4gICAgKiB3aGljaCB0b2dldGhlciByZXByZXNlbnQgYSBzZXF1ZW5jZS5cbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICovXG4gICAgZnVuY3Rpb24gTGlua2VkTGlzdCgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICogRmlyc3Qgbm9kZSBpbiB0aGUgbGlzdFxuICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICogQHByaXZhdGVcbiAgICAgICAgKi9cbiAgICAgICAgdGhpcy5maXJzdE5vZGUgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgKiBMYXN0IG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIHRoaXMubGFzdE5vZGUgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgKiBOdW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGxpc3RcbiAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICovXG4gICAgICAgIHRoaXMubkVsZW1lbnRzID0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBBZGRzIGFuIGVsZW1lbnQgdG8gdGhpcyBsaXN0LlxuICAgICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gZWxlbWVudCB0byBiZSBhZGRlZC5cbiAgICAqIEBwYXJhbSB7bnVtYmVyPX0gaW5kZXggb3B0aW9uYWwgaW5kZXggdG8gYWRkIHRoZSBlbGVtZW50LiBJZiBubyBpbmRleCBpcyBzcGVjaWZpZWRcbiAgICAqIHRoZSBlbGVtZW50IGlzIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhpcyBsaXN0LlxuICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgYWRkZWQgb3IgZmFsc2UgaWYgdGhlIGluZGV4IGlzIGludmFsaWRcbiAgICAqIG9yIGlmIHRoZSBlbGVtZW50IGlzIHVuZGVmaW5lZC5cbiAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChpbmRleCkpIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5uRWxlbWVudHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMubkVsZW1lbnRzIHx8IHV0aWwuaXNVbmRlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmV3Tm9kZSA9IHRoaXMuY3JlYXRlTm9kZShpdGVtKTtcbiAgICAgICAgaWYgKHRoaXMubkVsZW1lbnRzID09PSAwKSB7XG4gICAgICAgICAgICAvLyBGaXJzdCBub2RlIGluIHRoZSBsaXN0LlxuICAgICAgICAgICAgdGhpcy5maXJzdE5vZGUgPSBuZXdOb2RlO1xuICAgICAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IG5ld05vZGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaW5kZXggPT09IHRoaXMubkVsZW1lbnRzKSB7XG4gICAgICAgICAgICAvLyBJbnNlcnQgYXQgdGhlIGVuZC5cbiAgICAgICAgICAgIHRoaXMubGFzdE5vZGUubmV4dCA9IG5ld05vZGU7XG4gICAgICAgICAgICB0aGlzLmxhc3ROb2RlID0gbmV3Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gQ2hhbmdlIGZpcnN0IG5vZGUuXG4gICAgICAgICAgICBuZXdOb2RlLm5leHQgPSB0aGlzLmZpcnN0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3ROb2RlID0gbmV3Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwcmV2ID0gdGhpcy5ub2RlQXRJbmRleChpbmRleCAtIDEpO1xuICAgICAgICAgICAgbmV3Tm9kZS5uZXh0ID0gcHJldi5uZXh0O1xuICAgICAgICAgICAgcHJldi5uZXh0ID0gbmV3Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5FbGVtZW50cysrO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGlzIGxpc3QuXG4gICAgKiBAcmV0dXJuIHsqfSB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgbGlzdCBvciB1bmRlZmluZWQgaWYgdGhlIGxpc3QgaXNcbiAgICAqIGVtcHR5LlxuICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmZpcnN0Tm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlyc3ROb2RlLmVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgbGFzdCBlbGVtZW50IGluIHRoaXMgbGlzdC5cbiAgICAqIEByZXR1cm4geyp9IHRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGxpc3Qgb3IgdW5kZWZpbmVkIGlmIHRoZSBsaXN0IGlzXG4gICAgKiBlbXB0eS5cbiAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmxhc3ROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sYXN0Tm9kZS5lbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgcG9zaXRpb24gaW4gdGhpcyBsaXN0LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBkZXNpcmVkIGluZGV4LlxuICAgICAqIEByZXR1cm4geyp9IHRoZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBpbmRleCBvciB1bmRlZmluZWQgaWYgdGhlIGluZGV4IGlzXG4gICAgICogb3V0IG9mIGJvdW5kcy5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5lbGVtZW50QXRJbmRleCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZUF0SW5kZXgoaW5kZXgpO1xuICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZS5lbGVtZW50O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggaW4gdGhpcyBsaXN0IG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIHRoZVxuICAgICAqIHNwZWNpZmllZCBlbGVtZW50LCBvciAtMSBpZiB0aGUgTGlzdCBkb2VzIG5vdCBjb250YWluIHRoaXMgZWxlbWVudC5cbiAgICAgKiA8cD5JZiB0aGUgZWxlbWVudHMgaW5zaWRlIHRoaXMgbGlzdCBhcmVcbiAgICAgKiBub3QgY29tcGFyYWJsZSB3aXRoIHRoZSA9PT0gb3BlcmF0b3IgYSBjdXN0b20gZXF1YWxzIGZ1bmN0aW9uIHNob3VsZCBiZVxuICAgICAqIHByb3ZpZGVkIHRvIHBlcmZvcm0gc2VhcmNoZXMsIHRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgdHdvIGFyZ3VtZW50cyBhbmRcbiAgICAgKiByZXR1cm4gdHJ1ZSBpZiB0aGV5IGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLiBFeGFtcGxlOjwvcD5cbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogY29uc3QgcGV0c0FyZUVxdWFsQnlOYW1lID0gZnVuY3Rpb24ocGV0MSwgcGV0Mikge1xuICAgICAqICByZXR1cm4gcGV0MS5uYW1lID09PSBwZXQyLm5hbWU7XG4gICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIGVsZW1lbnQgdG8gc2VhcmNoIGZvci5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSBlcXVhbHNGdW5jdGlvbiBPcHRpb25hbFxuICAgICAqIGZ1bmN0aW9uIHVzZWQgdG8gY2hlY2sgaWYgdHdvIGVsZW1lbnRzIGFyZSBlcXVhbC5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbmRleCBpbiB0aGlzIGxpc3Qgb2YgdGhlIGZpcnN0IG9jY3VycmVuY2VcbiAgICAgKiBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQsIG9yIC0xIGlmIHRoaXMgbGlzdCBkb2VzIG5vdCBjb250YWluIHRoZVxuICAgICAqIGVsZW1lbnQuXG4gICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChpdGVtLCBlcXVhbHNGdW5jdGlvbikge1xuICAgICAgICB2YXIgZXF1YWxzRiA9IGVxdWFsc0Z1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdEVxdWFscztcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY3VycmVudE5vZGUgPSB0aGlzLmZpcnN0Tm9kZTtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZXF1YWxzRihjdXJyZW50Tm9kZS5lbGVtZW50LCBpdGVtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBsaXN0IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICAgICAqIDxwPklmIHRoZSBlbGVtZW50cyBpbnNpZGUgdGhlIGxpc3QgYXJlXG4gICAgICAgKiBub3QgY29tcGFyYWJsZSB3aXRoIHRoZSA9PT0gb3BlcmF0b3IgYSBjdXN0b20gZXF1YWxzIGZ1bmN0aW9uIHNob3VsZCBiZVxuICAgICAgICogcHJvdmlkZWQgdG8gcGVyZm9ybSBzZWFyY2hlcywgdGhlIGZ1bmN0aW9uIG11c3QgcmVjZWl2ZSB0d28gYXJndW1lbnRzIGFuZFxuICAgICAgICogcmV0dXJuIHRydWUgaWYgdGhleSBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS4gRXhhbXBsZTo8L3A+XG4gICAgICAgKlxuICAgICAgICogPHByZT5cbiAgICAgICAqIGNvbnN0IHBldHNBcmVFcXVhbEJ5TmFtZSA9IGZ1bmN0aW9uKHBldDEsIHBldDIpIHtcbiAgICAgICAqICByZXR1cm4gcGV0MS5uYW1lID09PSBwZXQyLm5hbWU7XG4gICAgICAgKiB9XG4gICAgICAgKiA8L3ByZT5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIGVsZW1lbnQgdG8gc2VhcmNoIGZvci5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIE9wdGlvbmFsXG4gICAgICAgKiBmdW5jdGlvbiB1c2VkIHRvIGNoZWNrIGlmIHR3byBlbGVtZW50cyBhcmUgZXF1YWwuXG4gICAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgbGlzdCBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQsIGZhbHNlXG4gICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChpdGVtLCBlcXVhbHNGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gKHRoaXMuaW5kZXhPZihpdGVtLCBlcXVhbHNGdW5jdGlvbikgPj0gMCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBpbiB0aGlzIGxpc3QuXG4gICAgICogPHA+SWYgdGhlIGVsZW1lbnRzIGluc2lkZSB0aGUgbGlzdCBhcmVcbiAgICAgKiBub3QgY29tcGFyYWJsZSB3aXRoIHRoZSA9PT0gb3BlcmF0b3IgYSBjdXN0b20gZXF1YWxzIGZ1bmN0aW9uIHNob3VsZCBiZVxuICAgICAqIHByb3ZpZGVkIHRvIHBlcmZvcm0gc2VhcmNoZXMsIHRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgdHdvIGFyZ3VtZW50cyBhbmRcbiAgICAgKiByZXR1cm4gdHJ1ZSBpZiB0aGV5IGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLiBFeGFtcGxlOjwvcD5cbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogY29uc3QgcGV0c0FyZUVxdWFsQnlOYW1lID0gZnVuY3Rpb24ocGV0MSwgcGV0Mikge1xuICAgICAqICByZXR1cm4gcGV0MS5uYW1lID09PSBwZXQyLm5hbWU7XG4gICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIGVsZW1lbnQgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoaXMgbGlzdCwgaWYgcHJlc2VudC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBsaXN0IGNvbnRhaW5lZCB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgICAgIHZhciBlcXVhbHNGID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xuICAgICAgICBpZiAodGhpcy5uRWxlbWVudHMgPCAxIHx8IHV0aWwuaXNVbmRlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJldmlvdXMgPSBudWxsO1xuICAgICAgICB2YXIgY3VycmVudE5vZGUgPSB0aGlzLmZpcnN0Tm9kZTtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZXF1YWxzRihjdXJyZW50Tm9kZS5lbGVtZW50LCBpdGVtKSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gdGhpcy5maXJzdE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdE5vZGUgPSB0aGlzLmZpcnN0Tm9kZS5uZXh0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudE5vZGUgPT09IHRoaXMubGFzdE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnROb2RlID09PSB0aGlzLmxhc3ROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE5vZGUgPSBwcmV2aW91cztcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMubmV4dCA9IGN1cnJlbnROb2RlLm5leHQ7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlLm5leHQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMubmV4dCA9IGN1cnJlbnROb2RlLm5leHQ7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlLm5leHQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm5FbGVtZW50cy0tO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldmlvdXMgPSBjdXJyZW50Tm9kZTtcbiAgICAgICAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUubmV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBvZiB0aGUgZWxlbWVudHMgZnJvbSB0aGlzIGxpc3QuXG4gICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZmlyc3ROb2RlID0gbnVsbDtcbiAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IG51bGw7XG4gICAgICAgIHRoaXMubkVsZW1lbnRzID0gMDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIGxpc3QgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIGxpc3QuXG4gICAgICogVHdvIGxpc3RzIGFyZSBlcXVhbCBpZiB0aGV5IGhhdmUgdGhlIHNhbWUgZWxlbWVudHMgaW4gdGhlIHNhbWUgb3JkZXIuXG4gICAgICogQHBhcmFtIHtMaW5rZWRMaXN0fSBvdGhlciB0aGUgb3RoZXIgbGlzdC5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSBlcXVhbHNGdW5jdGlvbiBvcHRpb25hbFxuICAgICAqIGZ1bmN0aW9uIHVzZWQgdG8gY2hlY2sgaWYgdHdvIGVsZW1lbnRzIGFyZSBlcXVhbC4gSWYgdGhlIGVsZW1lbnRzIGluIHRoZSBsaXN0c1xuICAgICAqIGFyZSBjdXN0b20gb2JqZWN0cyB5b3Ugc2hvdWxkIHByb3ZpZGUgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlXG4gICAgICogdGhlID09PSBvcGVyYXRvciBpcyB1c2VkIHRvIGNoZWNrIGVxdWFsaXR5IGJldHdlZW4gZWxlbWVudHMuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIGxpc3QgaXMgZXF1YWwgdG8gdGhlIGdpdmVuIGxpc3QuXG4gICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKG90aGVyLCBlcXVhbHNGdW5jdGlvbikge1xuICAgICAgICB2YXIgZXFGID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xuICAgICAgICBpZiAoIShvdGhlciBpbnN0YW5jZW9mIExpbmtlZExpc3QpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2l6ZSgpICE9PSBvdGhlci5zaXplKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5lcXVhbHNBdXgodGhpcy5maXJzdE5vZGUsIG90aGVyLmZpcnN0Tm9kZSwgZXFGKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICogQHByaXZhdGVcbiAgICAqL1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLmVxdWFsc0F1eCA9IGZ1bmN0aW9uIChuMSwgbjIsIGVxRikge1xuICAgICAgICB3aGlsZSAobjEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICghZXFGKG4xLmVsZW1lbnQsIG4yLmVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbjEgPSBuMS5uZXh0O1xuICAgICAgICAgICAgbjIgPSBuMi5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIHBvc2l0aW9uIGluIHRoaXMgbGlzdC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggZ2l2ZW4gaW5kZXguXG4gICAgICogQHJldHVybiB7Kn0gcmVtb3ZlZCBlbGVtZW50IG9yIHVuZGVmaW5lZCBpZiB0aGUgaW5kZXggaXMgb3V0IG9mIGJvdW5kcy5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5yZW1vdmVFbGVtZW50QXRJbmRleCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMubkVsZW1lbnRzKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbGVtZW50O1xuICAgICAgICBpZiAodGhpcy5uRWxlbWVudHMgPT09IDEpIHtcbiAgICAgICAgICAgIC8vRmlyc3Qgbm9kZSBpbiB0aGUgbGlzdC5cbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmZpcnN0Tm9kZS5lbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5maXJzdE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcHJldmlvdXMgPSB0aGlzLm5vZGVBdEluZGV4KGluZGV4IC0gMSk7XG4gICAgICAgICAgICBpZiAocHJldmlvdXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5maXJzdE5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLmZpcnN0Tm9kZSA9IHRoaXMuZmlyc3ROb2RlLm5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChwcmV2aW91cy5uZXh0ID09PSB0aGlzLmxhc3ROb2RlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMubGFzdE5vZGUuZWxlbWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3ROb2RlID0gcHJldmlvdXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJldmlvdXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gcHJldmlvdXMubmV4dC5lbGVtZW50O1xuICAgICAgICAgICAgICAgIHByZXZpb3VzLm5leHQgPSBwcmV2aW91cy5uZXh0Lm5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uRWxlbWVudHMtLTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyBsaXN0IGluIG9yZGVyLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xuICAgICAqIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IHRoaXMuZmlyc3ROb2RlO1xuICAgICAgICB3aGlsZSAoY3VycmVudE5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhjdXJyZW50Tm9kZS5lbGVtZW50KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUubmV4dDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV2ZXJzZXMgdGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIGxpbmtlZCBsaXN0IChtYWtlcyB0aGUgbGFzdFxuICAgICAqIGVsZW1lbnQgZmlyc3QsIGFuZCB0aGUgZmlyc3QgZWxlbWVudCBsYXN0KS5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJldmlvdXMgPSBudWxsO1xuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuZmlyc3ROb2RlO1xuICAgICAgICB2YXIgdGVtcCA9IG51bGw7XG4gICAgICAgIHdoaWxlIChjdXJyZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0ZW1wID0gY3VycmVudC5uZXh0O1xuICAgICAgICAgICAgY3VycmVudC5uZXh0ID0gcHJldmlvdXM7XG4gICAgICAgICAgICBwcmV2aW91cyA9IGN1cnJlbnQ7XG4gICAgICAgICAgICBjdXJyZW50ID0gdGVtcDtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wID0gdGhpcy5maXJzdE5vZGU7XG4gICAgICAgIHRoaXMuZmlyc3ROb2RlID0gdGhpcy5sYXN0Tm9kZTtcbiAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IHRlbXA7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBlbGVtZW50cyBpbiB0aGlzIGxpc3QgaW4gcHJvcGVyXG4gICAgICogc2VxdWVuY2UuXG4gICAgICogQHJldHVybiB7QXJyYXkuPCo+fSBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgZWxlbWVudHMgaW4gdGhpcyBsaXN0LFxuICAgICAqIGluIHByb3BlciBzZXF1ZW5jZS5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgdmFyIGN1cnJlbnROb2RlID0gdGhpcy5maXJzdE5vZGU7XG4gICAgICAgIHdoaWxlIChjdXJyZW50Tm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgYXJyYXkucHVzaChjdXJyZW50Tm9kZS5lbGVtZW50KTtcbiAgICAgICAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUubmV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBsaXN0LlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIGxpc3QuXG4gICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubkVsZW1lbnRzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgbGlzdCBjb250YWlucyBubyBlbGVtZW50cy5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgbGlzdCBjb250YWlucyBubyBlbGVtZW50cy5cbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uRWxlbWVudHMgPD0gMDtcbiAgICB9O1xuICAgIExpbmtlZExpc3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJyYXlzLnRvU3RyaW5nKHRoaXMudG9BcnJheSgpKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgTGlua2VkTGlzdC5wcm90b3R5cGUubm9kZUF0SW5kZXggPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLm5FbGVtZW50cykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ID09PSAodGhpcy5uRWxlbWVudHMgLSAxKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFzdE5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmZpcnN0Tm9kZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbmRleDsgaSsrKSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBMaW5rZWRMaXN0LnByb3RvdHlwZS5jcmVhdGVOb2RlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IGl0ZW0sXG4gICAgICAgICAgICBuZXh0OiBudWxsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gTGlua2VkTGlzdDtcbn0oKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBMaW5rZWRMaXN0OyAvLyBFbmQgb2YgbGlua2VkIGxpc3Rcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUxpbmtlZExpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoJy4vRGljdGlvbmFyeScpO1xudmFyIGFycmF5cyA9IHJlcXVpcmUoJy4vYXJyYXlzJyk7XG52YXIgTXVsdGlEaWN0aW9uYXJ5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVtcHR5IG11bHRpIGRpY3Rpb25hcnkuXG4gICAgICogQGNsYXNzIDxwPkEgbXVsdGkgZGljdGlvbmFyeSBpcyBhIHNwZWNpYWwga2luZCBvZiBkaWN0aW9uYXJ5IHRoYXQgaG9sZHNcbiAgICAgKiBtdWx0aXBsZSB2YWx1ZXMgYWdhaW5zdCBlYWNoIGtleS4gU2V0dGluZyBhIHZhbHVlIGludG8gdGhlIGRpY3Rpb25hcnkgd2lsbFxuICAgICAqIGFkZCB0aGUgdmFsdWUgdG8gYW4gYXJyYXkgYXQgdGhhdCBrZXkuIEdldHRpbmcgYSBrZXkgd2lsbCByZXR1cm4gYW4gYXJyYXksXG4gICAgICogaG9sZGluZyBhbGwgdGhlIHZhbHVlcyBzZXQgdG8gdGhhdCBrZXkuXG4gICAgICogWW91IGNhbiBjb25maWd1cmUgdG8gYWxsb3cgZHVwbGljYXRlcyBpbiB0aGUgdmFsdWVzLlxuICAgICAqIFRoaXMgaW1wbGVtZW50YXRpb24gYWNjZXB0cyBhbnkga2luZCBvZiBvYmplY3RzIGFzIGtleXMuPC9wPlxuICAgICAqXG4gICAgICogPHA+SWYgdGhlIGtleXMgYXJlIGN1c3RvbSBvYmplY3RzIGEgZnVuY3Rpb24gd2hpY2ggY29udmVydHMga2V5cyB0byBzdHJpbmdzIG11c3QgYmVcbiAgICAgKiBwcm92aWRlZC4gRXhhbXBsZTo8L3A+XG4gICAgICpcbiAgICAgKiA8cHJlPlxuICAgICAqIGZ1bmN0aW9uIHBldFRvU3RyaW5nKHBldCkge1xuICAgICAgICogIHJldHVybiBwZXQubmFtZTtcbiAgICAgICAqIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKiA8cD5JZiB0aGUgdmFsdWVzIGFyZSBjdXN0b20gb2JqZWN0cyBhIGZ1bmN0aW9uIHRvIGNoZWNrIGVxdWFsaXR5IGJldHdlZW4gdmFsdWVzXG4gICAgICogbXVzdCBiZSBwcm92aWRlZC4gRXhhbXBsZTo8L3A+XG4gICAgICpcbiAgICAgKiA8cHJlPlxuICAgICAqIGZ1bmN0aW9uIHBldHNBcmVFcXVhbEJ5QWdlKHBldDEscGV0Mikge1xuICAgICAgICogIHJldHVybiBwZXQxLmFnZT09PXBldDIuYWdlO1xuICAgICAgICogfVxuICAgICAqIDwvcHJlPlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KTpzdHJpbmc9fSB0b1N0ckZ1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uXG4gICAgICogdG8gY29udmVydCBrZXlzIHRvIHN0cmluZ3MuIElmIHRoZSBrZXlzIGFyZW4ndCBzdHJpbmdzIG9yIGlmIHRvU3RyaW5nKClcbiAgICAgKiBpcyBub3QgYXBwcm9wcmlhdGUsIGEgY3VzdG9tIGZ1bmN0aW9uIHdoaWNoIHJlY2VpdmVzIGEga2V5IGFuZCByZXR1cm5zIGFcbiAgICAgKiB1bmlxdWUgc3RyaW5nIG11c3QgYmUgcHJvdmlkZWQuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gdmFsdWVzRXF1YWxzRnVuY3Rpb24gb3B0aW9uYWxcbiAgICAgKiBmdW5jdGlvbiB0byBjaGVjayBpZiB0d28gdmFsdWVzIGFyZSBlcXVhbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhbGxvd0R1cGxpY2F0ZVZhbHVlc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIE11bHRpRGljdGlvbmFyeSh0b1N0ckZ1bmN0aW9uLCB2YWx1ZXNFcXVhbHNGdW5jdGlvbiwgYWxsb3dEdXBsaWNhdGVWYWx1ZXMpIHtcbiAgICAgICAgaWYgKGFsbG93RHVwbGljYXRlVmFsdWVzID09PSB2b2lkIDApIHsgYWxsb3dEdXBsaWNhdGVWYWx1ZXMgPSBmYWxzZTsgfVxuICAgICAgICB0aGlzLmRpY3QgPSBuZXcgRGljdGlvbmFyeV8xLmRlZmF1bHQodG9TdHJGdW5jdGlvbik7XG4gICAgICAgIHRoaXMuZXF1YWxzRiA9IHZhbHVlc0VxdWFsc0Z1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdEVxdWFscztcbiAgICAgICAgdGhpcy5hbGxvd0R1cGxpY2F0ZSA9IGFsbG93RHVwbGljYXRlVmFsdWVzO1xuICAgIH1cbiAgICAvKipcbiAgICAqIFJldHVybnMgYW4gYXJyYXkgaG9sZGluZyB0aGUgdmFsdWVzIHRvIHdoaWNoIHRoaXMgZGljdGlvbmFyeSBtYXBzXG4gICAgKiB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAqIFJldHVybnMgYW4gZW1wdHkgYXJyYXkgaWYgdGhpcyBkaWN0aW9uYXJ5IGNvbnRhaW5zIG5vIG1hcHBpbmdzIGZvciB0aGlzIGtleS5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBrZXkga2V5IHdob3NlIGFzc29jaWF0ZWQgdmFsdWVzIGFyZSB0byBiZSByZXR1cm5lZC5cbiAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBob2xkaW5nIHRoZSB2YWx1ZXMgdG8gd2hpY2ggdGhpcyBkaWN0aW9uYXJ5IG1hcHNcbiAgICAqIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICovXG4gICAgTXVsdGlEaWN0aW9uYXJ5LnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMuZGljdC5nZXRWYWx1ZShrZXkpO1xuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZCh2YWx1ZXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5cy5jb3B5KHZhbHVlcyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZSB2YWx1ZSB0byB0aGUgYXJyYXkgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LCBpZlxuICAgICAqIGl0IGlzIG5vdCBhbHJlYWR5IHByZXNlbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2l0aCB3aGljaCB0aGUgc3BlY2lmaWVkIHZhbHVlIGlzIHRvIGJlXG4gICAgICogYXNzb2NpYXRlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgdGhlIHZhbHVlIHRvIGFkZCB0byB0aGUgYXJyYXkgYXQgdGhlIGtleVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIHZhbHVlIHdhcyBub3QgYWxyZWFkeSBhc3NvY2lhdGVkIHdpdGggdGhhdCBrZXkuXG4gICAgICovXG4gICAgTXVsdGlEaWN0aW9uYXJ5LnByb3RvdHlwZS5zZXRWYWx1ZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGtleSkgfHwgdXRpbC5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuY29udGFpbnNLZXkoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5kaWN0LnNldFZhbHVlKGtleSwgW3ZhbHVlXSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXJyYXkgPSB0aGlzLmRpY3QuZ2V0VmFsdWUoa2V5KTtcbiAgICAgICAgaWYgKCF0aGlzLmFsbG93RHVwbGljYXRlKSB7XG4gICAgICAgICAgICBpZiAoYXJyYXlzLmNvbnRhaW5zKGFycmF5LCB2YWx1ZSwgdGhpcy5lcXVhbHNGKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcnJheS5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBzcGVjaWZpZWQgdmFsdWVzIGZyb20gdGhlIGFycmF5IG9mIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggdGhlXG4gICAgICogc3BlY2lmaWVkIGtleS4gSWYgYSB2YWx1ZSBpc24ndCBnaXZlbiwgYWxsIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZFxuICAgICAqIGtleSBhcmUgcmVtb3ZlZC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0ga2V5IGtleSB3aG9zZSBtYXBwaW5nIGlzIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgKiBkaWN0aW9uYXJ5LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gdmFsdWUgb3B0aW9uYWwgYXJndW1lbnQgdG8gc3BlY2lmeSB0aGUgdmFsdWUgdG8gcmVtb3ZlXG4gICAgICogZnJvbSB0aGUgYXJyYXkgYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICAqIEByZXR1cm4geyp9IHRydWUgaWYgdGhlIGRpY3Rpb25hcnkgY2hhbmdlZCwgZmFsc2UgaWYgdGhlIGtleSBkb2Vzbid0IGV4aXN0IG9yXG4gICAgICogaWYgdGhlIHNwZWNpZmllZCB2YWx1ZSBpc24ndCBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZCBrZXkuXG4gICAgICovXG4gICAgTXVsdGlEaWN0aW9uYXJ5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciB2ID0gdGhpcy5kaWN0LnJlbW92ZShrZXkpO1xuICAgICAgICAgICAgcmV0dXJuICF1dGlsLmlzVW5kZWZpbmVkKHYpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcnJheSA9IHRoaXMuZGljdC5nZXRWYWx1ZShrZXkpO1xuICAgICAgICBpZiAoYXJyYXlzLnJlbW92ZShhcnJheSwgdmFsdWUsIHRoaXMuZXF1YWxzRikpIHtcbiAgICAgICAgICAgIGlmIChhcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpY3QucmVtb3ZlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBrZXlzIGluIHRoaXMgZGljdGlvbmFyeS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGtleXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqL1xuICAgIE11bHRpRGljdGlvbmFyeS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdC5rZXlzKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSB2YWx1ZXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgdmFsdWVzIGluIHRoaXMgZGljdGlvbmFyeS5cbiAgICAgKi9cbiAgICBNdWx0aURpY3Rpb25hcnkucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMuZGljdC52YWx1ZXMoKTtcbiAgICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgdmFsdWVzXzEgPSB2YWx1ZXM7IF9pIDwgdmFsdWVzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgdiA9IHZhbHVlc18xW19pXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgdl8xID0gdjsgX2EgPCB2XzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHcgPSB2XzFbX2FdO1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2godyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgZGljdGlvbmFyeSBhdCBsZWFzdCBvbmUgdmFsdWUgYXNzb2NpYXR0ZWQgdGhlIHNwZWNpZmllZCBrZXkuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGtleSBrZXkgd2hvc2UgcHJlc2VuY2UgaW4gdGhpcyBkaWN0aW9uYXJ5IGlzIHRvIGJlXG4gICAgICogdGVzdGVkLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGF0IGxlYXN0IG9uZSB2YWx1ZSBhc3NvY2lhdHRlZFxuICAgICAqIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICAqL1xuICAgIE11bHRpRGljdGlvbmFyeS5wcm90b3R5cGUuY29udGFpbnNLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3QuY29udGFpbnNLZXkoa2V5KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIG1hcHBpbmdzIGZyb20gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqL1xuICAgIE11bHRpRGljdGlvbmFyeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZGljdC5jbGVhcigpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGtleXMgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBrZXktdmFsdWUgbWFwcGluZ3MgaW4gdGhpcyBkaWN0aW9uYXJ5LlxuICAgICAqL1xuICAgIE11bHRpRGljdGlvbmFyeS5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdC5zaXplKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGNvbnRhaW5zIG5vIG1hcHBpbmdzLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBkaWN0aW9uYXJ5IGNvbnRhaW5zIG5vIG1hcHBpbmdzLlxuICAgICAqL1xuICAgIE11bHRpRGljdGlvbmFyeS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdC5pc0VtcHR5KCk7XG4gICAgfTtcbiAgICByZXR1cm4gTXVsdGlEaWN0aW9uYXJ5O1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IE11bHRpRGljdGlvbmFyeTsgLy8gZW5kIG9mIG11bHRpIGRpY3Rpb25hcnlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU11bHRpRGljdGlvbmFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbihmdW5jdGlvbiAoRGlyZWN0aW9uKSB7XG4gICAgRGlyZWN0aW9uW0RpcmVjdGlvbltcIkJFRk9SRVwiXSA9IDBdID0gXCJCRUZPUkVcIjtcbiAgICBEaXJlY3Rpb25bRGlyZWN0aW9uW1wiQUZURVJcIl0gPSAxXSA9IFwiQUZURVJcIjtcbiAgICBEaXJlY3Rpb25bRGlyZWN0aW9uW1wiSU5TSURFX0FUX0VORFwiXSA9IDJdID0gXCJJTlNJREVfQVRfRU5EXCI7XG4gICAgRGlyZWN0aW9uW0RpcmVjdGlvbltcIklOU0lERV9BVF9TVEFSVFwiXSA9IDNdID0gXCJJTlNJREVfQVRfU1RBUlRcIjtcbn0pKGV4cG9ydHMuRGlyZWN0aW9uIHx8IChleHBvcnRzLkRpcmVjdGlvbiA9IHt9KSk7XG52YXIgRGlyZWN0aW9uID0gZXhwb3J0cy5EaXJlY3Rpb247XG52YXIgTXVsdGlSb290VHJlZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTXVsdGlSb290VHJlZSgpIHtcbiAgICAgICAgLy8gaWRzIG11c3QgYmUgdW5pcXVlXG4gICAgICAgIHRoaXMucm9vdElkcyA9IFtdO1xuICAgICAgICB0aGlzLm5vZGVzID0ge307XG4gICAgfVxuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmdldFJvb3RJZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjbG9uZSA9IHRoaXMucm9vdElkcy5zbGljZSgpO1xuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5nZXROb2RlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNsb25lID0ge307XG4gICAgICAgIGZvciAodmFyIG5vZGVLZXkgaW4gdGhpcy5ub2Rlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkobm9kZUtleSkpIHtcbiAgICAgICAgICAgICAgICBjbG9uZVtub2RlS2V5XSA9IHRoaXMubm9kZXNbbm9kZUtleV0uc2xpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5tb3ZlSWRCZWZvcmVJZCA9IGZ1bmN0aW9uIChtb3ZlSWQsIGJlZm9yZUlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVJZChtb3ZlSWQsIGJlZm9yZUlkLCBEaXJlY3Rpb24uQkVGT1JFKTtcbiAgICB9O1xuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLm1vdmVJZEFmdGVySWQgPSBmdW5jdGlvbiAobW92ZUlkLCBhZnRlcklkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vdmVJZChtb3ZlSWQsIGFmdGVySWQsIERpcmVjdGlvbi5BRlRFUik7XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5tb3ZlSWRJbnRvSWQgPSBmdW5jdGlvbiAobW92ZUlkLCBpbnNpZGVJZCwgYXRTdGFydCkge1xuICAgICAgICBpZiAoYXRTdGFydCA9PT0gdm9pZCAwKSB7IGF0U3RhcnQgPSB0cnVlOyB9XG4gICAgICAgIGlmIChhdFN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb3ZlSWQobW92ZUlkLCBpbnNpZGVJZCwgRGlyZWN0aW9uLklOU0lERV9BVF9TVEFSVCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb3ZlSWQobW92ZUlkLCBpbnNpZGVJZCwgRGlyZWN0aW9uLklOU0lERV9BVF9FTkQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5kZWxldGVJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB0aGlzLnJvb3REZWxldGVJZChpZCk7XG4gICAgICAgIHRoaXMubm9kZUFuZFN1Yk5vZGVzRGVsZXRlKGlkKTtcbiAgICAgICAgdGhpcy5ub2RlUmVmcmVuY2VzRGVsZXRlKGlkKTtcbiAgICB9O1xuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmluc2VydElkQmVmb3JlSWQgPSBmdW5jdGlvbiAoYmVmb3JlSWQsIGluc2VydElkKSB7XG4gICAgICAgIHZhciBmb3VuZFJvb3RJZEluZGV4ID0gdGhpcy5maW5kUm9vdElkKGJlZm9yZUlkKTtcbiAgICAgICAgaWYgKGZvdW5kUm9vdElkSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Sb290KGluc2VydElkLCBmb3VuZFJvb3RJZEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBub2RlS2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kTm9kZUlkSW5kZXggPSB0aGlzLmZpbmROb2RlSWQobm9kZUtleSwgYmVmb3JlSWQpO1xuICAgICAgICAgICAgICAgIGlmIChmb3VuZE5vZGVJZEluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Ob2RlKG5vZGVLZXksIGluc2VydElkLCBmb3VuZE5vZGVJZEluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmluc2VydElkQWZ0ZXJJZCA9IGZ1bmN0aW9uIChiZWxvd0lkLCBpbnNlcnRJZCkge1xuICAgICAgICB2YXIgZm91bmRSb290SWRJbmRleCA9IHRoaXMuZmluZFJvb3RJZChiZWxvd0lkKTtcbiAgICAgICAgaWYgKGZvdW5kUm9vdElkSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Sb290KGluc2VydElkLCBmb3VuZFJvb3RJZEluZGV4ICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgbm9kZUtleSBpbiB0aGlzLm5vZGVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShub2RlS2V5KSkge1xuICAgICAgICAgICAgICAgIHZhciBmb3VuZE5vZGVJZEluZGV4ID0gdGhpcy5maW5kTm9kZUlkKG5vZGVLZXksIGJlbG93SWQpO1xuICAgICAgICAgICAgICAgIGlmIChmb3VuZE5vZGVJZEluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Ob2RlKG5vZGVLZXksIGluc2VydElkLCBmb3VuZE5vZGVJZEluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5pbnNlcnRJZEludG9JZCA9IGZ1bmN0aW9uIChpbnNpZGVJZCwgaW5zZXJ0SWQpIHtcbiAgICAgICAgdGhpcy5ub2RlSW5zZXJ0QXRFbmQoaW5zaWRlSWQsIGluc2VydElkKTtcbiAgICAgICAgdGhpcy5ub2Rlc1tpbnNlcnRJZF0gPSBbXTtcbiAgICB9O1xuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLmluc2VydElkSW50b1Jvb3QgPSBmdW5jdGlvbiAoaWQsIHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJvb3RJbnNlcnRBdEVuZChpZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxlbmd0aF8xID0gdGhpcy5yb290SWRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3RJZHMuc3BsaWNlKChwb3NpdGlvbiArIGxlbmd0aF8xICsgMSksIDAsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdElkcy5zcGxpY2UocG9zaXRpb24sIDAsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vZGVzW2lkXSA9IHRoaXMubm9kZXNbaWRdIHx8IFtdO1xuICAgIH07XG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUuaW5zZXJ0SWRJbnRvTm9kZSA9IGZ1bmN0aW9uIChub2RlS2V5LCBpZCwgcG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5ub2Rlc1tub2RlS2V5XSA9IHRoaXMubm9kZXNbbm9kZUtleV0gfHwgW107XG4gICAgICAgIHRoaXMubm9kZXNbaWRdID0gdGhpcy5ub2Rlc1tpZF0gfHwgW107XG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGVJbnNlcnRBdEVuZChub2RlS2V5LCBpZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxlbmd0aF8yID0gdGhpcy5ub2Rlc1tub2RlS2V5XS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlc1tub2RlS2V5XS5zcGxpY2UoKHBvc2l0aW9uICsgbGVuZ3RoXzIgKyAxKSwgMCwgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlc1tub2RlS2V5XS5zcGxpY2UocG9zaXRpb24sIDAsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUubW92ZUlkID0gZnVuY3Rpb24gKG1vdmVJZCwgYmVmb3JlSWQsIGRpcmVjdGlvbikge1xuICAgICAgICB2YXIgc291cmNlSWQgPSBtb3ZlSWQ7XG4gICAgICAgIHZhciBzb3VyY2VSb290SW5kZXggPSB0aGlzLmZpbmRSb290SWQoc291cmNlSWQpO1xuICAgICAgICB2YXIgc291cmNlTm9kZUtleTtcbiAgICAgICAgdmFyIHNvdXJjZU5vZGVJZEluZGV4O1xuICAgICAgICBpZiAodGhpcy5ub2Rlc1tiZWZvcmVJZF0pIHtcbiAgICAgICAgICAgIHNvdXJjZU5vZGVLZXkgPSBiZWZvcmVJZDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBub2RlS2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlTm9kZUlkSW5kZXggPSB0aGlzLmZpbmROb2RlSWQobm9kZUtleSwgYmVmb3JlSWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGdvdCBhbGxcbiAgICAgICAgdmFyIHRhcmdldElkID0gYmVmb3JlSWQ7XG4gICAgICAgIHZhciB0YXJnZXRSb290SW5kZXggPSB0aGlzLmZpbmRSb290SWQodGFyZ2V0SWQpO1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZUtleTtcbiAgICAgICAgdmFyIHRhcmdldE5vZGVJZEluZGV4O1xuICAgICAgICBpZiAodGhpcy5ub2Rlc1tiZWZvcmVJZF0pIHtcbiAgICAgICAgICAgIHRhcmdldE5vZGVLZXkgPSBiZWZvcmVJZDtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBub2RlS2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZUlkSW5kZXggPSB0aGlzLmZpbmROb2RlSWQobm9kZUtleSwgYmVmb3JlSWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGdvdCBhbGxcbiAgICAgICAgaWYgKHNvdXJjZVJvb3RJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0Um9vdEluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3REZWxldGUoc291cmNlUm9vdEluZGV4KTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5CRUZPUkU6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydElkSW50b1Jvb3Qoc291cmNlSWQsIHRhcmdldFJvb3RJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uQUZURVI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydElkSW50b1Jvb3Qoc291cmNlSWQsIHRhcmdldFJvb3RJbmRleCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLklOU0lERV9BVF9TVEFSVDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZUluc2VydEF0U3RhcnQodGFyZ2V0SWQsIHNvdXJjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5JTlNJREVfQVRfRU5EOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlSW5zZXJ0QXRFbmQodGFyZ2V0SWQsIHNvdXJjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG1vdmluZyByb290IChzb3VyY2UpIEFCT1ZFIG5vZGUgKHRhcmdldClcbiAgICAgICAgICAgICAgICAvLyB3aWxsIHJlbW92ZSBvbmUgZW50cnkgZnJvbSByb290c1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdERlbGV0ZShzb3VyY2VSb290SW5kZXgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG5vZGVLZXkgaW4gdGhpcy5ub2Rlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShub2RlS2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5maW5kTm9kZUlkKG5vZGVLZXksIHRhcmdldElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uQkVGT1JFOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Ob2RlKG5vZGVLZXksIHNvdXJjZUlkLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uQUZURVI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydElkSW50b05vZGUobm9kZUtleSwgc291cmNlSWQsIGluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uSU5TSURFX0FUX1NUQVJUOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlSW5zZXJ0QXRTdGFydCh0YXJnZXRJZCwgc291cmNlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLklOU0lERV9BVF9FTkQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVJbnNlcnRBdEVuZCh0YXJnZXRJZCwgc291cmNlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRhcmdldFJvb3RJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gbW92aW5nIG5vZGUgKHNvdXJjZSkgQUJPVkUgcm9vdCAodGFyZ2V0KVxuICAgICAgICAgICAgICAgIC8vIGRlbGV0ZSBzb3VyY2UgaWQgZnJvbSBlYWNoIG5vZGVcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBub2RlS2V5IGluIHRoaXMubm9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubm9kZXMuaGFzT3duUHJvcGVydHkobm9kZUtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZmluZE5vZGVJZChub2RlS2V5LCBzb3VyY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMubm9kZUluc2VydElkKG5vZGVLZXksIHNvdXJjZUlkLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlRGVsZXRlQXRJbmRleChub2RlS2V5LCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uQkVGT1JFOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Sb290KHNvdXJjZUlkLCB0YXJnZXRSb290SW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLkFGVEVSOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJZEludG9Sb290KHNvdXJjZUlkLCB0YXJnZXRSb290SW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5JTlNJREVfQVRfU1RBUlQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVJbnNlcnRBdFN0YXJ0KHRhcmdldElkLCBzb3VyY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uSU5TSURFX0FUX0VORDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZUluc2VydEF0RW5kKHRhcmdldElkLCBzb3VyY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBtb3Zpbmcgbm9kZSAoc291cmNlKSBBQk9WRSBub2RlICh0YXJnZXQpXG4gICAgICAgICAgICAgICAgLy8gZGVsZXRlIHNvdXJjZSBpZCBmcm9tIGVhY2ggbm9kZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIG5vZGVLZXkgaW4gdGhpcy5ub2Rlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShub2RlS2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5maW5kTm9kZUlkKG5vZGVLZXksIHNvdXJjZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlRGVsZXRlQXRJbmRleChub2RlS2V5LCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbm9kZUtleSBpbiB0aGlzLm5vZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGVzLmhhc093blByb3BlcnR5KG5vZGVLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmZpbmROb2RlSWQobm9kZUtleSwgdGFyZ2V0SWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5CRUZPUkU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydElkSW50b05vZGUobm9kZUtleSwgc291cmNlSWQsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5BRlRFUjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0SWRJbnRvTm9kZShub2RlS2V5LCBzb3VyY2VJZCwgaW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5JTlNJREVfQVRfU1RBUlQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVJbnNlcnRBdFN0YXJ0KHRhcmdldElkLCBzb3VyY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uSU5TSURFX0FUX0VORDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZUluc2VydEF0RW5kKHRhcmdldElkLCBzb3VyY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLnN3YXBBcnJheUVsZW1lbnRzID0gZnVuY3Rpb24gKGFyciwgaW5kZXhBLCBpbmRleEIpIHtcbiAgICAgICAgdmFyIHRlbXAgPSBhcnJbaW5kZXhBXTtcbiAgICAgICAgYXJyW2luZGV4QV0gPSBhcnJbaW5kZXhCXTtcbiAgICAgICAgYXJyW2luZGV4Ql0gPSB0ZW1wO1xuICAgICAgICByZXR1cm4gYXJyO1xuICAgIH07XG4gICAgO1xuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLnJvb3REZWxldGVJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmZpbmRSb290SWQoaWQpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5yb290RGVsZXRlKGluZGV4KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUubm9kZUFuZFN1Yk5vZGVzRGVsZXRlID0gZnVuY3Rpb24gKG5vZGVLZXkpIHtcbiAgICAgICAgdmFyIHRvRGVsZXRlTGF0ZXIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzW25vZGVLZXldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLm5vZGVzW25vZGVLZXldW2ldO1xuICAgICAgICAgICAgdGhpcy5ub2RlQW5kU3ViTm9kZXNEZWxldGUoaWQpO1xuICAgICAgICAgICAgdG9EZWxldGVMYXRlci5wdXNoKG5vZGVLZXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9kZURlbGV0ZShub2RlS2V5KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b0RlbGV0ZUxhdGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGVEZWxldGUodG9EZWxldGVMYXRlcltpXSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLm5vZGVSZWZyZW5jZXNEZWxldGUgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgZm9yICh2YXIgbm9kZUtleSBpbiB0aGlzLm5vZGVzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ub2Rlcy5oYXNPd25Qcm9wZXJ0eShub2RlS2V5KSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlc1tub2RlS2V5XS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0SWQgPSB0aGlzLm5vZGVzW25vZGVLZXldW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0SWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVEZWxldGVBdEluZGV4KG5vZGVLZXksIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5ub2RlRGVsZXRlID0gZnVuY3Rpb24gKG5vZGVLZXkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMubm9kZXNbbm9kZUtleV07XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5maW5kUm9vdElkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvb3RJZHMuaW5kZXhPZihpZCk7XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5maW5kTm9kZUlkID0gZnVuY3Rpb24gKG5vZGVLZXksIGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVzW25vZGVLZXldLmluZGV4T2YoaWQpO1xuICAgIH07XG4gICAgTXVsdGlSb290VHJlZS5wcm90b3R5cGUuZmluZE5vZGUgPSBmdW5jdGlvbiAobm9kZUtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2Rlc1tub2RlS2V5XTtcbiAgICB9O1xuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLm5vZGVJbnNlcnRBdFN0YXJ0ID0gZnVuY3Rpb24gKG5vZGVLZXksIGlkKSB7XG4gICAgICAgIHRoaXMubm9kZXNbbm9kZUtleV0udW5zaGlmdChpZCk7XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5ub2RlSW5zZXJ0QXRFbmQgPSBmdW5jdGlvbiAobm9kZUtleSwgaWQpIHtcbiAgICAgICAgdGhpcy5ub2Rlc1tub2RlS2V5XS5wdXNoKGlkKTtcbiAgICB9O1xuICAgIE11bHRpUm9vdFRyZWUucHJvdG90eXBlLnJvb3REZWxldGUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5yb290SWRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5ub2RlRGVsZXRlQXRJbmRleCA9IGZ1bmN0aW9uIChub2RlS2V5LCBpbmRleCkge1xuICAgICAgICB0aGlzLm5vZGVzW25vZGVLZXldLnNwbGljZShpbmRleCwgMSk7XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5yb290SW5zZXJ0QXRTdGFydCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB0aGlzLnJvb3RJZHMudW5zaGlmdChpZCk7XG4gICAgfTtcbiAgICBNdWx0aVJvb3RUcmVlLnByb3RvdHlwZS5yb290SW5zZXJ0QXRFbmQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgdGhpcy5yb290SWRzLnB1c2goaWQpO1xuICAgIH07XG4gICAgcmV0dXJuIE11bHRpUm9vdFRyZWU7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gTXVsdGlSb290VHJlZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU11bHRpUm9vdFRyZWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIEhlYXBfMSA9IHJlcXVpcmUoJy4vSGVhcCcpO1xudmFyIFByaW9yaXR5UXVldWUgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gZW1wdHkgcHJpb3JpdHkgcXVldWUuXG4gICAgICogQGNsYXNzIDxwPkluIGEgcHJpb3JpdHkgcXVldWUgZWFjaCBlbGVtZW50IGlzIGFzc29jaWF0ZWQgd2l0aCBhIFwicHJpb3JpdHlcIixcbiAgICAgKiBlbGVtZW50cyBhcmUgZGVxdWV1ZWQgaW4gaGlnaGVzdC1wcmlvcml0eS1maXJzdCBvcmRlciAodGhlIGVsZW1lbnRzIHdpdGggdGhlXG4gICAgICogaGlnaGVzdCBwcmlvcml0eSBhcmUgZGVxdWV1ZWQgZmlyc3QpLiBQcmlvcml0eSBRdWV1ZXMgYXJlIGltcGxlbWVudGVkIGFzIGhlYXBzLlxuICAgICAqIElmIHRoZSBpbnNlcnRlZCBlbGVtZW50cyBhcmUgY3VzdG9tIG9iamVjdHMgYSBjb21wYXJlIGZ1bmN0aW9uIG11c3QgYmUgcHJvdmlkZWQsXG4gICAgICogb3RoZXJ3aXNlIHRoZSA8PSwgPT09IGFuZCA+PSBvcGVyYXRvcnMgYXJlIHVzZWQgdG8gY29tcGFyZSBvYmplY3QgcHJpb3JpdHkuPC9wPlxuICAgICAqIDxwcmU+XG4gICAgICogZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gICAgICogIGlmIChhIGlzIGxlc3MgdGhhbiBiIGJ5IHNvbWUgb3JkZXJpbmcgY3JpdGVyaW9uKSB7XG4gICAgICogICAgIHJldHVybiAtMTtcbiAgICAgKiAgfSBpZiAoYSBpcyBncmVhdGVyIHRoYW4gYiBieSB0aGUgb3JkZXJpbmcgY3JpdGVyaW9uKSB7XG4gICAgICogICAgIHJldHVybiAxO1xuICAgICAqICB9XG4gICAgICogIC8vIGEgbXVzdCBiZSBlcXVhbCB0byBiXG4gICAgICogIHJldHVybiAwO1xuICAgICAqIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOm51bWJlcj19IGNvbXBhcmVGdW5jdGlvbiBvcHRpb25hbFxuICAgICAqIGZ1bmN0aW9uIHVzZWQgdG8gY29tcGFyZSB0d28gZWxlbWVudCBwcmlvcml0aWVzLiBNdXN0IHJldHVybiBhIG5lZ2F0aXZlIGludGVnZXIsXG4gICAgICogemVybywgb3IgYSBwb3NpdGl2ZSBpbnRlZ2VyIGFzIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBsZXNzIHRoYW4sIGVxdWFsIHRvLFxuICAgICAqIG9yIGdyZWF0ZXIgdGhhbiB0aGUgc2Vjb25kLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFByaW9yaXR5UXVldWUoY29tcGFyZUZ1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuaGVhcCA9IG5ldyBIZWFwXzEuZGVmYXVsdCh1dGlsLnJldmVyc2VDb21wYXJlRnVuY3Rpb24oY29tcGFyZUZ1bmN0aW9uKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc2VydHMgdGhlIHNwZWNpZmllZCBlbGVtZW50IGludG8gdGhpcyBwcmlvcml0eSBxdWV1ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCB0aGUgZWxlbWVudCB0byBpbnNlcnQuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgaW5zZXJ0ZWQsIG9yIGZhbHNlIGlmIGl0IGlzIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5lbnF1ZXVlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhcC5hZGQoZWxlbWVudCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBpbnRvIHRoaXMgcHJpb3JpdHkgcXVldWUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIGluc2VydGVkLCBvciBmYWxzZSBpZiBpdCBpcyB1bmRlZmluZWQuXG4gICAgICovXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhcC5hZGQoZWxlbWVudCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgYW5kIHJlbW92ZXMgdGhlIGhpZ2hlc3QgcHJpb3JpdHkgZWxlbWVudCBvZiB0aGlzIHF1ZXVlLlxuICAgICAqIEByZXR1cm4geyp9IHRoZSB0aGUgaGlnaGVzdCBwcmlvcml0eSBlbGVtZW50IG9mIHRoaXMgcXVldWUsXG4gICAgICogIG9yIHVuZGVmaW5lZCBpZiB0aGlzIHF1ZXVlIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLmRlcXVldWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhlYXAuc2l6ZSgpICE9PSAwKSB7XG4gICAgICAgICAgICB2YXIgZWwgPSB0aGlzLmhlYXAucGVlaygpO1xuICAgICAgICAgICAgdGhpcy5oZWFwLnJlbW92ZVJvb3QoKTtcbiAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzLCBidXQgZG9lcyBub3QgcmVtb3ZlLCB0aGUgaGlnaGVzdCBwcmlvcml0eSBlbGVtZW50IG9mIHRoaXMgcXVldWUuXG4gICAgICogQHJldHVybiB7Kn0gdGhlIGhpZ2hlc3QgcHJpb3JpdHkgZWxlbWVudCBvZiB0aGlzIHF1ZXVlLCBvciB1bmRlZmluZWQgaWYgdGhpcyBxdWV1ZSBpcyBlbXB0eS5cbiAgICAgKi9cbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZWFwLnBlZWsoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHByaW9yaXR5IHF1ZXVlIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBlbGVtZW50IHRvIHNlYXJjaCBmb3IuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHByaW9yaXR5IHF1ZXVlIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudCxcbiAgICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZWFwLmNvbnRhaW5zKGVsZW1lbnQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoaXMgcHJpb3JpdHkgcXVldWUgaXMgZW1wdHkuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBhbmQgb25seSBpZiB0aGlzIHByaW9yaXR5IHF1ZXVlIGNvbnRhaW5zIG5vIGl0ZW1zOyBmYWxzZVxuICAgICAqIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZWFwLmlzRW1wdHkoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIHByaW9yaXR5IHF1ZXVlLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIHByaW9yaXR5IHF1ZXVlLlxuICAgICAqL1xuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlYXAuc2l6ZSgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgb2YgdGhlIGVsZW1lbnRzIGZyb20gdGhpcyBwcmlvcml0eSBxdWV1ZS5cbiAgICAgKi9cbiAgICBQcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5oZWFwLmNsZWFyKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyBxdWV1ZSBpblxuICAgICAqIG5vIHBhcnRpY3VsYXIgb3JkZXIuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QpOip9IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGV4ZWN1dGUsIGl0IGlzXG4gICAgICogaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxuICAgICAqIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIFByaW9yaXR5UXVldWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5oZWFwLmZvckVhY2goY2FsbGJhY2spO1xuICAgIH07XG4gICAgcmV0dXJuIFByaW9yaXR5UXVldWU7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gUHJpb3JpdHlRdWV1ZTsgLy8gZW5kIG9mIHByaW9yaXR5IHF1ZXVlXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Qcmlvcml0eVF1ZXVlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIExpbmtlZExpc3RfMSA9IHJlcXVpcmUoJy4vTGlua2VkTGlzdCcpO1xudmFyIFF1ZXVlID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVtcHR5IHF1ZXVlLlxuICAgICAqIEBjbGFzcyBBIHF1ZXVlIGlzIGEgRmlyc3QtSW4tRmlyc3QtT3V0IChGSUZPKSBkYXRhIHN0cnVjdHVyZSwgdGhlIGZpcnN0XG4gICAgICogZWxlbWVudCBhZGRlZCB0byB0aGUgcXVldWUgd2lsbCBiZSB0aGUgZmlyc3Qgb25lIHRvIGJlIHJlbW92ZWQuIFRoaXNcbiAgICAgKiBpbXBsZW1lbnRhdGlvbiB1c2VzIGEgbGlua2VkIGxpc3QgYXMgYSBjb250YWluZXIuXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gUXVldWUoKSB7XG4gICAgICAgIHRoaXMubGlzdCA9IG5ldyBMaW5rZWRMaXN0XzEuZGVmYXVsdCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBpbnRvIHRoZSBlbmQgb2YgdGhpcyBxdWV1ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSB0aGUgZWxlbWVudCB0byBpbnNlcnQuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgZWxlbWVudCB3YXMgaW5zZXJ0ZWQsIG9yIGZhbHNlIGlmIGl0IGlzIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QuYWRkKGVsZW0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSW5zZXJ0cyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgaW50byB0aGUgZW5kIG9mIHRoaXMgcXVldWUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gdGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIGluc2VydGVkLCBvciBmYWxzZSBpZiBpdCBpcyB1bmRlZmluZWQuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QuYWRkKGVsZW0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGFuZCByZW1vdmVzIHRoZSBoZWFkIG9mIHRoaXMgcXVldWUuXG4gICAgICogQHJldHVybiB7Kn0gdGhlIGhlYWQgb2YgdGhpcyBxdWV1ZSwgb3IgdW5kZWZpbmVkIGlmIHRoaXMgcXVldWUgaXMgZW1wdHkuXG4gICAgICovXG4gICAgUXVldWUucHJvdG90eXBlLmRlcXVldWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmxpc3Quc2l6ZSgpICE9PSAwKSB7XG4gICAgICAgICAgICB2YXIgZWwgPSB0aGlzLmxpc3QuZmlyc3QoKTtcbiAgICAgICAgICAgIHRoaXMubGlzdC5yZW1vdmVFbGVtZW50QXRJbmRleCgwKTtcbiAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzLCBidXQgZG9lcyBub3QgcmVtb3ZlLCB0aGUgaGVhZCBvZiB0aGlzIHF1ZXVlLlxuICAgICAqIEByZXR1cm4geyp9IHRoZSBoZWFkIG9mIHRoaXMgcXVldWUsIG9yIHVuZGVmaW5lZCBpZiB0aGlzIHF1ZXVlIGlzIGVtcHR5LlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5saXN0LnNpemUoKSAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5maXJzdCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBxdWV1ZS5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBxdWV1ZS5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5zaXplKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBxdWV1ZSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICogPHA+SWYgdGhlIGVsZW1lbnRzIGluc2lkZSB0aGlzIHN0YWNrIGFyZVxuICAgICAqIG5vdCBjb21wYXJhYmxlIHdpdGggdGhlID09PSBvcGVyYXRvciwgYSBjdXN0b20gZXF1YWxzIGZ1bmN0aW9uIHNob3VsZCBiZVxuICAgICAqIHByb3ZpZGVkIHRvIHBlcmZvcm0gc2VhcmNoZXMsIHRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgdHdvIGFyZ3VtZW50cyBhbmRcbiAgICAgKiByZXR1cm4gdHJ1ZSBpZiB0aGV5IGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLiBFeGFtcGxlOjwvcD5cbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogY29uc3QgcGV0c0FyZUVxdWFsQnlOYW1lIChwZXQxLCBwZXQyKSB7XG4gICAgICogIHJldHVybiBwZXQxLm5hbWUgPT09IHBldDIubmFtZTtcbiAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsXG4gICAgICogZnVuY3Rpb24gdG8gY2hlY2sgaWYgdHdvIGVsZW1lbnRzIGFyZSBlcXVhbC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgcXVldWUgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LFxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoZWxlbSwgZXF1YWxzRnVuY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5jb250YWlucyhlbGVtLCBlcXVhbHNGdW5jdGlvbik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhpcyBxdWV1ZSBpcyBlbXB0eS5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIGFuZCBvbmx5IGlmIHRoaXMgcXVldWUgY29udGFpbnMgbm8gaXRlbXM7IGZhbHNlXG4gICAgICogb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIFF1ZXVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0LnNpemUoKSA8PSAwO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgb2YgdGhlIGVsZW1lbnRzIGZyb20gdGhpcyBxdWV1ZS5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGlzdC5jbGVhcigpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudCBwcmVzZW50IGluIHRoaXMgcXVldWUgaW5cbiAgICAgKiBGSUZPIG9yZGVyLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xuICAgICAqIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBRdWV1ZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmxpc3QuZm9yRWFjaChjYWxsYmFjayk7XG4gICAgfTtcbiAgICByZXR1cm4gUXVldWU7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gUXVldWU7IC8vIEVuZCBvZiBxdWV1ZVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UXVldWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGFycmF5cyA9IHJlcXVpcmUoJy4vYXJyYXlzJyk7XG52YXIgRGljdGlvbmFyeV8xID0gcmVxdWlyZSgnLi9EaWN0aW9uYXJ5Jyk7XG52YXIgU2V0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVtcHR5IHNldC5cbiAgICAgKiBAY2xhc3MgPHA+QSBzZXQgaXMgYSBkYXRhIHN0cnVjdHVyZSB0aGF0IGNvbnRhaW5zIG5vIGR1cGxpY2F0ZSBpdGVtcy48L3A+XG4gICAgICogPHA+SWYgdGhlIGluc2VydGVkIGVsZW1lbnRzIGFyZSBjdXN0b20gb2JqZWN0cyBhIGZ1bmN0aW9uXG4gICAgICogd2hpY2ggY29udmVydHMgZWxlbWVudHMgdG8gc3RyaW5ncyBtdXN0IGJlIHByb3ZpZGVkLiBFeGFtcGxlOjwvcD5cbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogZnVuY3Rpb24gcGV0VG9TdHJpbmcocGV0KSB7XG4gICAgICogIHJldHVybiBwZXQubmFtZTtcbiAgICAgKiB9XG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6c3RyaW5nPX0gdG9TdHJpbmdGdW5jdGlvbiBvcHRpb25hbCBmdW5jdGlvbiB1c2VkXG4gICAgICogdG8gY29udmVydCBlbGVtZW50cyB0byBzdHJpbmdzLiBJZiB0aGUgZWxlbWVudHMgYXJlbid0IHN0cmluZ3Mgb3IgaWYgdG9TdHJpbmcoKVxuICAgICAqIGlzIG5vdCBhcHByb3ByaWF0ZSwgYSBjdXN0b20gZnVuY3Rpb24gd2hpY2ggcmVjZWl2ZXMgYSBvbmplY3QgYW5kIHJldHVybnMgYVxuICAgICAqIHVuaXF1ZSBzdHJpbmcgbXVzdCBiZSBwcm92aWRlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTZXQodG9TdHJpbmdGdW5jdGlvbikge1xuICAgICAgICB0aGlzLmRpY3Rpb25hcnkgPSBuZXcgRGljdGlvbmFyeV8xLmRlZmF1bHQodG9TdHJpbmdGdW5jdGlvbik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHNldCBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgZWxlbWVudCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBzZXQgY29udGFpbnMgdGhlIHNwZWNpZmllZCBlbGVtZW50LFxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeS5jb250YWluc0tleShlbGVtZW50KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIHNwZWNpZmllZCBlbGVtZW50IHRvIHRoaXMgc2V0IGlmIGl0IGlzIG5vdCBhbHJlYWR5IHByZXNlbnQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gaW5zZXJ0LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBzZXQgZGlkIG5vdCBhbHJlYWR5IGNvbnRhaW4gdGhlIHNwZWNpZmllZCBlbGVtZW50LlxuICAgICAqL1xuICAgIFNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbnMoZWxlbWVudCkgfHwgdXRpbC5pc1VuZGVmaW5lZChlbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaWN0aW9uYXJ5LnNldFZhbHVlKGVsZW1lbnQsIGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGFuIGludGVyc2VjaW9uIGJldHdlZW4gdGhpcyBhbiBhbm90aGVyIHNldC5cbiAgICAgKiBSZW1vdmVzIGFsbCB2YWx1ZXMgdGhhdCBhcmUgbm90IHByZXNlbnQgdGhpcyBzZXQgYW5kIHRoZSBnaXZlbiBzZXQuXG4gICAgICogQHBhcmFtIHtjb2xsZWN0aW9ucy5TZXR9IG90aGVyU2V0IG90aGVyIHNldC5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIChvdGhlclNldCkge1xuICAgICAgICB2YXIgc2V0ID0gdGhpcztcbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoIW90aGVyU2V0LmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgc2V0LnJlbW92ZShlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGEgdW5pb24gYmV0d2VlbiB0aGlzIGFuIGFub3RoZXIgc2V0LlxuICAgICAqIEFkZHMgYWxsIHZhbHVlcyBmcm9tIHRoZSBnaXZlbiBzZXQgdG8gdGhpcyBzZXQuXG4gICAgICogQHBhcmFtIHtjb2xsZWN0aW9ucy5TZXR9IG90aGVyU2V0IG90aGVyIHNldC5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24gKG90aGVyU2V0KSB7XG4gICAgICAgIHZhciBzZXQgPSB0aGlzO1xuICAgICAgICBvdGhlclNldC5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBzZXQuYWRkKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgYSBkaWZmZXJlbmNlIGJldHdlZW4gdGhpcyBhbiBhbm90aGVyIHNldC5cbiAgICAgKiBSZW1vdmVzIGZyb20gdGhpcyBzZXQgYWxsIHRoZSB2YWx1ZXMgdGhhdCBhcmUgcHJlc2VudCBpbiB0aGUgZ2l2ZW4gc2V0LlxuICAgICAqIEBwYXJhbSB7Y29sbGVjdGlvbnMuU2V0fSBvdGhlclNldCBvdGhlciBzZXQuXG4gICAgICovXG4gICAgU2V0LnByb3RvdHlwZS5kaWZmZXJlbmNlID0gZnVuY3Rpb24gKG90aGVyU2V0KSB7XG4gICAgICAgIHZhciBzZXQgPSB0aGlzO1xuICAgICAgICBvdGhlclNldC5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICBzZXQucmVtb3ZlKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIHNldCBjb250YWlucyBhbGwgdGhlIGVsZW1lbnRzIGluIHRoaXMgc2V0LlxuICAgICAqIEBwYXJhbSB7Y29sbGVjdGlvbnMuU2V0fSBvdGhlclNldCBvdGhlciBzZXQuXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGlzIHNldCBpcyBhIHN1YnNldCBvZiB0aGUgZ2l2ZW4gc2V0LlxuICAgICAqL1xuICAgIFNldC5wcm90b3R5cGUuaXNTdWJzZXRPZiA9IGZ1bmN0aW9uIChvdGhlclNldCkge1xuICAgICAgICBpZiAodGhpcy5zaXplKCkgPiBvdGhlclNldC5zaXplKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXNTdWIgPSB0cnVlO1xuICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICghb3RoZXJTZXQuY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBpc1N1YiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGlzU3ViO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgZnJvbSB0aGlzIHNldCBpZiBpdCBpcyBwcmVzZW50LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBzZXQgY29udGFpbmVkIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhlbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaWN0aW9uYXJ5LnJlbW92ZShlbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50XG4gICAgICogcHJlc2VudCBpbiB0aGlzIHNldC5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCk6Kn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSwgaXQgaXNcbiAgICAgKiBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50czogdGhlIGVsZW1lbnQuIFRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxuICAgICAqIG9wdGlvbmFsbHkgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIFNldC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmRpY3Rpb25hcnkuZm9yRWFjaChmdW5jdGlvbiAoaywgdikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHYpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgc2V0IGluIGFyYml0cmFyeSBvcmRlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGVsZW1lbnRzIGluIHRoaXMgc2V0LlxuICAgICAqL1xuICAgIFNldC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeS52YWx1ZXMoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHNldCBjb250YWlucyBubyBlbGVtZW50cy5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoaXMgc2V0IGNvbnRhaW5zIG5vIGVsZW1lbnRzLlxuICAgICAqL1xuICAgIFNldC5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeS5pc0VtcHR5KCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhpcyBzZXQuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoaXMgc2V0LlxuICAgICAqL1xuICAgIFNldC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeS5zaXplKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBvZiB0aGUgZWxlbWVudHMgZnJvbSB0aGlzIHNldC5cbiAgICAgKi9cbiAgICBTZXQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRpY3Rpb25hcnkuY2xlYXIoKTtcbiAgICB9O1xuICAgIC8qXG4gICAgKiBQcm92aWRlcyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBmb3IgZGlzcGxheVxuICAgICovXG4gICAgU2V0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5cy50b1N0cmluZyh0aGlzLnRvQXJyYXkoKSk7XG4gICAgfTtcbiAgICByZXR1cm4gU2V0O1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNldDsgLy8gZW5kIG9mIFNldFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U2V0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIExpbmtlZExpc3RfMSA9IHJlcXVpcmUoJy4vTGlua2VkTGlzdCcpO1xudmFyIFN0YWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGVtcHR5IFN0YWNrLlxuICAgICAqIEBjbGFzcyBBIFN0YWNrIGlzIGEgTGFzdC1Jbi1GaXJzdC1PdXQgKExJRk8pIGRhdGEgc3RydWN0dXJlLCB0aGUgbGFzdFxuICAgICAqIGVsZW1lbnQgYWRkZWQgdG8gdGhlIHN0YWNrIHdpbGwgYmUgdGhlIGZpcnN0IG9uZSB0byBiZSByZW1vdmVkLiBUaGlzXG4gICAgICogaW1wbGVtZW50YXRpb24gdXNlcyBhIGxpbmtlZCBsaXN0IGFzIGEgY29udGFpbmVyLlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFN0YWNrKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBuZXcgTGlua2VkTGlzdF8xLmRlZmF1bHQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHVzaGVzIGFuIGl0ZW0gb250byB0aGUgdG9wIG9mIHRoaXMgc3RhY2suXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW0gdGhlIGVsZW1lbnQgdG8gYmUgcHVzaGVkIG9udG8gdGhpcyBzdGFjay5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBlbGVtZW50IHdhcyBwdXNoZWQgb3IgZmFsc2UgaWYgaXQgaXMgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIFN0YWNrLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5hZGQoZWxlbSwgMCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBQdXNoZXMgYW4gaXRlbSBvbnRvIHRoZSB0b3Agb2YgdGhpcyBzdGFjay5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSB0aGUgZWxlbWVudCB0byBiZSBwdXNoZWQgb250byB0aGlzIHN0YWNrLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGVsZW1lbnQgd2FzIHB1c2hlZCBvciBmYWxzZSBpZiBpdCBpcyB1bmRlZmluZWQuXG4gICAgICovXG4gICAgU3RhY2sucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QuYWRkKGVsZW0sIDApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgb2JqZWN0IGF0IHRoZSB0b3Agb2YgdGhpcyBzdGFjayBhbmQgcmV0dXJucyB0aGF0IG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgb2JqZWN0IGF0IHRoZSB0b3Agb2YgdGhpcyBzdGFjayBvciB1bmRlZmluZWQgaWYgdGhlXG4gICAgICogc3RhY2sgaXMgZW1wdHkuXG4gICAgICovXG4gICAgU3RhY2sucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5yZW1vdmVFbGVtZW50QXRJbmRleCgwKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIExvb2tzIGF0IHRoZSBvYmplY3QgYXQgdGhlIHRvcCBvZiB0aGlzIHN0YWNrIHdpdGhvdXQgcmVtb3ZpbmcgaXQgZnJvbSB0aGVcbiAgICAgKiBzdGFjay5cbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgb2JqZWN0IGF0IHRoZSB0b3Agb2YgdGhpcyBzdGFjayBvciB1bmRlZmluZWQgaWYgdGhlXG4gICAgICogc3RhY2sgaXMgZW1wdHkuXG4gICAgICovXG4gICAgU3RhY2sucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QuZmlyc3QoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIHN0YWNrLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGlzIHN0YWNrLlxuICAgICAqL1xuICAgIFN0YWNrLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0LnNpemUoKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHN0YWNrIGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICAgKiA8cD5JZiB0aGUgZWxlbWVudHMgaW5zaWRlIHRoaXMgc3RhY2sgYXJlXG4gICAgICogbm90IGNvbXBhcmFibGUgd2l0aCB0aGUgPT09IG9wZXJhdG9yLCBhIGN1c3RvbSBlcXVhbHMgZnVuY3Rpb24gc2hvdWxkIGJlXG4gICAgICogcHJvdmlkZWQgdG8gcGVyZm9ybSBzZWFyY2hlcywgdGhlIGZ1bmN0aW9uIG11c3QgcmVjZWl2ZSB0d28gYXJndW1lbnRzIGFuZFxuICAgICAqIHJldHVybiB0cnVlIGlmIHRoZXkgYXJlIGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuIEV4YW1wbGU6PC9wPlxuICAgICAqXG4gICAgICogPHByZT5cbiAgICAgKiBjb25zdCBwZXRzQXJlRXF1YWxCeU5hbWUgKHBldDEsIHBldDIpIHtcbiAgICAgKiAgcmV0dXJuIHBldDEubmFtZSA9PT0gcGV0Mi5uYW1lO1xuICAgICAqIH1cbiAgICAgKiA8L3ByZT5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbSBlbGVtZW50IHRvIHNlYXJjaCBmb3IuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gb3B0aW9uYWxcbiAgICAgKiBmdW5jdGlvbiB0byBjaGVjayBpZiB0d28gZWxlbWVudHMgYXJlIGVxdWFsLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhpcyBzdGFjayBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQsXG4gICAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIFN0YWNrLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtLCBlcXVhbHNGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0LmNvbnRhaW5zKGVsZW0sIGVxdWFsc0Z1bmN0aW9uKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGlzIHN0YWNrIGlzIGVtcHR5LlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5kIG9ubHkgaWYgdGhpcyBzdGFjayBjb250YWlucyBubyBpdGVtczsgZmFsc2VcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICovXG4gICAgU3RhY2sucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3QuaXNFbXB0eSgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgb2YgdGhlIGVsZW1lbnRzIGZyb20gdGhpcyBzdGFjay5cbiAgICAgKi9cbiAgICBTdGFjay5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGlzdC5jbGVhcigpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgZm9yIGVhY2ggZWxlbWVudCBwcmVzZW50IGluIHRoaXMgc3RhY2sgaW5cbiAgICAgKiBMSUZPIG9yZGVyLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xuICAgICAqIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ6IHRoZSBlbGVtZW50IHZhbHVlLCB0byBicmVhayB0aGUgaXRlcmF0aW9uIHlvdSBjYW5cbiAgICAgKiBvcHRpb25hbGx5IHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBTdGFjay5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmxpc3QuZm9yRWFjaChjYWxsYmFjayk7XG4gICAgfTtcbiAgICByZXR1cm4gU3RhY2s7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gU3RhY2s7IC8vIEVuZCBvZiBzdGFja1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3RhY2suanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuLyoqXG4gKiBSZXR1cm5zIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiB0aGUgc3BlY2lmaWVkIGl0ZW1cbiAqIHdpdGhpbiB0aGUgc3BlY2lmaWVkIGFycmF5LjRcbiAqIEBwYXJhbSB7Kn0gYXJyYXkgdGhlIGFycmF5IGluIHdoaWNoIHRvIHNlYXJjaCB0aGUgZWxlbWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIHRoZSBlbGVtZW50IHRvIHNlYXJjaC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWQgdG9cbiAqIGNoZWNrIGVxdWFsaXR5IGJldHdlZW4gMiBlbGVtZW50cy5cbiAqIEByZXR1cm4ge251bWJlcn0gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudFxuICogd2l0aGluIHRoZSBzcGVjaWZpZWQgYXJyYXksIG9yIC0xIGlmIG5vdCBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgaXRlbSwgZXF1YWxzRnVuY3Rpb24pIHtcbiAgICB2YXIgZXF1YWxzID0gZXF1YWxzRnVuY3Rpb24gfHwgdXRpbC5kZWZhdWx0RXF1YWxzO1xuICAgIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZXF1YWxzKGFycmF5W2ldLCBpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuZXhwb3J0cy5pbmRleE9mID0gaW5kZXhPZjtcbi8qKlxuICogUmV0dXJucyB0aGUgcG9zaXRpb24gb2YgdGhlIGxhc3Qgb2NjdXJyZW5jZSBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnRcbiAqIHdpdGhpbiB0aGUgc3BlY2lmaWVkIGFycmF5LlxuICogQHBhcmFtIHsqfSBhcnJheSB0aGUgYXJyYXkgaW4gd2hpY2ggdG8gc2VhcmNoIHRoZSBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gdGhlIGVsZW1lbnQgdG8gc2VhcmNoLlxuICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdXNlZCB0b1xuICogY2hlY2sgZXF1YWxpdHkgYmV0d2VlbiAyIGVsZW1lbnRzLlxuICogQHJldHVybiB7bnVtYmVyfSB0aGUgcG9zaXRpb24gb2YgdGhlIGxhc3Qgb2NjdXJyZW5jZSBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnRcbiAqIHdpdGhpbiB0aGUgc3BlY2lmaWVkIGFycmF5IG9yIC0xIGlmIG5vdCBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gbGFzdEluZGV4T2YoYXJyYXksIGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgdmFyIGVxdWFscyA9IGVxdWFsc0Z1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdEVxdWFscztcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSBsZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAoZXF1YWxzKGFycmF5W2ldLCBpdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuZXhwb3J0cy5sYXN0SW5kZXhPZiA9IGxhc3RJbmRleE9mO1xuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBhcnJheSBjb250YWlucyB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gKiBAcGFyYW0geyp9IGFycmF5IHRoZSBhcnJheSBpbiB3aGljaCB0byBzZWFyY2ggdGhlIGVsZW1lbnQuXG4gKiBAcGFyYW0ge09iamVjdH0gaXRlbSB0aGUgZWxlbWVudCB0byBzZWFyY2guXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCxPYmplY3QpOmJvb2xlYW49fSBlcXVhbHNGdW5jdGlvbiBvcHRpb25hbCBmdW5jdGlvbiB0b1xuICogY2hlY2sgZXF1YWxpdHkgYmV0d2VlbiAyIGVsZW1lbnRzLlxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIGFycmF5IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gY29udGFpbnMoYXJyYXksIGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgcmV0dXJuIGluZGV4T2YoYXJyYXksIGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSA+PSAwO1xufVxuZXhwb3J0cy5jb250YWlucyA9IGNvbnRhaW5zO1xuLyoqXG4gKiBSZW1vdmVzIHRoZSBmaXJzdCBvY3VycmVuY2Ugb2YgdGhlIHNwZWNpZmllZCBlbGVtZW50IGZyb20gdGhlIHNwZWNpZmllZCBhcnJheS5cbiAqIEBwYXJhbSB7Kn0gYXJyYXkgdGhlIGFycmF5IGluIHdoaWNoIHRvIHNlYXJjaCBlbGVtZW50LlxuICogQHBhcmFtIHtPYmplY3R9IGl0ZW0gdGhlIGVsZW1lbnQgdG8gc2VhcmNoLlxuICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdG9cbiAqIGNoZWNrIGVxdWFsaXR5IGJldHdlZW4gMiBlbGVtZW50cy5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlIGFycmF5IGNoYW5nZWQgYWZ0ZXIgdGhpcyBjYWxsLlxuICovXG5mdW5jdGlvbiByZW1vdmUoYXJyYXksIGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgdmFyIGluZGV4ID0gaW5kZXhPZihhcnJheSwgaXRlbSwgZXF1YWxzRnVuY3Rpb24pO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0cnVlO1xufVxuZXhwb3J0cy5yZW1vdmUgPSByZW1vdmU7XG4vKipcbiAqIFJldHVybnMgdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB0aGUgc3BlY2lmaWVkIGFycmF5IGVxdWFsXG4gKiB0byB0aGUgc3BlY2lmaWVkIG9iamVjdC5cbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IHRoZSBhcnJheSBpbiB3aGljaCB0byBkZXRlcm1pbmUgdGhlIGZyZXF1ZW5jeSBvZiB0aGUgZWxlbWVudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVtIHRoZSBlbGVtZW50IHdob3NlIGZyZXF1ZW5jeSBpcyB0byBiZSBkZXRlcm1pbmVkLlxuICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsT2JqZWN0KTpib29sZWFuPX0gZXF1YWxzRnVuY3Rpb24gb3B0aW9uYWwgZnVuY3Rpb24gdXNlZCB0b1xuICogY2hlY2sgZXF1YWxpdHkgYmV0d2VlbiAyIGVsZW1lbnRzLlxuICogQHJldHVybiB7bnVtYmVyfSB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBzcGVjaWZpZWQgYXJyYXlcbiAqIGVxdWFsIHRvIHRoZSBzcGVjaWZpZWQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBmcmVxdWVuY3koYXJyYXksIGl0ZW0sIGVxdWFsc0Z1bmN0aW9uKSB7XG4gICAgdmFyIGVxdWFscyA9IGVxdWFsc0Z1bmN0aW9uIHx8IHV0aWwuZGVmYXVsdEVxdWFscztcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIHZhciBmcmVxID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChlcXVhbHMoYXJyYXlbaV0sIGl0ZW0pKSB7XG4gICAgICAgICAgICBmcmVxKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZyZXE7XG59XG5leHBvcnRzLmZyZXF1ZW5jeSA9IGZyZXF1ZW5jeTtcbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB0d28gc3BlY2lmaWVkIGFycmF5cyBhcmUgZXF1YWwgdG8gb25lIGFub3RoZXIuXG4gKiBUd28gYXJyYXlzIGFyZSBjb25zaWRlcmVkIGVxdWFsIGlmIGJvdGggYXJyYXlzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyXG4gKiBvZiBlbGVtZW50cywgYW5kIGFsbCBjb3JyZXNwb25kaW5nIHBhaXJzIG9mIGVsZW1lbnRzIGluIHRoZSB0d29cbiAqIGFycmF5cyBhcmUgZXF1YWwgYW5kIGFyZSBpbiB0aGUgc2FtZSBvcmRlci5cbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5MSBvbmUgYXJyYXkgdG8gYmUgdGVzdGVkIGZvciBlcXVhbGl0eS5cbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5MiB0aGUgb3RoZXIgYXJyYXkgdG8gYmUgdGVzdGVkIGZvciBlcXVhbGl0eS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LE9iamVjdCk6Ym9vbGVhbj19IGVxdWFsc0Z1bmN0aW9uIG9wdGlvbmFsIGZ1bmN0aW9uIHVzZWQgdG9cbiAqIGNoZWNrIGVxdWFsaXR5IGJldHdlZW4gZWxlbWVtZW50cyBpbiB0aGUgYXJyYXlzLlxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgdHdvIGFycmF5cyBhcmUgZXF1YWxcbiAqL1xuZnVuY3Rpb24gZXF1YWxzKGFycmF5MSwgYXJyYXkyLCBlcXVhbHNGdW5jdGlvbikge1xuICAgIHZhciBlcXVhbHMgPSBlcXVhbHNGdW5jdGlvbiB8fCB1dGlsLmRlZmF1bHRFcXVhbHM7XG4gICAgaWYgKGFycmF5MS5sZW5ndGggIT09IGFycmF5Mi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkxLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghZXF1YWxzKGFycmF5MVtpXSwgYXJyYXkyW2ldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZXhwb3J0cy5lcXVhbHMgPSBlcXVhbHM7XG4vKipcbiAqIFJldHVybnMgc2hhbGxvdyBhIGNvcHkgb2YgdGhlIHNwZWNpZmllZCBhcnJheS5cbiAqIEBwYXJhbSB7Kn0gYXJyYXkgdGhlIGFycmF5IHRvIGNvcHkuXG4gKiBAcmV0dXJuIHtBcnJheX0gYSBjb3B5IG9mIHRoZSBzcGVjaWZpZWQgYXJyYXlcbiAqL1xuZnVuY3Rpb24gY29weShhcnJheSkge1xuICAgIHJldHVybiBhcnJheS5jb25jYXQoKTtcbn1cbmV4cG9ydHMuY29weSA9IGNvcHk7XG4vKipcbiAqIFN3YXBzIHRoZSBlbGVtZW50cyBhdCB0aGUgc3BlY2lmaWVkIHBvc2l0aW9ucyBpbiB0aGUgc3BlY2lmaWVkIGFycmF5LlxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IGluIHdoaWNoIHRvIHN3YXAgZWxlbWVudHMuXG4gKiBAcGFyYW0ge251bWJlcn0gaSB0aGUgaW5kZXggb2Ygb25lIGVsZW1lbnQgdG8gYmUgc3dhcHBlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBqIHRoZSBpbmRleCBvZiB0aGUgb3RoZXIgZWxlbWVudCB0byBiZSBzd2FwcGVkLlxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgYXJyYXkgaXMgZGVmaW5lZCBhbmQgdGhlIGluZGV4ZXMgYXJlIHZhbGlkLlxuICovXG5mdW5jdGlvbiBzd2FwKGFycmF5LCBpLCBqKSB7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gYXJyYXkubGVuZ3RoIHx8IGogPCAwIHx8IGogPj0gYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIHRlbXAgPSBhcnJheVtpXTtcbiAgICBhcnJheVtpXSA9IGFycmF5W2pdO1xuICAgIGFycmF5W2pdID0gdGVtcDtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuc3dhcCA9IHN3YXA7XG5mdW5jdGlvbiB0b1N0cmluZyhhcnJheSkge1xuICAgIHJldHVybiAnWycgKyBhcnJheS50b1N0cmluZygpICsgJ10nO1xufVxuZXhwb3J0cy50b1N0cmluZyA9IHRvU3RyaW5nO1xuLyoqXG4gKiBFeGVjdXRlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhpcyBhcnJheVxuICogc3RhcnRpbmcgZnJvbSBpbmRleCAwIHRvIGxlbmd0aCAtIDEuXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgaW4gd2hpY2ggdG8gaXRlcmF0ZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0KToqfSBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlLCBpdCBpc1xuICogaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDogdGhlIGVsZW1lbnQgdmFsdWUsIHRvIGJyZWFrIHRoZSBpdGVyYXRpb24geW91IGNhblxuICogb3B0aW9uYWxseSByZXR1cm4gZmFsc2UuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goYXJyYXksIGNhbGxiYWNrKSB7XG4gICAgZm9yICh2YXIgX2kgPSAwLCBhcnJheV8xID0gYXJyYXk7IF9pIDwgYXJyYXlfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGVsZSA9IGFycmF5XzFbX2ldO1xuICAgICAgICBpZiAoY2FsbGJhY2soZWxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuZm9yRWFjaCA9IGZvckVhY2g7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcnJheXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmV4cG9ydHMuaGFzID0gZnVuY3Rpb24gKG9iaiwgcHJvcCkge1xuICAgIHJldHVybiBfaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufTtcbi8qKlxuICogRGVmYXVsdCBmdW5jdGlvbiB0byBjb21wYXJlIGVsZW1lbnQgb3JkZXIuXG4gKiBAZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoYSwgYikge1xuICAgIGlmIChhIDwgYikge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGVsc2UgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHRDb21wYXJlID0gZGVmYXVsdENvbXBhcmU7XG4vKipcbiAqIERlZmF1bHQgZnVuY3Rpb24gdG8gdGVzdCBlcXVhbGl0eS5cbiAqIEBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBkZWZhdWx0RXF1YWxzKGEsIGIpIHtcbiAgICByZXR1cm4gYSA9PT0gYjtcbn1cbmV4cG9ydHMuZGVmYXVsdEVxdWFscyA9IGRlZmF1bHRFcXVhbHM7XG4vKipcbiAqIERlZmF1bHQgZnVuY3Rpb24gdG8gY29udmVydCBhbiBvYmplY3QgdG8gYSBzdHJpbmcuXG4gKiBAZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gZGVmYXVsdFRvU3RyaW5nKGl0ZW0pIHtcbiAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gJ0NPTExFQ1RJT05fTlVMTCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzVW5kZWZpbmVkKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiAnQ09MTEVDVElPTl9VTkRFRklORUQnO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1N0cmluZyhpdGVtKSkge1xuICAgICAgICByZXR1cm4gJyRzJyArIGl0ZW07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gJyRvJyArIGl0ZW0udG9TdHJpbmcoKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHRUb1N0cmluZyA9IGRlZmF1bHRUb1N0cmluZztcbi8qKlxuKiBKb2lucyBhbGwgdGhlIHByb3BlcmllcyBvZiB0aGUgb2JqZWN0IHVzaW5nIHRoZSBwcm92aWRlZCBqb2luIHN0cmluZ1xuKi9cbmZ1bmN0aW9uIG1ha2VTdHJpbmcoaXRlbSwgam9pbikge1xuICAgIGlmIChqb2luID09PSB2b2lkIDApIHsgam9pbiA9ICcsJzsgfVxuICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnQ09MTEVDVElPTl9OVUxMJztcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNVbmRlZmluZWQoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuICdDT0xMRUNUSU9OX1VOREVGSU5FRCc7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzU3RyaW5nKGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgdG9yZXQgPSAneyc7XG4gICAgICAgIHZhciBmaXJzdCA9IHRydWU7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gaXRlbSkge1xuICAgICAgICAgICAgaWYgKGV4cG9ydHMuaGFzKGl0ZW0sIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b3JldCA9IHRvcmV0ICsgam9pbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdG9yZXQgPSB0b3JldCArIHByb3AgKyAnOicgKyBpdGVtW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b3JldCArICd9JztcbiAgICB9XG59XG5leHBvcnRzLm1ha2VTdHJpbmcgPSBtYWtlU3RyaW5nO1xuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgZnVuY3Rpb24uXG4gKiBAZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgZnVuYykgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIHVuZGVmaW5lZC5cbiAqIEBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgICByZXR1cm4gKHR5cGVvZiBvYmopID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIHN0cmluZy5cbiAqIEBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuLyoqXG4gKiBSZXZlcnNlcyBhIGNvbXBhcmUgZnVuY3Rpb24uXG4gKiBAZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gcmV2ZXJzZUNvbXBhcmVGdW5jdGlvbihjb21wYXJlRnVuY3Rpb24pIHtcbiAgICBpZiAoIWlzRnVuY3Rpb24oY29tcGFyZUZ1bmN0aW9uKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIGlmIChhIDwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYSA9PT0gYikge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkLCB2KSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcGFyZUZ1bmN0aW9uKGQsIHYpICogLTE7XG4gICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0cy5yZXZlcnNlQ29tcGFyZUZ1bmN0aW9uID0gcmV2ZXJzZUNvbXBhcmVGdW5jdGlvbjtcbi8qKlxuICogUmV0dXJucyBhbiBlcXVhbCBmdW5jdGlvbiBnaXZlbiBhIGNvbXBhcmUgZnVuY3Rpb24uXG4gKiBAZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gY29tcGFyZVRvRXF1YWxzKGNvbXBhcmVGdW5jdGlvbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gY29tcGFyZUZ1bmN0aW9uKGEsIGIpID09PSAwO1xuICAgIH07XG59XG5leHBvcnRzLmNvbXBhcmVUb0VxdWFscyA9IGNvbXBhcmVUb0VxdWFscztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgMjAxMyBCYXNhcmF0IEFsaSBTeWVkLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIE1JVCBvcGVuIHNvdXJjZSBsaWNlbnNlIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbi8vXG4vLyBPcmdpbmFsIGphdmFzY3JpcHQgY29kZSB3YXMgYnkgTWF1cmljaW8gU2FudG9zXG4vL1xudmFyIF9hcnJheXMgPSByZXF1aXJlKCcuL2FycmF5cycpO1xuZXhwb3J0cy5hcnJheXMgPSBfYXJyYXlzO1xudmFyIEJhZ18xID0gcmVxdWlyZSgnLi9CYWcnKTtcbmV4cG9ydHMuQmFnID0gQmFnXzEuZGVmYXVsdDtcbnZhciBCU1RyZWVfMSA9IHJlcXVpcmUoJy4vQlNUcmVlJyk7XG5leHBvcnRzLkJTVHJlZSA9IEJTVHJlZV8xLmRlZmF1bHQ7XG52YXIgRGljdGlvbmFyeV8xID0gcmVxdWlyZSgnLi9EaWN0aW9uYXJ5Jyk7XG5leHBvcnRzLkRpY3Rpb25hcnkgPSBEaWN0aW9uYXJ5XzEuZGVmYXVsdDtcbnZhciBIZWFwXzEgPSByZXF1aXJlKCcuL0hlYXAnKTtcbmV4cG9ydHMuSGVhcCA9IEhlYXBfMS5kZWZhdWx0O1xudmFyIExpbmtlZERpY3Rpb25hcnlfMSA9IHJlcXVpcmUoJy4vTGlua2VkRGljdGlvbmFyeScpO1xuZXhwb3J0cy5MaW5rZWREaWN0aW9uYXJ5ID0gTGlua2VkRGljdGlvbmFyeV8xLmRlZmF1bHQ7XG52YXIgTGlua2VkTGlzdF8xID0gcmVxdWlyZSgnLi9MaW5rZWRMaXN0Jyk7XG5leHBvcnRzLkxpbmtlZExpc3QgPSBMaW5rZWRMaXN0XzEuZGVmYXVsdDtcbnZhciBNdWx0aURpY3Rpb25hcnlfMSA9IHJlcXVpcmUoJy4vTXVsdGlEaWN0aW9uYXJ5Jyk7XG5leHBvcnRzLk11bHRpRGljdGlvbmFyeSA9IE11bHRpRGljdGlvbmFyeV8xLmRlZmF1bHQ7XG52YXIgRmFjdG9yeURpY3Rpb25hcnlfMSA9IHJlcXVpcmUoJy4vRmFjdG9yeURpY3Rpb25hcnknKTtcbmV4cG9ydHMuRmFjdG9yeURpY3Rpb25hcnkgPSBGYWN0b3J5RGljdGlvbmFyeV8xLmRlZmF1bHQ7XG52YXIgRmFjdG9yeURpY3Rpb25hcnlfMiA9IHJlcXVpcmUoJy4vRmFjdG9yeURpY3Rpb25hcnknKTtcbmV4cG9ydHMuRGVmYXVsdERpY3Rpb25hcnkgPSBGYWN0b3J5RGljdGlvbmFyeV8yLmRlZmF1bHQ7XG52YXIgUXVldWVfMSA9IHJlcXVpcmUoJy4vUXVldWUnKTtcbmV4cG9ydHMuUXVldWUgPSBRdWV1ZV8xLmRlZmF1bHQ7XG52YXIgUHJpb3JpdHlRdWV1ZV8xID0gcmVxdWlyZSgnLi9Qcmlvcml0eVF1ZXVlJyk7XG5leHBvcnRzLlByaW9yaXR5UXVldWUgPSBQcmlvcml0eVF1ZXVlXzEuZGVmYXVsdDtcbnZhciBTZXRfMSA9IHJlcXVpcmUoJy4vU2V0Jyk7XG5leHBvcnRzLlNldCA9IFNldF8xLmRlZmF1bHQ7XG52YXIgU3RhY2tfMSA9IHJlcXVpcmUoJy4vU3RhY2snKTtcbmV4cG9ydHMuU3RhY2sgPSBTdGFja18xLmRlZmF1bHQ7XG52YXIgTXVsdGlSb290VHJlZV8xID0gcmVxdWlyZSgnLi9NdWx0aVJvb3RUcmVlJyk7XG5leHBvcnRzLk11bHRpUm9vdFRyZWUgPSBNdWx0aVJvb3RUcmVlXzEuZGVmYXVsdDtcbnZhciBfdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuZXhwb3J0cy51dGlsID0gX3V0aWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXX0=
return require('typescript-collections');
});