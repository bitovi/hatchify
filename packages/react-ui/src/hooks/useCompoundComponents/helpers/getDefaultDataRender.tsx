import type { FinalAttributeRecord, PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaNames,
  Record,
} from "@hatchifyjs/rest-client"
import type { DefaultValueComponentsTypes } from "../../../components"

export function getDefaultDataRender<
  const TSchemas extends globalThis.Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>({
  finalSchemas,
  schemaName,
  control,
  field,
  isRelationship,
  isAdditional,
  defaultValueComponents,
}: {
  finalSchemas: FinalSchemas
  schemaName: TSchemaName
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

    if (isRelationship && value) {
      value.label = value?.__label || value?.id

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
      const { maxDisplayLength } = control
      const formattedValue = maxDisplayLength
        ? `${value.substr(0, maxDisplayLength).trim()}...`
        : value
      return <String value={formattedValue} />
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
