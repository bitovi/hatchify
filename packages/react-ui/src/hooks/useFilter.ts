import { useState } from "react"
import type { Filter } from "@hatchifyjs/rest-client/dist/services"
import type { HatchifyCollectionFilter } from "../presentation"

export default function useFilter(): HatchifyCollectionFilter {
  const [filter, setFilter] = useState<Filter>(undefined)

  return {
    filter,
    setFilter,
  }
}
