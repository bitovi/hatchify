// src/mocks/browser.ts
import { rest, setupWorker } from "msw"

const todos = [
  { id: "1", type: "Todo", attributes: { name: "Workout" } },
  { id: "2", type: "Todo", attributes: { name: "Shopping" } },
  { id: "3", type: "Todo", attributes: { name: "Cooking" } },
]

const handlers = [
  rest.get("/api/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: todos }))
  }),
  rest.post("/api/todos", async (req, res, ctx) => {
    const json = await req.json()
    const { data } = json
    const newTodo = {
      id: (todos.length + 1).toString(),
      type: "Todo",
      attributes: data.attributes,
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
