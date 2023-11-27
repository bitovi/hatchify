import { Sort } from "./Sort"
import type { RenderHeaderProps } from "./interfaces"

export const Sortable: React.FC<
  RenderHeaderProps & {
    children: React.ReactNode
    sortable: boolean
  }
> = ({ children, column, direction, meta, setSort, sortable, sortBy }) =>
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
