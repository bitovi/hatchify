import type { FinalSchemas, Record, Resource, Subscription } from "../types/index.js"
import { flattenResourcesIntoRecords, keyResourcesById } from "../utils/index.js"

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
export function getRecords(allSchemas: FinalSchemas, schema: string): Record[] {
  if (!store[schema] || !("data" in store[schema])) {
    return []
  }

  const records = flattenResourcesIntoRecords(
    allSchemas,
    Object.values(store[schema].data),
    [],
  )

  if (!records) {
    return []
  }

  return Array.isArray(records) ? records : [records]
}

/**
 * Inserts data into the store and notifies subscribers.
 */
export function insert(
  allSchemas: FinalSchemas,
  schemaName: string,
  data: Resource[],
): void {
  store[schemaName].data = {
    ...store[schemaName].data,
    ...keyResourcesById(data),
  }

  const records = flattenResourcesIntoRecords(allSchemas, data, [])

  for (const subscriber of store[schemaName].subscribers) {
    // @ts-expect-error
    subscriber(records) // fix with v2 types
  }
}

/**
 * Notifies subscribers whenever a resource is created, updated, or deleted.
 */
export function notifySubscribers(schemaName?: string): void {
  // if no schemaName is provided, notify all subscribers for all schemas
  if (!schemaName) {
    for (const schemaName in store) {
      notifySubscribers(schemaName)
    }

    return
  }

  for (const subscriber of store[schemaName].subscribers) {
    subscriber([]) // todo, future: should notify with can-query-logic results
  }
}

/**
 * Removes ids from the store and notifies subscribers.
 */
export function remove(
  allSchemas: FinalSchemas,
  schema: string,
  ids: string[],
): void {
  const copy = { ...store[schema].data }

  for (const id of ids) {
    delete copy[id]
  }

  store[schema].data = copy

  const records = getRecords(allSchemas, schema)

  for (const subscriber of store[schema].subscribers) {
    // @ts-expect-error
    subscriber(records) // fix with v2 types
  }
}
