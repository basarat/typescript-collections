"use strict";
var Collections = require('../lib/index');
var assert = require('assert');
describe('util', function () {
    var Car = (function () {
        function Car(company, type, year) {
            this.company = company;
            this.type = type;
            this.year = year;
        }
        Car.prototype.toString = function () {
            // Short hand. Adds each own property 
            return Collections.util.makeString(this);
        };
        return Car;
    }());
    it('makeString function works', function () {
        var carStringified = new Car('BMW', 'A', 2016).toString();
        assert.equal(carStringified, '{company:BMW,type:A,year:2016}');
    });
});
//# sourceMappingURL=utilTest.js.map