import type { Record } from "source-jsonapi"

export type Subscription = (data: Record[]) => void

export interface ResourceStore {
  data: { [id: string]: Record }
  subscribers: Array<Subscription>
}

export interface Store {
  [resource: string]: ResourceStore
}

export const store: Store = {}

export function createStore(schemaKeys: string[]): Store {
  schemaKeys.forEach((schemaKey) => {
    store[schemaKey] = {
      data: {},
      subscribers: [],
    }
  })

  return store
}

export function getStore(resource: string): ResourceStore {
  return store[resource]
}

export function insert(resource: string, data: Record[]): void {
  store[resource].data = {
    ...store[resource].data,
    ...convertRecordArrayToById(data),
  }
  // @todo notify subscribers
}

export function convertRecordArrayToById(data: Record[]): {
  [id: string]: Record
} {
  return data.reduce((acc: any, item) => {
    acc[item.id] = item
    return acc
  }, {})
}
