import type { PartialSchema } from "@hatchifyjs/core"
import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import type { XDataGridProps } from "../../react-ui.js"
import { useHatchifyPresentation } from "../index.js"

function HatchifyPagination<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(props: XDataGridProps<TSchemas, TSchemaName>): JSX.Element {
  const { Pagination } = useHatchifyPresentation()
  return <Pagination {...props} />
}

export default HatchifyPagination
