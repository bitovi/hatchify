import { useState } from "react"
import type { HatchifyCollectionPage, PageCountObject } from "../presentation"

// todo (future): customizable pagination.size?
// todo (future): page number can come from query string
export default function usePage(): HatchifyCollectionPage {
  const [page, setPage] = useState<PageCountObject>({
    number: 1,
    size: 10,
  })

  return {
    page,
    setPage,
  }
}
