export interface Schema {
  name: string // "Article"
  displayAttribute: string
  attributes: {
    [field: string]: string | { type: string }
  }
  relationships?: {
    [field: string]: {
      type: "many" | "one"
      schema: string
    }
  }
}

export interface QueryList {
  fields?: string[]
  page?: { size: number; number: number }
  sort?: { [key: string]: "asc" | "desc" }
  filter?: { [key: string]: { [filter: string]: string } }
}

export interface Record {
  id: string
  [key: string]: any // @todo strict typing
}

export interface Resource {
  id: string
  __schema: string
  attributes?: {
    [key: string]: any // @todo
  }
  relationships?: {
    [key: string]: any // @todo
  }
}

export type CreateData = Omit<Record, "id" | "__schema">

export interface SourceConfig {
  type: string
  url: string
}

export interface SourceV0 {
  version: 0
  getList: (schema: string, query: QueryList) => Promise<{ data: Resource[] }>
  createOne: (schema: string, data: CreateData) => Promise<{ data: Resource }>
}

export type Source = SourceV0 // | SourceV1 | ...
