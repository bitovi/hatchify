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

export interface RestClientCreateData
  extends Omit<Resource, "attributes" | "id"> {
  attributes: {
    [key: string]: any
  }
}

export type ConsumerCreateData = Omit<RestClientCreateData, "__schema">

export type RestClientUpdateData = Resource

export type ConsumerUpdateData = Omit<Resource, "__schema">
