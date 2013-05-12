/// <reference path="../../collections.ts" />
var x = new collections.Set();
x.add(123);
x.add(123);
var y = new collections.Set();
y.add(456);
x.union(y);
console.log(x.toString());
//@ sourceMappingURL=app.js.map
