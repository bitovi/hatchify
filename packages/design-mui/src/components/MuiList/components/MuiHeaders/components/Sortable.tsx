import type { Meta } from "@hatchifyjs/rest-client"
import { Sort } from "./Sort"
import type { HatchifyColumn, HeaderProps } from "@hatchifyjs/react-ui"

export const Sortable: React.FC<
  Pick<HeaderProps, "direction" | "setSort" | "sortBy"> & {
    children: React.ReactNode
    isLoading: Meta["isLoading"]
    columnKey: HatchifyColumn["key"]
    sortable: boolean
  }
> = ({
  children,
  columnKey,
  direction,
  isLoading,
  setSort,
  sortable,
  sortBy,
}) =>
  sortable ? (
    <Sort
      direction={direction}
      isLoading={isLoading}
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
