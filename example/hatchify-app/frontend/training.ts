
type Animals = {
    legs: number
}

type Person = {
    name: string
    age: number
  }
  
  type AnimalTrainer = {
    level: "rookie" | "intermediate" | "advanced"
    animals: Array<Animals>
  }

/** 
* {
*   name: string; 
*   age: number; 
*   level: "rookie" | "intermediate" | "advanced"; 
*   animals: Array<Animals>;
* }
*/

type DinosaurCareTaker = {
       name: string; 
       age: number; 
       level: "rookie" | "intermediate" | "advanced"; 
       animals: Array<Animals>;
     }







  const pets2: Person
const pets: DinosaurCareTaker

lightMagic