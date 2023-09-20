import type { Schema, Schemas } from "./schema"
import type { QueryList, QueryOne } from "./query"
import type {
  RestClientCreateData,
  Resource,
  RestClientUpdateData,
} from "./data"
import type { RequestMetaData } from "./meta"
import type { Schema as LegacySchema } from "@hatchifyjs/hatchify-core"

type EitherSchema = Schema | LegacySchema

export type SourceSchema = EitherSchema & {
  type?: string
  endpoint?: string
}

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}

export type SchemaMap = Record<string, SourceSchema>

export type RequiredSchemaMap = Record<
  string,
  WithRequiredProperty<SourceSchema, "type">
>

export interface SourceConfig {
  baseUrl: string
  schemaMap: RequiredSchemaMap
}

// always return a Resource[] even if it's a single resource because
// their may be a need to return related resources
export interface SourceV0 {
  version: 0
  completeSchemaMap: RequiredSchemaMap
  findAll: (
    allSchemas: Schemas,
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
