/** @jsxImportSource @emotion/react */
import { Suspense, useEffect, useState } from "react"
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
  pagination,
  useData,
  sort,
  setPagination,
  setSort,
  checked,
  toggleChecked,
  setChecked,
  clearChecked,
}) => {
  const [meta, setMeta] = useState<Record<string, any>>({}) // todo: type
  const [data, setData] = useState<any>([]) // todo: type
  const { direction, sortBy } = sort

  const checkAll = () => {
    if (checked.length === 0) {
      setChecked(data.map((d: any) => d.id))
    } else {
      clearChecked()
    }
  }

  return (
    <TableContainer css={styles.tableContainer}>
      <Table css={styles.table}>
        <Suspense>
          <TableHead>
            <TableRow>
              <TableCell css={styles.th}>
                <Checkbox
                  aria-label="check all"
                  checked={checked.length !== 0}
                  indeterminate={
                    checked.length &&
                    checked.length !== meta.meta?.unpaginatedCount
                      ? true
                      : false
                  }
                  onChange={checkAll}
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
              setMeta={setMeta}
              checked={checked}
              toggleChecked={toggleChecked}
              clearChecked={clearChecked}
              setChecked={setChecked}
              setData={setData}
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
> & {
  setMeta: (meta: any) => void
  setData: (data: any) => void
}

const MuiListRows: React.FC<MuiListRowsProps> = ({
  displays,
  useData,
  setMeta,
  setData,
  checked,
  toggleChecked,
}) => {
  const [data, meta] = useData()
  const stringifiedMeta = JSON.stringify(meta)
  const stringifiedData = JSON.stringify(data)

  useEffect(() => {
    setMeta(meta)
  }, [setMeta, stringifiedMeta])

  useEffect(() => {
    setData(data)
  }, [setData, stringifiedData])

  if (meta.isLoading) {
    return <SkeletonCells displays={displays} />
  }

  return (
    <>
      {data.map((item) => (
        <TableRow key={item.id}>
          <TableCell>
            <Checkbox
              aria-label={`check ${item.id}`}
              checked={checked.includes(item.id)}
              onChange={(ev) => {
                console.log("ev.target.checked", ev.target.checked)
                toggleChecked(item.id)
              }}
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
      ))}
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
  | "checked"
  | "toggleChecked"
  | "clearChecked"
  | "setChecked"
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
