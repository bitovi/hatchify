import type { RenderHeaderProps } from "./interfaces"

export const Header: React.FC<RenderHeaderProps> = ({
  column,
  direction,
  meta,
  setSort,
  sortBy,
}) =>
  column.renderHeader
    ? column.renderHeader({
        column: {
          sortable: column.sortable,
          key: column.key,
          label: column.label,
        },
        meta,
        sortBy,
        direction,
        setSort,
      })
    : column.label
