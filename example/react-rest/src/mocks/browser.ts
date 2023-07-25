// src/mocks/browser.ts
import { rest, setupWorker } from "msw"

const users = [
  { id: "user-1", type: "User", attributes: { name: "John" } },
  { id: "user-2", type: "User", attributes: { name: "Jane" } },
  { id: "user-3", type: "User", attributes: { name: "Jack" } },
]

const todos = [
  {
    id: "todo-1",
    type: "Todo",
    attributes: { name: "Workout" },
    relationships: { user: { data: { id: "user-1", type: "User" } } },
  },
  {
    id: "todo-2",
    type: "Todo",
    attributes: { name: "Shopping" },
    relationships: { user: { data: { id: "user-2", type: "User" } } },
  },
  {
    id: "todo-3",
    type: "Todo",
    attributes: { name: "Cooking" },
    relationships: { user: { data: { id: "user-3", type: "User" } } },
  },
]

let id = todos.length + 1

const handlers = [
  rest.get("/api/todos", (req, res, ctx) => {
    if (req.url.searchParams.get("include") === "user") {
      return res(ctx.status(200), ctx.json({ data: todos, included: users }))
    }
    return res(ctx.status(200), ctx.json({ data: todos }))
  }),
  rest.post("/api/todos", async (req, res, ctx) => {
    const json = await req.json()
    const { data } = json
    const newTodo = {
      id: `todo-${id++}`,
      type: "Todo",
      attributes: data.attributes,
      relationships: {
        user: { data: { id: data.relationships.user.id, type: "User" } },
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
  rest.get("/api/users", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: users }))
  }),
]

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)
