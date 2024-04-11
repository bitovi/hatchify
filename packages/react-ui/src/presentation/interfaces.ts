import type { GetSchemaNames, Filters, Meta } from "@hatchifyjs/rest-client"
import type { DataGridState } from "../hooks/useDataGridState.js"
import type { FinalAttributeRecord, PartialSchema } from "@hatchifyjs/core"
import type { HatchifyColumn } from "../hooks/index.js"
import type { DefaultDisplayComponentsTypes } from "../react-ui.js"

export type Primitive = string | boolean | number

export interface XProviderProps {
  children: React.ReactNode
  defaultDisplayComponents?: Partial<DefaultDisplayComponentsTypes>
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

export interface HatchifyDataGridSelectedState {
  all: boolean
  ids: string[]
}

export interface HatchifyDataGridSelected {
  selected: HatchifyDataGridSelectedState
  setSelected: (selected: HatchifyDataGridSelectedState) => void
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
  listWrapperId?: string
  fitParent?: boolean
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

export type DataValueRecord = {
  id: string | number
  [field: string]: DataValue
}

export type DataValueComponent = React.FC<{
  value: DataValue
  record: DataValueRecord
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
  alwaysSorted: SortObject["alwaysSorted"]
}
