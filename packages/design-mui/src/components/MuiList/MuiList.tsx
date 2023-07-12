/** @jsxImportSource @emotion/react */
import { Suspense, useEffect, useState } from "react"
import { css } from "@emotion/react"
import {
  Box,
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
}) => {
  const [meta, setMeta] = useState<Record<string, any>>({}) // todo: type
  const { direction, sortBy } = sort

  return (
    <TableContainer css={styles.tableContainer}>
      <Table css={styles.table}>
        <Suspense>
          <TableHead>
            <TableRow>
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
> & {
  setMeta: (meta: any) => void
}

const MuiListRows: React.FC<MuiListRowsProps> = ({
  displays,
  useData,
  setMeta,
  emptyList: EmptyList,
}) => {
  const [data, meta] = useData()
  const stringifiedMeta = JSON.stringify(meta)

  useEffect(() => {
    setMeta(meta)
  }, [setMeta, stringifiedMeta])

  if (meta.isLoading) {
    return <SkeletonCells displays={displays} />
  }

  return (
    <>
      {data.length === 0 && <EmptyList />}
      {data.length > 0 &&
        data.map((item) => (
          <TableRow key={item.id}>
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
  "useData" | "sort" | "setSort" | "pagination" | "setPagination"
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
