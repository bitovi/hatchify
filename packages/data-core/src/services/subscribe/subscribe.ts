import { getStore } from "../store"
import type { Record } from "../types"

export type Unsubscribe = () => void

/**
 * Adds a subscriber to the store for a given schema.
 */
export const subscribeToList = (
  resource: string,
  onChange: (data: Record[]) => void,
): Unsubscribe => {
  const store = getStore(resource)

  store.subscribers.push(onChange)

  return () => {
    store.subscribers = store.subscribers.filter((fn) => fn !== onChange)
  }
}

/**
 * Adds a subscriber to the store for a given schema and id. Will only notify
 * the subscriber when the record with the given id is updated.
 */
export const subscribeToOne = (
  resource: string,
  onChange: (data: Record) => void,
  id: string,
): Unsubscribe => {
  const store = getStore(resource)

  function notify(data: Record[]) {
    const record = data.find((record) => record.id === id)
    if (record) {
      onChange(record)
    }
  }

  store.subscribers.push(notify)

  return () => {
    store.subscribers = store.subscribers.filter((fn) => fn !== notify)
  }
}
