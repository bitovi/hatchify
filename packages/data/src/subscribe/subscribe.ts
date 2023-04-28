import { getStore } from "../store"

export type Unsubscribe = () => void

export const subscribeToList = (
  resource: string,
  onChange: (data: any) => void,
): Unsubscribe => {
  const store = getStore(resource)

  store.subscribers.push(onChange)

  return () => {
    store.subscribers = store.subscribers.filter((fn) => fn !== onChange)
  }
}
