// hatchify-app/schemas/todo.ts
import { PartialSchema, datetime, integer, string } from "@hatchifyjs/core"

export const Todo = {
  name: "Todo",
  attributes: {
    name: string(),
    due_date: datetime(),
    importance: integer(),
  },
} satisfies PartialSchema
