import { Checkbox, TableBody, TableCell, TableRow } from "@mui/material"
import type { HatchifyColumn, XDataGridProps } from "@hatchifyjs/react-ui"
import MuiBodySkeleton from "./MuiBodySkeleton"

export const MuiBody: React.FC<
  XDataGridProps & { columns: HatchifyColumn[]; Empty: () => JSX.Element }
> = ({ columns, data, meta, selected, setSelected, Empty }) => {
  const selectable = selected !== undefined && setSelected !== undefined

  if (meta.isPending) {
    return (
      <TableBody>
        <MuiBodySkeleton columns={columns} />
      </TableBody>
    )
  }

  function onRowSelect(id: string) {
    if (selectable) {
      const ids = [...selected.ids]
      const index = ids.indexOf(id)
      if (index > -1) {
        ids.splice(index, 1)
      } else {
        ids.push(id)
      }
      setSelected({ all: ids.length === meta?.meta?.unpaginatedCount, ids })
    }
  }

  return (
    <TableBody>
      {!data?.length ? (
        <TableRow>
          <TableCell colSpan={columns.length + 1} align="center">
            <Empty />
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
                    checked={selected.ids.includes(item.id)}
                    onChange={() => onRowSelect(item.id)}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={`${item.id}-${column.key}`}>
                  {column.renderData({
                    record: item,
                  })}
                </TableCell>
              ))}
            </TableRow>
          )
        })
      )}
    </TableBody>
  )
}

export default MuiBody
