import type { Meta, Record, Schemas } from "@hatchifyjs/rest-client"
import type { ReactRest } from "@hatchifyjs/react-rest"
import type {
  HatchifyCollectionPage,
  HatchifyCollectionSelected,
  HatchifyCollectionSort,
} from "../presentation"
import usePage from "./usePage"
import useSort from "./useSort"
import useSelected from "./useSelected"

export interface CollectionState {
  data: Record[]
  meta: Meta
  fields: string[]
  include: string[]
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
  selectedDefault?: string[],
  onSelectedChange?: (ids: string[]) => void,
): CollectionState {
  const { page, setPage } = usePage()
  const { sort, sortQueryString, setSort } = useSort()
  const { selected, setSelected } = useSelected(
    selectedDefault,
    onSelectedChange,
  )

  const [data, meta] = restClient[schemaName].useAll({
    page,
    sort: sortQueryString,
  })

  return {
    data,
    meta,
    fields: [],
    include: [],
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
