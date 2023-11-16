import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import type { CollectionState } from "../hooks/useCollectionState"
import type { Filters } from "@hatchifyjs/rest-client"
import type { FinalAttributeRecord, PartialSchema } from "@hatchifyjs/core"

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
}

export interface XEverythingProps extends XCollectionProps {
  setSelectedSchema: (schemaName: any) => void
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

export type CellValue = Primitive | Relationship | Relationship[]

export type ValueComponent = React.FC<{
  value: CellValue
  record: {
    id: string | number
    [field: string]: CellValue
  }
  control: FinalAttributeRecord[string]["control"]
  field?: string | null
}>
