/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Checkbox, TableCell, TableHead, TableRow } from "@mui/material"
import type { HatchifyColumn, XCollectionProps } from "@hatchifyjs/react-ui"
import { Sortable } from "./components"

const styles = {
  th: css`
    font-weight: bold;
  `,
}

export const MuiHeaders: React.FC<
  XCollectionProps & { columns: HatchifyColumn[] }
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
            css={column.isHeaderOverridden ? "" : styles.th}
            sortDirection={column.key === sortBy ? direction : false}
          >
            <Sortable
              direction={direction}
              isLoading={meta.isLoading}
              key={column.key}
              setSort={setSort}
              sortable={column.sortable}
              sortBy={sortBy}
            >
              {column.renderHeader({
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
            </Sortable>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default MuiHeaders
