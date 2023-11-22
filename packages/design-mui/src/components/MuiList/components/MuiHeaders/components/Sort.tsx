import type { HatchifyDisplay } from "@hatchifyjs/react-ui"
import type { Meta } from "@hatchifyjs/rest-client"
import { Box, TableSortLabel } from "@mui/material"
import { visuallyHidden } from "@mui/utils"

export const Sort: React.FC<{
  children: React.ReactNode
  column: HatchifyDisplay
  direction: "asc" | "desc" | undefined
  meta: Meta
  setSort: (sortBy: string) => void
  sortBy?: string
}> = ({ children, column, direction, meta, setSort, sortBy }) => (
  <TableSortLabel
    disabled={meta.isLoading}
    active={column.key === sortBy}
    direction={sortBy === sortBy ? direction : "asc"}
    onClick={() => setSort(column.key)}
  >
    {children}
    {column.key === sortBy ? (
      <Box component="span" sx={visuallyHidden}>
        {direction === "desc" ? "sorted descending" : "sorted ascending"}
      </Box>
    ) : null}
  </TableSortLabel>
)
