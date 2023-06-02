import type { Source, SchemaMap } from "@hatchifyjs/rest-client"
import { createOne, deleteOne, findAll, findOne, updateOne } from ".."

export interface JsonApiResource {
  id: string | number
  type: string
  attributes?: { [key: string]: string | number | boolean | null }
  // todo relationships
}

/**
 * Creates a new JSON:API Source.
 */
export function jsonapi(baseUrl: string, schemaMap: SchemaMap): Source {
  const config = { baseUrl, schemaMap }

  return {
    version: 0,
    findAll: (allSchemas, schemaName, query) =>
      findAll(config, allSchemas, schemaName, query),
    findOne: (allSchemas, schemaName, query) =>
      findOne(config, allSchemas, schemaName, query),
    createOne: (allSchemas, schemaName, data) =>
      createOne(config, allSchemas, schemaName, data),
    updateOne: (allSchemas, schemaName, data) =>
      updateOne(config, allSchemas, schemaName, data),
    deleteOne: (allSchemas, schemaName, id) =>
      deleteOne(config, allSchemas, schemaName, id),
  }
}
