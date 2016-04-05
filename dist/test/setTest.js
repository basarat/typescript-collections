"use strict";
var collections = require('../lib/index');
var chai_1 = require('chai');
describe('Set', function () {
    var set = null;
    it('Gives the right size', function () {
        set = new collections.Set();
        set.add('a');
        set.add('b');
        set.add('c');
        chai_1.expect(set.size()).equals(3);
        set.add('d');
        chai_1.expect(set.size()).equals(4);
        set.remove('d');
        chai_1.expect(set.size()).equals(3);
        set.clear();
        set.add('a');
        set.add('b');
        set.add('c');
        chai_1.expect(set.size()).equals(3);
        set.add('d');
        chai_1.expect(set.size()).equals(4);
        set.remove('d');
        chai_1.expect(set.size()).equals(3);
        set.add('c');
        chai_1.expect(set.size()).equals(3);
    });
    it('Contains existing elements', function () {
        set = new collections.Set();
        set.add('a');
        set.add('b');
        set.add('c');
        set.add('d');
        chai_1.expect(set.contains('a')).equals(true);
        chai_1.expect(set.contains('b')).equals(true);
        chai_1.expect(set.contains('c')).equals(true);
        chai_1.expect(set.contains('d')).equals(true);
        chai_1.expect(set.contains('e')).equals(false);
        set.clear();
        set.add(1);
        set.add(2);
        set.add(3);
        set.add(4);
        chai_1.expect(set.contains(1)).equals(true);
        chai_1.expect(set.contains(2)).equals(true);
        chai_1.expect(set.contains(3)).equals(true);
        chai_1.expect(set.contains(4)).equals(true);
        chai_1.expect(set.contains(5)).equals(false);
        var toStringF = function (f) {
            return f.description;
        };
        set = new collections.Set(toStringF);
        var fn1 = function () { };
        fn1.description = 'fn1';
        chai_1.expect(set.contains(fn1)).equals(false);
        set.add(fn1);
        chai_1.expect(set.contains(fn1)).equals(true);
        var fn2 = function () { };
        fn2.description = 'fn2';
        chai_1.expect(set.contains(fn2)).equals(false);
        set.add(fn2);
        chai_1.expect(set.contains(fn2)).equals(true);
        chai_1.expect(set.size()).equals(2);
    });
    it('An empty set is empty', function () {
        set = new collections.Set();
        chai_1.expect(set.isEmpty()).equals(true);
        set.add(1);
        chai_1.expect(set.isEmpty()).equals(false);
    });
    it('Intersection is commutative', function () {
        //Two empty sets
        set = new collections.Set();
        var set2 = new collections.Set();
        set.intersection(set2);
        chai_1.expect(set.isEmpty()).equals(true);
        set2.intersection(set);
        chai_1.expect(set2.isEmpty()).equals(true);
        // non empty with empty
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set.add(3);
        set.intersection(set2);
        chai_1.expect(set.isEmpty()).equals(true);
        set2.intersection(set);
        chai_1.expect(set2.isEmpty()).equals(true);
        // non empty sets with common elements
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set2.add(1);
        set2.add(2);
        set2.add(3);
        set.intersection(set2);
        var s1 = set.toArray().sort();
        chai_1.expect(s1).to.deep.equal([1, 2]);
        set = new collections.Set();
        set.add(1);
        set.add(2);
        set2.intersection(set);
        var s2 = set2.toArray().sort();
        chai_1.expect(s2).to.deep.equal([1, 2]);
        // non empty sets with  no common elements
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set2.add(3);
        set2.add(4);
        set2.add(5);
        set.intersection(set2);
        chai_1.expect(set.isEmpty()).equals(true);
        set.add(1);
        set.add(2);
        set2.intersection(set);
        chai_1.expect(set2.isEmpty()).equals(true);
    });
    it('Union is commutative', function () {
        set = new collections.Set();
        var set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set2.add(2);
        set2.add(4);
        set2.add(5);
        set.union(set2);
        var s1 = set.toArray().sort();
        chai_1.expect(s1).to.deep.equal([1, 2, 4, 5]);
        set.clear();
        set.add(1);
        set.add(2);
        set2.union(set);
        var s2 = set2.toArray().sort();
        chai_1.expect(s2).to.deep.equal([1, 2, 4, 5]);
    });
    it('Difference works as expected', function () {
        //Two empty sets
        set = new collections.Set();
        var set2 = new collections.Set();
        set.difference(set2);
        chai_1.expect(set.isEmpty()).equals(true);
        //Non empty and empty set
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set.difference(set2);
        var s1 = set.toArray().sort();
        chai_1.expect(s1).to.deep.equal([1, 2]);
        //Non empty sets with common elements
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set.add(3);
        set.add(4);
        set2.add(2);
        set2.add(3);
        set.difference(set2);
        s1 = set.toArray().sort();
        chai_1.expect(s1).to.deep.equal([1, 4]);
        // Two equal sets
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set.add(3);
        set2.add(1);
        set2.add(3);
        set2.add(2);
        set.difference(set2);
        chai_1.expect(set.isEmpty()).equals(true);
        //Non empty sets with no common elements
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set.add(3);
        set.add(4);
        set2.add(6);
        set2.add(9);
        set.difference(set2);
        s1 = set.toArray().sort();
        chai_1.expect(s1).to.deep.equal([1, 2, 3, 4]);
    });
    it('isSubsetOf works as expected', function () {
        //Two empty sets
        set = new collections.Set();
        var set2 = new collections.Set();
        chai_1.expect(set.isSubsetOf(set2)).equals(true);
        // Two equal sets
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set2.add(2);
        set2.add(1);
        chai_1.expect(set.isSubsetOf(set2)).equals(true);
        chai_1.expect(set2.isSubsetOf(set)).equals(true);
        //Non empty sets with common elements
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(1);
        set.add(2);
        set.add(3);
        set.add(4);
        set2.add(2);
        set2.add(3);
        chai_1.expect(set2.isSubsetOf(set)).equals(true);
        chai_1.expect(set.isSubsetOf(set2)).equals(false);
        //Non empty sets with no common elements
        set = new collections.Set();
        set2 = new collections.Set();
        set.add(3);
        set2.add(4);
        chai_1.expect(set.isSubsetOf(set2)).equals(false);
        chai_1.expect(set2.isSubsetOf(set)).equals(false);
    });
    it('Adds', function () {
        set = new collections.Set();
        chai_1.expect(set.add('a')).equals(true);
        chai_1.expect(set.add('b')).equals(true);
        chai_1.expect(set.contains('a')).equals(true);
        chai_1.expect(set.contains('b')).equals(true);
        chai_1.expect(set.add('b')).equals(false);
        chai_1.expect(set.contains('b')).equals(true);
        chai_1.expect(set.add(null)).equals(true);
        chai_1.expect(set.contains(null)).equals(true);
        chai_1.expect(set.add(null)).equals(false);
        chai_1.expect(set.contains(undefined)).equals(false);
        chai_1.expect(set.add(undefined)).equals(false);
        chai_1.expect(set.contains(undefined)).equals(false);
    });
    it('For each gives all the elements', function () {
        set = new collections.Set();
        set.forEach(function (e) {
            chai_1.expect(false).equals(true);
        });
        for (var i = 0; i < 100; i++) {
            set.add(i);
        }
        var values = set.toArray();
        chai_1.expect(values.length).equals(100);
        set.forEach(function (e) {
            chai_1.expect(collections.arrays.remove(values, e)).equals(true);
        });
        chai_1.expect(values.length).equals(0);
    });
    it('For each can be interrupted', function () {
        set = new collections.Set();
        for (var i = 0; i < 5; i++) {
            set.add(i);
        }
        var t = 0;
        set.forEach(function (e) {
            t++;
            return false;
        });
        chai_1.expect(t).equals(1);
    });
});
//# sourceMappingURL=setTest.js.map