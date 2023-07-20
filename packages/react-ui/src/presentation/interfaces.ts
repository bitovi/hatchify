// import type { Schema } from "@hatchifyjs/rest-client"
import type {
  Attribute as NewAttribute, // todo: replace Attribute with NewAttribute
  Meta,
  Record,
  Schemas,
} from "@hatchifyjs/rest-client"
import type { Schema } from "../services-legacy/api/schemas" //TODO update schema

import type {
  HatchifyDisplay as LegacyHatchifyDisplay,
  HatchifyFormField,
  FormFieldValueType,
} from "../services-legacy"
import type { HatchifyDisplay } from "../services"
import type { FormState } from "../components/HatchifyForm"

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

export interface HatchifyListPagination {
  pagination: PageCountObject
  setPagination: (page: PageCountObject) => void
}

export interface HatchifyListSort {
  sort: SortObject
  setSort: (sortBy: string) => void
  sortQueryString: string
}

export interface XListProps {
  // columns
  displays: HatchifyDisplay[]
  // data
  useData: () => [Record[], Meta]
  // pgaination
  pagination: PageCountObject
  setPagination: (page: PageCountObject) => void
  // sort
  sort: SortObject
  setSort: (sortBy: string) => void
  // row select (checkoxes)
  selectable: boolean
  selected: globalThis.Record<string, true>
  setSelected: (ids: globalThis.Record<string, true>) => void
  // empty list
  emptyList: () => JSX.Element
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
export interface XFilterProps {
  children: React.ReactElement
  schemas: Schemas
  schemaName: string
  filters: { [key: string]: string }
  setFilters: (filterBy: { [key: string]: string }) => void
}

export interface HatchifyListFilter {
  filter: { [key: string]: string }
  setFilter: (filterBy: { [key: string]: string }) => void
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

export type ValueComponent = React.FC<{
  value: CellValue
  record: FlatRecord
  attributeSchema: NewAttribute | null
  attribute?: string | null
}>

export type FieldComponent = React.FC<{
  value: Primitive | string[]
  onUpdate: (value: Primitive) => void
  attributeSchema?: Attribute
}>
