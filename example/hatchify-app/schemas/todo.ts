import {
  PartialSchema,
  belongsTo,
  dateonly,
  datetime,
  enumerate,
  integer,
  string,
  text,
} from "@hatchifyjs/core"


export const Todo: PartialSchema = {
  name: "Todo",
  // namespace: "Admin",
  attributes: {
    name: string(),
    dueDate: datetime(),
    importance: integer(),
    status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
    completionDate: dateonly(),
    notes: text()
  },
  relationships: {
    user: belongsTo(),
  },
}
