import { hasMany, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const User = {
  name: "User",
  attributes: {
    name: string(),
  },
  relationships: {
    todos: hasMany("Todo"),
  },
} satisfies PartialSchema
