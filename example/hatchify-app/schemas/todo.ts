import {
  PartialSchema,
  belongsTo,
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
    // status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
  },
  relationships: {
    user: belongsTo(),
  },
} satisfies PartialSchema
