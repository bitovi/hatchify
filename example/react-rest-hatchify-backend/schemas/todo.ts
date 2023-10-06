import { belongsTo, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    name: string({ required: false }),
  },
  relationships: {
    user: belongsTo(),
  },
}
