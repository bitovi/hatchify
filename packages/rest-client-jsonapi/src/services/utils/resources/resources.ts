import type {
  RequiredSchemaMap,
  Resource,
  ResourceRelationship,
  RestClientCreateData,
  RestClientUpdateData,
  Schema,
  SourceConfig,
} from "@hatchifyjs/rest-client"
import type {
  JsonApiResource,
  JsonApiResourceRelationship,
  Relationship as JsonApiRelationship,
} from "../../jsonapi"

type Relationship = Record<
  string,
  ResourceRelationship | ResourceRelationship[]
>

export const getTypeToSchema = (
  schemaMap: RequiredSchemaMap,
): Record<string, string> => {
  return Object.entries(schemaMap).reduce((acc, [key, value]) => {
    acc[value.type] = key
    return acc
  }, {} as Record<string, string>)
}

/**
 * Converts a JSON:API resource into a hatchify resource.
 * - Converts `id` to a string.
 * - Replaces `type` with `__schema`,
 * - Converts `relationships` into a hatchify resource relationship. (See `ResourceRelationship`)
 */
export function jsonApiResourceToHatchifyResource(
  resource: JsonApiResource,
  typeToSchema: Record<string, string>,
): Resource {
  let relationships = undefined

  if (resource.relationships) {
    relationships = Object.entries(resource.relationships).reduce(
      (acc: Relationship, [key, value]) => {
        // skip if relationship has no data
        if (!value.data) return acc

        acc[key] = Array.isArray(value.data)
          ? value.data.map((v) => ({
              id: v.id.toString(),
              __schema: typeToSchema[v.type],
            }))
          : {
              id: value.data.id.toString(),
              __schema: typeToSchema[value.data.type],
            }

        return acc
      },
      {},
    )
  }

  return {
    id: resource.id.toString(),
    __schema: typeToSchema[resource.type],
    attributes: resource.attributes,
    ...(relationships ? { relationships } : {}),
  }
}

/**
 * Converts JSON:API resources into hatchify resource.
 */
export function convertToHatchifyResources(
  data: JsonApiResource | JsonApiResource[],
  schemaMap: RequiredSchemaMap,
): Resource[] {
  const typeToSchema = getTypeToSchema(schemaMap)

  if (Array.isArray(data)) {
    return data.map((d) => jsonApiResourceToHatchifyResource(d, typeToSchema))
  }

  return [jsonApiResourceToHatchifyResource(data, typeToSchema)]
}

/**
 * Converts a single Hatchify relationship to a JSON:API relationship
 */
function hatchifyRelationshipToJsonApiRelationship(
  config: SourceConfig,
  schema: Schema,
  typeName: string,
  relationships:
    | Omit<ResourceRelationship, "__schema">
    | Array<Omit<ResourceRelationship, "__schema">>,
): JsonApiRelationship | JsonApiRelationship[] {
  const jsonApiRelationships = (
    [] as Array<Omit<ResourceRelationship, "__schema">>
  )
    .concat(relationships)
    .map((relationship) => {
      const { id } = relationship
      return {
        id,
        type: Object.keys(schema?.relationships || {}).reduce((a, b) => {
          if (a.length) {
            return a
          }

          const relation = schema.relationships?.[b]

          if (relation && b === typeName) {
            a = config.schemaMap[relation.schema]?.type ?? relation.schema
            return a
          }

          return ""
        }, ""),
      }
    })

  return Array.isArray(relationships)
    ? jsonApiRelationships
    : jsonApiRelationships[0]
}

/**
 * Converts Hatchify relationship object to JSON:API relationship object
 */
export function convertToJsonApiRelationships(
  config: SourceConfig,
  schema: Schema,
  resourceRelationships: Record<
    string,
    | Omit<ResourceRelationship, "__schema">
    | Array<Omit<ResourceRelationship, "__schema">>
  >,
): Record<string, JsonApiResourceRelationship> {
  return Object.keys(resourceRelationships).reduce((a, b) => {
    a[b] = {
      data: hatchifyRelationshipToJsonApiRelationship(
        config,
        schema,
        b,
        resourceRelationships[b],
      ),
    }
    return a
  }, {} as Record<string, JsonApiResourceRelationship>)
}

/**
 * Converts a Hatchify resource into a JSON:API resource.
 */
export function restClientDataToJsonApiResource(
  config: SourceConfig,
  schema: Schema,
  schemaName: string,
  hatchifyResource: RestClientCreateData | RestClientUpdateData,
): JsonApiResource | Omit<JsonApiResource, "id"> {
  const { attributes, relationships } = hatchifyResource
  const id = "id" in hatchifyResource ? hatchifyResource?.id : null

  const translatedRelationships = relationships
    ? {
        relationships: convertToJsonApiRelationships(
          config,
          schema,
          relationships,
        ),
      }
    : null

  return {
    ...(id ? { id } : {}),
    type: config.schemaMap[schemaName].type,
    attributes,
    ...translatedRelationships,
  }
}
