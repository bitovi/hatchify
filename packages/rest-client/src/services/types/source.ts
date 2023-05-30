import type { Schemas } from "./schema"
import type { QueryList, QueryOne } from "./query"
import type { CreateData, Resource, UpdateData } from "./data"

export interface SchemaMap {
  [schemaName: string]: {
    type: string // jsonapi type
    endpoint: string // appends to baseUrl
  }
}

export interface SourceConfig {
  baseUrl: string
  schemaMap: SchemaMap
}

// always return a Resource[] even if it's a single resource because
// their may be a need to return related resources
export interface SourceV0 {
  version: 0
  getList: (
    allSchemas: Schemas,
    schemaName: string,
    query: Required<QueryList>,
  ) => Promise<Resource[]>
  getOne: (
    allSchemas: Schemas,
    schemaName: string,
    query: Required<QueryOne>,
  ) => Promise<Resource[]>
  createOne: (
    allSchemas: Schemas,
    schemaName: string,
    data: CreateData,
  ) => Promise<Resource[]>
  updateOne: (
    allSchemas: Schemas,
    schemaName: string,
    data: UpdateData,
  ) => Promise<Resource[]>
  deleteOne: (
    allSchemas: Schemas,
    schemaName: string,
    id: string,
  ) => Promise<void>
}

export type Source = SourceV0 // | SourceV1 | ...
