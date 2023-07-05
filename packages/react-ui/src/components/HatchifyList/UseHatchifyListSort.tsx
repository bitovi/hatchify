import { useEffect, useState } from "react"
import type { HatchifyListSort, SortObject } from "../../presentation"

export function useHatchifyListSort(): HatchifyListSort {
  const [sort, setSort] = useState<SortObject>({
    direction: undefined,
    sortBy: false,
  })
  const [sortQueryString, setSortQueryString] = useState<string>("")

  const changeSort = (update: SortObject) => {
    const { direction, sortBy } = update
    let newSort: SortObject = {
      direction: "asc",
      sortBy,
    }
    if (direction === "asc") {
      newSort = {
        direction: "desc",
        sortBy,
      }
    } else if (direction === "desc") {
      newSort = {
        direction: undefined,
        sortBy: false,
      }
    }
    setSort({ ...newSort })
  }

  useEffect(() => {
    const formatQueryString = () => {
      let sortString = ""
      if (sort.direction === "desc") {
        sortString = "-"
      }
      if (sort.sortBy !== false) {
        sortString += sort.sortBy
      }
      return sortString
    }
    setSortQueryString(formatQueryString())
  }, [sort])

  return { changeSort, sortQueryString, sort }
}
