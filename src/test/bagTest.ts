import * as collections from '../lib/index';

import assert = require('assert');
import {expect} from 'chai';

describe('Bag',
    function() {

        var bag: collections.Bag<any>;

        beforeEach(function() {
            bag = new collections.Bag();
        });

        var toStringF: any = function(f: any) {
            return f.description;
        };

        it('Gives the right size',
            function() {
                bag.add('a');
                bag.add('b');
                bag.add('c');
                expect(bag.size()).equals(3);
                bag.add('d');
                expect(bag.size()).equals(4);
                bag.remove('d');
                expect(bag.size()).equals(3);
                bag.clear();

                bag.add('a');
                bag.add('b');
                bag.add('c');
                expect(bag.size()).equals(3);
                bag.add('d');
                expect(bag.size()).equals(4);
                bag.remove('d');
                expect(bag.size()).equals(3);
            });

        it('Gives the right size with duplicated elements',
            function() {
                bag.add('a');
                bag.add('a');
                bag.add('b');
                bag.add('b');
                bag.add('c');
                expect(bag.size()).equals(5);
                bag.remove('b');
                bag.remove('a');
                expect(bag.size()).equals(3);
                bag.remove('a');
                bag.remove('b');
                bag.remove('c');
                expect(bag.size()).equals(0);
            });

        it('Contains existing elements',
            function() {
                bag.add('a');
                bag.add('b');
                bag.add('c');
                bag.add('c');
                bag.add('d');

                expect(bag.contains('a')).equals(true);
                expect(bag.contains('b')).equals(true);
                expect(bag.contains('c')).equals(true);
                expect(bag.contains('d')).equals(true);
                expect(bag.contains('e')).equals(false);
                bag.remove('c');
                expect(bag.contains('c')).equals(true);
                bag.remove('c');
                expect(bag.contains('c')).equals(false);
                bag.clear();
                bag.add(1);
                bag.add(2);
                expect(bag.contains(1)).equals(true);
                expect(bag.contains(2)).equals(true);
                expect(bag.contains(3)).equals(false);
            });

        it('Contains existing elements with custom toString function',
            function() {
                bag = new collections.Bag(toStringF);
                var fn1: any = function() { };
                fn1.description = 'fn1';
                expect(bag.contains(fn1)).equals(false);
                bag.add(fn1);
                expect(bag.contains(fn1)).equals(true);
                var fn2: any = function() { };
                fn2.description = 'fn2';
                expect(bag.contains(fn2)).equals(false);
                bag.add(fn2);
                bag.add(fn2);
                expect(bag.contains(fn2)).equals(true);
                expect(bag.size()).equals(3);
                bag.remove(fn2);
                expect(bag.contains(fn2)).equals(true);
                bag.remove(fn2);
                expect(bag.contains(fn2)).equals(false);
            });

        it('An empty bag is empty',
            function() {
                expect(bag.isEmpty()).equals(true);
                bag.add(1);
                bag.add(1);
                expect(bag.isEmpty()).equals(false);
                bag.remove(1);
                expect(bag.isEmpty()).equals(false);
                bag.remove(1);
                expect(bag.isEmpty()).equals(true);
            });

        it('Adds',
            function() {
                expect(bag.add('a')).equals(true);
                expect(bag.add('b')).equals(true);
                expect(bag.contains('a')).equals(true);
                expect(bag.contains('b')).equals(true);
                expect(bag.add('b')).equals(true);
                expect(bag.contains('b')).equals(true);
                expect(bag.add(null)).equals(true);
                expect(bag.contains(null)).equals(true);
                expect(bag.add(null)).equals(true);
                expect(bag.contains(undefined)).equals(false);
                expect(bag.add(undefined)).equals(false);
                expect(bag.contains(undefined)).equals(false);
            });
        it('Adds multiple copies',
            function() {
                expect(bag.add('a', 1)).equals(true);
                expect(bag.add('a')).equals(true);
                expect(bag.add('b', 3)).equals(true);
                expect(bag.contains('a')).equals(true);
                expect(bag.contains('b')).equals(true);
                expect(bag.add('b')).equals(true);
                expect(bag.count('a')).equals(2);
                expect(bag.count('b')).equals(4);
                bag.remove('a');
                bag.remove('a');
                expect(bag.count('a')).equals(0);
            });

        it('Removes',
            function() {
                expect(bag.add('a')).equals(true);
                expect(bag.add('a')).equals(true);
                expect(bag.add('b')).equals(true);
                expect(bag.remove('a')).equals(true);
                expect(bag.remove('a')).equals(true);
                expect(bag.size()).equals(1);
                expect(bag.remove('b')).equals(true);
                expect(bag.size()).equals(0);
            });

        it('Removes multiple copies',
            function() {
                expect(bag.add('a', 1)).equals(true);
                expect(bag.add('a')).equals(true);
                expect(bag.add('b', 3)).equals(true);
                expect(bag.remove('b', 2)).equals(true);
                expect(bag.count('b')).equals(1);
                expect(bag.remove('b', 1)).equals(true);
                expect(bag.count('b')).equals(0);
                expect(bag.remove('a', 2)).equals(true);
                expect(bag.count('a')).equals(0);
                expect(bag.add('c', 3)).equals(true);
                expect(bag.remove('c', 5)).equals(true);
                expect(bag.count('a')).equals(0);
                expect(bag.size()).equals(0);
            });

        it('Clear removes all elements',
            function() {
                expect(bag.add('b', 3)).equals(true);
                bag.clear();
                expect(bag.count('b')).equals(0);
                expect(bag.size()).equals(0);
            });

        it('Converts to an array',
            function() {
                var arr = bag.toArray();
                expect(arr.length).equals(0);
                expect(bag.add('b', 3)).equals(true);
                expect(bag.add('a', 2)).equals(true);
                expect(bag.add('c')).equals(true);
                arr = bag.toArray();
                expect(collections.arrays.frequency(arr, 'b')).equals(3);
                expect(collections.arrays.frequency(arr, 'a')).equals(2);
                expect(collections.arrays.frequency(arr, 'c')).equals(1);
            });

        it('Converts to a set',
            function() {
                var set = bag.toSet();
                expect(set.size()).equals(0);
                expect(bag.add('b', 3)).equals(true);
                expect(bag.add('a', 2)).equals(true);
                expect(bag.add('c')).equals(true);
                set = bag.toSet();
                expect(set.contains('b')).equals(true);
                expect(set.contains('a')).equals(true);
                expect(set.contains('c')).equals(true);
            });

        it('For each gives all the elements',
            function() {
                bag.forEach(function(e) {
                    expect(false).equals(true);
                });
                var a = [1, 5, 5, 6];
                bag.add(1);
                bag.add(5);
                bag.add(5);
                bag.add(6);
                bag.forEach(function(e) {
                    expect(collections.arrays.contains(a, e)).equals(true);
                });

                var count = 0;
                bag.forEach(function(e) {
                    expect(collections.arrays.contains(a, e)).equals(true);
                    if (e === 5) {
                        count++;
                        bag.remove(e);
                    }
                });
                expect(count).equals(2);
                expect(bag.contains(5)).equals(false);
                expect(bag.contains(1)).equals(true);
                expect(bag.contains(6)).equals(true);
            });

        it('For each can be interrupted',
            function() {
                for (var i = 0; i < 5; i++) {
                    bag.add(i);
                }
                var t = 0;
                bag.forEach(function(e) {
                    t++;
                    return false;
                });
                expect(t).equals(1);
            });
    });
