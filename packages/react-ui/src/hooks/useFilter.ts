import { useState } from "react"
import type { Filters } from "@hatchifyjs/rest-client"
import type { HatchifyCollectionFilters } from "../presentation"

export default function useFilter(
  defaultFilter?: Filters,
): HatchifyCollectionFilters {
  const [filter, setFilter] = useState<Filters>(defaultFilter) // I assume we allow falsy-but-not-nullish values here?

  return {
    filter,
    setFilter,
  }
}
