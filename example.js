class Person {
    constructor (name,lastName,age,gender) {
        this.name = name;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender;
    }

}

class Male extends Person {
    constructor (name,lastName,age,gender) {
        this.name = name;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender
    }
}

const Txa = new Male ("Hovsep","Babayan",23,)