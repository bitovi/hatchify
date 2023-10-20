import {
  PartialSchema,
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
    name: string(),
    dueDate: datetime(),
    importance: integer(),
    completedDate: dateonly(),
    // status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
  },
  // relationships: {
  //   user: belongsTo("User"),
  // },
} satisfies PartialSchema
