import type { PartialSchema } from "@hatchifyjs/core"
import { getStore } from "../../store/index.js"
import type {
  GetSchemaFromName,
  GetSchemaNames,
  QueryList,
  RecordType,
  Unsubscribe,
} from "../../types/index.js"
import { SchemaNameNotStringError, schemaNameIsString } from "../../utils/index.js"

/**
 * Adds a subscriber to the store for a given schema.
 */
export const subscribeToAll = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  resource: TSchemaName,
  query: QueryList<GetSchemaFromName<TSchemas, TSchemaName>> | undefined,
  onChange: (
    data: Array<RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>>,
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
