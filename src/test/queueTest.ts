import * as collections from '../lib/index';

import * as assert from 'power-assert';
import {expect} from 'chai';

describe('Queue',
    function() {

        var queue: any = null;

        beforeEach(function() {
            queue = new collections.Queue();
        });

        function createQueue() {
            queue.enqueue('a');
            queue.enqueue('b');
            queue.enqueue('c');
        }

        it('Gives the right size',
            function() {
                expect(queue.size()).equals(0);
                createQueue();
                expect(queue.size()).equals(3);
                queue.enqueue('d');
                expect(queue.size()).equals(4);
                queue.dequeue();
                expect(queue.size()).equals(3);
                queue.clear();
                expect(queue.size()).equals(0);

            });

        it('Enqueues',
            function() {
                createQueue();
                var head = queue.dequeue();
                expect(head).equals('a');
                queue.dequeue();
                head = queue.dequeue();
                expect(head).equals('c');
                expect(queue.isEmpty()).equals(true);
                head = queue.dequeue();
                expect(head).equals(undefined);
            });

        it('Peeks',
            function() {
                createQueue();
                var head = queue.peek();
                expect(head).equals('a');
                var head2 = queue.dequeue();
                expect(head).equals(head2);
                head = queue.peek();
                expect(head).equals('b');
                queue.clear();
                head = queue.peek();
                expect(head).equals(undefined);
            });

        it('For each gives the right ordering',
            function() {

                queue.forEach(function(e: any) {
                    expect(true).equals(false); // should not enter here
                });

                for (var i = 0; i < 10; i++) {
                    queue.add(i);
                }

                var i = 0;
                queue.forEach(function(e: any) {
                    expect(e).equals(i);
                    i++;
                });
            });

        it('For each can be interrupted',
            function() {
                var array = [0, 1, 2, 3, 4];
                var b: any = [];
                for (var i = 0; i < 5; i++) {
                    queue.add(i);
                }
                queue.forEach(function(e: any) {
                    b.push(e);
                    if (e === 3) {
                        return false;
                    }
                });

                expect([0, 1, 2, 3]).to.deep.equal(b);
            });
        it('Contains previously added items',
            function() {
                createQueue();
                expect(queue.contains('a')).equals(true);
                expect(queue.contains('z')).equals(false);
                expect(queue.contains(undefined)).equals(false);
            });

    });
