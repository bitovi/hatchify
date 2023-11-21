import { Children as ReactChildren } from "react"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  Include,
  Record,
} from "@hatchifyjs/rest-client"
import { useHatchifyPresentation } from "../../components"
import { getColumns, getEmptyList } from "./helpers"

export interface HatchifyColumn {
  sortable: boolean
  key: string
  label: string
  render: ({ record }: { record: Record }) => React.ReactNode
}

interface CompoundComponents {
  columns: HatchifyColumn[]
  Empty: () => JSX.Element
}

export default function useCompoundComponents<
  const TSchemas extends globalThis.Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  finalSchemas: FinalSchemas,
  schemaName: TSchemaName,
  children: React.ReactNode | null,
  include?: Include<GetSchemaFromName<TSchemas, TSchemaName>>,
): CompoundComponents {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]
  const valueComponents = useHatchifyPresentation().defaultValueComponents

  return {
    columns: getColumns(
      finalSchemas,
      schemaName,
      valueComponents,
      childArray,
      include,
    ),
    Empty: getEmptyList(childArray),
  }
}
