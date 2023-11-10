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
> = ({ selected, setSelected, sort, setSort, data, columns, meta }) => {
  const selectable = selected !== undefined && setSelected !== undefined
  const { direction, sortBy } = sort

  return (
    <TableHead>
      <TableRow>
        {selectable && (
          <TableCell css={styles.th}>
            <Checkbox
              disabled={meta.isLoading}
              aria-label="select all"
              checked={selected.all}
              indeterminate={Boolean(!selected.all && selected.ids.length)}
              onChange={() => {
                if (selected.ids.length) {
                  return setSelected({ all: false, ids: [] })
                }
                setSelected({ all: true, ids: data.map((item) => item.id) })
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
            {column.headerCellRender ? (
              column.sortable ? (
                <TableSortLabel
                  disabled={meta.isLoading}
                  active={column.key === sortBy}
                  direction={sortBy === sortBy ? direction : "asc"}
                  onClick={() => setSort(column.key)}
                >
                  {column.headerCellRender({
                    column: {
                      sortable: column.sortable,
                      key: column.key,
                      label: column.label,
                    },
                    meta,
                    sortBy,
                    direction,
                    setSort,
                  })}
                  {column.key === sortBy ? (
                    <Box component="span" sx={visuallyHidden}>
                      {direction === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                column.headerCellRender({
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
              )
            ) : column.sortable ? (
              <TableSortLabel
                disabled={meta.isLoading}
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
