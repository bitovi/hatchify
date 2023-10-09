import { PartialSchema, hasMany, string } from "@hatchifyjs/core"

export const User: PartialSchema = {
  name: "User",
  attributes: {
    name: string(),
  },
  relationships: {
    todos: hasMany(),
  },
}
