import type {
  Source,
  SchemaMap,
  RequiredSchemaMap,
} from "@hatchifyjs/rest-client"
import { createOne, deleteOne, findAll, findOne, updateOne } from ".."
import { getEndpoint } from "../utils/schema"

export type Relationship = {
  id: string | number
  type: string
}

export type JsonApiResourceRelationship = {
  data: Relationship | Relationship[]
}

export interface JsonApiResource {
  id: string | number
  type: string
  attributes?: Record<string, string | number | boolean | null>
  relationships?: Record<string, JsonApiResourceRelationship>
}

export type CreateJsonApiResource = Omit<JsonApiResource, "id">

/**
 * Creates a new JSON:API Source.
 */
export function jsonapi(baseUrl: string, schemaMap: SchemaMap): Source {
  // Default `type` to `schemaMap` key if not set in `schemaMap`
  const completeSchemaMap = Object.entries(schemaMap).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        ...value,
        name: value.name,
        attributes: { ...value.attributes },
        type: value.type || key,
        endpoint: getEndpoint(value.pluralName, key),
      }
      return acc
    },
    {} as RequiredSchemaMap,
  )

  const config = { baseUrl, schemaMap: completeSchemaMap }

  return {
    completeSchemaMap: completeSchemaMap,
    version: 0,
    findAll: (allSchemas, schemaName, query, baseFilter) =>
      findAll(config, allSchemas, schemaName, query, baseFilter),
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
