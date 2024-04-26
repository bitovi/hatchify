import type { Meta } from "@hatchifyjs/rest-client"
import { Sort } from "./Sort.js"
import type { HatchifyColumn, HeaderProps } from "@hatchifyjs/react-ui"

export const Sortable: React.FC<
  Pick<HeaderProps, "direction" | "setSort" | "sortBy"> & {
    children: React.ReactNode
    isPending: Meta["isPending"]
    columnKey: HatchifyColumn["key"]
    sortable: boolean
  }
> = ({
  children,
  columnKey,
  direction,
  isPending,
  setSort,
  sortable,
  sortBy,
}) =>
  sortable ? (
    <Sort
      direction={direction}
      isPending={isPending}
      columnKey={columnKey}
      setSort={setSort}
      sortBy={sortBy}
    >
      {children}
    </Sort>
  ) : (
    <>{children}</>
  )

export default Sortable
