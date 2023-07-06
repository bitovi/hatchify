import { useState } from "react"
import type { HatchifyListPagination } from "../../../presentation"
import type { PageCountObject } from "../../../presentation"

export default function useHatchifyListPagination(): HatchifyListPagination {
  //hard coding this for right now
  const [pageCount, setPageCount] = useState<number>(10)
  //There is no ui for changing page size, just hardcoding a default of 10
  const [pagination, setPagination] = useState<PageCountObject>({
    number: 1,
    size: 2,
  })

  return {
    pageCount,
    pagination,
    setPageCount,
    setPagination,
  }
}
