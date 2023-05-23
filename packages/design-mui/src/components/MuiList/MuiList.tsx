/** @jsxImportSource @emotion/react */
import { Suspense } from "react"
import { css } from "@emotion/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material"

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

export const MuiList: React.FC<XListProps> = ({ displays, useData }) => {
  return (
    <TableContainer css={styles.tableContainer}>
      <Table css={styles.table}>
        <Suspense>
          <TableHead>
            <TableRow>
              {displays.map((display) => (
                <TableCell key={display.label} css={styles.th}>
                  {display.label}
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

const MuiListRows: React.FC<XListProps> = ({ displays, useData }) => {
  const data = useData()

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

// type SkeletonCellsProps = Omit<XListProps, "useData">

// const SkeletonCells = ({ displays }: SkeletonCellsProps) => {
//   return (
//     <>
//       {[1, 2, 3].map((key) => (
//         <TableRow key={key}>
//           {displays.map((display) => (
//             <TableCell key={display.label}>
//               <Skeleton variant="rounded" />
//             </TableCell>
//           ))}
//         </TableRow>
//       ))}
//     </>
//   )
// }
