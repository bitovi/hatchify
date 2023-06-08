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

export interface Resource {
  id: string
  __schema: string
  attributes?: {
    [key: string]: any // @todo
  }
  relationships?: globalThis.Record<
    string,
    ResourceRelationship | ResourceRelationship[]
  >
}

export type CreateData = Omit<Record, "id" | "__schema">

export type UpdateData = Omit<Record, "__schema">
