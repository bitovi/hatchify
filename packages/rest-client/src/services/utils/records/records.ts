import type {
  Record,
  Resource,
  RecordRelationship,
  Schemas,
  ResourceRelationship,
} from "../../types"

type Relationship = globalThis.Record<
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
  allSchemas: Schemas,
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
  allSchemas: Schemas,
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
  const displayAttribute = allSchemas[resource.__schema].displayAttribute

  return {
    id: resource.id,
    __schema: resource.__schema,
    __label: attributes?.[displayAttribute],
    ...attributes,
  }
}

/**
 * Takes a list of Resources containing both top-level records and related records and
 * flattens them into a list of Records. Flattens the attributes and relationships keys.
 * Merges the attribute data of the related records into the top-level records.
 */
export function flattenResourcesIntoRecords(
  allSchemas: Schemas,
  resources: Resource[],
  topLevelSchemaName: string,
): Record[]
export function flattenResourcesIntoRecords(
  allSchemas: Schemas,
  resources: Resource[],
  topLevelRecordSchemaName: string,
  id: string,
): Record | undefined
export function flattenResourcesIntoRecords(
  allSchemas: Schemas,
  resources: Resource[],
  topLevelRecordSchemaName: string,
  id?: string,
): Record[] | Record | undefined {
  const resourcesById = keyResourcesById(resources)

  const flattened = resources
    .filter((resource) => {
      return resource.__schema === topLevelRecordSchemaName
    })
    .map((resource) => {
      let relationships = undefined

      if (resource.relationships) {
        relationships = Object.entries(resource.relationships).reduce(
          (acc: Relationship, [key, value]) => {
            if (isMissingSchema(allSchemas, value)) {
              return acc
            }

            acc[key] = Array.isArray(value)
              ? value.map((item) =>
                  resourceToRecordRelationship(allSchemas, resourcesById, item),
                )
              : resourceToRecordRelationship(allSchemas, resourcesById, value)

            return acc
          },
          {},
        )
      }

      return {
        id: resource.id,
        __schema: resource.__schema,
        ...resource.attributes,
        ...(relationships ? relationships : {}),
      }
    })

  if (id) {
    return flattened.find((record) => record.id === id) || undefined
  }

  return flattened
}
