import type { Meta } from "@hatchifyjs/rest-client"
import { Sort } from "./Sort"
import type { HatchifyColumn, HeaderProps } from "@hatchifyjs/react-ui"

export const Sortable: React.FC<
  Pick<HeaderProps, "direction" | "setSort" | "sortBy"> & {
    children: React.ReactNode
    isLoading: Meta["isLoading"]
    key: HatchifyColumn["key"]
    sortable: boolean
  }
> = ({ children, key, direction, isLoading, setSort, sortable, sortBy }) =>
  sortable ? (
    <Sort
      direction={direction}
      isLoading={isLoading}
      key={key}
      setSort={setSort}
      sortBy={sortBy}
    >
      {children}
    </Sort>
  ) : (
    <>{children}</>
  )

export default Sortable
