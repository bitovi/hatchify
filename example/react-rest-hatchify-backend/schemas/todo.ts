export const Todo = {
  name: "Todo",
  attributes: {
    name: { type: "STRING", allowNull: true },
  },
  belongsTo: [{ target: "User", options: { as: "user" } }],
}
