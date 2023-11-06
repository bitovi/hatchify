import {
  belongsTo,
  boolean,
  datetime,
  integer,
  hasMany,
  string,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    name: string({ required: true }),
    dueDate: datetime(),
    importance: integer(),
    complete: boolean({ default: false }),
  },
  relationships: {
    user: belongsTo(),
  },
}

export const User: PartialSchema = {
  name: "User",
  attributes: {
    name: string({ required: true }),
  },
  relationships: {
    todos: hasMany(),
  },
}
