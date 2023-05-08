
export type Primitive = string | boolean | number

export type Relationship = {
  id: string
  label: string
  [field: string]: Primitive
}

export type CellValue = Primitive | Relationship | Relationship[]

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
  attributeSchema: Attribute | null
  attribute?: string | null
}>






///TODO placeholder for until Arthurs PR get merge
export interface FlatRecord {
  id: string | number
  [field: string]: CellValue
}

export interface RelationshipSchema {
  target: string
  options: { through: string; as: string }
}

export interface Schema {
  name: string
  attributes: { [key: string]: Attribute }
  // validation
  belongsToMany?: RelationshipSchema[]
  hasMany?: RelationshipSchema[]
  hasOne?: RelationshipSchema[]
  /* EXTRA */
  displayField: string
  jsonApiField: string
}