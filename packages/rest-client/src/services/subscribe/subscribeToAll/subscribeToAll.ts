import type { PartialSchema } from "@hatchifyjs/core"
import { getStore } from "../../store"
import type {
  GetSchemaFromName,
  GetSchemaNames,
  QueryList,
  RecordType,
  Unsubscribe,
} from "../../types"
import { SchemaNameNotStringError, schemaNameIsString } from "../../utils"

/**
 * Adds a subscriber to the store for a given schema.
 */
export const subscribeToAll = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  resource: TSchemaName,
  query: QueryList | undefined,
  onChange: (
    data: Array<RecordType<GetSchemaFromName<TSchemas, TSchemaName>>>,
  ) => void,
): Unsubscribe => {
  if (!schemaNameIsString) {
    throw new SchemaNameNotStringError(resource)
  }

  const store = getStore(resource as string)

  store.subscribers.push(onChange)

  return () => {
    store.subscribers = store.subscribers.filter((fn) => fn !== onChange)
  }
}
