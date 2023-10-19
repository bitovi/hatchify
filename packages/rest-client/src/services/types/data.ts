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

// todo: v2 relationships
export interface RestClientCreateData
  extends Omit<Resource, "attributes" | "id" | "relationships"> {
  attributes: {
    [key: string]: any
  }
  relationships?: SchemalessResourceRelationshipObject
}

export type CreateData = Omit<RestClientCreateData, "__schema">

// todo: v2 relationships
export interface RestClientUpdateData extends Omit<Resource, "relationships"> {
  relationships?: SchemalessResourceRelationshipObject
}

export type UpdateData = Omit<Resource, "__schema">
