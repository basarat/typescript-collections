[TypeScript Collections](github.com/basarat/typescript-collections/)
====================
It is a complete, fully tested data structure library written in TypeScript.

This project uses TypeScript Generics so you need TS 0.9 and above.

Included data structures
---------------------

- Linked List
- Dictionary
- Multi Dictionary
- Binary Search Tree
- Stack
- Queue
- Set
- Bag
- Binary Heap
- Priority Queue

It also includes several functions for manipulating arrays.

How to use?
--------------------

Download collections.ts. Add it as a reference in your TypeScript code and start coding. 

A visual studio project is contained in the demo folder to show you sample usage. 

For run time: 
Load it using either a script tag (collections.js) or RequireJS. 

Example
--------------------
```typescript
var x = new collections.Set<number>(); 
x.add(123);
x.add(123); // Duplicates not allowed in a set 

var y = new collections.Set<number>();
y.add(456);
x.union(y);

console.log(x.toString()); // [123,456] 
```

Supported platforms
--------------------

- Every desktop and mobile browser (including IE6)
- Node.js

If it supports JavaScript, it probably supports this library.

Support
--------------------

Basarat Ali, 

bas AT basarat.com 

Project is based on the excellent original javascript version called [buckets](https://github.com/mauriciosantos/buckets)
