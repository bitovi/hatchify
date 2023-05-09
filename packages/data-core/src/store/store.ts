import type { Record, Resource } from "../types"

export type Subscription = (data: Record[]) => void

export interface ResourceStore {
  data: { [id: string]: Resource }
  subscribers: Subscription[]
}

export interface Store {
  [resource: string]: ResourceStore
}

export const store: Store = {}

export function createStore(schemas: string[]): Store {
  schemas.forEach((name) => {
    store[name] = {
      data: {},
      subscribers: [],
    }
  })

  return store
}

export function getStore(schema: string): ResourceStore {
  return store[schema]
}

export function insert(schema: string, data: Resource[]): void {
  store[schema].data = {
    ...store[schema].data,
    ...keyResourcesById(data),
  }

  const records = data.map(convertResourceToRecord)
  store[schema].subscribers.forEach((subscriber) => subscriber(records))
}

export function keyResourcesById(data: Resource[]): {
  [id: string]: Resource
} {
  return data.reduce((acc: { [id: string]: Resource }, item) => {
    acc[item.id] = item
    return acc
  }, {})
}

export function convertResourceToRecord(resource: Resource): Record {
  return {
    id: resource.id,
    __schema: resource.__schema,
    ...resource.attributes,
    // @todo relationships
  }
}
