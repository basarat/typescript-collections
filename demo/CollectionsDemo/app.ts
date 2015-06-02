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
console.log("==Insertion Order Preserved for Insertions and Iterations==");
console.log("Inserting Joe");
linkedDictionary.setValue(joe, new Car("Mazda", "3", 2010));
console.log(linkedDictionary.toString());

console.log("Inserting Elena");
linkedDictionary.setValue(elena, new Car("Mazda", "Tribute", 2002));
console.log(linkedDictionary.toString());

console.log("Inserting Chris");
linkedDictionary.setValue(chris, new Car("Honda", "Accord", 2006));
console.log(linkedDictionary.toString());

// Update Preserves order
console.log("==Update Preserves order==");
console.log("Giving Elena a Maserati");
linkedDictionary.setValue(elena, new Car("Maserati", "Granturismo", 2015));
console.log(linkedDictionary.toString());

// Removal, then adding back does not.
console.log("==Removal, then adding entry with same key back does not preserve order==");
console.log("Removing Joe");
linkedDictionary.remove(joe);
console.log(linkedDictionary.toString());
console.log("Contains Joe? : " + linkedDictionary.containsKey(joe));

console.log("Replacing Joe, and he will have Lamborghini, and be at end of the ordering");
linkedDictionary.setValue(joe, new Car("Lamborghini", "Huracan", 2015));
console.log(linkedDictionary.toString());
console.log("Contains Joe? : " + linkedDictionary.containsKey(joe));

// Printing cars in order of insertion
console.log("Printing cars in order of insertion");
linkedDictionary.values().forEach(car => {
    console.log("TypeOfCar: " + car.type);
});

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



