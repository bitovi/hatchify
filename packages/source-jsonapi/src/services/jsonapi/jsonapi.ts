import type {
  CreateData,
  Schema,
  Source,
  SourceConfig,
  QueryList,
  QueryOne,
} from "@hatchifyjs/data-core"
import { createOne, getList, getOne } from ".."

/**
 * Creates a new JSON:API Source.
 */
export function jsonapi(config: SourceConfig): Source {
  return {
    version: 0,
    getList: (schema: Schema, query: QueryList) =>
      getList(config, schema, query),
    getOne: (schema: Schema, query: QueryOne) => getOne(config, schema, query),
    createOne: (schema: Schema, data: CreateData) =>
      createOne(config, schema, data),
  }
}
