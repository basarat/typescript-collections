import * as collections from '../lib/index';

import * as assert from 'power-assert';
import {expect} from 'chai';

describe('Stack',
    function() {

        var stack: any = null;

        beforeEach(function() {
            stack = new collections.Stack();
        });

        it('Pops',
            function() {
                expect(stack.pop()).equals(undefined);
                stack.push(1);
                stack.push(2);
                stack.push(3);
                expect(stack.pop()).equals(3);
                expect(stack.pop()).equals(2);
                expect(stack.pop()).equals(1);
                expect(stack.pop()).equals(undefined);

            });

        it('Pushes and pops',
            function() {
                stack.push(1);
                expect(stack.pop()).equals(1);
                stack.push(2);
                expect(stack.pop()).equals(2);
                stack.push(3);
                expect(stack.pop()).equals(3);
                expect(stack.pop()).equals(undefined);
            });

        it('Peeks',
            function() {
                stack.push(1);
                stack.push(2);
                stack.push(3);
                expect(stack.peek()).equals(3);
                stack.pop();
                expect(stack.peek()).equals(2);
                stack.pop();
                expect(stack.peek()).equals(1);
                stack.pop();
                expect(stack.peek()).equals(undefined);
            });

        it('Pushes and peeks',
            function() {
                expect(stack.peek()).equals(undefined);
                stack.push(1);
                expect(stack.peek()).equals(1);
                stack.push(2);
                expect(stack.peek()).equals(2);
                stack.push(3);
                expect(stack.peek()).equals(3);
            });

        it('Gives the right size',
            function() {
                expect(stack.size()).equals(0);
                stack.push(1);
                stack.push(2);
                stack.push(3);
                expect(stack.size()).equals(3);
                stack.peek();
                expect(stack.size()).equals(3);
                stack.pop();
                stack.pop();
                stack.pop();
                expect(stack.size()).equals(0);
            });

        it('For each gives the right ordering',
            function() {

                stack.forEach(function(e: any) {
                    expect(true).equals(false); // should not enter here
                });

                for (var i = 0; i < 10; i++) {
                    stack.add(i);
                }

                var i = 10 - 1;
                stack.forEach(function(e: any) {
                    expect(e).equals(i);
                    i--;
                });
            });

        it('For each can be interrupted',
            function() {
                var array = [0, 1, 2, 3, 4];
                var b: any = [];
                for (var i = 0; i < 5; i++) {
                    stack.add(i);
                }
                stack.forEach(function(e: any) {
                    b.push(e);
                    if (e === 4) {
                        return false;
                    }
                });

                expect([4]).to.deep.equal(b);
            });

    });
