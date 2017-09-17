import * as collections from '../lib/index';

import * as assert from 'power-assert';
import {expect} from 'chai';

describe('Factory Dictionary',
    function() {

        var dict: any = null;
        var defaultValue: Array<any> = [];

        beforeEach(function() {
            dict = new collections.FactoryDictionary(() => []);
        });

        it('Uses the default value only when necessary',
            function() {
                expect(dict.setDefault('a', defaultValue)).to.deep.equal(defaultValue);

                var key: string = 'b';

                dict.setValue(key, []);
                expect(dict.setDefault(key, defaultValue)).to.not.equal(defaultValue);
            });

        it('Automatically creates a key with a default value if it doesn\'t exist',
            function() {
                var key: string = 'a';

                expect(dict.getValue(key)).to.deep.equal(defaultValue);
                expect(dict.containsKey(key)).equals(true);
            });

    });
