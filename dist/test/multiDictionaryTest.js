"use strict";
var collections = require('../lib/index');
var chai_1 = require('chai');
describe('Multi Dictionary', function () {
    var dict = null;
    var elems = 100;
    beforeEach(function () {
        dict = new collections.MultiDictionary();
    });
    it('Maps keys to values with string keys', function () {
        chai_1.expect(dict.getValue('sd')).to.deep.equal([]);
        // test with string keys
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.setValue('' + i, i + 1)).equals(true);
        }
        chai_1.expect(dict.size()).equals(elems);
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.getValue('' + i)).to.deep.equal([i + 1]);
        }
        dict.setValue('a', 5);
        chai_1.expect(dict.getValue('a')).to.deep.equal([5]);
        chai_1.expect(dict.setValue('a', 21)).equals(true);
        chai_1.expect(dict.size()).equals(elems + 1);
        chai_1.expect(dict.getValue('a')).to.deep.equal([5, 21]);
    });
    it('Maps keys to values with number keys', function () {
        // test with number keys
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.setValue(i, i + 1)).equals(true);
        }
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.getValue(i)).to.deep.equal([i + 1]);
        }
    });
    it('Maps keys to values with custom keys', function () {
        var ts = function (obj) {
            return obj.s;
        };
        dict = new collections.MultiDictionary(ts);
        chai_1.expect(dict.getValue('sd')).to.deep.equal([]);
        for (var i = 0; i < elems; i++) {
            var o = {};
            o.s = '' + i;
            chai_1.expect(dict.setValue(o, i + 1)).equals(true);
        }
        for (var i = 0; i < elems; i++) {
            var d = {};
            d.s = '' + i;
            chai_1.expect(dict.getValue(d)).to.deep.equal([i + 1]);
        }
    });
    it('Maps multiple values', function () {
        dict.setValue('a', 5);
        chai_1.expect(dict.getValue('a')).to.deep.equal([5]);
        chai_1.expect(dict.setValue('a', 21)).equals(true);
        chai_1.expect(dict.size()).equals(1);
        chai_1.expect(dict.getValue('a')).to.deep.equal([5, 21]);
        chai_1.expect(dict.size()).equals(1);
        chai_1.expect(dict.setValue('a', 31)).equals(true);
        chai_1.expect(dict.size()).equals(1);
        chai_1.expect(dict.getValue('a')).to.deep.equal([5, 21, 31]);
        chai_1.expect(dict.size()).equals(1);
    });
    it('Removes existing elements from the dictionary', function () {
        chai_1.expect(dict.remove('1')).equals(false);
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.setValue('' + i, i + 1)).equals(true);
        }
        chai_1.expect(dict.size()).equals(elems);
        for (var i = 0; i < elems; i++) {
            chai_1.expect(dict.remove('' + i)).equals(true);
            chai_1.expect(dict.getValue('' + i)).to.deep.equal([]);
            chai_1.expect(dict.remove('' + i)).equals(false);
        }
        chai_1.expect(dict.size()).equals(0);
    });
    it('Removes all values from a key', function () {
        dict.setValue('a', 1);
        dict.remove('a');
        chai_1.expect(dict.containsKey('a')).equals(false);
        chai_1.expect(dict.getValue('a')).to.deep.equal([]);
        dict.setValue('a', 2);
        dict.setValue('a', 3);
        dict.remove('a');
        chai_1.expect(dict.containsKey('a')).equals(false);
        chai_1.expect(dict.getValue('a')).to.deep.equal([]);
    });
    it('Removes a single value from a key', function () {
        dict.setValue('a', 1);
        dict.remove('a', 1);
        chai_1.expect(dict.containsKey('a')).equals(false);
        chai_1.expect(dict.getValue('a')).to.deep.equal([]);
        dict.setValue('a', 2);
        dict.setValue('a', 3);
        dict.remove('a', 3);
        chai_1.expect(dict.containsKey('a')).equals(true);
        chai_1.expect(dict.getValue('a')).to.deep.equal([2]);
        dict.remove('a', 2);
        chai_1.expect(dict.containsKey('a')).equals(false);
        chai_1.expect(dict.getValue('a')).to.deep.equal([]);
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
        chai_1.expect(dict.getValue(1)).to.deep.equal([]);
    });
    it('Contains existing keys', function () {
        chai_1.expect(dict.containsKey(0)).equals(false);
        for (var i = 0; i < 10; i++) {
            dict.setValue(i, i);
            chai_1.expect(dict.containsKey(i)).equals(true);
        }
        for (var i = 0; i < 10; i++) {
            dict.remove(i);
            chai_1.expect(dict.containsKey(i)).equals(false);
        }
    });
    it('Gives the right size', function () {
        chai_1.expect(dict.size()).equals(0);
        for (var i = 0; i < 10; i++) {
            dict.setValue(i, i);
            chai_1.expect(dict.size()).equals(i + 1);
        }
    });
    it('Gives all the stored keys', function () {
        var k = [];
        for (var i = 0; i < elems; i++) {
            var keys = dict.keys();
            k.sort();
            keys.sort();
            chai_1.expect(k).to.deep.equal(keys);
            dict.setValue('' + i, i);
            k.push('' + i);
        }
    });
    it('Gives all the stored values', function () {
        var v = [];
        for (var i = 0; i < elems; i++) {
            var values = dict.values();
            v.sort();
            values.sort();
            chai_1.expect(v).to.deep.equal(values);
            dict.setValue('' + i, i);
            v.push(i);
        }
    });
});
//# sourceMappingURL=multiDictionaryTest.js.map