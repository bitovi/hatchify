import {
  PartialSchema,
  hasMany,
  string,
  belongsTo,
  dateonly,
  datetime,
  integer,
  uuid,
  // enumerate,
} from "@hatchifyjs/core"

const schemas = {
  User: {
    name: "User",
    attributes: {
      name: string(),
    },
    relationships: {
      todos: hasMany("Todo"),
    },
  },
  Todo: {
    name: "Todo",
    attributes: {
      title: string(),
      dueDate: datetime(),
      importance: integer(),
      completedDate: dateonly(),
      uuid: uuid(),
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
