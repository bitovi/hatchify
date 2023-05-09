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
