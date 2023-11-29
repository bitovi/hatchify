import type { HatchifyColumn, HeaderProps } from "@hatchifyjs/react-ui"
import type { Meta } from "@hatchifyjs/rest-client"
import { Box, TableSortLabel } from "@mui/material"
import { visuallyHidden } from "@mui/utils"

export const Sort: React.FC<
  Pick<HeaderProps, "direction" | "setSort" | "sortBy"> & {
    children: React.ReactNode
    isLoading: Meta["isLoading"]
    columnKey: HatchifyColumn["key"]
  }
> = ({ children, columnKey, direction, isLoading, setSort, sortBy }) => (
  <TableSortLabel
    disabled={isLoading}
    active={columnKey === sortBy}
    direction={sortBy === sortBy ? direction : "asc"}
    onClick={() => setSort(columnKey)}
  >
    {children}
    {columnKey === sortBy ? (
      <Box component="span" sx={visuallyHidden}>
        {direction === "desc" ? "sorted descending" : "sorted ascending"}
      </Box>
    ) : null}
  </TableSortLabel>
)

export default Sort
