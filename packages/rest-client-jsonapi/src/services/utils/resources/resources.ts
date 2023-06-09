import type {
  Resource,
  ResourceRelationship,
  SchemaMap,
} from "@hatchifyjs/rest-client"
import type { JsonApiResource } from "../../jsonapi"

type Relationship = Record<
  string,
  ResourceRelationship | ResourceRelationship[]
>

export const getTypeToSchema = (
  schemaMap: SchemaMap,
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
  schemaMap: SchemaMap,
): Resource[] {
  const typeToSchema = getTypeToSchema(schemaMap)

  if (Array.isArray(data)) {
    return data.map((d) => jsonApiResourceToHatchifyResource(d, typeToSchema))
  }

  return [jsonApiResourceToHatchifyResource(data, typeToSchema)]
}
