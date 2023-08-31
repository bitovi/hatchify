import type { PartialSchema } from "@hatchifyjs/hatchify-core"
import { getStore } from "../../store"
import type {
  GetSchemaFromName,
  GetSchemaNames,
  QueryList,
  RecordType,
  Unsubscribe,
} from "../../types"

/**
 * Adds a subscriber to the store for a given schema.
 */
export const subscribeToAll = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  resource: string,
  query: QueryList | undefined,
  onChange: (
    data: Array<RecordType<GetSchemaFromName<TSchemas, TSchemaName>>>,
  ) => void,
): Unsubscribe => {
  const store = getStore(resource)

  store.subscribers.push(onChange)

  return () => {
    store.subscribers = store.subscribers.filter((fn) => fn !== onChange)
  }
}
