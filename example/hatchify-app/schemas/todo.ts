// hatchify-app/schemas/todo.ts

export const Admin_Todo = {
  name: "Todo",
  namespace: "Admin",
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
  belongsTo: [{ target: "Admin_User", options: { as: "user" } }],
}
