import type { Meta } from "@hatchifyjs/rest-client"
import type { HatchifyDisplay } from "@hatchifyjs/react-ui"
import { Sort } from "./Sort"

export const Sortable: React.FC<{
  children: React.ReactNode
  column: HatchifyDisplay
  direction: "asc" | "desc" | undefined
  meta: Meta
  setSort: (sortBy: string) => void
  sortable: boolean
  sortBy?: string
}> = ({ children, column, direction, meta, setSort, sortable, sortBy }) =>
  sortable ? (
    <Sort
      column={column}
      direction={direction}
      meta={meta}
      setSort={setSort}
      sortBy={sortBy}
    >
      {children}
    </Sort>
  ) : (
    children
  )
