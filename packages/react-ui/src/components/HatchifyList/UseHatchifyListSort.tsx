import { useMemo, useState } from "react"
import type { HatchifyListSort, SortObject } from "../../presentation"

export function useHatchifyListSort(): HatchifyListSort {
  const [sort, setSort] = useState<SortObject>({
    direction: undefined,
    sortBy: undefined,
  })

  const sortQueryString = useMemo(() => {
    if (sort.sortBy === undefined) return ""
    return `${sort.direction === "desc" ? "-" : ""}${sort.sortBy}`
  }, [sort.sortBy, sort.direction])

  const updateSort = (sortBy: string) => {
    if (sort.sortBy === undefined || sort.sortBy !== sortBy) {
      setSort({ sortBy, direction: "asc" })
    } else if (sort.direction === "asc") {
      setSort({ sortBy, direction: "desc" })
    } else {
      setSort({ sortBy: undefined, direction: undefined })
    }
  }

  return { setSort: updateSort, sortQueryString, sort }
}
