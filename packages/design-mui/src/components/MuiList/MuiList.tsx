/** @jsxImportSource @emotion/react */
import { Suspense } from "react"
import { css } from "@emotion/react"
import {
  Box,
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
  useData,
  changeSort,
  sort,
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
                    onClick={() =>
                      changeSort({
                        direction:
                          display.key === sortBy ? direction : undefined,
                        sortBy: display.key,
                      })
                    }
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
    </TableContainer>
  )
}

export default MuiList

const MuiListRows: React.FC<Omit<XListProps, "changeSort" | "sort">> = ({
  displays,
  useData,
}) => {
  const [data, meta] = useData()

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

type SkeletonCellsProps = Omit<XListProps, "useData" | "sort" | "changeSort">

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
