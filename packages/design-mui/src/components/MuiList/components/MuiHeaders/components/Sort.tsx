import type { HatchifyColumn, HeaderProps } from "@hatchifyjs/react-ui"
import type { Meta } from "@hatchifyjs/rest-client"
import { Box, TableSortLabel } from "@mui/material"

export const Sort: React.FC<
  Pick<HeaderProps, "direction" | "setSort" | "sortBy"> & {
    children: React.ReactNode
    isPending: Meta["isPending"]
    columnKey: HatchifyColumn["key"]
  }
> = ({ children, columnKey, direction, isPending, setSort, sortBy }) => (
  <TableSortLabel
    disabled={isPending}
    active={columnKey === sortBy}
    direction={sortBy === sortBy ? direction : "asc"}
    onClick={() => setSort(columnKey)}
    sx={{
      display: "flex",
    }}
  >
    {children}
    {columnKey === sortBy ? (
      <Box component="span">
        {direction === "desc" ? "sorted descending" : "sorted ascending"}
      </Box>
    ) : null}
  </TableSortLabel>
)

export default Sort
