import { useMemo, useState } from "react"
import type { HatchifyDataGridSort, SortObject } from "../presentation/index.js"

export default function useSort(
  defaultSort?: SortObject,
): HatchifyDataGridSort {
  const [sort, setSort] = useState<SortObject>(
    defaultSort ?? {
      alwaysSorted: false,
      direction: undefined,
      sortBy: undefined,
    },
  )

  const sortQueryString = useMemo(() => {
    if (sort.sortBy === undefined) {
      return ""
    }
    return `${sort.direction === "desc" ? "-" : ""}${sort.sortBy}`
  }, [sort.sortBy, sort.direction])

  const updateSort = (sortBy: string, alwaysSorted = sort.alwaysSorted) => {
    if (alwaysSorted && sort.direction === "desc") {
      setSort({ sortBy, direction: "asc", alwaysSorted })
    } else if (sort.sortBy === undefined || sort.sortBy !== sortBy) {
      setSort({ sortBy, direction: "asc", alwaysSorted })
    } else if (sort.direction === "asc") {
      setSort({ sortBy, direction: "desc", alwaysSorted })
    } else {
      setSort({ sortBy: undefined, direction: undefined, alwaysSorted })
    }
  }

  return { setSort: updateSort, sortQueryString, sort }
}
