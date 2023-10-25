import type { PartialSchema } from "@hatchifyjs/core"
import type {
  CreateType,
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  UpdateType,
} from "./schema"
import type { Filters, QueryList, QueryOne } from "./query"

import type { Resource } from "./data"
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
export interface RestClient<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> {
  version: 0
  // completeSchemaMap: RequiredSchemaMap
  completeSchemaMap: TSchemas
  findAll: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    query: QueryList,
    baseFilter?: Filters,
  ) => Promise<[Resources: Resource[], Meta: RequestMetaData]>
  findOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    query: QueryOne,
  ) => Promise<Resource[]>
  createOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    data: CreateType<GetSchemaFromName<TSchemas, TSchemaName>>,
  ) => Promise<Resource[]>
  updateOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    data: UpdateType<GetSchemaFromName<TSchemas, TSchemaName>>,
  ) => Promise<Resource[] | null>
  deleteOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    id: string,
  ) => Promise<void>
}
