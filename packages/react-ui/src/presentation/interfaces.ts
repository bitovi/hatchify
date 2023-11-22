// import type { Schema } from "@hatchifyjs/rest-client"
import type {
  GetSchemaNames,
  Meta,
  Attribute as NewAttribute, // todo: replace Attribute with NewAttribute
} from "@hatchifyjs/rest-client"
import type { Schema } from "../services-legacy/api/schemas" //TODO update schema
import type {
  HatchifyDisplay as LegacyHatchifyDisplay,
  HatchifyFormField,
  FormFieldValueType,
} from "../services-legacy"
import type { FormState } from "../components/HatchifyForm"
import type { CollectionState } from "../hooks/useCollectionState"
import type { Filters } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyDisplay } from "../services"

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

export interface XLayoutProps {
  schema: Schema
  renderActions?: () => JSX.Element
  children?: React.ReactNode
}

export interface XDetailsProps {
  displays: LegacyHatchifyDisplay[]
  useData: () => FlatRecord
}

export interface XFormProps {
  isEdit: boolean
  fields: HatchifyFormField[]
  formState: FormState
  onUpdateField: ({
    key,
    value,
    attributeSchema,
  }: {
    key: string
    value: FormFieldValueType
    attributeSchema: AttributeSchema
  }) => void
  onSave: () => void
}

export type Relationship = {
  id: string
  label: string
  [field: string]: Primitive
}

export type CellValue = Primitive | Relationship | Relationship[]

export interface FlatRecord {
  id: string | number
  [field: string]: CellValue
}

export type AttributeSchema = {
  type: string
  allowNull: boolean
  primaryKey?: boolean
  defaultValue?: string
  unique?: boolean
  values?: string[]
}

export type Attribute = string | AttributeSchema

export type DataValueComponent = React.FC<{
  value: CellValue
  record: FlatRecord
  attributeSchema: NewAttribute | null
  attribute?: string | null
}>

export type HeaderValueComponent = React.FC<{
  column: Omit<HatchifyDisplay, "renderData" | "renderHeader">
  meta: Meta
  sortBy: string | undefined
  direction: "asc" | "desc" | undefined
  setSort: (sortBy: string) => void
}>

export type FieldComponent = React.FC<{
  value: Primitive | string[]
  onUpdate: (value: Primitive) => void
  attributeSchema?: Attribute
}>
