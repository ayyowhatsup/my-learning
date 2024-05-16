// Sử dụng class hoặc Object trong ES6 để làm đẹp lại đoạn code sau
var name = "John";
var age = 30;

function displayUser() {
  console.log(name + " is " + age + " years old.");
}

function updateUser(newName, newAge) {
  name = newName;
  age = newAge;
}

displayUser();
updateUser("Jane", 25);
displayUser();

// ================================================================
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  display() {
    console.log(`${this.name} is ${this.age} years old.`);
  }

  update(newName, newAge) {
    this.name = newName;
    this.age = newAge;
  }
}

const user = new User("John", 30);
user.display();
user.update("Jane", 25);
user.display();
