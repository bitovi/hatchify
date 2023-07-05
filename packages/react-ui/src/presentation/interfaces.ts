// import type { Schema } from "@hatchifyjs/rest-client"
import type {
  Attribute as NewAttribute, // todo: replace Attribute with NewAttribute
  Meta,
  Record,
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
  sortBy: string | false
}

export type HatchifyListSort = {
  changeSort: (sort: SortObject) => void
  sortQueryString: string
  sort: SortObject
}

export interface XListProps {
  changeSort: (sort: SortObject) => void
  displays: HatchifyDisplay[]
  sort: SortObject
  useData: () => [Record[], Meta]
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
