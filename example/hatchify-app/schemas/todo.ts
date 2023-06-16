// hatchify-app/schemas/todo.ts

export const Todo = {
  name: "Todo",
  attributes: {
    name: "STRING",
    due_date: "DATE",
    importance: "INTEGER",
  },
  belongsTo: [{ target: "User", options: { as: "user" } }],
}
