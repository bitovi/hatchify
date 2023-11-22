import type { HatchifyDisplay } from "@hatchifyjs/react-ui"
import type { Meta } from "@hatchifyjs/rest-client"

export const Header: React.FC<{
  column: HatchifyDisplay
  direction: "asc" | "desc" | undefined
  meta: Meta
  setSort: (sortBy: string) => void
  sortBy?: string
}> = ({ column, direction, meta, setSort, sortBy }) =>
  column.renderHeader
    ? column.renderHeader({
        column: {
          sortable: column.sortable,
          key: column.key,
          label: column.label,
        },
        meta,
        sortBy,
        direction,
        setSort,
      })
    : column.label
