[TypeScript Collections](https://github.com/basarat/typescript-collections/)
====================
It is a complete, fully tested data structure library written in TypeScript.

This project uses TypeScript Generics so you need TS 0.9 and above.

Included data structures
---------------------

- Linked List
- Dictionary - [Example](#a-sample-on-dictionary)
- Multi Dictionary
- Binary Search Tree
- Stack
- Queue
- Set - [Example](#example)
- Bag
- Binary Heap
- Priority Queue

It also includes several functions for manipulating arrays.

How to use?
--------------------

Also available on NuGet : http://www.nuget.org/packages/typescript.collections/ Thanks to https://github.com/georgiosd

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
Equality is important for hashing (e.g. dictionary / sets). Javascript only allows strings to be keys for the base dictionary {}.
This is why the implementation for these data structures uses the item's toString() method.


makeString utility function
-------------------

A simple function is provided for you when you need a quick toString that uses all properties. E.g: 
```typescript
class Car {
    constructor(public company: string, public type: string, public year: number) {
    }
    toString() {
        // Short hand. Adds each own property 
        return collections.makeString(this);
    }
}
```

A Sample on Dictionary
---------------------

```typescript
class Person {
    constructor(public name: string, public yearOfBirth: number,public city?:string) {
    }
    toString() {
        return this.name + "-" + this.yearOfBirth; // City is not a part of the key. 
    }
}

class Car {
    constructor(public company: string, public type: string, public year: number) {
    }
    toString() {
        // Short hand. Adds each own property 
        return collections.toString(this);
    }
}
var dict = new collections.Dictionary<Person, Car>();
dict.setValue(new Person("john", 1970,"melbourne"), new Car("honda", "city", 2002));
dict.setValue(new Person("gavin", 1984), new Car("ferrari", "F50", 2006));
console.log("Orig");
console.log(dict);

// Changes the same john, since city is not part of key 
dict.setValue(new Person("john", 1970, "sydney"), new Car("honda", "accord", 2006)); 
// Add a new john
dict.setValue(new Person("john", 1971), new Car("nissan", "micra", 2010)); 
console.log("Updated");
console.log(dict);

// Showing getting / setting a single car: 
console.log("Single Item");
var person = new Person("john", 1970); 
console.log("-Person:");
console.log(person);

var car = dict.getValue(person);
console.log("-Car:");
console.log(car.toString());
```
Output: 
```
Orig
{
    john-1970 : {company:honda,type:city,year:2002}
	gavin-1984 : {company:ferrari,type:F50,year:2006}
}
Updated
{
	john-1970 : {company:honda,type:accord,year:2006}
	gavin-1984 : {company:ferrari,type:F50,year:2006}
	john-1971 : {company:nissan,type:micra,year:2010}
}
Single Item
-Person:
john-1970
-Car:
{company:honda,type:accord,year:2006}
```

Supported platforms
--------------------

- Every desktop and mobile browser (including IE6)
- Node.js

If it supports JavaScript, it probably supports this library.

Contact
--------------------

bas AT basarat.com 

Project is based on the excellent original javascript version called [buckets](https://github.com/mauriciosantos/buckets)
