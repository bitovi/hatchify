import type {
  Fields,
  Filter,
  Include,
  Meta,
  Record,
  Schemas,
} from "@hatchifyjs/rest-client"
import type { ReactRest } from "@hatchifyjs/react-rest"
import type {
  HatchifyCollectionPage,
  HatchifyCollectionSelected,
  HatchifyCollectionSort,
} from "../presentation"
import usePage from "./usePage"
import useSort from "./useSort"
import useSelected from "./useSelected"
import useFilter from "./useFilter"

export interface CollectionState {
  data: Record[]
  meta: Meta
  fields?: Fields
  include?: Include
  filter: Filter
  setFilter: (filterBy: Filter) => void
  page: HatchifyCollectionPage["page"]
  setPage: HatchifyCollectionPage["setPage"]
  sort: HatchifyCollectionSort["sort"]
  setSort: HatchifyCollectionSort["setSort"]
  selected: HatchifyCollectionSelected["selected"] | undefined
  setSelected: HatchifyCollectionSelected["setSelected"] | undefined
  allSchemas: Schemas
  schemaName: string
}

export default function useCollectionState(
  allSchemas: Schemas,
  schemaName: string,
  restClient: ReactRest<Schemas>,
  {
    selectedDefault,
    onSelectedChange,
    fields,
    include,
  }: {
    selectedDefault?: string[]
    onSelectedChange?: (ids: string[]) => void
    fields?: Fields
    include?: Include
  } = {},
): CollectionState {
  const { page, setPage } = usePage()
  const { sort, sortQueryString, setSort } = useSort()
  const { selected, setSelected } = useSelected(
    selectedDefault,
    onSelectedChange,
  )
  const { filter, setFilter } = useFilter()

  const [data, meta] = restClient[schemaName].useAll({
    page,
    sort: sortQueryString,
    filter,
    fields,
    include,
  })

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
    allSchemas,
    schemaName,
  }
}
