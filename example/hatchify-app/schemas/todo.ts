// hatchify-app/schemas/todo.ts

export const Todo = {
  name: "Todo",
  attributes: {
    name: { type: "STRING", allowNull: true },
    due_date: { type: "DATE", allowNull: true }, // camelCase, not snake_case
    importance: { type: "INTEGER", allowNull: true },
    status: {
      type: "ENUM",
      allowNull: true,
      values: ["Pending", "Failed", "Completed"],
    },
  },
  belongsTo: [
    {
      target: "Admin.User",
      options: {
        as: "adminUser",
        foreignKey: "adminUserId",
      },
    },
    { target: "User", options: { as: "user", foreignKey: "userId" } },
  ],
}
