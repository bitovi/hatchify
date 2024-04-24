import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  MutateOptions,
  Record,
  Resource,
  Subscription,
} from "../types/index.js"
import {
  flattenResourcesIntoRecords,
  keyResourcesById,
} from "../utils/index.js"

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

export function notifySchema(schemaName: string): void {
  for (const subscriber of store[schemaName].subscribers) {
    subscriber([])
  }
}

export function notifySubscribers<
  TSchemas extends globalThis.Record<string, PartialSchema>,
  TSchemaName extends keyof TSchemas,
>(
  schemaName: TSchemaName | string,
  notify?: MutateOptions<TSchemas>["notify"],
): void {
  if (notify == null || notify === true) {
    // if notify omitted or true, notify subscribers for all schemas
    for (const schemaName in store) {
      notifySchema(schemaName)
    }
  } else if (notify === false) {
    // notify subscribers for only the mutated schema
    notifySchema(schemaName as string)
  } else {
    // notify specified schemas as well as the mutated schema
    const toNotify = new Set([schemaName, ...notify] as string[])

    toNotify.forEach((schemaName) => {
      notifySchema(schemaName)
    })
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
