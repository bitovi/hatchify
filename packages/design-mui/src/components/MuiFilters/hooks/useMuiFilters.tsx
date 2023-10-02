import type { XCollectionProps } from "@hatchifyjs/react-ui"
import { capitalize } from "lodash"
import { useEffect, useRef, useState } from "react"

type HatchifyMuiFilters = {
  fields: string[]
}

export default function useMuiFilter(
  allSchemas: XCollectionProps["allSchemas"],
  schemaName: XCollectionProps["schemaName"],
  include: string[],
): HatchifyMuiFilters {
  const allSchemasRef = useRef(allSchemas)
  const includeRef = useRef(include)
  const defaultFields = Object.entries(
    allSchemasRef.current[schemaName].attributes,
  )
    .filter(([, attr]) =>
      typeof attr === "object"
        ? attr.type === "string" || attr.type === "date" || attr.type === "enum"
        : attr === "string" || attr === "date",
    )
    .map(([key]) => key)
  const defaultFieldsRef = useRef(defaultFields)
  const [fields, setFields] = useState<string[]>(defaultFields)

  useEffect(() => {
    //get related schemas that are included in the table
    const relatedSchemas = Object.entries(
      allSchemasRef.current[schemaName].relationships || {},
    )
      .map(([key]) => key)
      .filter((item) => includeRef.current?.includes(item))

    const fieldSet: string[] = [...defaultFieldsRef.current]
    const relatedFields = () => {
      for (let i = 0; i < relatedSchemas.length; i++) {
        fieldSet.push(
          ...Object.entries(
            allSchemasRef.current[capitalize(relatedSchemas[i])].attributes,
          )
            .filter(([, attr]) =>
              typeof attr === "object"
                ? attr.type === "string" ||
                  attr.type === "date" ||
                  attr.type === "enum"
                : attr === "string" || attr === "date",
            )
            .map(([key]) => {
              return `${relatedSchemas[i]}.${key}`
            }),
        )
      }
    }

    relatedFields()

    setFields(fieldSet)
  }, [allSchemasRef, defaultFieldsRef, includeRef, schemaName])
  return {
    fields,
  }
}
