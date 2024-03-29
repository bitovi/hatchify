import { useState } from "react"
import type {
  HatchifyDataGridPage,
  PageCountObject,
} from "../presentation/index.js"
import type { PaginationObject } from "@hatchifyjs/rest-client"

// todo (future): customizable pagination.size?
// todo (future): page number can come from query string
export default function usePage(
  defaultPage?: PaginationObject,
): HatchifyDataGridPage {
  const [page, setPage] = useState<PageCountObject>(
    defaultPage ?? {
      number: 1,
      size: 10,
    },
  )

  return {
    page,
    setPage,
  }
}
