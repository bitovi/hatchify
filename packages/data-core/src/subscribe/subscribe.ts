import { getStore } from "../store"
import type { Record } from "source-jsonapi"

export type Unsubscribe = () => void

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
