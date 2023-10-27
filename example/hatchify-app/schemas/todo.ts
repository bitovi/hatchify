import {
  PartialSchema,
  belongsTo,
  dateonly,
  datetime,
  // enumerate,
  integer,
  string,
  text,
} from "@hatchifyjs/core"

export const Todo = {
  name: "Todo",
  // namespace: "Admin",
  attributes: {
    title: string(),
    dueDate: datetime(),
    importance: integer(),
    // status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
    completionDate: dateonly(),
    notes: text(),
  },
  relationships: {
    user: belongsTo("User"),
  },
} satisfies PartialSchema
