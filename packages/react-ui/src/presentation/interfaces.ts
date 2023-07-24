// import type { Schema } from "@hatchifyjs/rest-client"
import type {
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
  selected: string[]
  setSelected: (ids: string[]) => void
}

export interface XCollectionProps extends CollectionState {
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
export interface XFilterProps {
  children: React.ReactElement
  schemas: Schemas
  schemaName: string
  filters: Filter
  setFilters: (filterBy: Filter) => void
}

export interface HatchifyListFilter {
  filter: Filter
  setFilter: (filterBy: Filter) => void
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
