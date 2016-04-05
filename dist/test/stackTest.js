"use strict";
var collections = require('../lib/index');
var chai_1 = require('chai');
describe('Stack', function () {
    var stack = null;
    beforeEach(function () {
        stack = new collections.Stack();
    });
    it('Pops', function () {
        chai_1.expect(stack.pop()).equals(undefined);
        stack.push(1);
        stack.push(2);
        stack.push(3);
        chai_1.expect(stack.pop()).equals(3);
        chai_1.expect(stack.pop()).equals(2);
        chai_1.expect(stack.pop()).equals(1);
        chai_1.expect(stack.pop()).equals(undefined);
    });
    it('Pushes and pops', function () {
        stack.push(1);
        chai_1.expect(stack.pop()).equals(1);
        stack.push(2);
        chai_1.expect(stack.pop()).equals(2);
        stack.push(3);
        chai_1.expect(stack.pop()).equals(3);
        chai_1.expect(stack.pop()).equals(undefined);
    });
    it('Peeks', function () {
        stack.push(1);
        stack.push(2);
        stack.push(3);
        chai_1.expect(stack.peek()).equals(3);
        stack.pop();
        chai_1.expect(stack.peek()).equals(2);
        stack.pop();
        chai_1.expect(stack.peek()).equals(1);
        stack.pop();
        chai_1.expect(stack.peek()).equals(undefined);
    });
    it('Pushes and peeks', function () {
        chai_1.expect(stack.peek()).equals(undefined);
        stack.push(1);
        chai_1.expect(stack.peek()).equals(1);
        stack.push(2);
        chai_1.expect(stack.peek()).equals(2);
        stack.push(3);
        chai_1.expect(stack.peek()).equals(3);
    });
    it('Gives the right size', function () {
        chai_1.expect(stack.size()).equals(0);
        stack.push(1);
        stack.push(2);
        stack.push(3);
        chai_1.expect(stack.size()).equals(3);
        stack.peek();
        chai_1.expect(stack.size()).equals(3);
        stack.pop();
        stack.pop();
        stack.pop();
        chai_1.expect(stack.size()).equals(0);
    });
    it('For each gives the right ordering', function () {
        stack.forEach(function (e) {
            chai_1.expect(true).equals(false); // should not enter here
        });
        for (var i = 0; i < 10; i++) {
            stack.add(i);
        }
        var i = 10 - 1;
        stack.forEach(function (e) {
            chai_1.expect(e).equals(i);
            i--;
        });
    });
    it('For each can be interrupted', function () {
        var array = [0, 1, 2, 3, 4];
        var b = [];
        for (var i = 0; i < 5; i++) {
            stack.add(i);
        }
        stack.forEach(function (e) {
            b.push(e);
            if (e === 4) {
                return false;
            }
        });
        chai_1.expect([4]).to.deep.equal(b);
    });
});
//# sourceMappingURL=stackTest.js.map