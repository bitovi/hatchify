import type { PartialSchema } from "@hatchifyjs/core"
import type {
  CreateType,
  Filters,
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  QueryList,
  QueryOne,
  RequestMetaData,
  Resource,
  UpdateType,
  WithRequiredProperty,
} from "./index.js"

export type MutateOptions<TSchemas extends Record<string, PartialSchema>> = {
  notify?: boolean | Array<keyof TSchemas>
}

export type RestClientSchema = PartialSchema & {
  type?: string
  endpoint?: string
}

export type RestClientSchemaMap = Record<
  string,
  WithRequiredProperty<RestClientSchema, "type">
>

export interface RestClientConfig {
  baseUrl: string
  schemaMap: RestClientSchemaMap
  fetchOptions?: RequestInit
}

// always return a Resource[] even if it's a single resource because
// their may be a need to return related resources
export interface RestClient<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> {
  version: 0
  completeSchemaMap: TSchemas
  findAll: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    query: QueryList<GetSchemaFromName<TSchemas, TSchemaName>>,
    baseFilter?: Filters,
    fetchOptions?: RequestInit,
  ) => Promise<
    [
      Resources: { records: Resource[]; related: Resource[] },
      Meta: RequestMetaData,
    ]
  >
  findOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    query: QueryOne<GetSchemaFromName<TSchemas, TSchemaName>>,
    fetchOptions?: RequestInit,
  ) => Promise<{ record: Resource; related: Resource[] }>
  createOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    data: CreateType<GetSchemaFromName<TSchemas, TSchemaName>>,
    fetchOptions?: RequestInit,
  ) => Promise<{ record: Resource; related: Resource[] }>
  updateOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    data: UpdateType<GetSchemaFromName<TSchemas, TSchemaName>>,
    fetchOptions?: RequestInit,
  ) => Promise<{ record: Resource; related: Resource[] }>
  deleteOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    id: string,
    fetchOptions?: RequestInit,
  ) => Promise<void>
}
