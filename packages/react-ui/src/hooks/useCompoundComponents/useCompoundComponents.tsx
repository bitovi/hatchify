import { Children as ReactChildren } from "react"
import type { FinalSchemas, Record } from "@hatchifyjs/rest-client"
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

export default function useCompoundComponents(
  finalSchemas: FinalSchemas,
  schemaName: string,
  children: React.ReactNode | null,
): CompoundComponents {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]
  const valueComponents = useHatchifyPresentation().defaultValueComponents

  return {
    columns: getColumns(finalSchemas, schemaName, valueComponents, childArray),
    Empty: getEmptyList(childArray),
  }
}
