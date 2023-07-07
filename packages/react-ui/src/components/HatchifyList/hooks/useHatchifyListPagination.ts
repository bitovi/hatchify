import { useState } from "react"
import type { HatchifyListPagination } from "../../../presentation"
import type { PageCountObject } from "../../../presentation"

export default function useHatchifyListPagination(): HatchifyListPagination {
  // todo: customizable pagination.size?
  // todo: (future): page number can come from query string
  const [pagination, setPagination] = useState<PageCountObject>({
    number: 1,
    size: 10,
  })

  return {
    pagination,
    setPagination,
  }
}
