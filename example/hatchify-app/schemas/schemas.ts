import {
  PartialSchema,
  hasMany,
  string,
  belongsTo,
  dateonly,
  datetime,
  integer,
  // enumerate,
} from "@hatchifyjs/core"

const schemas = {
  User: {
    name: "User",
    // namespace: "Admin",
    attributes: {
      name: string(),
    },
    relationships: {
      todos: hasMany("Todo"),
    },
  },
  Todo: {
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
      owner: belongsTo("User"),
      user: belongsTo("User"),
      tags: hasMany("Tag"),
    },
  },
  Tag: {
    name: "Tag",
    attributes: {
      label: string(),
    },
    relationships: {
      todos: hasMany("Todo"),
    },
  },
} satisfies Record<string, PartialSchema>

export default schemas
