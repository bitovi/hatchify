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
  Test_User: {
    name: "User",
    namespace: "Test",
    attributes: {
      name: string(),
    },
    relationships: {
      todos: hasMany("Admin_Todo"),
    },
  },
  Admin_Todo: {
    name: "Todo",
    namespace: "Admin",
    attributes: {
      title: string(),
      dueDate: datetime(),
      importance: integer(),
      completedDate: dateonly(),
      // status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
    },
    relationships: {
      user: belongsTo("Test_User"),
      tags: hasMany("Tag"),
    },
  },
  Tag: {
    name: "Tag",
    attributes: {
      label: string(),
    },
    relationships: {
      todos: hasMany("Admin_Todo"),
    },
  },
} satisfies Record<string, PartialSchema>

export default schemas
