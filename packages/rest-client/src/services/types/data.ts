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
  extends Omit<Resource, "attributes" | "id" | "relationships"> {
  attributes: {
    [key: string]: any
  }
  relationships?: globalThis.Record<
    string,
    | Omit<ResourceRelationship, "__schema">
    | Array<Omit<ResourceRelationship, "__schema">>
  >
}

export interface CreateData
  extends Omit<RestClientCreateData, "__schema" | "relationships"> {
  relationships?: globalThis.Record<
    string,
    | Omit<ResourceRelationship, "__schema">
    | Array<Omit<ResourceRelationship, "__schema">>
  >
}

export interface RestClientUpdateData extends Omit<Resource, "relationships"> {
  relationships?: globalThis.Record<
    string,
    | Omit<ResourceRelationship, "__schema">
    | Array<Omit<ResourceRelationship, "__schema">>
  >
}

export interface UpdateData
  extends Omit<Resource, "__schema" | "relationships"> {
  relationships?: globalThis.Record<
    string,
    | Omit<ResourceRelationship, "__schema">
    | Array<Omit<ResourceRelationship, "__schema">>
  >
}
