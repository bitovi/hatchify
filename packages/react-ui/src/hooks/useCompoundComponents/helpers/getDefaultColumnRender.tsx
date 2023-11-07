import type { FinalAttributeRecord } from "@hatchifyjs/core"
import type { FinalSchemas, Record } from "@hatchifyjs/rest-client"
import type { DefaultValueComponentsTypes } from "../../../components"

export function getDefaultColumnRender({
  finalSchemas,
  schemaName,
  control,
  field,
  isRelationship,
  isAdditional,
  defaultValueComponents,
}: {
  finalSchemas: FinalSchemas
  schemaName: string
  control: FinalAttributeRecord[string]["control"]
  field: string
  isRelationship: boolean
  isAdditional: boolean
  defaultValueComponents: DefaultValueComponentsTypes
}): ({ record }: { record: Record }) => React.ReactNode {
  const type = control?.type.toLowerCase() || null
  const { String, Number, Boolean, Relationship, RelationshipList, Date } =
    defaultValueComponents

  const defaultRender = ({ record }: { record: Record }) => {
    const value = record[field]

    if (isRelationship) {
      value.label = value.__label || value.id

      return Array.isArray(value) ? (
        <RelationshipList values={value} />
      ) : (
        <Relationship value={value} />
      )
    }

    if (isAdditional || !value || !type) {
      return <String value="" />
    }

    if (type === "date" || type === "dateonly" || type === "datetime") {
      return <Date value={value} dateOnly={type === "dateonly"} />
    }

    if (type === "string" || type === "enum") {
      return <String value={value} />
    }

    if (type === "boolean") {
      return <Boolean value={value} />
    }

    if (type === "number") {
      return <Number value={value} />
    }

    // fallback
    return <String value="" />
  }

  return defaultRender
}
