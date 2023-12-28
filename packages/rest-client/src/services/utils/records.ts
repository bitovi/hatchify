import type {
  Record,
  Resource,
  RecordRelationship,
  ResourceRelationship,
  FinalSchemas,
  ResourceRelationshipObject,
} from "../types"
import { setClientPropertyValuesFromResponse } from "."
import { FinalSchema } from "@hatchifyjs/core"

type Relationships = globalThis.Record<
  string,
  RecordRelationship | RecordRelationship[]
>

/**
 * Converts an array of resources into an object keyed by id.
 */
export function keyResourcesById(data: Resource[]): {
  [id: string]: Resource
} {
  return data.reduce((acc: { [id: string]: Resource }, item) => {
    acc[item.id] = item
    return acc
  }, {})
}

/**
 * Returns true if the resource is missing a __schema attribute. This
 * can happen if the backend returns a relationship that the frontend
 * does not have a schema for.
 */
export function isMissingSchema(
  allSchemas: FinalSchemas,
  resource: ResourceRelationship | ResourceRelationship[],
): boolean {
  if (Array.isArray(resource)) {
    return resource.some((r) => !r.__schema || !allSchemas[r.__schema])
  } else {
    return !resource.__schema || !allSchemas[resource.__schema]
  }
}

/**
 * Converts a Resource relationship into a Record relationship by merging the
 * attributes of the related record into the relationship. The __label attribute
 * is also added to the relationship by finding the displayAttribute of the related
 * record's schema.
 */
export function resourceToRecordRelationship(
  allSchemas: FinalSchemas,
  resourcesById: globalThis.Record<string, Resource>,
  resource: ResourceRelationship,
): RecordRelationship {
  // if the related record is not included, return the relationship as-is
  if (resourcesById[resource.id] === undefined) {
    return {
      ...resource,
      __label: resource.id,
    }
  }

  const attributes = resourcesById[resource.id].attributes
  const relationships = resourcesById[resource.id].relationships
  const displayAttribute = getDisplayAttribute(allSchemas[resource.__schema])

  const coercedAttributes = setClientPropertyValuesFromResponse(
    allSchemas,
    resource.__schema,
    attributes || {},
  )

  // if the relationship has relationships, recursively flatten them
  const nestedRelationships = flattenRelationships(
    allSchemas,
    relationships,
    resourcesById,
  )

  return {
    id: resource.id,
    __schema: resource.__schema,
    __label: attributes?.[displayAttribute],
    ...coercedAttributes,
    ...(nestedRelationships ? nestedRelationships : {}),
  }
}

export function flattenRelationships(
  finalSchemas: FinalSchemas,
  relationships: ResourceRelationshipObject | null | undefined,
  relatedById: globalThis.Record<string, Resource>,
): Relationships | undefined {
  if (!relationships) {
    return undefined
  }

  return Object.entries(relationships).reduce(
    (acc: Relationships, [key, value]) => {
      if (isMissingSchema(finalSchemas, value)) {
        return acc
      }

      acc[key] = Array.isArray(value)
        ? value.map((item) =>
            resourceToRecordRelationship(finalSchemas, relatedById, item),
          )
        : resourceToRecordRelationship(finalSchemas, relatedById, value)

      return acc
    },
    {},
  )
}

/**
 * Converts a Resource|Resource[] which is a unflattened object response from rest-client-*
 * into a Record|Record[] which is a flattened object.
 * ie. converting JSON:API data and included into a single object with nested relationships.
 */
export function flattenResourcesIntoRecords(
  finalSchemas: FinalSchemas,
  records: Resource | Resource[],
  related: Resource[],
): Record[] | Record | undefined {
  const relatedById = keyResourcesById(related)
  const flattened = (Array.isArray(records) ? records : [records]).map((r) => {
    const coercedAttributes = setClientPropertyValuesFromResponse(
      finalSchemas,
      r.__schema,
      r.attributes || {},
    )

    const relationships = flattenRelationships(
      finalSchemas,
      r.relationships,
      relatedById,
    )

    return {
      id: r.id,
      __schema: r.__schema,
      ...coercedAttributes,
      ...(relationships ? relationships : {}),
    }
  })

  if (Array.isArray(records)) {
    return flattened
  }

  return flattened.length ? flattened[0] : undefined
}

// if the schema has a displayAttribute, use it
// otherwise, use the first attribute
export function getDisplayAttribute(finalSchema: FinalSchema): string {
  const fromSchema = finalSchema.displayAttribute

  if (fromSchema) {
    return fromSchema
  }

  return Object.keys(finalSchema.attributes)[0]
}
