import { Checkbox, TableBody, TableCell, TableRow } from "@mui/material"
import type { HatchifyDisplay, XCollectionProps } from "@hatchifyjs/react-ui"
import MuiBodySkeleton from "./MuiBodySkeleton"

export const MuiBody: React.FC<
  XCollectionProps & { columns: HatchifyDisplay[]; Empty: () => JSX.Element }
> = ({ columns, data, meta, selected, setSelected, Empty }) => {
  const selectable = selected !== undefined && setSelected !== undefined

  if (meta.isLoading) {
    return (
      <TableBody>
        <MuiBodySkeleton columns={columns} />
      </TableBody>
    )
  }

  function onRowSelect(id: string) {
    if (selectable) {
      const copy = [...selected]
      const index = copy.indexOf(id)
      if (index > -1) {
        copy.splice(index, 1)
      } else {
        copy.push(id)
      }
      setSelected(copy)
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
                    checked={selected.includes(item.id)}
                    onChange={() => onRowSelect(item.id)}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={`${item.id}-${column.key}`}>
                  {column.render({
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
