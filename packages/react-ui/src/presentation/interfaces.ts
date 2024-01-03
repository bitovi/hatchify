import type { GetSchemaNames, Filters, Meta } from "@hatchifyjs/rest-client"
import type { CollectionState } from "../hooks/useCollectionState"
import type { FinalAttributeRecord, PartialSchema } from "@hatchifyjs/core"
import type { HatchifyColumn } from "../hooks"

export type Primitive = string | boolean | number

export interface XProviderProps<T> {
  theme?: T
  children: React.ReactNode
}

export interface SortObject {
  direction: "asc" | "desc" | undefined
  sortBy: string | undefined
}

export interface PageCountObject {
  number: number
  size: number
}

export interface HatchifyCollectionPage {
  page: PageCountObject
  setPage: (page: PageCountObject) => void
}

export interface HatchifyCollectionSort {
  sort: SortObject
  setSort: (sortBy: string) => void
  sortQueryString: string
}

export interface HatchifyCollectionSelected {
  selected: {
    all: boolean
    ids: string[]
  }
  setSelected: ({ all, ids }: { all: boolean; ids: string[] }) => void
}

export interface HatchifyCollectionFilters {
  filter: Filters
  setFilter: (filters: Filters) => void
}

export interface XCollectionProps<
  TSchemas extends Record<string, PartialSchema> = any,
  TSchemaName extends GetSchemaNames<TSchemas> = any,
> extends CollectionState<TSchemas, TSchemaName> {
  children?: React.ReactNode
  overwrite?: boolean
}

export interface XEverythingProps<
  TSchemas extends Record<string, PartialSchema> = any,
  TSchemaName extends GetSchemaNames<TSchemas> = any,
> extends Partial<XCollectionProps> {
  setSelectedSchema?: (schemaName: TSchemaName) => void
}

export interface XLayoutProps<
  TSchemas extends Record<string, PartialSchema> = any,
  TSchemaName extends GetSchemaNames<TSchemas> = any,
> {
  partialSchemas: TSchemas
  schemaName: TSchemaName
  renderActions?: () => JSX.Element
  children?: React.ReactNode
}

export type Relationship = {
  id: string
  label: string
  [field: string]: Primitive
}

export type DataValue = Primitive | Relationship | Relationship[]

export type DataValueComponent = React.FC<{
  value: DataValue
  record: {
    id: string | number
    [field: string]: DataValue
  }
  control: FinalAttributeRecord[string]["control"]
  field?: string | null
}>

export type HeaderValueComponent = React.FC<HeaderProps>

export type HeaderProps =
  | (HeaderPropsCommon & {
      column: HatchifyColumn
    })
  | (HeaderPropsCommon & {
      column: Omit<
        HatchifyColumn,
        "headerOverride" | "renderData" | "renderHeader"
      >
    })

interface HeaderPropsCommon {
  direction: SortObject["direction"]
  meta: Meta
  setSort: HatchifyCollectionSort["setSort"]
  sortBy: SortObject["sortBy"]
}
