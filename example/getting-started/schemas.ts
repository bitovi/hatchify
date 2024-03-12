import {
  belongsTo,
  boolean,
  dateonly,
  integer,
  hasMany,
  string,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Todo = {
  name: "Todo",
  attributes: {
    name: string({ required: true }),
    dueDate: dateonly(),
    importance: integer(),
    complete: boolean({ default: false }),
  },
  relationships: {
    user: belongsTo("User"),
  },
} satisfies PartialSchema

export const User = {
  name: "User",
  attributes: {
    name: string({ required: true }),
  },
  relationships: {
    todos: hasMany("Todo"),
  },
} satisfies PartialSchema
