import { useState } from "react"
import type { Filter } from "@hatchifyjs/rest-client"
import type { HatchifyCollectionFilter } from "../presentation"

export default function useFilter(): HatchifyCollectionFilter {
  const [filter, setFilter] = useState<Filter>(undefined)

  return {
    filter,
    setFilter,
  }
}
