"use strict";
var collections = require('../lib/index');
var chai_1 = require('chai');
describe('Dictionary', function () {
    var dict = null;
    var elems = 100;
    var elemKeys = [];
    for (var i = 0; i < elems; i++) {
        elemKeys[i] = '' + i;
    }
    // Test with some potentially problematic keys
    elemKeys[2] = 'hasOwnProperty';
    elemKeys[4] = '__proto__';
    elemKeys[6] = '';
    beforeEach(function () {
        dict = new collections.Dictionary();
    });
    it('Maps keys to values with string keys', function () {
        chai_1.expect(dict.getValue('sd')).equals(undefined);
        // test with string keys
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.setValue(elemKeys[i], i + 1)).equals(undefined);
        }
        chai_1.expect(dict.size()).equals(elems);
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.getValue(elemKeys[i])).equals(i + 1);
        }
        dict.setValue('a', 5);
        chai_1.expect(dict.getValue('a')).equals(5);
        chai_1.expect(dict.setValue('a', 21)).equals(5);
        chai_1.expect(dict.size()).equals(elems + 1);
        chai_1.expect(dict.getValue('a')).equals(21);
    });
    it('Maps keys to values with number keys', function () {
        // test with number keys
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.setValue(i, i + 1)).equals(undefined);
        }
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.getValue(i)).equals(i + 1);
        }
    });
    it('Maps keys to values with custom keys', function () {
        var ts = function (obj) {
            return obj.s;
        };
        dict = new collections.Dictionary(ts);
        chai_1.expect(dict.getValue('sd')).equals(undefined);
        for (var i = 0; i < elems; i++) {
            var o = {};
            o.s = elemKeys[i];
            chai_1.expect(dict.setValue(o, i + 1)).equals(undefined);
        }
        for (var i = 0; i < elems; i++) {
            var d = {};
            d.s = elemKeys[i];
            chai_1.expect(dict.getValue(d)).equals(i + 1);
        }
    });
    it('Removes existing elements from the dictionary', function () {
        chai_1.expect(dict.remove('1')).equals(undefined);
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.setValue(elemKeys[i], i + 1)).equals(undefined);
        }
        chai_1.expect(dict.size()).equals(elems);
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.remove(elemKeys[i])).equals(i + 1);
            chai_1.expect(dict.getValue(elemKeys[i])).equals(undefined);
            chai_1.expect(dict.remove(elemKeys[i])).equals(undefined);
        }
        chai_1.expect(dict.size()).equals(0);
    });
    it('An empty dictionary is empty', function () {
        chai_1.expect(dict.isEmpty()).equals(true);
        dict.setValue('1', 1);
        chai_1.expect(dict.isEmpty()).equals(false);
        dict.remove('1');
        chai_1.expect(dict.isEmpty()).equals(true);
    });
    it('Clear removes all elements', function () {
        dict.clear();
        dict.setValue(1, 1);
        dict.clear();
        chai_1.expect(dict.isEmpty()).equals(true);
        chai_1.expect(dict.getValue(1)).equals(undefined);
    });
    it('Contains existing keys', function () {
        chai_1.expect(dict.containsKey(0)).equals(false);
        for (var i = 0; i < 10; i++) {
            dict.setValue(elemKeys[i], i);
            chai_1.expect(dict.containsKey(elemKeys[i])).equals(true);
        }
        ;
        for (var i = 0; i < 10; i++) {
            dict.remove(elemKeys[i]);
            chai_1.expect(dict.containsKey(elemKeys[i])).equals(false);
        }
        ;
    });
    it('Gives the right size', function () {
        chai_1.expect(dict.size()).equals(0);
        for (var i = 0; i < 10; i++) {
            dict.setValue(elemKeys[i], i);
            chai_1.expect(dict.size()).equals(i + 1);
        }
        ;
    });
    it('Gives all the stored keys', function () {
        var k = [];
        for (var i = 0; i < elems; i++) {
            var keys = dict.keys();
            k.sort();
            keys.sort();
            chai_1.expect(collections.arrays.equals(k, keys)).equals(true);
            dict.setValue(elemKeys[i], i);
            k.push(elemKeys[i]);
        }
    });
    it('Gives all the stored values', function () {
        var v = [];
        for (var i = 0; i < elems; i++) {
            var values = dict.values();
            v.sort();
            values.sort();
            chai_1.expect(collections.arrays.equals(v, values)).equals(true);
            dict.setValue(elemKeys[i], i);
            v.push(i);
        }
    });
    it('For each gives all the pairs', function () {
        for (var i = 0; i < elems; i++) {
            dict.setValue(elemKeys[i], i);
        }
        var keys = dict.keys();
        var values = dict.values();
        dict.forEach(function (k, v) {
            chai_1.expect(collections.arrays.remove(keys, k)).equals(true);
            chai_1.expect(collections.arrays.remove(values, v)).equals(true);
        });
        chai_1.expect(keys.length).equals(0);
        chai_1.expect(values.length).equals(0);
    });
    it('For each can be interrupted', function () {
        for (var i = 0; i < elems; i++) {
            dict.setValue(elemKeys[i], i);
        }
        var t = 0;
        dict.forEach(function (k, v) {
            t++;
            return false;
        });
        chai_1.expect(t).equals(1);
    });
});
//# sourceMappingURL=dictionaryTest.js.map