export type EnumObject = { type: "enum"; allowNull?: boolean; values: string[] }
export type AttributeObject = { type: string; allowNull?: boolean } | EnumObject
export type Attribute = string | AttributeObject

export interface Schema {
  name: string // "Article"
  displayAttribute: string
  attributes: {
    [field: string]: Attribute
  }
  relationships?: {
    [field: string]: {
      type: "many" | "one"
      schema: string
    }
  }
}

export type Schemas = Record<string, Schema>
