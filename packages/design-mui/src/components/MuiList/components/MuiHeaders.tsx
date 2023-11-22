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
import type { Meta } from "@hatchifyjs/rest-client"

const styles = {
  th: css`
    font-weight: bold;
  `,
}

const Sortable: React.FC<{
  children: React.ReactNode
  column: HatchifyDisplay
  direction: "asc" | "desc" | undefined
  meta: Meta
  setSort: (sortBy: string) => void
  sortable: boolean
  sortBy?: string
}> = ({ children, column, direction, meta, setSort, sortable, sortBy }) =>
  sortable ? (
    <Sort
      column={column}
      direction={direction}
      meta={meta}
      setSort={setSort}
      sortBy={sortBy}
    >
      {children}
    </Sort>
  ) : (
    children
  )

const Sort: React.FC<{
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

const Header: React.FC<{
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
            <Sortable
              column={column}
              direction={direction}
              meta={meta}
              setSort={setSort}
              sortable={column.sortable}
              sortBy={sortBy}
            >
              <Header
                column={column}
                direction={direction}
                meta={meta}
                setSort={setSort}
                sortBy={sortBy}
              />
            </Sortable>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default MuiHeaders
