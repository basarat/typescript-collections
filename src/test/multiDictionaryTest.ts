import * as collections from '../lib/index';

import assert = require('assert');
import {expect} from 'chai';

describe('Multi Dictionary',
    function() {

        var dict: any = null;
        var elems = 100;

        beforeEach(function() {
            dict = new collections.MultiDictionary();
        });

        it('Maps keys to values with string keys',
            function() {

                expect(dict.getValue('sd')).to.deep.equal([]);

                // test with string keys
                for (var i = 0; i < elems; i++) {
                    expect(dict.setValue('' + i, i + 1)).equals(true);
                }
                expect(dict.size()).equals(elems);

                for (var i = 0; i < elems; i++) {
                    expect(dict.getValue('' + i)).to.deep.equal([i + 1]);
                }

                dict.setValue('a', 5);
                expect(dict.getValue('a')).to.deep.equal([5]);
                expect(dict.setValue('a', 21)).equals(true);
                expect(dict.size()).equals(elems + 1);
                expect(dict.getValue('a')).to.deep.equal([5, 21]);

            });

        it('Maps keys to values with number keys',
            function() {

                // test with number keys
                for (var i = 0; i < elems; i++) {
                    expect(dict.setValue(i, i + 1)).equals(true);
                }

                for (var i = 0; i < elems; i++) {
                    expect(dict.getValue(i)).to.deep.equal([i + 1]);
                }
            });

        it('Maps keys to values with custom keys',
            function() {

                var ts = function(obj: any) {
                    return obj.s;
                };
                dict = new collections.MultiDictionary(ts);
                expect(dict.getValue('sd')).to.deep.equal([]);

                for (var i = 0; i < elems; i++) {
                    var o: any = {};
                    o.s = '' + i;
                    expect(dict.setValue(o, i + 1)).equals(true);
                }

                for (var i = 0; i < elems; i++) {
                    var d: any = {};
                    d.s = '' + i;
                    expect(dict.getValue(d)).to.deep.equal([i + 1]);
                }
            });

        it('Maps multiple values',
            function() {
                dict.setValue('a', 5);
                expect(dict.getValue('a')).to.deep.equal([5]);
                expect(dict.setValue('a', 21)).equals(true);
                expect(dict.size()).equals(1);
                expect(dict.getValue('a')).to.deep.equal([5, 21]);
                expect(dict.size()).equals(1);
                expect(dict.setValue('a', 31)).equals(true);
                expect(dict.size()).equals(1);
                expect(dict.getValue('a')).to.deep.equal([5, 21, 31]);
                expect(dict.size()).equals(1);

            });

        it('Removes existing elements from the dictionary',
            function() {

                expect(dict.remove('1')).equals(false);
                for (var i = 0; i < elems; i++) {
                    expect(dict.setValue('' + i, i + 1)).equals(true);
                }
                expect(dict.size()).equals(elems);

                for (var i = 0; i < elems; i++) {
                    expect(dict.remove('' + i)).equals(true);
                    expect(dict.getValue('' + i)).to.deep.equal([]);
                    expect(dict.remove('' + i)).equals(false);
                }
                expect(dict.size()).equals(0);
            });

        it('Removes all values from a key',
            function() {
                dict.setValue('a', 1);
                dict.remove('a');
                expect(dict.containsKey('a')).equals(false);
                expect(dict.getValue('a')).to.deep.equal([]);
                dict.setValue('a', 2);
                dict.setValue('a', 3);
                dict.remove('a');
                expect(dict.containsKey('a')).equals(false);
                expect(dict.getValue('a')).to.deep.equal([]);
            });

        it('Removes a single value from a key',
            function() {
                dict.setValue('a', 1);
                dict.remove('a', 1);
                expect(dict.containsKey('a')).equals(false);
                expect(dict.getValue('a')).to.deep.equal([]);
                dict.setValue('a', 2);
                dict.setValue('a', 3);
                dict.remove('a', 3);
                expect(dict.containsKey('a')).equals(true);
                expect(dict.getValue('a')).to.deep.equal([2]);
                dict.remove('a', 2);
                expect(dict.containsKey('a')).equals(false);
                expect(dict.getValue('a')).to.deep.equal([]);
            });

        it('An empty dictionary is empty',
            function() {

                expect(dict.isEmpty()).equals(true);
                dict.setValue('1', 1);
                expect(dict.isEmpty()).equals(false);
                dict.remove('1');
                expect(dict.isEmpty()).equals(true);
            });

        it('Clear removes all elements',
            function() {
                dict.clear();
                dict.setValue(1, 1);
                dict.clear();
                expect(dict.isEmpty()).equals(true);
                expect(dict.getValue(1)).to.deep.equal([]);
            });

        it('Contains existing keys',
            function() {

                expect(dict.containsKey(0)).equals(false);
                for (var i = 0; i < 10; i++) {
                    dict.setValue(i, i);
                    expect(dict.containsKey(i)).equals(true);
                }
                for (var i = 0; i < 10; i++) {
                    dict.remove(i);
                    expect(dict.containsKey(i)).equals(false);
                }
            });

        it('Gives the right size',
            function() {

                expect(dict.size()).equals(0);
                for (var i = 0; i < 10; i++) {
                    dict.setValue(i, i);
                    expect(dict.size()).equals(i + 1);
                }
            });

        it('Gives all the stored keys',
            function() {
                var k: any = [];
                for (var i = 0; i < elems; i++) {
                    var keys = dict.keys();
                    k.sort();
                    keys.sort();
                    expect(k).to.deep.equal(keys);
                    dict.setValue('' + i, i);
                    k.push('' + i);
                }
            });

        it('Gives all the stored values',
            function() {
                var v: any = [];
                for (var i = 0; i < elems; i++) {
                    var values = dict.values();
                    v.sort();
                    values.sort();
                    expect(v).to.deep.equal(values);
                    dict.setValue('' + i, i);
                    v.push(i);
                }
            });

    });
