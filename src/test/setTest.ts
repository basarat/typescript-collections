import * as collections from '../lib/index';

import assert = require('assert');
import {expect} from 'chai';

describe('Set',
    function() {

        var set: any = null;

        it('Gives the right size',
            function() {
                set = new collections.Set();
                set.add('a');
                set.add('b');
                set.add('c');
                expect(set.size()).equals(3);
                set.add('d');
                expect(set.size()).equals(4);
                set.remove('d');
                expect(set.size()).equals(3);
                set.clear();

                set.add('a');
                set.add('b');
                set.add('c');
                expect(set.size()).equals(3);
                set.add('d');
                expect(set.size()).equals(4);
                set.remove('d');
                expect(set.size()).equals(3);
                set.add('c');
                expect(set.size()).equals(3);
            });

        it('Contains existing elements',
            function() {
                set = new collections.Set();
                set.add('a');
                set.add('b');
                set.add('c');
                set.add('d');

                expect(set.contains('a')).equals(true);
                expect(set.contains('b')).equals(true);
                expect(set.contains('c')).equals(true);
                expect(set.contains('d')).equals(true);
                expect(set.contains('e')).equals(false);

                set.clear();
                set.add(1);
                set.add(2);
                set.add(3);
                set.add(4);
                expect(set.contains(1)).equals(true);
                expect(set.contains(2)).equals(true);
                expect(set.contains(3)).equals(true);
                expect(set.contains(4)).equals(true);
                expect(set.contains(5)).equals(false);

                var toStringF = function(f: any) {
                    return f.description;
                };

                set = new collections.Set(toStringF);
                var fn1: any = function() { };
                fn1.description = 'fn1';
                expect(set.contains(fn1)).equals(false);
                set.add(fn1);
                expect(set.contains(fn1)).equals(true);
                var fn2: any = function() { };
                fn2.description = 'fn2';
                expect(set.contains(fn2)).equals(false);
                set.add(fn2);
                expect(set.contains(fn2)).equals(true);
                expect(set.size()).equals(2);
            });

        it('An empty set is empty',
            function() {
                set = new collections.Set();
                expect(set.isEmpty()).equals(true);
                set.add(1);
                expect(set.isEmpty()).equals(false);
            });

        it('Intersection is commutative',
            function() {
                //Two empty sets
                set = new collections.Set();
                var set2 = new collections.Set();
                set.intersection(set2);
                expect(set.isEmpty()).equals(true);
                set2.intersection(set);
                expect(set2.isEmpty()).equals(true);

                // non empty with empty
                set = new collections.Set();
                set2 = new collections.Set();
                set.add(1);
                set.add(2);
                set.add(3);
                set.intersection(set2);
                expect(set.isEmpty()).equals(true);
                set2.intersection(set);
                expect(set2.isEmpty()).equals(true);

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
                expect(s1).to.deep.equal([1, 2]);
                set = new collections.Set();
                set.add(1);
                set.add(2);

                set2.intersection(set);
                var s2 = set2.toArray().sort();
                expect(s2).to.deep.equal([1, 2]);

                // non empty sets with  no common elements
                set = new collections.Set();
                set2 = new collections.Set();
                set.add(1);
                set.add(2);
                set2.add(3);
                set2.add(4);
                set2.add(5);

                set.intersection(set2);
                expect(set.isEmpty()).equals(true);
                set.add(1);
                set.add(2);
                set2.intersection(set);
                expect(set2.isEmpty()).equals(true);
            });

        it('Union is commutative',
            function() {
                set = new collections.Set();
                var set2 = new collections.Set();
                set.add(1);
                set.add(2);
                set2.add(2);
                set2.add(4);
                set2.add(5);
                set.union(set2);
                var s1 = set.toArray().sort();
                expect(s1).to.deep.equal([1, 2, 4, 5]);
                set.clear();
                set.add(1);
                set.add(2);
                set2.union(set);
                var s2 = set2.toArray().sort();
                expect(s2).to.deep.equal([1, 2, 4, 5]);
            });

        it('Difference works as expected',
            function() {

                //Two empty sets
                set = new collections.Set();
                var set2 = new collections.Set();
                set.difference(set2);
                expect(set.isEmpty()).equals(true);

                //Non empty and empty set
                set = new collections.Set();
                set2 = new collections.Set();
                set.add(1);
                set.add(2);
                set.difference(set2);
                var s1 = set.toArray().sort();
                expect(s1).to.deep.equal([1, 2]);

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
                expect(s1).to.deep.equal([1, 4]);

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
                expect(set.isEmpty()).equals(true);

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
                expect(s1).to.deep.equal([1, 2, 3, 4]);
            });

        it('isSubsetOf works as expected',
            function() {

                //Two empty sets
                set = new collections.Set();
                var set2 = new collections.Set();
                expect(set.isSubsetOf(set2)).equals(true);

                // Two equal sets
                set = new collections.Set();
                set2 = new collections.Set();
                set.add(1);
                set.add(2);
                set2.add(2);
                set2.add(1);
                expect(set.isSubsetOf(set2)).equals(true);
                expect(set2.isSubsetOf(set)).equals(true);

                //Non empty sets with common elements
                set = new collections.Set();
                set2 = new collections.Set();
                set.add(1);
                set.add(2);
                set.add(3);
                set.add(4);
                set2.add(2);
                set2.add(3);
                expect(set2.isSubsetOf(set)).equals(true);
                expect(set.isSubsetOf(set2)).equals(false);

                //Non empty sets with no common elements
                set = new collections.Set();
                set2 = new collections.Set();
                set.add(3);
                set2.add(4);
                expect(set.isSubsetOf(set2)).equals(false);
                expect(set2.isSubsetOf(set)).equals(false);
            });

        it('Adds',
            function() {
                set = new collections.Set();
                expect(set.add('a')).equals(true);
                expect(set.add('b')).equals(true);
                expect(set.contains('a')).equals(true);
                expect(set.contains('b')).equals(true);
                expect(set.add('b')).equals(false);
                expect(set.contains('b')).equals(true);
                expect(set.add(null)).equals(true);
                expect(set.contains(null)).equals(true);
                expect(set.add(null)).equals(false);
                expect(set.contains(undefined)).equals(false);
                expect(set.add(undefined)).equals(false);
                expect(set.contains(undefined)).equals(false);
            });

        it('For each gives all the elements',
            function() {
                set = new collections.Set();
                set.forEach(function(e: any) {
                    expect(false).equals(true);
                });
                for (var i = 0; i < 100; i++) {
                    set.add(i);
                }
                var values = set.toArray();
                expect(values.length).equals(100);
                set.forEach(function(e: any) {
                    expect(collections.arrays.remove(values, e)).equals(true);
                });
                expect(values.length).equals(0);
            });

        it('For each can be interrupted',
            function() {
                set = new collections.Set();
                for (var i = 0; i < 5; i++) {
                    set.add(i);
                }
                var t = 0;
                set.forEach(function(e: any) {
                    t++;
                    return false;
                });
                expect(t).equals(1);
            });
    });
