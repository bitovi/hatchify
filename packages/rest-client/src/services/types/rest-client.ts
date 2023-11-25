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
} from "."

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
  ) => Promise<{ record: Resource; related: Resource[] }>
  createOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    data: CreateType<GetSchemaFromName<TSchemas, TSchemaName>>,
  ) => Promise<{ record: Resource; related: Resource[] }>
  updateOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    data: UpdateType<GetSchemaFromName<TSchemas, TSchemaName>>,
  ) => Promise<{ record: Resource; related: Resource[] }>
  deleteOne: (
    allSchemas: FinalSchemas,
    schemaName: TSchemaName,
    id: string,
  ) => Promise<void>
}
