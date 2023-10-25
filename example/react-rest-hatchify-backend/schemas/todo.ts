import { belongsTo, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Todo = {
  name: "Todo",
  attributes: {
    name: string({ required: false }),
  },
  relationships: {
    user: belongsTo("User"),
  },
} satisfies PartialSchema
