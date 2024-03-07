import { Children as ReactChildren } from "react"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  Include,
  Record,
} from "@hatchifyjs/rest-client"
import { useHatchifyPresentation } from "../../components/index.js"
import { getColumns, getEmptyList } from "./helpers/index.js"
import type { HeaderProps } from "../../presentation/index.js"

export interface HatchifyColumn {
  sortable: boolean
  key: string
  label: string
  headerOverride: boolean
  renderData: ({ record }: { record: Record }) => React.ReactNode
  renderHeader: (headerProps: HeaderProps) => React.ReactNode
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
  overwrite: boolean,
  children: React.ReactNode | null,
  include?: Include<GetSchemaFromName<TSchemas, TSchemaName>>,
): CompoundComponents {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]
  const defaultDisplayComponents =
    useHatchifyPresentation().defaultDisplayComponents

  return {
    columns: getColumns(
      finalSchemas,
      schemaName,
      defaultDisplayComponents,
      overwrite,
      childArray,
      include,
    ),
    Empty: getEmptyList(childArray),
  }
}
