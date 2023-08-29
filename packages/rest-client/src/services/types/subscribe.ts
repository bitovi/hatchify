import { PartialSchema } from "@hatchifyjs/hatchify-core"
import { GetSchemaFromName, GetSchemaNames, RecordType } from "."

export type Unsubscribe = () => void

export type Subscription = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  data: RecordType<GetSchemaFromName<TSchemas, TSchemaName>>[],
) => void
