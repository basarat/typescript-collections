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
Visual studio / any typescript IDE, will provide you with complete intellisense for your types and the compiler will 
ensure that the collections contain the correct elements. 

A visual studio project is contained in the demo folder to show you sample usage. 

Example
--------------------
```typescript
/// <reference path="collections.ts" />
var x = new collections.Set<number>(); 
x.add(123);
x.add(123); // Duplicates not allowed in a set 
// The following will give error due to wrong type: 
// x.add("asdf"); // Can only add numbers since that is the type argument. 

var y = new collections.Set<number>();
y.add(456);
x.union(y);

console.log(x.toString()); // [123,456] 
```

A note on Equality
-------------------
Equlity is important for hashing (e.g. dictionary / sets). Javascript only allows strings to be keys for the base dictionary {}.
This is why the implementation for these datastructures uses the item's toString() method. 

A simple function is provided for you when you need a quick toString that uses all properties. E.g: 
```typescript
class Car {
    constructor(public company: string, public type: string, public year: number) {
    }
    toString() {
        // Short hand. Adds each own property 
        return collections.toString(this);
    }
}
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
