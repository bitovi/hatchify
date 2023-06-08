import type {
  Record,
  Resource,
  Subscription,
  RecordRelationship,
} from "../types"

type Relationship = globalThis.Record<
  string,
  RecordRelationship | RecordRelationship[]
>

export interface ResourceStore {
  data: { [id: string]: Resource }
  subscribers: Subscription[]
}

export interface Store {
  [resource: string]: ResourceStore
}

export const store: Store = {}

/**
 * Initializes the store with a ResourceStore for each schema.
 */
export function createStore(schemas: string[]): Store {
  for (let i = 0; i < schemas.length; i++) {
    store[schemas[i]] = {
      data: {},
      subscribers: [],
    }
  }

  return store
}

/**
 * Returns the ResourceStore for a given schema.
 * @todo query parameter
 */
export function getStore(schema: string): ResourceStore {
  return store[schema]
}

/**
 * Returns the records for a given schema.
 */
export function getRecords(schema: string): Record[] {
  return store[schema] && "data" in store[schema]
    ? flattenResourcesIntoRecords(Object.values(store[schema].data), schema)
    : []
}

/**
 * Inserts data into the store and notifies subscribers.
 */
export function insert(schemaName: string, data: Resource[]): void {
  store[schemaName].data = {
    ...store[schemaName].data,
    ...keyResourcesById(data),
  }

  const records = flattenResourcesIntoRecords(data, schemaName)

  for (const subscriber of store[schemaName].subscribers) {
    subscriber(records)
  }
}

/**
 * Notifies subscribers whenever a resource is created, updated, or deleted.
 */
export function notifySubscribers(schemaName: string): void {
  for (const subscriber of store[schemaName].subscribers) {
    subscriber([]) // todo, future: should notify with can-query-logic results
  }
}

/**
 * Removes ids from the store and notifies subscribers.
 */
export function remove(schema: string, ids: string[]): void {
  const copy = { ...store[schema].data }

  for (const id of ids) {
    delete copy[id]
  }

  store[schema].data = copy

  const records = getRecords(schema)

  for (const subscriber of store[schema].subscribers) {
    subscriber(records)
  }
}

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
 * Takes a list of Resources containing both top-level records and related records and
 * flattens them into a list of Records. Flattens the attributes and relationships keys.
 * Merges the attribute data of the related records into the top-level records.
 */
export function flattenResourcesIntoRecords(
  resources: Resource[],
  topLevelSchemaName: string,
): Record[]
export function flattenResourcesIntoRecords(
  resources: Resource[],
  topLevelRecordSchemaName: string,
  id: string,
): Record | undefined
export function flattenResourcesIntoRecords(
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
            acc[key] = Array.isArray(value)
              ? value.map((item) => ({
                  id: item.id,
                  __schema: item.__schema,
                  ...resourcesById[item.id].attributes,
                }))
              : {
                  id: value.id,
                  __schema: value.__schema,
                  ...resourcesById[value.id].attributes,
                }

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
