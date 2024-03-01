import type { GetSchemaNames, Filters, Meta } from "@hatchifyjs/rest-client"
import type { DataGridState } from "../hooks/useDataGridState.js"
import type { FinalAttributeRecord, PartialSchema } from "@hatchifyjs/core"
import type { HatchifyColumn } from "../hooks/index.js"

export type Primitive = string | boolean | number

export interface XProviderProps<T> {
  theme?: T
  children: React.ReactNode
}

export interface SortObject {
  direction: "asc" | "desc" | undefined
  sortBy: string | undefined
  alwaysSorted?: boolean
}

export interface PageCountObject {
  number: number
  size: number
}

export interface HatchifyDataGridPage {
  page: PageCountObject
  setPage: (page: PageCountObject) => void
}

export interface HatchifyDataGridSort {
  sort: SortObject
  setSort: (sortBy: string) => void
  sortQueryString: string
}

export interface HatchifyDataGridSelected {
  selected: {
    all: boolean
    ids: string[]
  }
  setSelected: ({ all, ids }: { all: boolean; ids: string[] }) => void
}

export interface HatchifyDataGridFilters {
  filter: Filters
  setFilter: (filters: Filters) => void
}

export interface XDataGridProps<
  TSchemas extends Record<string, PartialSchema> = any,
  TSchemaName extends GetSchemaNames<TSchemas> = any,
> extends DataGridState<TSchemas, TSchemaName> {
  children?: React.ReactNode
  overwrite?: boolean
  minimumLoadTime?: number
}

export interface XEverythingProps<
  TSchemas extends Record<string, PartialSchema> = any,
  TSchemaName extends GetSchemaNames<TSchemas> = any,
> extends Partial<XDataGridProps> {
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
  setSort: HatchifyDataGridSort["setSort"]
  sortBy: SortObject["sortBy"]
}
