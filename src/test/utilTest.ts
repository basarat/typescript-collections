import * as Collections from '../lib/index';

import assert = require('assert');
import {expect} from 'chai';

describe('util',
    function () {

        class Car {
            constructor(public company: string, public type: string, public year: number) {
            }
            toString() {
                // Short hand. Adds each own property 
                return Collections.util.makeString(this);
            }
        }

        it('makeString function works',
            function () {
                let carStringified = new Car('BMW', 'A', 2016).toString();

                assert.equal(carStringified, '{company:BMW,type:A,year:2016}');
            });
    });
