import type { Schema } from "./schema"
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
  getList: (schema: Schema, query: QueryList) => Promise<Resource[]>
  getOne: (schema: Schema, query: QueryOne) => Promise<Resource[]>
  createOne: (schema: Schema, data: CreateData) => Promise<Resource[]>
  updateOne: (schema: Schema, data: UpdateData) => Promise<Resource[]>
  deleteOne: (schema: Schema, id: string) => Promise<void>
}

export type Source = SourceV0 // | SourceV1 | ...
