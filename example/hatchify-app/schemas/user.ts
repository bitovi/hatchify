// hatchify-app/schemas/user.ts

export const Admin_User = {
  name: "User",
  namespace: "Admin",
  attributes: {
    name: "STRING",
  },
  hasMany: [{ target: "Admin_Todo", options: { as: "todos" } }],
}
