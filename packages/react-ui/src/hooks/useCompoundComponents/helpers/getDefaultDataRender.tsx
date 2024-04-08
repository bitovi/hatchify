import type { FinalAttributeRecord, PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaNames,
  Record,
} from "@hatchifyjs/rest-client"
import type { DefaultDisplayComponentsTypes } from "../../../components/index.js"

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
  defaultDisplayComponents,
}: {
  finalSchemas: FinalSchemas
  schemaName: TSchemaName
  control: FinalAttributeRecord[string]["control"]
  field: string
  isRelationship: boolean
  isAdditional: boolean
  defaultDisplayComponents: DefaultDisplayComponentsTypes
}): ({ record }: { record: Record }) => React.ReactNode {
  const type = control?.type.toLowerCase() || null
  const { String, Number, Boolean, Relationship, RelationshipList, Date } =
    defaultDisplayComponents

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

    if (isAdditional || value == null || !type) {
      return <String value="" />
    }

    if (type === "date") {
      return <Date value={value} step={control.step} />
    }

    if (type === "enum") {
      return <String value={value} />
    }

    if (type === "string") {
      const { maxRenderLength } = control
      const maxRenderLengthExceeded =
        maxRenderLength && value.length > maxRenderLength

      if (!maxRenderLengthExceeded) {
        return <String value={value} />
      }

      const truncatedValue = `${value.substr(0, maxRenderLength)}\u2026`
      return (
        <span aria-label={value}>
          <String value={truncatedValue} />
        </span>
      )
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
