import type { Schema } from "./schema"
import type { QueryList, QueryOne } from "./query"
import type { CreateData, Resource, UpdateData } from "./data"

export interface SourceConfig {
  type: string
  url: string
}

// always return a Resource[] even if it's a single resource because
// their may be a need to return related resources
export interface SourceV0 {
  version: 0
  getList: (schema: Schema, query: QueryList) => Promise<Resource[]>
  getOne: (schema: Schema, query: QueryOne) => Promise<Resource[]>
  createOne: (schema: Schema, data: CreateData) => Promise<Resource[]>
  updateOne: (schema: Schema, data: UpdateData) => Promise<Resource[]>
}

export type Source = SourceV0 // | SourceV1 | ...
