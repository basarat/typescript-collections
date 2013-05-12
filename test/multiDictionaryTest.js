describe('Multi Dictionary',
function() {

   	var dict = null;
    var elems = 100;

    beforeEach(function() {
        dict = new collections.MultiDictionary();
    });

    it('Maps keys to values with string keys',
    function() {

        expect(dict.getValue("sd")).toEqual([]);

        // test with string keys
        for (var i = 0; i < elems; i++) {
            expect(dict.setValue("" + i, i + 1)).toBeTruthy();
        }
        expect(dict.size()).toEqual(elems);

        for (var i = 0; i < elems; i++) {
            expect(dict.getValue("" + i)).toEqual([i + 1]);
        }

        dict.setValue("a", 5);
        expect(dict.getValue("a")).toEqual([5]);
        expect(dict.setValue("a", 21)).toBeTruthy();
        expect(dict.size()).toEqual(elems + 1);
        expect(dict.getValue("a")).toEqual([5,21]);

    });

 	it('Maps keys to values with number keys',
    function() {

        // test with number keys
        for (var i = 0; i < elems; i++) {
            expect(dict.setValue(i, i + 1)).toBeTruthy();
        }

        for (var i = 0; i < elems; i++) {
            expect(dict.getValue(i)).toEqual([i + 1]);
        }
    });

	it('Maps keys to values with custom keys',
    function() {

        var ts = function(obj) {
            return obj.s;
        };
        dict = new collections.MultiDictionary(ts);
        expect(dict.getValue("sd")).toEqual([]);

        for (var i = 0; i < elems; i++) {
            var o = {};
            o.s = "" + i;
            expect(dict.setValue(o, i + 1)).toBeTruthy();
        }

        for (var i = 0; i < elems; i++) {
            var d = {};
            d.s = "" + i;
            expect(dict.getValue(d)).toEqual([i + 1]);
        }
    });

	it('Maps multiple values',
    function() {
        dict.setValue("a", 5);
        expect(dict.getValue("a")).toEqual([5]);
        expect(dict.setValue("a", 21)).toBeTruthy();
        expect(dict.size()).toEqual(1);
        expect(dict.getValue("a")).toEqual([5,21]);
		expect(dict.size()).toEqual(1);
		expect(dict.setValue("a", 31)).toBeTruthy();
        expect(dict.size()).toEqual(1);
        expect(dict.getValue("a")).toEqual([5,21,31]);
		expect(dict.size()).toEqual(1);

    });

	it('Removes existing elements from the dictionary',
    function() {

        expect(dict.remove("1")).toBeFalsy();
        for (var i = 0; i < elems; i++) {
            expect(dict.setValue("" + i, i + 1)).toBeTruthy();
        }
        expect(dict.size()).toEqual(elems);

        for (var i = 0; i < elems; i++) {
            expect(dict.remove("" + i)).toBeTruthy();
            expect(dict.getValue("" + i)).toEqual([]);
            expect(dict.remove("" + i)).toBeFalsy();
        }
        expect(dict.size()).toEqual(0);
    });

	it('Removes all values from a key',
    function() {
		dict.setValue("a",1);
		dict.remove("a");
		expect(dict.containsKey("a")).toBeFalsy();
		expect(dict.getValue("a")).toEqual([]);
		dict.setValue("a",2);
		dict.setValue("a",3);
		dict.remove("a");
		expect(dict.containsKey("a")).toBeFalsy();
		expect(dict.getValue("a")).toEqual([]);
    });

	it('Removes a single value from a key',
    function() {
		dict.setValue("a",1);
		dict.remove("a",1);
		expect(dict.containsKey("a")).toBeFalsy();
		expect(dict.getValue("a")).toEqual([]);
		dict.setValue("a",2);
		dict.setValue("a",3);
		dict.remove("a",3);
		expect(dict.containsKey("a")).toBeTruthy();
		expect(dict.getValue("a")).toEqual([2]);
		dict.remove("a",2);
		expect(dict.containsKey("a")).toBeFalsy();
		expect(dict.getValue("a")).toEqual([]);
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
		expect(dict.getValue(1)).toEqual([]);
    });

    it('Contains existing keys',
    function() {

        expect(dict.containsKey(0)).toBeFalsy();
        for (var i = 0; i < 10; i++) {
            dict.setValue(i, i);
            expect(dict.containsKey(i)).toBeTruthy();
        }
        for (var i = 0; i < 10; i++) {
            dict.remove(i);
            expect(dict.containsKey(i)).toBeFalsy();
        }
    });

    it('Gives the right size',
    function() {

        expect(dict.size()).toEqual(0);
        for (var i = 0; i < 10; i++) {
            dict.setValue(i, i);
            expect(dict.size()).toEqual(i + 1);
        }
    });

    it('Gives all the stored keys',
    function() {
        var k = [];
        for (var i = 0; i < elems; i++) {
            var keys = dict.keys();
            k.sort();
            keys.sort();
			expect(k).toEqual(keys);
            dict.setValue("" + i, i);
            k.push("" + i);
        }
    });

    it('Gives all the stored values',
    function() {
        var v = [];
        for (var i = 0; i < elems; i++) {
            var values = dict.values();
            v.sort();
            values.sort();
			expect(v).toEqual(values);
            dict.setValue("" + i, i);
            v.push(i);
        }
    });

});