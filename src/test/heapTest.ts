import * as collections from '../lib/index';

import * as assert from 'power-assert';
import {expect} from 'chai';

describe('Heap',
    function() {

        var heap: any = null;

        beforeEach(function() {
            heap = new collections.Heap();
        });

        var createHeap1 = function() {
            heap.add(0);
            heap.add(1);
            heap.add(2);
            heap.add(3);
        };

        var createHeap2 = function() {
            heap.add(1);
            heap.add(3);
            heap.add(0);
            heap.add(2);
        };

        var createHeap3 = function() {
            heap.add('a');
            heap.add('b');
            heap.add('c');
            heap.add('d');
        };

        var createHeap4 = function() {
            heap.add('b');
            heap.add('d');
            heap.add('a');
            heap.add('c');
        };

        var createHeap5 = function() {
            heap.add({ val: 'b' });
            heap.add({ val: 'd' });
            heap.add({ val: 'a' });
            heap.add({ val: 'c' });
        };

        function customCompare(a: any, b: any) {
            if (a.val < b.val) {
                return -1;
            } else if (a.val === b.val) {
                return 0;
            } else {
                return 1;
            }
        }

        it('Gives the right size 1',
            function() {
                createHeap1();
                expect(heap.size()).equals(4);
                heap.removeRoot();
                expect(heap.size()).equals(3);
            });

        it('Gives the right size 2',
            function() {
                createHeap1();
                heap.removeRoot();
                heap.removeRoot();
                heap.removeRoot();
                heap.removeRoot();
                expect(heap.size()).equals(0);
            });

        it('Gives the right size with strings',
            function() {
                createHeap3();
                heap.removeRoot();
                heap.removeRoot();
                heap.removeRoot();
                heap.removeRoot();
                expect(heap.size()).equals(0);
            });

        it('Peeks the lowest element',
            function() {
                createHeap1();
                expect(heap.peek()).equals(0);
                heap.clear();
                expect(heap.peek()).equals(undefined);
            });

        it('Peeks the lowest element 2',
            function() {
                createHeap2();
                expect(heap.peek()).equals(0);
            });

        it('Peeks the lowest element with strings',
            function() {
                createHeap3();
                expect(heap.peek()).equals('a');
            });

        it('Peeks the lowest element with strings 2',
            function() {
                createHeap4();
                expect(heap.peek()).equals('a');
            });

        it('Peeks the lowest element with custom objects',
            function() {
                heap = new collections.Heap(customCompare);
                createHeap5();
                expect(heap.peek().val).equals('a');
            });

        it('Removes root',
            function() {
                createHeap1();
                expect(heap.removeRoot()).equals(0);
                expect(heap.removeRoot()).equals(1);
                expect(heap.removeRoot()).equals(2);
                expect(heap.removeRoot()).equals(3);
            });

        it('Removes root 2',
            function() {
                createHeap2();
                heap.add(1);
                expect(heap.removeRoot()).equals(0);
                expect(heap.removeRoot()).equals(1);
                expect(heap.removeRoot()).equals(1);
                expect(heap.removeRoot()).equals(2);
                expect(heap.removeRoot()).equals(3);
            });

        it('Removes root with custom objects',
            function() {
                heap = new collections.Heap(customCompare);
                createHeap5();
                expect(heap.removeRoot().val).equals('a');
                expect(heap.removeRoot().val).equals('b');
                expect(heap.removeRoot().val).equals('c');
                expect(heap.removeRoot().val).equals('d');
            });

        it('Adds and peeks',
            function() {
                heap.add(3);
                expect(heap.peek()).equals(3);
                heap.add(2);
                expect(heap.peek()).equals(2);
                heap.add(1);
                expect(heap.peek()).equals(1);
                heap.add(0);
                expect(heap.peek()).equals(0);
            });

        it('Adds and peeks 2',
            function() {
                heap.add(1);
                expect(heap.peek()).equals(1);
                heap.add(3);
                expect(heap.peek()).equals(1);
                heap.add(0);
                expect(heap.peek()).equals(0);
                heap.add(2);
                expect(heap.peek()).equals(0);
            });

        it('An empty heap is empty',
            function() {
                expect(heap.isEmpty()).equals(true);
                createHeap1();
                for (var i = 0; i < heap.size(); i++) {
                    expect(heap.isEmpty()).equals(false);
                    heap.removeRoot();
                }
            });

        it('Clear removes all elements',
            function() {
                heap.clear();
                createHeap1();
                heap.clear();
                expect(heap.isEmpty()).equals(true);
                expect(heap.peek()).equals(undefined);
            });

        it('Contains inserted elements',
            function() {
                createHeap1();
                for (var i = 0; i < 4; i++) {
                    expect(heap.contains(i)).equals(true);
                }
                expect(heap.contains(i)).equals(false);
            });

        it('For each gives the right elements',
            function() {

                heap.forEach(function(e: any) {
                    expect(true).equals(false); // should not enter here
                });
                createHeap1();

                var elements: any = [];
                heap.forEach(function(e: any) {
                    elements.push(e);
                });

                expect(collections.arrays.contains(elements, 0)).equals(true);
                expect(collections.arrays.contains(elements, 1)).equals(true);
                expect(collections.arrays.contains(elements, 2)).equals(true);
                expect(collections.arrays.contains(elements, 3)).equals(true);
                expect(collections.arrays.contains(elements, 4)).equals(false);
            });

        it('For each can be interrupted',
            function() {
                createHeap1();
                var elements: any = [];
                heap.forEach(function(e: any) {
                    elements.push(e);
                    return false;
                });
                expect(elements.length).equals(1);
            });
    });
