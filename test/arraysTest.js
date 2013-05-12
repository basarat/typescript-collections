describe('Arrays',
function() {

    it('IndexOf returns the right position',
    function() {
        var a = [1, 8, 10];
        expect(collections.arrays.indexOf(a, 1)).toEqual(0);
        expect(collections.arrays.indexOf(a, 8)).toEqual(1);
        expect(collections.arrays.indexOf(a, 10)).toEqual(2);
        expect(collections.arrays.indexOf(a, 11)).toEqual( - 1);
        expect(collections.arrays.indexOf([], 8)).toEqual( - 1);
    });

    it('IndexOf with custom equals function returns the right position',
    function() {
        var b = {
            val: 1
        };
        var c = {
            val: 8
        };
        var d = {
            val: 10
        };
        var e = {
            val: 11
        };
        var a = [b, c, d];

        var eq = function(arg1, arg2) {
            return arg1.val === arg2.val;
        };

        expect(collections.arrays.indexOf(a, {
            val: 1
        })).toEqual( - 1);
        expect(collections.arrays.indexOf(a, {
            val: 1
        },
        eq)).toEqual(0);
        expect(collections.arrays.indexOf(a, c, eq)).toEqual(1);
        expect(collections.arrays.indexOf(a, {
            val: 10
        },
        eq)).toEqual(2);
        expect(collections.arrays.indexOf(a, e, eq)).toEqual( - 1);
        expect(collections.arrays.indexOf([], b)).toEqual( - 1);
    });

    it('lastIndexOf returns the right position',
    function() {
        var a = [1, 8, 8, 8, 10, 10];
        expect(collections.arrays.lastIndexOf(a, 1)).toEqual(0);
        expect(collections.arrays.lastIndexOf(a, 8)).toEqual(3);
        expect(collections.arrays.lastIndexOf(a, 10)).toEqual(5);
        expect(collections.arrays.lastIndexOf(a, 11)).toEqual( - 1);
        expect(collections.arrays.lastIndexOf([], 8)).toEqual( - 1);
    });

    it('lastIndexOf with custom equals function returns the right position',
    function() {
        var b = {
            val: 1
        };
        var c = {
            val: 8
        };
        var d = {
            val: 10
        };
        var e = {
            val: 11
        };
        var a = [b, b, c, d];

        var eq = function(arg1, arg2) {
            return arg1.val === arg2.val;
        };

        expect(collections.arrays.lastIndexOf(a, {
            val: 1
        })).toEqual( - 1);
        expect(collections.arrays.lastIndexOf(a, {
            val: 1
        },
        eq)).toEqual(1);
    });

    it('Contains existing elements',
    function() {
        var a = [1, 8, 8, 8, 10, 10];
        expect(collections.arrays.contains(a, 1)).toBeTruthy();
        expect(collections.arrays.contains(a, 8)).toBeTruthy();
        expect(collections.arrays.contains(a, 10)).toBeTruthy();
        expect(collections.arrays.contains(a, 11)).toBeFalsy();
        expect(collections.arrays.contains([], 8)).toBeFalsy();
    });

    it('Contains existing elements with custom equals function',
    function() {
        var b = {
            val: 1
        };
        var c = {
            val: 8
        };
        var d = {
            val: 10
        };
        var e = {
            val: 11
        };
        var a = [b, b, c, d];

        var eq = function(arg1, arg2) {
            return arg1.val === arg2.val;
        };

        expect(collections.arrays.contains(a, {
            val: 1
        })).toBeFalsy();
        expect(collections.arrays.contains(a, {
            val: 1
        },
        eq)).toBeTruthy();
        expect(collections.arrays.contains(a, {
            val: 8
        },
        eq)).toBeTruthy();
        expect(collections.arrays.contains(a, {
            val: 10
        },
        eq)).toBeTruthy();
        expect(collections.arrays.contains(a, {
            val: 11
        },
        eq)).toBeFalsy();
        expect(collections.arrays.contains([], {
            val: 11
        },
        eq)).toBeFalsy();
    });

    it('Gives the right frequency',
    function() {
        var a = [1, 8, 8, 8, 10, 10];
        expect(collections.arrays.frequency(a, 1)).toEqual(1);
        expect(collections.arrays.frequency(a, 8)).toEqual(3);
        expect(collections.arrays.frequency(a, 10)).toEqual(2);
        expect(collections.arrays.frequency(a, 11)).toEqual(0);
    });

    it('Gives the right frequency with custom equals',
    function() {
        var b = {
            val: 1
        };
        var c = {
            val: 8
        };
        var d = {
            val: 10
        };
        var e = {
            val: 11
        };
        var a = [b, b, c, d];

        var eq = function(arg1, arg2) {
            return arg1.val === arg2.val;
        };
        expect(collections.arrays.frequency(a, {
            val: 1
        })).toEqual(0);
        expect(collections.arrays.frequency(a, {
            val: 1
        },
        eq)).toEqual(2);
        expect(collections.arrays.frequency(a, {
            val: 8
        },
        eq)).toEqual(1);
    });

    it('Equal arrays are equal',
    function() {
        var a = [1, 8, 8, 8, 10, 10];
        var b = [1, 8, 8, 8, 10, 10];
        var c = [1, 8, 5, 8, 10, 10];
        var d = [1, 8, 8, 8, 10];

        expect(collections.arrays.equals(a, a)).toBeTruthy();
        expect(collections.arrays.equals(a, b)).toBeTruthy();
        expect(collections.arrays.equals(a, [])).toBeFalsy();
        expect(collections.arrays.equals(a, c)).toBeFalsy();
        expect(collections.arrays.equals(a, d)).toBeFalsy();
        expect(collections.arrays.equals(a, [])).toBeFalsy();
    });

    it('Equal arrays are equal with custom equals function',
    function() {
        var a = [{
            val: 8
        }];
        var b = [{
            val: 8
        }];

        var eq = function(arg1, arg2) {
            return arg1.val === arg2.val;
        };

        expect(collections.arrays.equals(a, a)).toBeTruthy();
        expect(collections.arrays.equals(a, a, eq)).toBeTruthy();
        expect(collections.arrays.equals(a, b, eq)).toBeTruthy();
        expect(collections.arrays.equals(a, b)).toBeFalsy();
    });

    it('Removes elements',
    function() {
        var a = [];
        expect(collections.arrays.remove(a, 1)).toBeFalsy();
        a = [4, 9, 9, 10];
        expect(collections.arrays.remove(a, 9)).toBeTruthy();
        expect(collections.arrays.indexOf(a, 9)).toEqual(1);
        expect(collections.arrays.indexOf(a, 10)).toEqual(2);
        expect(collections.arrays.remove(a, 9)).toBeTruthy();
        expect(collections.arrays.remove(a, 9)).toBeFalsy();
        expect(collections.arrays.remove(a, 9)).toBeFalsy();
    });

    it('Removes elements with custom equals function',
    function() {
        var c = {
            val: 8
        };
        var d = {
            val: 10
        };
        var eq = function(arg1, arg2) {
            return arg1.val === arg2.val;
        };

        var a = [c, d];
        expect(collections.arrays.remove(a, {
            val: 10
        })).toBeFalsy();																															
        expect(collections.arrays.remove(a, {
            val: 10
        },
        eq)).toBeTruthy();
    });

	it('For each gives the right ordering',
    function() {
		var a = [];
        collections.arrays.forEach(a,function(e) {
			expect(true).toEqual(false); // should not enter here
		});

        for (var i = 0; i < 10; i++) {
            a.push(i);
        }

        var i = 0;
		 collections.arrays.forEach(a,function(e) {
			expect(e).toEqual(i);
            i++;
		});
    });

	it('For each can be interrupted',
    function() {
		var a = [];
		var b = [];
        for (var i = 0; i < 5; i++) {
	            a.push(i);
	    }
		collections.arrays.forEach(a,function(e) {
			b.push(e);
            if(e===3){
				return false;
			}
		});
		
     	expect([0,1,2,3]).toEqual(b);
    });

    it('Copies existing arrays',
    function() {
        var a = [1, 8, 8, 8, 10, 10];
        var b = collections.arrays.copy(a);
        expect(collections.arrays.equals(a, b)).toBeTruthy();
        expect(a === b).toBeFalsy();
    });

    it('Swaps elements',
    function() {
        var a = [1, 8, 8, 8, 10, 10];
        expect(collections.arrays.swap(a, 0, 5)).toEqual(true);
        expect(a[0]).toEqual(10);
        expect(a[5]).toEqual(1);
        expect(collections.arrays.swap(a, 0, 6)).toEqual(false);
        expect(collections.arrays.swap(a, 7, 2)).toEqual(false);
        expect(collections.arrays.swap(a, -1, 9)).toEqual(false);
    });

});