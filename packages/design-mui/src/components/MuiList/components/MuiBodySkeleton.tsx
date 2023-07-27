import { Skeleton, TableCell, TableRow } from "@mui/material"
import type { HatchifyDisplay } from "@hatchifyjs/react-ui"

export const MuiBodySkeleton: React.FC<{ columns: HatchifyDisplay[] }> = ({
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
