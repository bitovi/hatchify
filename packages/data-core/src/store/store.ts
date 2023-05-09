import type { Record, Resource, Subscription } from "../types"

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
    ? Object.values(store[schema].data).map(convertResourceToRecord)
    : []
}

/**
 * Inserts data into the store and notifies subscribers.
 */
export function insert(schema: string, data: Resource[]): void {
  store[schema].data = {
    ...store[schema].data,
    ...keyResourcesById(data),
  }

  const records = data.map(convertResourceToRecord)

  store[schema].subscribers.forEach((subscriber) => subscriber(records))
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
 * Converts a resource to a record.
 */
export function convertResourceToRecord(resource: Resource): Record {
  return {
    id: resource.id,
    __schema: resource.__schema,
    ...resource.attributes,
    // @todo relationships
  }
}
