[TypeScript Collections](https://github.com/basarat/typescript-collections/)
====================

It is a complete, fully tested data structure library written in TypeScript.

This project uses TypeScript Generics so you need TS 0.9 and above.

[This projects supports UMD (Universal Module Definition)](https://github.com/umdjs/umd)

![typescript-collections downloads](https://nodei.co/npm-dl/typescript-collections.png)

Included data structures
---------------------

- Linked List
- Dictionary - [Example](#a-sample-on-dictionary)
- Multi Dictionary
- Linked Dictionary
- Default Dictionary - [Info](#default-dictionary)
- Binary Search Tree
- Multi Root Tree - [Info](#multi-root-tree)
- Stack
- Queue
- Set - [Example](#example)
- Bag
- Binary Heap
- Priority Queue

It also includes several functions for manipulating arrays.

Usage
--------------------

`npm install typescript-collections --save`

ES6 `import ... from`

```typescript
import * as Collections from 'typescript-collections';
```

or TypeScript `import ... require`

```typescript
import Collections = require('typescript-collections');
```

or JavaScript `var ... require`

```js
var Collections = require('typescript-collections');
```

![](https://zippy.gfycat.com/SeriousPointlessCob.gif)

Visual Studio or other TypeScript IDE, will provide you with complete Intellisense (autocomplete) for your types.
The compiler will ensure that the collections contain the correct elements.

A sample Visual Studio project is in the demo folder.

Also available on NuGet : <http://www.nuget.org/packages/typescript.collections/>
Thanks to <https://github.com/georgiosd>

Example
--------------------

```typescript
import * as Collections from 'typescript-collections';

var mySet = new Collections.Set<number>();
mySet.add(123);
mySet.add(123); // Duplicates not allowed in a set
// The following will give error due to wrong type:
// mySet.add("asdf"); // Can only add numbers since that is the type argument.

var myQueue = new Collections.Queue();
myQueue.enqueue(1);
myQueue.enqueue(2);

console.log(myQueue.dequeue()); // prints 1
console.log(myQueue.dequeue()); // prints 2
```

Typings resolution
-------------------

Remember to set `"moduleResolution": "node"`, so TypeScript compiler can resolve typings in the `node_modules/typescript-collections` directory.

![](http://i30.photobucket.com/albums/c316/Tilosag/Screen%20Shot%202016-04-08%20at%2015.55.30.png)

In browser usage
-------------------

You should include `umd.js` or `umd.min.js` from `dist/lib/` directory.

```html
<script src="[server public path]/typescript-collections/dist/lib/umd.min.js"></script>
```

A note on Equality
-------------------

Equality is important for hashing (e.g. dictionary / sets). Javascript only allows strings to be keys for the base dictionary {}.
This is why the implementation for these data structures uses the item's toString() method.

makeString utility function (aka. JSON.stringify)
-------------------

A simple function is provided for you when you need a quick toString that uses all properties. E.g:

```typescript
import * as Collections from 'typescript-collections';

class Car {
    constructor(public company: string, public type: string, public year: number) {
    }
    toString() {
        // Short hand. Adds each own property
        return Collections.util.makeString(this);
    }
}

console.log(new Car("BMW", "A", 2016).toString());
```

Output:

```text
{company:BMW,type:A,year:2016}
```

A Sample on Dictionary
---------------------

```typescript
import * as Collections from 'typescript-collections';

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
        return Collections.util.makeString(this);
    }
}
var dict = new Collections.Dictionary<Person, Car>();
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

```text
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

Default Dictionary
---------------------

Also known as `Factory Dictionary` [[ref.](https://github.com/basarat/typescript-collections/pull/47)]

If a key doesn't exist, the Default Dictionary automatically creates it with `setDefault(defaultValue)`.

Default Dictionary is a @michaelneu contribution which copies Python's [defaultDict](https://docs.python.org/2/library/collections.html#collections.defaultdict).

Multi Root Tree
---------------------

It's a [forest](https://en.wikipedia.org/wiki/Tree_(graph_theory)#Forest) like data structure which must consist of unique keys. It exposes advanced node manipulation methods.

```javascript
import * as Collections from 'typescript-collections';

let tree = new Collections.MultiRootTree();
tree.insertIdIntoRoot('1');
```

```text
{
    rootIds: ['1']
    nodes: { '1': [] }
}
```

Where `rootIds` are tree roots and `nodes` contains keys in order and describe keys nesting.

Constraints

- inserted keys MUST be unique

Tree manipulation methods

- insertIdIntoRoot(id: string, position?: number)
- insertIdIntoNode(nodeKey: string, id: string, position?: number)
- insertIdAfterId(belowId: string, insertId: string)
- insertIdBeforeId(beforeId: string, insertId: string)
- insertIdIntoId(insideId: string, insertId: string)
- moveIdBeforeId(moveId: string, beforeId: string)
- moveIdAfterId(moveId: string, afterId: string)
- moveIdIntoId(moveId: string, insideId: string, atStart = true)
- deleteId(id: string)
- getRootIds() - get a copy of rootIds
- getNodes() - get a copy of nodes

ToDos:

- drop unique key constraint

Development and contrbutions
--------------------

Install dependencies and tools
`npm run install_tools`

Compile, test and check coverage
`npm run all`

Supported platforms
--------------------

- Every desktop and mobile browser (including IE6)
- Node.js

```text
If it supports JavaScript, it probably supports this library.
```

Contact
--------------------

bas AT basarat.com

Project is based on the excellent original javascript version called [buckets](https://github.com/mauriciosantos/buckets)
