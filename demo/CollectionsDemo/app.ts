/// <reference path="../../collections.ts" />

var x = new collections.Set<number>();
x.add(123);
x.add(123); // Duplicates not allowed in a set 

var y = new collections.Set<number>();
y.add(456);
x.union(y);

console.log(x.toString()); // [123,456] 



