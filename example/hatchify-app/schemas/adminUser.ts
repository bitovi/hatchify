export const AdminUser = {
  name: "User",
  namespace: "Admin",
  attributes: {
    name: "STRING",
  },
  hasMany: [
    { target: "Todo", options: { as: "todos", foreignKey: "adminUserId" } },
  ],
}
