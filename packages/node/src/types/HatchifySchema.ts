type AttributeType = "string" | "number" | "boolean" | "date" | "json"

type RelationshipType = "one" | "many" | "many-through"

export interface HatchifyModelV2 {
  name: string
  displayAttribute: string
  id?: ID
  attributes: Record<string, Attribute>
  relationships?: Record<string, Relationship>
  validation?: Record<string, ModelValidation>
}

type Attribute =
  | AttributeType
  | SimpleAttribute
  | NonVirtualAttribute
  | VirtualAttribute

interface SimpleAttribute {
  type: AttributeType
  options?: any[]
}

interface NonVirtualAttribute extends SimpleAttribute {
  validation?: AttributeValidation
  sequelize?: AttributeSequelize
}

interface AttributeSequelize {
  type: string // "VARCHAR(255)" // TODO: If invalid will throw in runtime?
}

interface AttributeValidation {
  optional?: boolean
  minLength?: number
}

interface VirtualAttributeBase {
  virtual: true
  fields: string[]
}

type VirtualAttribute =
  | VirtualAttributeString
  | VirtualAttributeNumber
  | VirtualAttributeBoolean
  | VirtualAttributeDate
  | VirtualAttributeJson

interface VirtualAttributeString extends VirtualAttributeBase {
  type: "string"
  value: (fields: any[]) => string
}

interface VirtualAttributeNumber extends VirtualAttributeBase {
  type: "number"
  value: (fields: any[]) => number
}

interface VirtualAttributeBoolean extends VirtualAttributeBase {
  type: "boolean"
  value: (fields: any[]) => boolean
}

interface VirtualAttributeDate extends VirtualAttributeBase {
  type: "date"
  value: (fields: any[]) => Date
}

interface VirtualAttributeJson extends VirtualAttributeBase {
  type: "json"
  value: (fields: any[]) => object
}

interface ID {
  type: string
  defaultValue?: string
}

type Relationship = SimpleRelationship | ThroughRelationship

interface SimpleRelationship {
  type: Exclude<RelationshipType, "many-through">
  schema: string
}

interface ThroughRelationship {
  type: "many-through"
  schema: string
  through: string
}

type ModelValidation = SimpleModelValidation | CustomModelValidation

interface SimpleModelValidation {
  type: "equal" | "greater-than" | "less-than"
  lhs: string
  rhs: string
}

type ValidationSuccess = true
interface ValidationError {
  fields: string[]
  message: string
}

interface CustomModelValidation {
  type: "custom"
  fields: string[]
  validate: (
    fields: string[],
    record: Record<string, any>,
  ) => ValidationSuccess | ValidationError
}
