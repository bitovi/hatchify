import type { HatchifyColumn, HeaderProps } from "@hatchifyjs/react-ui"
import type { Meta } from "@hatchifyjs/rest-client"
import { Box, TableSortLabel } from "@mui/material"
import { visuallyHidden } from "@mui/utils"

export const Sort: React.FC<
  Pick<HeaderProps, "direction" | "setSort" | "sortBy" | "alwaysSorted"> & {
    children: React.ReactNode
    isPending: Meta["isPending"]
    columnKey: HatchifyColumn["key"]
  }
> = ({
  alwaysSorted,
  children,
  columnKey,
  direction,
  isPending,
  setSort,
  sortBy,
}) => (
  <TableSortLabel
    // todo: @Noah - this is not a valid prop for https://mui.com/material-ui/api/table-sort-label/
    // alwaysSorted={alwaysSorted}
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
      <Box component="span" sx={visuallyHidden}>
        {direction === "desc" ? "sorted descending" : "sorted ascending"}
      </Box>
    ) : null}
  </TableSortLabel>
)

export default Sort
