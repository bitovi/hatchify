export interface Relationship {
  target: string
  options: {
    as: string
  }
}

export interface Schema {
  name: string
  attributes: {
    [field: string]: string
  }
  hasOne?: Relationship[]
  hasMany?: Relationship[]
  belongsTo?: Relationship[]
  belongsToMany?: Relationship[]
}
