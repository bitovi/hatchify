/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { visuallyHidden } from "@mui/utils"
import {
  Box,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material"
import type { HatchifyDisplay, XCollectionProps } from "@hatchifyjs/react-ui"

const styles = {
  th: css`
    font-weight: bold;
  `,
}

export const MuiHeaders: React.FC<
  XCollectionProps & { columns: HatchifyDisplay[] }
> = ({ selected, setSelected, sort, setSort, data, columns }) => {
  const selectable = selected !== undefined && setSelected !== undefined
  const { direction, sortBy } = sort

  return (
    <TableHead>
      <TableRow>
        {selectable && (
          <TableCell css={styles.th}>
            <Checkbox
              aria-label="select all"
              checked={
                data.length > 0 && Object.keys(selected).length === data.length
              }
              indeterminate={
                data.length > 0 &&
                Object.keys(selected).length > 0 &&
                Object.keys(selected).length < data.length
              }
              onChange={() => {
                if (Object.keys(selected).length > 0) setSelected([])
                else setSelected(data.map((item) => item.id))
              }}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            key={column.key}
            css={styles.th}
            sortDirection={column.key === sortBy ? direction : false}
          >
            {column.sortable ? (
              <TableSortLabel
                active={column.key === sortBy}
                direction={sortBy === sortBy ? direction : "asc"}
                onClick={() => setSort(column.key)}
              >
                {column.label}
                {column.key === sortBy ? (
                  <Box component="span" sx={visuallyHidden}>
                    {direction === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default MuiHeaders
