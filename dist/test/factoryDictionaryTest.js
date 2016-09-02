"use strict";
var collections = require('../lib/index');
var chai_1 = require('chai');
describe('Factory Dictionary', function () {
    var dict = null;
    var defaultValue = [];
    beforeEach(function () {
        dict = new collections.FactoryDictionary(function () { return []; });
    });
    it('Uses the default value only when necessary', function () {
        chai_1.expect(dict.setDefault('a', defaultValue)).to.deep.equal(defaultValue);
        var key = 'b';
        dict.setValue(key, []);
        chai_1.expect(dict.setDefault(key, defaultValue)).to.not.equal(defaultValue);
    });
    it('Automatically creates a key with a default value if it doesn\'t exist', function () {
        var key = 'a';
        chai_1.expect(dict.getValue(key)).to.deep.equal(defaultValue);
        chai_1.expect(dict.containsKey(key)).equals(true);
    });
});
//# sourceMappingURL=factoryDictionaryTest.js.map