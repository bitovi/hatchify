import { belongsTo, hasMany, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Todo = {
  name: "Todo",
  attributes: {
    name: string({ required: false }),
  },
  relationships: {
    user: belongsTo("User"),
  },
} satisfies PartialSchema

export const User = {
  name: "User",
  attributes: {
    name: string(),
  },
  relationships: {
    todos: hasMany("Todo"),
  },
} satisfies PartialSchema
