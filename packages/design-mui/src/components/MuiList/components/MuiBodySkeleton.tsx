import { Skeleton, TableCell, TableRow } from "@mui/material"
import type { HatchifyColumn } from "@hatchifyjs/react-ui"

export const MuiBodySkeleton: React.FC<{ columns: HatchifyColumn[] }> = ({
  columns,
}) => {
  return (
    <>
      {[1, 2, 3].map((key) => (
        <TableRow key={key}>
          {columns.map((column) => (
            <TableCell key={column.label}>
              <Skeleton variant="rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export default MuiBodySkeleton
