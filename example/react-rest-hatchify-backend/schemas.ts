import { belongsTo, hasMany, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    name: string({ required: false }),
  },
  relationships: {
    user: belongsTo("User"),
  },
}

export const User: PartialSchema = {
  name: "User",
  attributes: {
    name: string(),
  },
  relationships: {
    todos: hasMany("Todo"),
  },
}
