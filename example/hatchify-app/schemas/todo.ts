// hatchify-app/schemas/todo.ts

export const Todo = {
  name: "Todo",
  attributes: {
    name: { type: "STRING", allowNull: true },
    dueDate: { type: "DATE", allowNull: true },
    importance: { type: "INTEGER", allowNull: true },
    status: {
      type: "ENUM",
      allowNull: true,
      values: ["Pending", "Failed", "Completed"],
    },
  },
  belongsTo: [{ target: "User", options: { as: "user" } }],
}
