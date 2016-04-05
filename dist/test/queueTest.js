"use strict";
var collections = require('../lib/index');
var chai_1 = require('chai');
describe('Queue', function () {
    var queue = null;
    beforeEach(function () {
        queue = new collections.Queue();
    });
    function createQueue() {
        queue.enqueue('a');
        queue.enqueue('b');
        queue.enqueue('c');
    }
    it('Gives the right size', function () {
        chai_1.expect(queue.size()).equals(0);
        createQueue();
        chai_1.expect(queue.size()).equals(3);
        queue.enqueue('d');
        chai_1.expect(queue.size()).equals(4);
        queue.dequeue();
        chai_1.expect(queue.size()).equals(3);
        queue.clear();
        chai_1.expect(queue.size()).equals(0);
    });
    it('Enqueues', function () {
        createQueue();
        var head = queue.dequeue();
        chai_1.expect(head).equals('a');
        queue.dequeue();
        head = queue.dequeue();
        chai_1.expect(head).equals('c');
        chai_1.expect(queue.isEmpty()).equals(true);
        head = queue.dequeue();
        chai_1.expect(head).equals(undefined);
    });
    it('Peeks', function () {
        createQueue();
        var head = queue.peek();
        chai_1.expect(head).equals('a');
        var head2 = queue.dequeue();
        chai_1.expect(head).equals(head2);
        head = queue.peek();
        chai_1.expect(head).equals('b');
        queue.clear();
        head = queue.peek();
        chai_1.expect(head).equals(undefined);
    });
    it('For each gives the right ordering', function () {
        queue.forEach(function (e) {
            chai_1.expect(true).equals(false); // should not enter here
        });
        for (var i = 0; i < 10; i++) {
            queue.add(i);
        }
        var i = 0;
        queue.forEach(function (e) {
            chai_1.expect(e).equals(i);
            i++;
        });
    });
    it('For each can be interrupted', function () {
        var array = [0, 1, 2, 3, 4];
        var b = [];
        for (var i = 0; i < 5; i++) {
            queue.add(i);
        }
        queue.forEach(function (e) {
            b.push(e);
            if (e === 3) {
                return false;
            }
        });
        chai_1.expect([0, 1, 2, 3]).to.deep.equal(b);
    });
    it('Contains previously added items', function () {
        createQueue();
        chai_1.expect(queue.contains('a')).equals(true);
        chai_1.expect(queue.contains('z')).equals(false);
        chai_1.expect(queue.contains(undefined)).equals(false);
    });
});
//# sourceMappingURL=queueTest.js.map