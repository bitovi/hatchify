import {
  PartialSchema,
  belongsTo,
  // belongsTo,
  dateonly,
  datetime,
  // enumerate,
  integer,
  string,
} from "@hatchifyjs/core"

export const Todo = {
  name: "Todo",
  // namespace: "Admin",
  attributes: {
    title: string(),
    dueDate: datetime(),
    importance: integer(),
    completedDate: dateonly(),
    // status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
  },
  relationships: {
    user: belongsTo("User"),
  },
} satisfies PartialSchema
