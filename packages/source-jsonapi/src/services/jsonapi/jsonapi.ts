import type {
  CreateData,
  Source,
  SourceConfig,
  QueryList,
  QueryOne,
} from "data-core"
import { createOne, getList, getOne } from ".."

/**
 * Creates a new JSON:API Source.
 */
export function jsonapi(config: SourceConfig): Source {
  return {
    version: 0,
    getList: (schema: string, query: QueryList) =>
      getList(config, schema, query),
    getOne: (schema: string, query: QueryOne) => getOne(config, schema, query),
    createOne: (schema: string, data: CreateData) =>
      createOne(config, schema, data),
  }
}
