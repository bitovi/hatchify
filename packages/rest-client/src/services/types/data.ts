export interface RecordRelationship {
  id: string
  __schema: string
  __label: string
  [key: string]: any // todo: strict typing
}
export interface Record {
  id: string
  [key: string]: any // todo: strict typing
}

export interface ResourceRelationship {
  id: string
  __schema: string
}

export type SchemalessResourceRelationship = Omit<
  ResourceRelationship,
  "__schema"
>

export interface ResourceRelationshipObject {
  [key: string]: ResourceRelationship | ResourceRelationship[]
}

export interface SchemalessResourceRelationshipObject {
  [key: string]:
    | SchemalessResourceRelationship
    | SchemalessResourceRelationship[]
}

export interface Resource {
  id: string
  __schema: string
  attributes?: {
    [key: string]: any // @todo
  }
  relationships?: ResourceRelationshipObject
}
