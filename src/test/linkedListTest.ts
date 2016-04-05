import * as collections from '../lib/index';

import assert = require('assert');
import {expect} from 'chai';

describe('Linked List',
    function() {

        var list: any = null;
        var elems = 100;

        var equals = function(a: any, b: any) {
            return a.el === b.el;
        };

        beforeEach(function() {
            list = new collections.LinkedList();
        });

        it('Inserts elements',
            function() {
                expect(list.first()).equals(undefined);
                expect(list.last()).equals(undefined);
                expect(list.size()).equals(0);
                for (var i = 0; i < elems; i++) {
                    list.add(i);
                    expect(list.first()).equals(0);
                    expect(list.last()).equals(i);

                    if (i === 0) {
                        expect(list.first()).equals(list.last());
                    }
                    expect(list.size()).equals(i + 1);
                }
            });

        it('Reverses the list 1',
            function() {
                list.add(1);
                list.add(2);
                list.add(3);
                list.reverse();
                expect(list.elementAtIndex(0)).equals(3);
                expect(list.elementAtIndex(1)).equals(2);
                expect(list.elementAtIndex(2)).equals(1);
            });

        it('Reverses the list 2',
            function() {
                list.add(1);
                list.add(2);
                list.reverse();
                expect(list.elementAtIndex(0)).equals(2);
                expect(list.elementAtIndex(1)).equals(1);
            });

        it('Reverses the list 2',
            function() {
                list.add(1);
                list.reverse();
                expect(list.elementAtIndex(0)).equals(1);
                expect(list.elementAtIndex(1)).equals(undefined);
            });

        it('Clear removes all elements',
            function() {
                for (var i = 0; i < elems; i++) {
                    list.add(i);
                }
                list.clear();
                expect(list.first()).equals(undefined);
                expect(list.last()).equals(undefined);
                expect(list.size()).equals(0);
            });

        it('Gives the right size',
            function() {
                expect(list.size()).equals(0);
                list.add(1);
                expect(list.size()).equals(1);
                list.add(1);
                expect(list.size()).equals(2);
            });

        it('Inserts an element to specified index',
            function() {
                expect(list.elementAtIndex(- 1)).equals(undefined);
                expect(list.elementAtIndex(0)).equals(undefined);
                expect(list.elementAtIndex(1)).equals(undefined);

                for (var i = 0; i < elems; i++) {
                    list.add(i);
                    expect(list.elementAtIndex(list.size() - 1)).equals(i);
                    expect(list.elementAtIndex(i)).equals(i);

                    for (var j = 0; j < i; j++) {
                        expect(list.elementAtIndex(j)).equals(j);
                    }
                }
            });

        it('Two equal lists are equal',
            function() {
                list.add(1);
                list.add(2);

                var list2 = new collections.LinkedList();
                list2.add(1);
                list2.add(2);

                expect(list.equals(list2)).equals(true);
                list2.clear();
                list2.add(2);
                list2.add(1);
                expect(list.equals(list2)).equals(false);
                expect(list.equals([1, 2])).equals(false);
            });


        it('Doesn\'t insert elements to invalid indexes',
            function() {
                expect(list.add(0, 1)).equals(false);
                expect(list.size() === 0).equals(true);
                expect(list.first()).equals(undefined);
                expect(list.last()).equals(undefined);
            });


        it('Inserts elements to the last index',
            function() {
                for (var i = 0; i < elems; i++) {
                    expect(list.add(i, i)).equals(true);
                    expect(list.elementAtIndex(i)).equals(i);
                    expect(list.first()).equals(0);
                    expect(list.last()).equals(i);
                    if (i === 0) {
                        expect(list.first()).equals(list.last());
                    }
                    expect(list.size()).equals(i + 1);
                }
            });

        it('Inserts elements at the first index',
            function() {
                for (var j = 0; j < elems; j++) {

                    for (var i = 0; i < j; i++) {
                        list.add(i);
                    }
                    list.add(- i, 0);
                    expect(list.elementAtIndex(0)).equals(- i);
                    expect(list.first()).equals(- i);
                }
            });

        it('Inserts elements to custom index',
            function() {
                for (var j = 0; j < elems; j++) {
                    list.add(j);
                }

                list.add(- 100, elems / 2);
                expect(list.elementAtIndex(elems / 2)).equals(- 100);
            });


        it('Finds elements with indexOf',
            function() {
                expect(list.indexOf(0)).equals(- 1);
                for (var j = 0; j < elems; j++) {
                    list.add(j + 1);
                    expect(list.indexOf(j + 1)).equals(j);
                    expect(list.indexOf(- 100)).equals(- 1);
                }
                for (var j = 0; j < elems; j++) {
                    expect(list.indexOf(j + 1)).equals(j);
                    expect(list.indexOf(- 100)).equals(- 1);
                }
            });

        it('Finds elements with indexOf and custom equals function',
            function() {
                expect(list.indexOf({
                    el: 1
                }, equals)).equals(- 1);
                for (var j = 0; j < elems; j++) {
                    list.add({
                        el: j + 1
                    });
                    expect(list.indexOf({
                        el: j + 1
                    }, equals)).equals(j);
                    expect(list.indexOf({
                        el: -200
                    }, equals)).equals(- 1);
                }
                for (var j = 0; j < elems; j++) {
                    expect(list.indexOf({
                        el: j + 1
                    }, equals)).equals(j);
                    expect(list.indexOf({
                        el: -200
                    }, equals)).equals(- 1);
                }
            });

        it('Removes elements',
            function() {
                expect(list.remove(1)).equals(false);
                expect(list.size() === 0).equals(true);
                expect(list.last()).equals(undefined);
                expect(list.first()).equals(undefined);

                for (var i = 0; i < elems; i++) {
                    list.add(i);
                    expect(list.remove(i)).equals(true);
                    expect(list.size() === 0).equals(true);
                    expect(list.last()).equals(undefined);
                    expect(list.first()).equals(undefined);
                }

                list.add(1);
                list.add(2);
                expect(list.remove(1)).equals(true);
                expect(list.size() === 1).equals(true);
                expect(list.first()).equals(2);
                expect(list.last()).equals(2);
                list.clear();

                list.add(1);
                list.add(2);
                list.add(3);
                list.add(4);
                expect(list.remove(2)).equals(true);
                expect(list.size() === 3).equals(true);
                expect(list.first()).equals(1);
                expect(list.last()).equals(4);
                expect(list.elementAtIndex(0)).equals(1);
                expect(list.elementAtIndex(1)).equals(3);
                expect(list.elementAtIndex(2)).equals(4);
                expect(list.elementAtIndex(3)).equals(undefined);
                list.clear();

                for (var i = 0; i < elems; i++) {
                    list.add(i);
                }
                var half = elems / 2;
                list.remove(elems / 2);
                for (var i = 0; i < elems; i++) {
                    if (i === (half)) {
                        expect(list.indexOf(i)).equals(- 1);
                    } else if (i < half) {
                        expect(list.indexOf(i)).equals(i);
                    } else if (i > half) {
                        expect(list.indexOf(i)).equals(i - 1);
                    }
                }
                expect(list.size() === (elems - 1)).equals(true);
            });

        it('Doesn\'t remove non existing elements',
            function() {
                expect(list.remove(5)).equals(false);
                expect(list.size()).equals(0);
                list.add(1);
                list.add(2);
                list.add(3);
                list.add(4);
                expect(list.remove(5)).equals(false);
                expect(list.size()).equals(4);
            });

        it('Removes elements with custom equals',
            function() {
                expect(list.remove({ el: 1 })).equals(false);
                for (var i = 0; i < elems; i++) {
                    list.add({ el: i });
                }
                for (var i = 0; i < elems; i++) {
                    expect(list.remove({ el: i })).equals(false);
                    expect(list.remove({ el: i }, equals)).equals(true);
                }

            });

        it('Removes elements at specified index',
            function() {
                expect(list.removeElementAtIndex(0)).equals(undefined);
                expect(list.removeElementAtIndex(- 1)).equals(undefined);
                expect(list.removeElementAtIndex(1)).equals(undefined);
                expect(list.size() === 0).equals(true);

                list.add(1);

                expect(list.removeElementAtIndex(- 1)).equals(undefined);
                expect(list.removeElementAtIndex(1)).equals(undefined);
                expect(list.size() === 1).equals(true);

                expect(list.removeElementAtIndex(0)).equals(1);
                expect(list.size() === 0).equals(true);
                expect(list.first()).equals(undefined);
                expect(list.last()).equals(undefined);
                expect(list.elementAtIndex(0)).equals(undefined);

                list.add(1);
                list.add(2);
                expect(list.removeElementAtIndex(0)).equals(1);
                expect(list.size() === 1).equals(true);
                expect(list.first()).equals(2);

                list.clear();
                list.add(1);
                list.add(2);
                list.add(3);
                expect(list.removeElementAtIndex(2)).equals(3);
                expect(list.size() === 2).equals(true);
                expect(list.first()).equals(1);
                expect(list.last()).equals(2);
                list.clear();

                list.add(1);
                list.add(2);
                list.add(3);
                list.add(4);
                list.add(5);

                expect(list.removeElementAtIndex(2)).equals(3);
                expect(list.size() === 4).equals(true);
                expect(list.first()).equals(1);
                expect(list.last()).equals(5);

                expect(list.elementAtIndex(0)).equals(1);
                expect(list.elementAtIndex(1)).equals(2);
                expect(list.elementAtIndex(2)).equals(4);
                expect(list.elementAtIndex(3)).equals(5);
            });

        it('Converts the list to an array',
            function() {
                expect(list.toArray().length).equals(0);

                list.add(5);
                var arr = list.toArray();
                expect(arr[0]).equals(5);
                expect(arr.length).equals(1);

                list.add(8);
                arr = list.toArray();
                expect(arr[0]).equals(5);
                expect(arr[1]).equals(8);
                expect(arr.length).equals(2);
            });

        it('Two identical linked lists are equal',
            function() {
                var list2 = new collections.LinkedList();
                expect(list.equals(list2)).equals(true);

                list.add(1);
                list.add(2);
                expect(list.equals(list2)).equals(false);
                list2.add(2);
                list2.add(1);
                expect(list.equals(list2)).equals(false);
                list2.clear();
                list2.add(1);
                list2.add(2);
                expect(list.equals(list2)).equals(true);
            });

        it('For each gives the right ordering',
            function() {

                list.forEach(function(e: any) {
                    expect(true).equals(false); // should not enter here
                });

                for (var i = 0; i < elems; i++) {
                    list.add(i);
                }

                var i = 0;
                list.forEach(function(e: any) {
                    expect(e).equals(i);
                    i++;
                });
            });

        it('For each can be interrupted',
            function() {
                var array = [0, 1, 2, 3, 4];
                var b: any = [];
                for (var i = 0; i < elems; i++) {
                    list.add(i);
                }
                list.forEach(function(e: any) {
                    b.push(e);
                    if (e === 4) {
                        return false;
                    }
                });

                expect(array).to.deep.equal(b);
            });

    });
