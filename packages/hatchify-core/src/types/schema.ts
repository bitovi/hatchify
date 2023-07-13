export type Attribute =
  | string
  | { type: string }
  | { type: "enum"; values: string[] }

export interface Relationship {
  target: string
  options: {
    as: string
  }
}

export interface Schema {
  name: string
  attributes: {
    [field: string]: Attribute
  }
  hasOne?: Relationship[]
  hasMany?: Relationship[]
  belongsTo?: Relationship[]
  belongsToMany?: Relationship[]
}
