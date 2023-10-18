import type { PartialSchema } from "@hatchifyjs/core"
import type { FinalSchemas, Schemas } from "./schema"
import type { Filters, QueryList, QueryOne } from "./query"

import type {
  RestClientCreateData,
  Resource,
  RestClientUpdateData,
} from "./data"
import type { RequestMetaData } from "./meta"

export type SourceSchema = PartialSchema & {
  type?: string
  endpoint?: string
}

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}

export type SchemaMap<TSchemas extends Record<string, PartialSchema>> = Record<
  string,
  TSchemas
>

export type RequiredSchemaMap<TSchemas extends Record<string, PartialSchema>> =
  Record<string, WithRequiredProperty<SourceSchema, "type">>

export interface SourceConfig<TSchemas extends Record<string, PartialSchema>> {
  baseUrl: string
  schemaMap: RequiredSchemaMap<TSchemas>
}

// always return a Resource[] even if it's a single resource because
// their may be a need to return related resources
export interface RestClient<TSchemas extends Record<string, PartialSchema>> {
  version: 0
  // completeSchemaMap: RequiredSchemaMap
  completeSchemaMap: TSchemas
  findAll: (
    allSchemas: FinalSchemas,
    schemaName: string,
    query: QueryList,
    baseFilter?: Filters,
  ) => Promise<[Resources: Resource[], Meta: RequestMetaData]>
  findOne: (
    allSchemas: FinalSchemas,
    schemaName: string,
    query: QueryOne,
  ) => Promise<Resource[]>
  createOne: (
    allSchemas: FinalSchemas,
    schemaName: string,
    data: RestClientCreateData,
  ) => Promise<Resource[]>
  updateOne: (
    allSchemas: FinalSchemas,
    schemaName: string,
    data: RestClientUpdateData,
  ) => Promise<Resource[] | null>
  deleteOne: (
    allSchemas: FinalSchemas,
    schemaName: string,
    id: string,
  ) => Promise<void>
}
