import { Sort } from "./Sort"
import type { HeaderProps } from "@hatchifyjs/react-ui"

export const Sortable: React.FC<
  HeaderProps & {
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

export default Sortable
