import {
  PartialSchema,
  belongsTo,
  datetime,
  enumerate,
  integer,
  string,
} from "@hatchifyjs/core"

export const Todo: PartialSchema = {
  name: "Todo",
  // namespace: "Admin",
  attributes: {
    name: string(),
    dueDate: datetime(),
    importance: integer(),
    status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
  },
  relationships: {
    user: belongsTo(),
  },
}
