import * as collections from '../lib/index';

import * as assert from 'power-assert';
import {expect} from 'chai';


/*
   This test suite focuses on the correctness of the type interface of BSTreeKV.
   The behavior of the class is asserted in bsTreeTest.ts
*/
describe('Binary Search Tree - general form',
    function() {

        type K = {
            key: number;
        };

        function compare(a: K, b: K) {
            if (a.key > b.key) {
                return 1;
            } else if (a.key < b.key) {
                return -1;
            } else { // a.key === b.key
                return 0;
            }
        }

        type V = K & {
            data: string;
        };

        var tree: collections.BSTreeKV<K, V>;

        beforeEach(function() {
            tree = new collections.BSTreeKV(compare);
        });
        var createTree1 = function() {
            tree.add({key: 1, data: 'first'});
            tree.add({key: 2, data: 'second'});
            tree.add({key: 3, data: 'third'});
        };
        var createTree2 = function() {
            tree.add({key: 6, data: 'f'});
            tree.add({key: 2, data: 'b'});
            tree.add({key: 1, data: 'a'});
            tree.add({key: 4, data: 'd'});
            tree.add({key: 3, data: 'c'});
            tree.add({key: 5, data: 'e'});
            tree.add({key: 7, data: 'g'});
            tree.add({key: 9, data: 'i'});
            tree.add({key: 8, data: 'h'});
        };

        it('Can remove with just the key or the value', function() {
            createTree1();
                var obj = {key: 4, data: 'fourth'};
                expect(tree.size()).equals(3);
                tree.add(obj);
                expect(tree.size()).equals(4);
                tree.remove(obj);
                tree.remove({key: 3});
                expect(tree.size()).equals(2);
        });

        it('Returns the full element with maximum value, not just its key',
            function() {
                createTree2();
                expect(tree.maximum()).to.deep.equal({key: 9, data: 'i'});
            });

        it('Returns the full element with minimum value, not just its key',
            function() {
                createTree2();
                expect(tree.minimum()).to.deep.equal({key: 1, data: 'a'});
            });

        it('Contains works with just the key or the full object',
            function() {
                createTree1();

                var elExist = { key: 1, value: 'a' };
                var elAbsent = { key: 5, value: 'e' };

                expect(tree.contains({ key: 1 })).equals(true);
                expect(tree.contains(elExist)).equals(true);
                expect(tree.contains({ key: 5 })).equals(false);
                expect(tree.contains(elAbsent)).equals(false);
            });

        it('Inorder traversal gives the full elements',
            function() {
                createTree2();
                var array = [
                    {key: 1, data: 'a'},
                    {key: 2, data: 'b'},
                    {key: 3, data: 'c'},
                    {key: 4, data: 'd'},
                    {key: 5, data: 'e'},
                    {key: 6, data: 'f'},
                    {key: 7, data: 'g'},
                    {key: 8, data: 'h'},
                    {key: 9, data: 'i'}
                ];
                var b: V[] = [];
                tree.inorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });


        it('Preorder traversal gives the full elements',
            function() {
                createTree2();
                var array = [
                    {key: 6, data: 'f'},
                    {key: 2, data: 'b'},
                    {key: 1, data: 'a'},
                    {key: 4, data: 'd'},
                    {key: 3, data: 'c'},
                    {key: 5, data: 'e'},
                    {key: 7, data: 'g'},
                    {key: 9, data: 'i'},
                    {key: 8, data: 'h'}
                ];
                var b: V[] = [];
                tree.preorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Level traversal gives the full elements',
            function() {
                createTree2();
                var array = [
                    {key: 6, data: 'f'},
                    {key: 2, data: 'b'},
                    {key: 7, data: 'g'},
                    {key: 1, data: 'a'},
                    {key: 4, data: 'd'},
                    {key: 9, data: 'i'},
                    {key: 3, data: 'c'},
                    {key: 5, data: 'e'},
                    {key: 8, data: 'h'}
                ];
                var b: V[] = [];
                tree.levelTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Postorter traversal gives the full elements',
            function() {
                createTree2();
                var array = [
                    {key: 1, data: 'a'},
                    {key: 3, data: 'c'},
                    {key: 5, data: 'e'},
                    {key: 4, data: 'd'},
                    {key: 2, data: 'b'},
                    {key: 8, data: 'h'},
                    {key: 9, data: 'i'},
                    {key: 7, data: 'g'},
                    {key: 6, data: 'f'},
                ];
                var b: V[] = [];
                tree.postorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('For each gives the full elements',
            function() {
                createTree2();
                var array = [
                    {key: 1, data: 'a'},
                    {key: 2, data: 'b'},
                    {key: 3, data: 'c'},
                    {key: 4, data: 'd'},
                    {key: 5, data: 'e'},
                    {key: 6, data: 'f'},
                    {key: 7, data: 'g'},
                    {key: 8, data: 'h'},
                    {key: 9, data: 'i'}
                ];
                var b: V[] = [];
                tree.forEach(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('toArray gives the right ordering',
            function() {
                createTree2();
                var array = [
                    {key: 1, data: 'a'},
                    {key: 2, data: 'b'},
                    {key: 3, data: 'c'},
                    {key: 4, data: 'd'},
                    {key: 5, data: 'e'},
                    {key: 6, data: 'f'},
                    {key: 7, data: 'g'},
                    {key: 8, data: 'h'},
                    {key: 9, data: 'i'}
                ];
                var b = tree.toArray();
                expect(array).to.deep.equal(b);
            });

    });
