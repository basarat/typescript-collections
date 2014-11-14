describe('Dictionary',
function() {

    var dict = null;
    var elems = 100;
    var elemKeys = [];
    for(var i = 0; i < elems; i++) {
        elemKeys[i] = '' + i;
    }
    // Test with some potentially problematic keys
    elemKeys[2] = 'hasOwnProperty';
    elemKeys[4] = '__proto__';
    elemKeys[6] = '';

    beforeEach(function() {
        dict = new collections.Dictionary();
    });

    it('Maps keys to values with string keys',
    function() {

        expect(dict.getValue("sd")).toBeUndefined();

        // test with string keys
        for (var i = 0; i < elems; i++) {
            expect(dict.setValue(elemKeys[i], i + 1)).toBeUndefined();
        }
        expect(dict.size()).toEqual(elems);

        for (var i = 0; i < elems; i++) {
            expect(dict.getValue(elemKeys[i])).toEqual(i + 1);
        }

        dict.setValue("a", 5);
        expect(dict.getValue("a")).toEqual(5);
        expect(dict.setValue("a", 21)).toEqual(5);
        expect(dict.size()).toEqual(elems + 1);
        expect(dict.getValue("a")).toEqual(21);
        

    });

    it('Maps keys to values with number keys',
    function() {

        // test with number keys
        for (var i = 0; i < elems; i++) {
            expect(dict.setValue(i, i + 1)).toBeUndefined();
        }

        for (var i = 0; i < elems; i++) {
            expect(dict.getValue(i)).toEqual(i + 1);
        }
    });

    it('Maps keys to values with custom keys',
    function() {

        var ts = function(obj) {
            return obj.s;
        };
        dict = new collections.Dictionary(ts);
        expect(dict.getValue("sd")).toBeUndefined();

        for (var i = 0; i < elems; i++) {
            var o = {};
            o.s = elemKeys[i];
            expect(dict.setValue(o, i + 1)).toBeUndefined();
        }

        for (var i = 0; i < elems; i++) {
            var d = {};
            d.s = elemKeys[i];
            expect(dict.getValue(d)).toEqual(i + 1);
        }
    });

    it('Removes existing elements from the dictionary',
    function() {

        expect(dict.remove("1")).toBeUndefined();
        for (var i = 0; i < elems; i++) {
            expect(dict.setValue(elemKeys[i], i + 1)).toBeUndefined();
        }
        expect(dict.size()).toEqual(elems);

        for (var i = 0; i < elems; i++) {
            expect(dict.remove(elemKeys[i])).toEqual(i + 1);
            expect(dict.getValue(elemKeys[i])).toBeUndefined();
            expect(dict.remove(elemKeys[i])).toBeUndefined();
        }
        expect(dict.size()).toEqual(0);
    });

    it('An empty dictionary is empty',
    function() {

        expect(dict.isEmpty()).toBeTruthy();
        dict.setValue("1", 1);
        expect(dict.isEmpty()).toBeFalsy();
        dict.remove("1");
        expect(dict.isEmpty()).toBeTruthy();
    });

	it('Clear removes all elements',
    function() {
		dict.clear();
		dict.setValue(1,1);
		dict.clear();
		expect(dict.isEmpty()).toBeTruthy();
		expect(dict.getValue(1)).toBeUndefined();
    });

    it('Contains existing keys',
    function() {

        expect(dict.containsKey(0)).toBeFalsy();
        for (var i = 0; i < 10; i++) {
            dict.setValue(elemKeys[i], i);
            expect(dict.containsKey(elemKeys[i])).toBeTruthy();
        };
        for (var i = 0; i < 10; i++) {
            dict.remove(elemKeys[i]);
            expect(dict.containsKey(elemKeys[i])).toBeFalsy();
        };
    });

    it('Gives the right size',
    function() {

        expect(dict.size()).toEqual(0);
        for (var i = 0; i < 10; i++) {
            dict.setValue(elemKeys[i], i);
            expect(dict.size()).toEqual(i + 1);
        };

    });

    it('Gives all the stored keys',
    function() {
        var k = [];
        for (var i = 0; i < elems; i++) {
            var keys = dict.keys();
            k.sort();
            keys.sort();
            expect(collections.arrays.equals(k, keys)).toBeTruthy();
            dict.setValue(elemKeys[i], i);
            k.push(elemKeys[i]);
        }
    });

    it('Gives all the stored values',
    function() {
        var v = [];
        for (var i = 0; i < elems; i++) {
            var values = dict.values();
            v.sort();
            values.sort();
            expect(collections.arrays.equals(v, values)).toBeTruthy();
            dict.setValue(elemKeys[i], i);
            v.push(i);
        }
    });
	
	it('For each gives all the pairs',
    function() {
        for (var i = 0; i < elems; i++) {
            dict.setValue(elemKeys[i], i);
        }
		var keys = dict.keys();
		var values = dict.values();
		dict.forEach(function(k,v) {
			expect(collections.arrays.remove(keys, k)).toBeTruthy();
			expect(collections.arrays.remove(values, v)).toBeTruthy();
		});
		expect(keys.length).toEqual(0);
		expect(values.length).toEqual(0);
    });
	
	
	it('For each can be interrupted',
    function() {
        for (var i = 0; i < elems; i++) {
            dict.setValue(elemKeys[i], i);
        }
		var t = 0;
		dict.forEach(function(k,v) {
			t++;
			return false;
		});
		expect(t).toEqual(1);
    });

});
