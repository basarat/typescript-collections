[TypeScript Collections](github.com/basarat/typescript-collections/)
====================
It is a complete, fully tested and documented data structure library written in TypeScript, based on the excellent original javascript version called [buckets](https://github.com/mauriciosantos/buckets)

Already done: 
- use module / classes
- search for all "private"s to make sure they are marked as such 
- remove extra semicolons at end of functions / classes / modules 
- Optionals: use default parameter arguments. 

Things need to be done: 
- use generics 
- function arguments types 

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

Supported platforms
--------------------

- Every desktop and mobile browser (including IE6)
- Node.js

If it supports JavaScript, it probably supports this library.

How to use?
--------------------

Download

- collections.js

Include the script and start coding.

Example

```typescript
var setA = new collections.Set();
var setB = new collections.Set();
setA.add(1);
setB.add(2);
setA.union(setB); // {1,2}
```

Support
--------------------

Basarat Ali, 

bas AT basarat.com 
