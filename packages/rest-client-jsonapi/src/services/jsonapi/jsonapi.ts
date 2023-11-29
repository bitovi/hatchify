import { getEndpoint } from "@hatchifyjs/core"
import type {
  RestClient,
  RestClientSchemaMap,
  RestClientSchema,
  GetSchemaNames,
} from "@hatchifyjs/rest-client"
import { createOne, deleteOne, findAll, findOne, updateOne } from ".."

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
 * Creates a new JSON:API rest client.
 */
export function jsonapi<
  const TSchemas extends Record<string, RestClientSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(baseUrl: string, schemaMap: TSchemas): RestClient<TSchemas, TSchemaName> {
  // Default `type` to `schemaMap` key if not set in `schemaMap`
  const completeSchemaMap = Object.entries(schemaMap).reduce(
    (acc, [key, value]) => {
      if (value.namespace) {
        if (key !== `${value.namespace}_${value.name}`) {
          console.warn(
            `The key ${key} should be ${value.namespace}_${value.name}`,
          )
        }
      } else {
        if (key !== value.name) {
          console.warn(`The key ${key} should be ${value.name}`)
        }
      }
      acc[key] = {
        ...value,
        name: value.name,
        attributes: { ...value.attributes },
        type: value.type || key,
        endpoint: value.endpoint ?? getEndpoint(value),
      }
      return acc
    },
    {} as RestClientSchemaMap,
  )

  const config = { baseUrl, schemaMap: completeSchemaMap }

  return {
    completeSchemaMap: completeSchemaMap as TSchemas,
    version: 0,
    findAll: (allSchemas, schemaName, query, baseFilter) =>
      findAll<TSchemas, TSchemaName>(
        config,
        allSchemas,
        schemaName,
        query,
        baseFilter,
      ),
    findOne: (allSchemas, schemaName, query) =>
      findOne<TSchemas, TSchemaName>(config, allSchemas, schemaName, query),
    createOne: (allSchemas, schemaName, data) =>
      createOne<TSchemas, TSchemaName>(config, allSchemas, schemaName, data),
    updateOne: (allSchemas, schemaName, data) =>
      updateOne<TSchemas, TSchemaName>(config, allSchemas, schemaName, data),
    deleteOne: (allSchemas, schemaName, id) =>
      deleteOne<TSchemas, TSchemaName>(config, allSchemas, schemaName, id),
  }
}
