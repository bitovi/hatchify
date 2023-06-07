// hatchify-app/schemas/user.ts
// import type { Schema } from "@hatchifyjs/react";

export const User = {
  name: "User",
  attributes: {
    name: "STRING",
  },
  hasMany: [{ target: "Todo", options: { as: "todos" } }],
};