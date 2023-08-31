import type { FinalSchemas, Schemas } from "./schema"
import type { QueryList, QueryOne } from "./query"
import type {
  RestClientCreateData,
  Resource,
  RestClientUpdateData,
} from "./data"
import type { RequestMetaData } from "./meta"

interface SourceSchema {
  type?: string
  endpoint: string
}

export type SchemaMap = Record<string, SourceSchema>

export type RequiredSchemaMap = Record<string, Required<SourceSchema>>

export interface SourceConfig {
  baseUrl: string
  schemaMap: RequiredSchemaMap
}

// always return a Resource[] even if it's a single resource because
// their may be a need to return related resources
export interface SourceV0 {
  version: 0
  findAll: (
    allSchemas: Schemas | FinalSchemas,
    schemaName: string,
    query: QueryList,
  ) => Promise<[Resources: Resource[], Meta: RequestMetaData]>
  findOne: (
    allSchemas: Schemas,
    schemaName: string,
    query: QueryOne,
  ) => Promise<Resource[]>
  createOne: (
    allSchemas: Schemas,
    schemaName: string,
    data: RestClientCreateData,
  ) => Promise<Resource[]>
  updateOne: (
    allSchemas: Schemas,
    schemaName: string,
    data: RestClientUpdateData,
  ) => Promise<Resource[] | null>
  deleteOne: (
    allSchemas: Schemas,
    schemaName: string,
    id: string,
  ) => Promise<void>
}

export type Source = SourceV0 // | SourceV1 | ...

export type RestClient = Source
