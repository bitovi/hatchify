import { useParams } from "react-router-dom"
// import type { Schema } from "@hatchifyjs/rest-client"

import { findOne } from "../../services-legacy/api/api"
import { useHatchifyPresentation } from ".."
import { getDisplays } from "../../services-legacy"

import type { Schema } from "../../services-legacy/api/schemas" //TODO update schema

import type { FlatRecord, ValueComponent } from "../../presentation/interfaces"

interface HatchifyDetailsProps {
  schema: Schema
  dataCellValueComponents?: { [attribute: string]: ValueComponent }
  headerCellValueComponents?: { [attribute: string]: ValueComponent }
  useData?: () => FlatRecord
  children?: React.ReactNode | null
}

export const HatchifyDetails: React.FC<HatchifyDetailsProps> = ({
  // idk what this component does
  schema,
  dataCellValueComponents,
  headerCellValueComponents,
  useData,
  children,
}) => {
  const { id } = useParams<{ id: string }>()
  const { Details, defaultValueComponents } = useHatchifyPresentation()
  const displays = getDisplays(
    schema,
    dataCellValueComponents,
    headerCellValueComponents,
    defaultValueComponents,
    children,
  )

  if (!useData) {
    const resource = findOne(schema, id as string)
    useData = () => resource.read()
  }

  return <Details displays={displays} useData={useData} />
}
