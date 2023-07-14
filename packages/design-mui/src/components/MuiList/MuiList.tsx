/** @jsxImportSource @emotion/react */
import { Suspense } from "react"
import { css } from "@emotion/react"
import {
  Box,
  Checkbox,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableSortLabel,
} from "@mui/material"
import { visuallyHidden } from "@mui/utils"
import type { XListProps } from "@hatchifyjs/react-ui"

const styles = {
  tableContainer: css`
    padding: 15px;
    box-sizing: border-box;
  `,
  table: css`
    background-color: white;
  `,
  th: css`
    font-weight: bold;
  `,
  pagination: css`
    margin-top: 5px;
    ul {
      justify-content: flex-end;
    }
  `,
}

export const MuiList: React.FC<XListProps> = ({
  displays,
  emptyList,
  pagination,
  useData,
  sort,
  setPagination,
  setSort,
  selected,
  setSelected,
}) => {
  const [, meta] = useData()
  const { direction, sortBy } = sort
  const allRowsSelected =
    selected === true ||
    Object.keys(selected).length === meta.meta?.unpaginatedCount

  return (
    <TableContainer css={styles.tableContainer}>
      <Table css={styles.table}>
        <Suspense>
          <TableHead>
            <TableRow>
              <TableCell css={styles.th}>
                <Checkbox
                  aria-label="select all"
                  checked={allRowsSelected}
                  indeterminate={
                    !allRowsSelected && Object.keys(selected).length > 0
                  }
                  onChange={() => {
                    if (selected === true || Object.keys(selected).length > 0)
                      setSelected({})
                    else setSelected(true)
                  }}
                />
              </TableCell>
              {displays.map((display) => (
                <TableCell
                  key={display.key}
                  css={styles.th}
                  sortDirection={display.key === sortBy ? direction : false}
                >
                  <TableSortLabel
                    active={display.key === sortBy}
                    direction={sortBy === sortBy ? direction : "asc"}
                    onClick={() => setSort(display.key)}
                  >
                    {display.label}
                    {display.key === sortBy ? (
                      <Box component="span" sx={visuallyHidden}>
                        {direction === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <MuiListRows
              displays={displays}
              useData={useData}
              selected={selected}
              setSelected={setSelected}
              emptyList={emptyList}
            />
          </TableBody>
        </Suspense>
      </Table>
      <Pagination
        disabled={meta?.isLoading}
        css={styles.pagination}
        count={
          meta?.meta?.unpaginatedCount
            ? Math.ceil(meta.meta.unpaginatedCount / pagination.size)
            : 1
        }
        shape="rounded"
        variant="outlined"
        onChange={(ev: React.ChangeEvent<unknown>, value: number) =>
          setPagination({ ...pagination, number: value })
        }
      />
    </TableContainer>
  )
}

export default MuiList

type MuiListRowsProps = Omit<
  XListProps,
  "setSort" | "sort" | "currentPage" | "pagination" | "setPagination"
>

const MuiListRows: React.FC<MuiListRowsProps> = ({
  displays,
  useData,
  selected,
  setSelected,
  emptyList: EmptyList,
}) => {
  const [data, meta] = useData()

  if (meta.isLoading) {
    return <SkeletonCells displays={displays} />
  }

  function onRowSelect(id: string) {
    if (selected === true) {
      // if all rows are selected (true), select only visible rows
      // and deselect the one that was clicked
      const updated = Object.values(data).reduce((acc, item) => {
        acc[item.id] = true
        return acc
      }, {} as Record<string, true>)

      delete updated[id]
      setSelected(updated)
    } else {
      // othwerise, toggle the row that was clicked
      const copy = { ...selected }
      if (copy[id]) delete copy[id]
      else copy[id] = true
      setSelected(copy)
    }
  }

  return (
    <>
      {data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={displays.length + 1} align="center">
            <EmptyList />
          </TableCell>
        </TableRow>
      ) : (
        data.map((item) => {
          return (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  aria-label={`select ${item.id}`}
                  checked={
                    selected === true || selected[item.id] ? true : false
                  }
                  onChange={() => onRowSelect(item.id)}
                />
              </TableCell>
              {displays.map((display) => (
                <TableCell key={`${item.id}-${display.key}`}>
                  {display.render({
                    record: item,
                  })}
                </TableCell>
              ))}
            </TableRow>
          )
        })
      )}
    </>
  )
}

type SkeletonCellsProps = Omit<
  XListProps,
  | "useData"
  | "sort"
  | "setSort"
  | "pagination"
  | "setPagination"
  | "selected"
  | "setSelected"
  | "emptyList"
>

const SkeletonCells = ({ displays }: SkeletonCellsProps) => {
  return (
    <>
      {[1, 2, 3].map((key) => (
        <TableRow key={key}>
          {displays.map((display) => (
            <TableCell key={display.label}>
              <Skeleton variant="rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
