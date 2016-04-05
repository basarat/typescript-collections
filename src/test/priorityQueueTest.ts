import * as collections from '../lib/index';

import assert = require('assert');
import {expect} from 'chai';

describe('Priority Queue',
    function() {

        var queue: any = null;

        beforeEach(function() {
            queue = new collections.PriorityQueue();
        });

        var createPriorityQueue1 = function() {
            queue.enqueue(0);
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            return queue;
        };

        var createPriorityQueue2 = function() {
            queue.enqueue(1);
            queue.enqueue(3);
            queue.enqueue(0);
            queue.enqueue(2);
            return queue;
        };

        it('Gives the right size',
            function() {
                createPriorityQueue1();
                expect(queue.size()).equals(4);
                queue.dequeue();
                expect(queue.size()).equals(3);
            });

        it('Gives the right size 2',
            function() {
                createPriorityQueue2();
                expect(queue.size()).equals(4);
                queue.dequeue();
                expect(queue.size()).equals(3);
            });

        it('Gives the right size 3',
            function() {
                createPriorityQueue1();
                queue.dequeue();
                queue.dequeue();
                queue.dequeue();
                queue.dequeue();
                expect(queue.size()).equals(0);
            });

        it('Contains inserted elements',
            function() {
                createPriorityQueue1();
                for (var i = 0; i < 4; i++) {
                    expect(queue.contains(i)).equals(true);
                }
                expect(queue.contains(5)).equals(false);
            });

        it('An empty queue is empty',
            function() {
                createPriorityQueue1();
                expect(queue.isEmpty()).equals(false);
                queue.dequeue();
                queue.dequeue();
                queue.dequeue();
                expect(queue.isEmpty()).equals(false);
                queue.dequeue();
                expect(queue.isEmpty()).equals(true);
            });

        it('Peeks the highest priority item',
            function() {
                createPriorityQueue1();
                expect(queue.peek()).equals(3);
            });

        it('Peeks the highest priority item 2',
            function() {
                createPriorityQueue2();
                expect(queue.peek()).equals(3);
            });

        it('Peeking an empty queue returns undefined',
            function() {
                createPriorityQueue1();
                queue.clear();
                expect(queue.peek()).equals(undefined);
            });

        it('Dequeues the highest priority item',
            function() {
                createPriorityQueue1();
                expect(queue.dequeue()).equals(3);
                expect(queue.dequeue()).equals(2);
                expect(queue.dequeue()).equals(1);
                expect(queue.dequeue()).equals(0);
            });

        it('Dequeues the highest priority item 2',
            function() {
                createPriorityQueue2();
                expect(queue.dequeue()).equals(3);
                expect(queue.dequeue()).equals(2);
                expect(queue.dequeue()).equals(1);
                expect(queue.dequeue()).equals(0);
            });

        it('Peek and enqueue are consistent',
            function() {
                queue.enqueue(0);
                expect(queue.peek()).equals(0);
                queue.enqueue(1);
                expect(queue.peek()).equals(1);
                queue.enqueue(2);
                expect(queue.peek()).equals(2);
                queue.enqueue(3);
                expect(queue.peek()).equals(3);
            });

        it('Peek and enqueue are consistent 2',
            function() {
                queue.enqueue(1);
                expect(queue.peek()).equals(1);
                queue.enqueue(3);
                expect(queue.peek()).equals(3);
                queue.enqueue(0);
                expect(queue.peek()).equals(3);
                queue.enqueue(2);
                expect(queue.peek()).equals(3);
            });

        it('For each gives the right elements',
            function() {

                queue.forEach(function(e: any) {
                    expect(true).equals(false); // should not enter here
                });
                createPriorityQueue1();

                var elements: any = [];
                queue.forEach(function(e: any) {
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
                createPriorityQueue1();
                var elements: any = [];
                queue.forEach(function(e: any) {
                    elements.push(e);
                    return false;
                });
                expect(elements.length).equals(1);
            });
    });
