import * as collections from '../lib/index';

import * as assert from 'power-assert';
import {expect} from 'chai';

describe('Binary Search Tree',
    function() {

        // The type of elements in the tested data structure.
        type T = string|number|null|undefined;

        var tree: collections.BSTree<T>;

        beforeEach(function() {
            tree = new collections.BSTree();
        });
        var createTree1 = function() {
            tree.add('b');
            tree.add('a');
            tree.add('c');
        };
        var createTree2 = function() {
            tree.add('f');
            tree.add('b');
            tree.add('a');
            tree.add('d');
            tree.add('c');
            tree.add('e');
            tree.add('g');
            tree.add('i');
            tree.add('h');
        };

        it('Gives the right size',
            function() {
                createTree1();
                expect(tree.size()).equals(3);
                tree.add('d');
                expect(tree.size()).equals(4);
                tree.remove('d');
                tree.remove('d');
                expect(tree.size()).equals(3);
                tree.remove('b');
                tree.remove('b');
                expect(tree.size()).equals(2);
                tree.remove('c');
                tree.remove('c');
                expect(tree.size()).equals(1);
                tree.remove('a');
                tree.remove('a');
                expect(tree.size()).equals(0);

                tree.clear();
                expect(tree.size()).equals(0);
                createTree1();
                expect(tree.size()).equals(3);
                tree.add('d');
                expect(tree.size()).equals(4);
                tree.remove('d');
                expect(tree.size()).equals(3);
                tree.add('c');
                expect(tree.size()).equals(3);
            });

        it('Clears removes all elements',
            function() {
                createTree1();
                tree.clear();
                expect(tree.contains('a')).equals(false);
            });

        it('Gives the right height',
            function() {
                createTree1();
                expect(tree.height()).equals(1);
            });

        it('Gives the right height 2',
            function() {
                createTree2();
                expect(tree.height()).equals(3);
            });

        it('Gives the right height on empty tree',
            function() {
                expect(tree.height()).equals(- 1);
            });

        it('Gives the maximum element 1',
            function() {
                createTree1();
                expect(tree.maximum()).equals('c');
            });

        it('Gives the maximum element 2',
            function() {
                createTree2();
                expect(tree.maximum()).equals('i');
            });

        it('Gives the maximum element on empty tree',
            function() {
                expect(tree.maximum()).equals(undefined);
            });

        it('Gives the minimum element 1',
            function() {
                createTree1();
                expect(tree.minimum()).equals('a');
            });

        it('Gives the minimum element 2',
            function() {
                createTree2();
                expect(tree.minimum()).equals('a');
            });

        it('Gives the minimum element on empty tree',
            function() {
                expect(tree.minimum()).equals(undefined);
            });

        it('Contains existing elements',
            function() {
                createTree1();

                expect(tree.contains('a')).equals(true);
                expect(tree.contains('b')).equals(true);
                expect(tree.contains('c')).equals(true);
                expect(tree.contains('e')).equals(false);
                tree.remove('a');
                expect(tree.contains('a')).equals(false);
                expect(tree.contains('b')).equals(true);
                expect(tree.contains('c')).equals(true);

                tree.clear();
                tree.add(3);
                tree.add(2);
                tree.add(4);
                tree.add(1);
                expect(tree.contains(1)).equals(true);
                expect(tree.contains(2)).equals(true);
                expect(tree.contains(3)).equals(true);
                expect(tree.contains(4)).equals(true);
                expect(tree.contains(5)).equals(false);
            });

        it('An empty tree is empty',
            function() {
                expect(tree.isEmpty()).equals(true);
                tree.add(1);
                expect(tree.isEmpty()).equals(false);
                tree.remove(1);
                expect(tree.isEmpty()).equals(true);
            });

        it('Adds',
            function() {
                expect(tree.add('b')).equals(true);
                expect(tree.add('a')).equals(true);
                expect(tree.contains('a')).equals(true);
                expect(tree.contains('b')).equals(true);
                expect(tree.add('b')).equals(false);
                expect(tree.contains('b')).equals(true);
                expect(tree.add(null)).equals(true);
                expect(tree.contains(null)).equals(true);
                expect(tree.add(null)).equals(false);
                expect(tree.contains(undefined)).equals(false);
                expect(tree.add(undefined)).equals(false);
                expect(tree.contains(undefined)).equals(false);
            });

        it('Removes a leaf',
            function() {
                createTree2();
                tree.remove('c');
                var array = ['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i'];
                var b: T[] = [];
                tree.inorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Removes a node with one children',
            function() {
                createTree2();
                tree.remove('i');
                var array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                var b: T[] = [];
                tree.inorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Removes a node with two children',
            function() {
                createTree2();
                tree.remove('b');
                var array = ['a', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
                var b: T[] = [];
                tree.inorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Removes root',
            function() {
                createTree2();
                tree.remove('f');
                var array = ['a', 'b', 'c', 'd', 'e', 'g', 'h', 'i'];
                var b: T[] = [];
                tree.inorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Inorder traversal gives the right ordering',
            function() {
                createTree2();
                var array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
                var b: T[] = [];
                tree.inorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Inorder traversal cen be interrupted',
            function() {
                createTree2();
                var array = ['a', 'b', 'c', 'd'];
                var b: T[] = [];
                tree.inorderTraversal(function(element) {
                    b.push(element);
                    if (element === 'd') {
                        return false;
                    }
                });
                expect(array).to.deep.equal(b);
            });

        it('Preorder traversal gives the right ordering',
            function() {
                createTree2();
                var array = ['f', 'b', 'a', 'd', 'c', 'e', 'g', 'i', 'h'];
                var b: T[] = [];
                tree.preorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Preorder traversal can be interrupted',
            function() {
                createTree2();
                var array = ['f', 'b', 'a'];
                var b: T[] = [];
                tree.preorderTraversal(function(element) {
                    b.push(element);
                    if (element === 'a') {
                        return false;
                    }
                });
                expect(array).to.deep.equal(b);
            });

        it('Level traversal gives the right ordering',
            function() {
                createTree2();
                var array = ['f', 'b', 'g', 'a', 'd', 'i', 'c', 'e', 'h'];
                var b: T[] = [];
                tree.levelTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Level traversal can be interrupted',
            function() {
                createTree2();
                var array = ['f', 'b', 'g', 'a', 'd', 'i'];
                var b: T[] = [];
                tree.levelTraversal(function(element) {
                    b.push(element);
                    if (element === 'i') {
                        return false;
                    }
                });
                expect(array).to.deep.equal(b);
            });

        it('Postorter traversal gives the right ordering',
            function() {
                createTree2();
                var array = ['a', 'c', 'e', 'd', 'b', 'h', 'i', 'g', 'f'];
                var b: T[] = [];
                tree.postorderTraversal(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('Postorter traversal can be interrupted',
            function() {
                createTree2();
                var array = ['a', 'c', 'e', 'd', 'b'];
                var b: T[] = [];
                tree.postorderTraversal(function(element) {
                    b.push(element);
                    if (element === 'b') {
                        return false;
                    }
                });
                expect(array).to.deep.equal(b);
            });

        it('For each gives the right ordering',
            function() {
                createTree2();
                var array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
                var b: T[] = [];
                tree.forEach(function(element) {
                    b.push(element);
                });
                expect(array).to.deep.equal(b);
            });

        it('For each can be interrupted',
            function() {
                createTree2();
                var array = ['a', 'b', 'c', 'd'];
                var b: T[] = [];
                tree.forEach(function(element) {
                    b.push(element);
                    if (element === 'd') {
                        return false;
                    }
                });
                expect(array).to.deep.equal(b);
            });

        it('toArray gives the right ordering',
            function() {
                createTree2();
                var array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
                var b = tree.toArray();
                expect(array).to.deep.equal(b);
            });

        it('Empty tree returns an empty array',
            function() {
                expect(tree.toArray()).to.deep.equal([]);
            });

    });
