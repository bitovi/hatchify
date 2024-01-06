import { useState } from "react"
import type { Filters } from "@hatchifyjs/rest-client"
import type { HatchifyDataGridFilters } from "../presentation/index.js"

export default function useFilter(): HatchifyDataGridFilters {
  const [filter, setFilter] = useState<Filters>(undefined)

  return {
    filter,
    setFilter,
  }
}
