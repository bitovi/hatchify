import { getStore } from "../../store"
import type { Record, Unsubscribe } from "../../types"

/**
 * Adds a subscriber to the store for a given schema and id. Will only notify
 * the subscriber when the record with the given id is updated.
 */
export const subscribeToOne = (
  resource: string,
  id: string,
  onChange: (data: Record) => void,
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
