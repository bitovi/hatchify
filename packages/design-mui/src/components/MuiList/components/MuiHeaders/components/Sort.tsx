import { Box, TableSortLabel } from "@mui/material"
import { visuallyHidden } from "@mui/utils"
import type { RenderHeaderProps1 } from "./interfaces"

export const Sort: React.FC<
  RenderHeaderProps1 & { children: React.ReactNode }
> = ({ children, column, direction, meta, setSort, sortBy }) => (
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

export default Sort
