#!/usr/bin/env node
/* istanbul ignore file */

// A script distributed with hatchifyKoa to make seeding data in the
// getting started guide trivial. To be upgraded into a more general
// schema-driven seeder at some point in the future.
import { faker } from "@faker-js/faker"
import fetch from "node-fetch"

function getRandomTodoItem(users: Array<{ id: string }>) {
  return {
    id: faker.string.uuid(),
    name: `${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()}`,
    importance: faker.number.int({ min: 0, max: 10 }),
    dueDate: faker.date.soon({ days: 10 }),
    userId: users[Math.floor(Math.random() * 10)].id,
  }
}

function getRandomUser() {
  return {
    id: faker.string.uuid(),
    name: `${faker.person.fullName()}`,
  }
}

const users = Array.from(Array(20).keys()).map(() => getRandomUser())
const todos = Array.from(Array(200).keys()).map(() => getRandomTodoItem(users))

for (const user of users) {
  await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({ data: { type: "User", attributes: user } }),
  })
}

for (const todo of todos) {
  await fetch("http://localhost:3000/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "Todo",
        attributes: todo,
        relationships: {
          user: {
            data: {
              type: "User",
              id: todo.userId,
            },
          },
        },
      },
    }),
  })
}
