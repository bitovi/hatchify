import type { PartialSchema } from "@hatchifyjs/core"
import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import type { XDataGridProps } from "../../react-ui.js"
import { useHatchifyPresentation } from "../index.js"

function HatchifyFilters<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(props: XDataGridProps<TSchemas, TSchemaName>): JSX.Element {
  const { Filters } = useHatchifyPresentation()
  return <Filters {...props} />
}

export default HatchifyFilters
