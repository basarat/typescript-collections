[TypeScript Collections](github.com/basarat/typescript-collections/)
====================
Things need to be done: 
use generics 
function arguments types 


Already done: 
use module 
search for all "private"s to make sure they are marked as such 
remove extra semicolons at end of functions / classes / modules 
**Optionals**
use default parameter arguments 
search optional. 
search for isundefined and use to mark optional. 
move all initialization to constructors : Decided its better inside (more performance since || is faster than typeof 



**A TypeScript Data Structure Library**

It is a complete, fully tested and documented data structure library written in TypeScript, based on the excellent original javascript version called [buckets](https://github.com/mauriciosantos/buckets)

Included data structures
---------------------

- [Linked List](http://mauriciosantos.github.com/buckets/symbols/buckets.LinkedList.html)
- [Dictionary](http://mauriciosantos.github.com/buckets/symbols/buckets.Dictionary.html)
- [Multi Dictionary](http://mauriciosantos.github.com/buckets/symbols/buckets.MultiDictionary.html)
- [Binary Search Tree](http://mauriciosantos.github.com/buckets/symbols/buckets.BSTree.html)
- [Stack](http://mauriciosantos.github.com/buckets/symbols/buckets.Stack.html)
- [Queue](http://mauriciosantos.github.com/buckets/symbols/buckets.Queue.html)
- [Set](http://mauriciosantos.github.com/buckets/symbols/buckets.Set.html)
- [Bag](http://mauriciosantos.github.com/buckets/symbols/buckets.Bag.html)
- [Binary Heap](http://mauriciosantos.github.com/buckets/symbols/buckets.Heap.html)
- [Priority Queue](http://mauriciosantos.github.com/buckets/symbols/buckets.PriorityQueue.html)

It also includes several functions for manipulating [arrays](http://mauriciosantos.github.com/buckets/symbols/buckets.arrays.html).

Supported platforms
--------------------

- Every desktop and mobile browser (including IE6)
- Node.js

If it supports JavaScript, it probably supports buckets.

How to use?
--------------------

Download

- [buckets.js](https://raw.github.com/mauriciosantos/buckets/master/buckets.js) (for development) or
- [buckets-minified.js](https://raw.github.com/mauriciosantos/buckets/master/buckets-minified.js) (for production)

Include the script and start coding.

Example

```javascript
var setA = new buckets.Set();
var setB = new buckets.Set();
setA.add(1);
setB.add(2);
setA.union(setB); // {1,2}
```
Read the [documentation](http://mauriciosantos.github.com/buckets/).

Support
--------------------

Mauricio Santos, [mauriciosantoss@gmail.com](mailto:mauriciosantoss@gmail.com)
