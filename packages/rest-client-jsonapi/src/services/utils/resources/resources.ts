import type { FinalSchema } from "@hatchifyjs/core"
import type {
  RequiredSchemaMap,
  Resource,
  ResourceRelationship,
  RestClientCreateData,
  RestClientUpdateData,
  SourceConfig,
  SchemalessResourceRelationship,
  SchemalessResourceRelationshipObject,
} from "@hatchifyjs/rest-client"
import type {
  JsonApiResource,
  JsonApiResourceRelationship,
  Relationship as JsonApiRelationship,
  CreateJsonApiResource,
} from "../../jsonapi"

type Relationship = Record<
  string,
  ResourceRelationship | ResourceRelationship[]
>

export const getTypeToSchema = (
  schemaMap: RequiredSchemaMap, // todo: HATCH-417
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
        if (!value.data) {
          return acc
        }

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
  schemaMap: RequiredSchemaMap, // todo: HATCH-417
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
  config: SourceConfig, // todo: HATCH-417
  schema: FinalSchema,
  typeName: string,
  resourceRelationships:
    | SchemalessResourceRelationship
    | SchemalessResourceRelationship[],
): JsonApiRelationship | JsonApiRelationship[] {
  const jsonApiRelationships = ([] as SchemalessResourceRelationship[])
    .concat(resourceRelationships)
    .map((resourceRelationship) => {
      const { id } = resourceRelationship

      const type = Object.keys(schema?.relationships || {}).reduce(
        (type, relationshipKey) => {
          if (type) {
            return type
          }

          const relationship = schema.relationships?.[relationshipKey]

          if (relationship && relationshipKey === typeName) {
            type =
              config.schemaMap[relationship.targetSchema]?.type ??
              relationship.targetSchema
          }

          return type
        },
        "",
      )

      return {
        id,
        type,
      }
    })

  return Array.isArray(resourceRelationships)
    ? jsonApiRelationships
    : jsonApiRelationships[0]
}

/**
 * Converts Hatchify relationship object to JSON:API relationship object
 */
export function convertToJsonApiRelationships(
  config: SourceConfig, // todo: HATCH-417
  schema: FinalSchema,
  resourceRelationships: SchemalessResourceRelationshipObject,
): Record<string, JsonApiResourceRelationship> {
  return Object.keys(resourceRelationships).reduce(
    (jsonApiRelationshipObject, relationshipKey) => {
      jsonApiRelationshipObject[relationshipKey] = {
        data: hatchifyRelationshipToJsonApiRelationship(
          config,
          schema,
          relationshipKey,
          resourceRelationships[relationshipKey],
        ),
      }
      return jsonApiRelationshipObject
    },
    {} as Record<string, JsonApiResourceRelationship>,
  )
}

/**
 * Converts a Hatchify resource into a JSON:API resource.
 */
export function hatchifyResourceToJsonApiResource(
  config: SourceConfig, // todo: HATCH-417
  schema: FinalSchema,
  schemaName: string,
  hatchifyResource: RestClientCreateData | RestClientUpdateData,
): JsonApiResource | CreateJsonApiResource {
  const { attributes, relationships } = hatchifyResource
  const id = "id" in hatchifyResource ? hatchifyResource?.id : null

  const conditionalIdProperty = id ? { id } : null
  const conditionalRelationshipsProperty = relationships
    ? {
        relationships: convertToJsonApiRelationships(
          config,
          schema,
          relationships,
        ),
      }
    : null

  return {
    ...conditionalIdProperty,
    type: config.schemaMap[schemaName].type,
    attributes,
    ...conditionalRelationshipsProperty,
  }
}
