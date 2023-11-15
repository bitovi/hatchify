import type { PartialSchema } from "@hatchifyjs/core"
import type { GetSchemaFromName, GetSchemaNames, RecordType } from "."

export type Unsubscribe = () => void

export type Subscription = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  data: Array<RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>>,
) => void
