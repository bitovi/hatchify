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
  selectable,
  selected,
  setSelected,
}) => {
  const [data, meta] = useData()
  const { direction, sortBy } = sort

  return (
    <TableContainer css={styles.tableContainer}>
      <Table css={styles.table}>
        <Suspense>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell css={styles.th}>
                  <Checkbox
                    aria-label="select all"
                    checked={
                      data.length > 0 &&
                      Object.keys(selected).length === data.length
                    }
                    indeterminate={
                      data.length > 0 &&
                      Object.keys(selected).length > 0 &&
                      Object.keys(selected).length < data.length
                    }
                    onChange={() => {
                      if (Object.keys(selected).length > 0) setSelected({})
                      else
                        setSelected(
                          data.reduce(
                            (acc, next) => ({
                              ...acc,
                              [next.id]: true,
                            }),
                            {} as Record<string, true>,
                          ),
                        )
                    }}
                  />
                </TableCell>
              )}
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
              selectable={selectable}
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
  selectable,
  selected,
  setSelected,
  emptyList: EmptyList,
}) => {
  const [data, meta] = useData()

  if (meta.isLoading) {
    return <SkeletonCells displays={displays} />
  }

  function onRowSelect(id: string) {
    // toggle the row that was clicked
    const copy = { ...selected }
    if (copy[id]) delete copy[id]
    else copy[id] = true
    setSelected(copy)
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
              {selectable && (
                <TableCell>
                  <Checkbox
                    aria-label={`select ${item.id}`}
                    checked={selected[item.id] ? true : false}
                    onChange={() => onRowSelect(item.id)}
                  />
                </TableCell>
              )}
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
  | "selectable"
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
