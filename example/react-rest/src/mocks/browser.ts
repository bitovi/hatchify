// src/mocks/browser.ts
import { rest, setupWorker } from "msw"

const users = [
  { id: "1", type: "User", attributes: { name: "John" } },
  { id: "2", type: "User", attributes: { name: "Jane" } },
  { id: "3", type: "User", attributes: { name: "Jack" } },
]

const todos = [
  {
    id: "1",
    type: "Todo",
    attributes: { name: "Workout" },
    relationships: { user: { data: { id: "1", type: "User" } } },
  },
  {
    id: "2",
    type: "Todo",
    attributes: { name: "Shopping" },
    relationships: { user: { data: { id: "2", type: "User" } } },
  },
  {
    id: "3",
    type: "Todo",
    attributes: { name: "Cooking" },
    relationships: { user: { data: { id: "3", type: "User" } } },
  },
]

let id = todos.length + 1

const handlers = [
  rest.get("/api/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: todos, included: users }))
  }),
  rest.post("/api/todos", async (req, res, ctx) => {
    const json = await req.json()
    const { data } = json
    const userId = Math.floor(Math.random() * 3) + 1
    const newTodo = {
      id: (id++).toString(),
      type: "Todo",
      attributes: data.attributes,
      relationships: {
        user: { data: { id: userId.toString(), type: "User" } },
      },
    }
    todos.push(newTodo)
    return res(ctx.status(200), ctx.json({ data: newTodo }))
  }),
  rest.patch("/api/todos/:id", async (req, res, ctx) => {
    const { id } = req.params
    const { name } = await req.json()
    const index = todos.findIndex((todo) => todo.id === id)
    todos[index].attributes.name = name
    return res(ctx.status(200), ctx.json(todos[index]))
  }),
  rest.delete("/api/todos/:id", (req, res, ctx) => {
    const { id } = req.params
    const index = todos.findIndex((todo) => todo.id === id)
    todos.splice(index, 1)
    return res(ctx.status(200), ctx.json({}))
  }),
]

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)
