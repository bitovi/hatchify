import type { Meta, QueryList, Record, Schemas } from "@hatchifyjs/rest-client"
import type { ValueComponent } from "../../presentation/interfaces"
import useHatchifyListSort from "./hooks/useHatchifyListSort"
import useHatchifyListPagination from "./hooks/useHatchifyListPagination"
import useHatchifyRowSelect from "./hooks/useHatchifyRowSelect"
import { getDisplays, getEmptyList } from "../../services"
import { useHatchifyPresentation } from ".."

export interface HatchifyListProps {
  allSchemas: Schemas
  schemaName: string
  useData: (query: QueryList) => [Record[], Meta]
  valueComponents?: { [attribute: string]: ValueComponent }
  selectable?: boolean
  onSelectionChange?: (ids: string[]) => void
  children?: React.ReactNode | null
  filter: { [key: string]: string }
}

export const HatchifyList: React.FC<HatchifyListProps> = ({
  allSchemas,
  schemaName,
  valueComponents,
  useData,
  selectable = false,
  onSelectionChange = () => undefined,
  children,
  filter,
}) => {
  const { List, defaultValueComponents } = useHatchifyPresentation()
  const { sort, setSort, sortQueryString } = useHatchifyListSort()
  const { pagination, setPagination } = useHatchifyListPagination()
  const { selected, setSelected } = useHatchifyRowSelect(onSelectionChange)

  const useDataCallback = () =>
    useData({ page: pagination, sort: sortQueryString, filter: filter })

  const displays = getDisplays(
    allSchemas[schemaName],
    valueComponents,
    defaultValueComponents,
    children,
  )

  const EmptyList = getEmptyList(children)

  return (
    <List
      displays={displays}
      useData={useDataCallback}
      pagination={pagination}
      sort={sort}
      setPagination={setPagination}
      setSort={setSort}
      selectable={selectable}
      selected={selected}
      setSelected={setSelected}
      emptyList={EmptyList}
    />
  )
}
