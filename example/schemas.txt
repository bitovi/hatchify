import {
  PartialSchema,
  belongsTo,
  dateonly,
  datetime,
  enumerate,
  hasMany,
  integer,
  string,
  text,
} from "@hatchifyjs/core"

export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    name: string(),
    dueDate: datetime(),
    importance: integer(),
    status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
    completionDate: dateonly(),
    notes: text(),
  },
  relationships: {
    user: belongsTo("User"),
  },
} satisfies PartialSchema

export const User: PartialSchema = {
  name: "User",
  attributes: {
    name: string(),
  },
  relationships: {
    todos: hasMany(),
  },
} satisfies PartialSchema
