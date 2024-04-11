import { useEffect } from "react"
import type {
  Fields,
  Filters,
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  Include,
  Meta,
  RecordType,
  PaginationObject,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type {
  HatchifyDataGridPage,
  HatchifyDataGridSelectedState,
  HatchifyDataGridSort,
  SortObject,
} from "../presentation/index.js"
import usePage from "./usePage.js"
import useSort from "./useSort.js"
import useSelected from "./useSelected.js"
import useFilter from "./useFilter.js"

export interface DataGridState<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> {
  data: Array<
    RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>, false, true>
  >
  meta: Meta
  fields?: Fields
  include?: Include<GetSchemaFromName<TSchemas, TSchemaName>>
  filter: Filters
  setFilter: (filters: Filters) => void
  page: HatchifyDataGridPage["page"]
  setPage: HatchifyDataGridPage["setPage"]
  sort: HatchifyDataGridSort["sort"]
  setSort: HatchifyDataGridSort["setSort"]
  selected?: HatchifyDataGridSelectedState
  setSelected?: (selected: HatchifyDataGridSelectedState) => void
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  schemaName: TSchemaName
}

export default function useDataGridState<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  finalSchemas: FinalSchemas,
  partialSchemas: TSchemas,
  schemaName: TSchemaName,
  restClient: HatchifyReactRest<TSchemas>,
  {
    defaultSelected,
    onSelectedChange,
    fields,
    include,
    defaultPage,
    defaultSort,
    baseFilter,
    minimumLoadTime,
  }: {
    defaultSelected?: HatchifyDataGridSelectedState
    onSelectedChange?: (selected: HatchifyDataGridSelectedState) => void
    fields?: Fields
    include?: Include<GetSchemaFromName<TSchemas, TSchemaName>>
    defaultPage?: PaginationObject
    defaultSort?: SortObject
    baseFilter?: Filters
    minimumLoadTime?: number
  } = {},
): DataGridState<TSchemas, TSchemaName> {
  if (typeof schemaName !== "string") {
    throw new Error(
      `Expected schemaName to be a string, received ${typeof schemaName}`,
    )
  }

  const { page, setPage } = usePage(defaultPage)
  const { sort, sortQueryString, setSort } = useSort(defaultSort)
  const { filter, setFilter } = useFilter()
  const { selected, setSelected } = useSelected(
    defaultSelected,
    onSelectedChange,
  )
  const [data, meta] = restClient[schemaName].useAll(
    {
      page,
      sort: sortQueryString,
      filter,
      fields,
      include,
    },
    baseFilter,
    minimumLoadTime,
  )

  useEffect(() => {
    setSelected({
      all: selected?.all ? data.length > 0 : false,
      ids: selected?.all ? data.map((record) => record.id) : [],
    })
  }, [data])

  return {
    data,
    meta,
    fields,
    include,
    filter,
    setFilter,
    page,
    setPage,
    sort,
    setSort,
    selected: onSelectedChange !== undefined ? selected : undefined,
    setSelected: onSelectedChange !== undefined ? setSelected : undefined,
    finalSchemas,
    partialSchemas,
    schemaName,
  }
}
