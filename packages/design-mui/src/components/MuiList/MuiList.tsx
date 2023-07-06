/** @jsxImportSource @emotion/react */
import { Suspense } from "react"
import { css } from "@emotion/react"
import {
  Box,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
  `,
  table: css`
    background-color: white;
  `,
  th: css`
    font-weight: bold;
  `,
}

export const MuiList: React.FC<XListProps> = ({
  displays,
  pagination,
  useData,
  sort,
  setPagination,
  setSort,
}) => {
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
            <MuiListRows displays={displays} useData={useData} />
          </TableBody>
        </Suspense>
      </Table>
      <TableFooter>
        <Pagination
          count={10}
          shape="rounded"
          variant="outlined"
          onChange={(ev: React.ChangeEvent<unknown>, value: number) =>
            setPagination({ ...pagination, number: value })
          }
        />
      </TableFooter>
    </TableContainer>
  )
}

export default MuiList

const MuiListRows: React.FC<
  Omit<
    XListProps,
    "setSort" | "sort" | "currentPage" | "pagination" | "setPagination"
  >
> = ({ displays, useData }) => {
  const [data, meta] = useData()
  console.log("data ", data)
  console.log("meta in list", meta)

  if (meta.isLoading) {
    return <SkeletonCells displays={displays} />
  }

  return (
    <>
      {data.map((item) => (
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
