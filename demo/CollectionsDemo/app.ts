/// <reference path="../../collections.ts" />

///////////////////////////////////Dictionary 
console.log("------");
console.log("Dictionary demo");

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
        return collections.makeString(this);
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

///////////////////////////////////LinkedDictionary

console.log("------");
console.log("Linked Dictionary Demo");

var joe = new Person("Joe", 1994, "Gainesville");
var elena = new Person("Elena", 1995, "Gainesville");
var chris = new Person("Chris", 1994, "Ocala");

var linkedDictionary = new collections.LinkedDictionary<Person, Car>();

// Add Three People, print them in order of insertion.
linkedDictionary.setValue(joe, new Car("Mazda", "3", 2010));
linkedDictionary.setValue(elena, new Car("Mazda", "Tribute", 2002));
linkedDictionary.setValue(chris, new Car("Honda", "Accord", 2006));

console.log("Insertion Order Preserved for Insertions and Interations");
console.log(linkedDictionary.toString());

// Update Preserves order
linkedDictionary.setValue(elena, new Car("Maserati", "Granturismo", 2015));

console.log("Updating one Value maintains insertion order");
console.log(linkedDictionary.toString());

// Removal, then adding back does not.
linkedDictionary.remove(joe);
linkedDictionary.setValue(joe, new Car("Lamorghini", "Huracan", 2015));

console.log(linkedDictionary.toString());

// Retrieving a Car for a person.
console.log("Retrieving a Car for a person.");
var car = linkedDictionary.getValue(chris);
console.log(car);

///////////////////////////////////Set 
console.log("------");
console.log("Set Demo");
var x = new collections.Set<number>();
x.add(123);
x.add(123); // Duplicates not allowed in a set 

var y = new collections.Set<number>();
y.add(456);
x.union(y);

console.log(x.toString()); // [123,456] 

///////////////////////////////////Linked list 
console.log("------");
console.log("Linked List demo");
var ll = new collections.LinkedList<number>();
ll.add(123);
ll.add(456);
console.log(ll); 


//console.log("------");
//console.log("PriorityQueue demo"); 



