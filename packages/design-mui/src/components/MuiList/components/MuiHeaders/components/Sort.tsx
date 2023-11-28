import type { HatchifyColumn, HeaderProps } from "@hatchifyjs/react-ui"
import type { Meta } from "@hatchifyjs/rest-client"
import { Box, TableSortLabel } from "@mui/material"
import { visuallyHidden } from "@mui/utils"

export const Sort: React.FC<
  Pick<HeaderProps, "direction" | "setSort" | "sortBy"> & {
    children: React.ReactNode
    isLoading: Meta["isLoading"]
    key: HatchifyColumn["key"]
  }
> = ({ children, key, direction, isLoading, setSort, sortBy }) => (
  <TableSortLabel
    disabled={isLoading}
    active={key === sortBy}
    direction={sortBy === sortBy ? direction : "asc"}
    onClick={() => setSort(key)}
  >
    {children}
    {key === sortBy ? (
      <Box component="span" sx={visuallyHidden}>
        {direction === "desc" ? "sorted descending" : "sorted ascending"}
      </Box>
    ) : null}
  </TableSortLabel>
)

export default Sort
