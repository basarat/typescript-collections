"use strict";
var collections = require('../lib/index');
var chai_1 = require('chai');
describe('Priority Queue', function () {
    var queue = null;
    beforeEach(function () {
        queue = new collections.PriorityQueue();
    });
    var createPriorityQueue1 = function () {
        queue.enqueue(0);
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);
        return queue;
    };
    var createPriorityQueue2 = function () {
        queue.enqueue(1);
        queue.enqueue(3);
        queue.enqueue(0);
        queue.enqueue(2);
        return queue;
    };
    it('Gives the right size', function () {
        createPriorityQueue1();
        chai_1.expect(queue.size()).equals(4);
        queue.dequeue();
        chai_1.expect(queue.size()).equals(3);
    });
    it('Gives the right size 2', function () {
        createPriorityQueue2();
        chai_1.expect(queue.size()).equals(4);
        queue.dequeue();
        chai_1.expect(queue.size()).equals(3);
    });
    it('Gives the right size 3', function () {
        createPriorityQueue1();
        queue.dequeue();
        queue.dequeue();
        queue.dequeue();
        queue.dequeue();
        chai_1.expect(queue.size()).equals(0);
    });
    it('Contains inserted elements', function () {
        createPriorityQueue1();
        for (var i = 0; i < 4; i++) {
            chai_1.expect(queue.contains(i)).equals(true);
        }
        chai_1.expect(queue.contains(5)).equals(false);
    });
    it('An empty queue is empty', function () {
        createPriorityQueue1();
        chai_1.expect(queue.isEmpty()).equals(false);
        queue.dequeue();
        queue.dequeue();
        queue.dequeue();
        chai_1.expect(queue.isEmpty()).equals(false);
        queue.dequeue();
        chai_1.expect(queue.isEmpty()).equals(true);
    });
    it('Peeks the highest priority item', function () {
        createPriorityQueue1();
        chai_1.expect(queue.peek()).equals(3);
    });
    it('Peeks the highest priority item 2', function () {
        createPriorityQueue2();
        chai_1.expect(queue.peek()).equals(3);
    });
    it('Peeking an empty queue returns undefined', function () {
        createPriorityQueue1();
        queue.clear();
        chai_1.expect(queue.peek()).equals(undefined);
    });
    it('Dequeues the highest priority item', function () {
        createPriorityQueue1();
        chai_1.expect(queue.dequeue()).equals(3);
        chai_1.expect(queue.dequeue()).equals(2);
        chai_1.expect(queue.dequeue()).equals(1);
        chai_1.expect(queue.dequeue()).equals(0);
    });
    it('Dequeues the highest priority item 2', function () {
        createPriorityQueue2();
        chai_1.expect(queue.dequeue()).equals(3);
        chai_1.expect(queue.dequeue()).equals(2);
        chai_1.expect(queue.dequeue()).equals(1);
        chai_1.expect(queue.dequeue()).equals(0);
    });
    it('Peek and enqueue are consistent', function () {
        queue.enqueue(0);
        chai_1.expect(queue.peek()).equals(0);
        queue.enqueue(1);
        chai_1.expect(queue.peek()).equals(1);
        queue.enqueue(2);
        chai_1.expect(queue.peek()).equals(2);
        queue.enqueue(3);
        chai_1.expect(queue.peek()).equals(3);
    });
    it('Peek and enqueue are consistent 2', function () {
        queue.enqueue(1);
        chai_1.expect(queue.peek()).equals(1);
        queue.enqueue(3);
        chai_1.expect(queue.peek()).equals(3);
        queue.enqueue(0);
        chai_1.expect(queue.peek()).equals(3);
        queue.enqueue(2);
        chai_1.expect(queue.peek()).equals(3);
    });
    it('For each gives the right elements', function () {
        queue.forEach(function (e) {
            chai_1.expect(true).equals(false); // should not enter here
        });
        createPriorityQueue1();
        var elements = [];
        queue.forEach(function (e) {
            elements.push(e);
        });
        chai_1.expect(collections.arrays.contains(elements, 0)).equals(true);
        chai_1.expect(collections.arrays.contains(elements, 1)).equals(true);
        chai_1.expect(collections.arrays.contains(elements, 2)).equals(true);
        chai_1.expect(collections.arrays.contains(elements, 3)).equals(true);
        chai_1.expect(collections.arrays.contains(elements, 4)).equals(false);
    });
    it('For each can be interrupted', function () {
        createPriorityQueue1();
        var elements = [];
        queue.forEach(function (e) {
            elements.push(e);
            return false;
        });
        chai_1.expect(elements.length).equals(1);
    });
});
//# sourceMappingURL=priorityQueueTest.js.map