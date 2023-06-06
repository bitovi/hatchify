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
export function insert(schemaName: string, data: Resource[]): void {
  store[schemaName].data = {
    ...store[schemaName].data,
    ...keyResourcesById(data),
  }

  const records = data.map(convertResourceToRecord)

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
