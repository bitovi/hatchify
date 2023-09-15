import { useState } from "react"
import type { Filters } from "@hatchifyjs/rest-client"
import type { HatchifyCollectionFilters } from "../presentation"

export default function useFilter(): HatchifyCollectionFilters {
  const [filter, setFilter] = useState<Filters>()

  return {
    filter,
    setFilter,
  }
}
