import type { Record, Schema } from "data-core"

import type { HatchifyDisplay, HatchifyFormField, FormFieldValueType } from "../services"
import type { FormState } from "../components/HatchifyForm"

export type Primitive = string | boolean | number

export interface XListProps {
  displays: HatchifyDisplay[]
  useData: () => Record[]
}

export interface XLayoutProps {
  schema: Schema
  renderActions?: () => JSX.Element
  children?: React.ReactNode
}

export interface XDetailsProps {
  displays: HatchifyDisplay[]
  useData: () => Record
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
  record: Record
  attributeSchema: Attribute | null
  attribute?: string | null
}>

export type FieldComponent = React.FC<{
  value: Primitive | string[]
  onUpdate: (value: Primitive) => void
  attributeSchema?: Attribute
}>




/// ***** import the Schema from Arthur PR

///TODO placeholder for until Arthurs PR get merge
// export interface RelationshipSchema {
//   target: string
//   options: { through: string; as: string }
// }

// export interface Schema {
//   name: string
//   attributes: { [key: string]: Attribute }
//   // validation
//   belongsToMany?: RelationshipSchema[]
//   hasMany?: RelationshipSchema[]
//   hasOne?: RelationshipSchema[]
//   /* EXTRA */
//   displayField: string
//   jsonApiField: string
// }