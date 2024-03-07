import type { PartialSchema } from "@hatchifyjs/core"
import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import type { XDataGridProps } from "../../react-ui.js"
import { useHatchifyPresentation } from "../index.js"

function HatchifyList<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(props: XDataGridProps<TSchemas, TSchemaName>): JSX.Element {
  const { List } = useHatchifyPresentation()
  return <List {...props} />
}

export default HatchifyList
