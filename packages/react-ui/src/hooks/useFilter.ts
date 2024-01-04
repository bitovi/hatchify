import { useState } from "react"
import type { Filters } from "@hatchifyjs/rest-client"
import type { HatchifyCollectionFilters } from "../presentation/index.js"

export default function useFilter(): HatchifyCollectionFilters {
  const [filter, setFilter] = useState<Filters>(undefined)

  return {
    filter,
    setFilter,
  }
}
