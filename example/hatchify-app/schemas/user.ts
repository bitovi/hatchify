import { PartialSchema, hasMany, string } from "@hatchifyjs/core"

export const User = {
  name: "User",
  // namespace: "Admin",
  attributes: {
    name: string(),
  },
  relationships: {
    todos: hasMany("Todo"),
  },
} satisfies PartialSchema
