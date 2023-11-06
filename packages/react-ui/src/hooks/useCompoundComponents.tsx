import { FinalAttributeRecord, FinalSchema, uuidv4 } from "@hatchifyjs/core"
import type { HatchifyDisplay } from "../services"
import type { DefaultValueComponentsTypes } from "../components"
import { useHatchifyPresentation } from "../components"
import { Children as ReactChildren } from "react"
import { getDisplaysFromSchema, getHatchifyDisplay } from "../services"
import { FinalSchemas } from "@hatchifyjs/rest-client"
import { ValueComponent } from "../presentation"

interface CompoundComponents {
  columns: HatchifyDisplay[]
  Empty: () => JSX.Element
}

export default function useCompoundComponents(
  schema: FinalSchema,
  children: React.ReactNode | null,
): CompoundComponents {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]
  const valueComponents = useHatchifyPresentation().defaultValueComponents

  return {
    columns: getColumns(schema, valueComponents, childArray),
    Empty: getEmptyList(childArray),
  }
}

export function getColumns(
  schema: FinalSchema,
  valueComponents: DefaultValueComponentsTypes,
  childArray: JSX.Element[],
): HatchifyDisplay[] {
  const hatchifyColumns: HatchifyDisplay[] = []

  const columns = childArray.filter((c) => c.type.name === "Column")
  const prepend = columns.filter((c) => c.props.type === "prepend")
  const append = columns.filter((c) => c.props.type === "append")
  const replace = columns.filter((c) => c.props.type === "replace")
  const overwrite = columns.filter((c) => !c.props.type)

  for (let i = 0; i < prepend.length; i++) {
    const { props } = prepend[i]
    hatchifyColumns.push(
      getHatchifyDisplay({
        sortable: false,
        isExtraDisplay: true,
        label: props.label,
        attribute: props.label,
        render: props.renderValue,
        ValueComponent: props.ValueComponent,
        defaultValueComponents: valueComponents,
      }),
    )
  }

  if (overwrite.length > 0) {
    for (let i = 0; i < overwrite.length; i++) {
      const { props } = overwrite[i]
      const relationship = schema?.relationships?.[props.field]

      hatchifyColumns.push(
        getHatchifyDisplay({
          sortable: true,
          isRelationship: relationship !== undefined,
          label: props.label || null,
          attribute: props.field,
          attributeSchema: relationship
            ? null
            : schema.attributes?.[props.field].control,
          renderValue: props.renderValue,
          ValueComponent: props.ValueComponent,
          defaultValueComponents: valueComponents,
        }),
      )
    }
  } else {
    const schemaColumns = getDisplaysFromSchema(schema, valueComponents, null)

    for (let i = 0; i < schemaColumns.length; i++) {
      const replaceWith = replace.find(
        (c) => c.props.field === schemaColumns[i].key,
      )

      if (replaceWith) {
        const { props } = replaceWith
        const relationship = schema?.relationships?.[props.field]

        hatchifyColumns.push(
          getHatchifyDisplay({
            sortable: true,
            isRelationship: relationship !== undefined,
            label: props.label || null,
            attribute: props.field,
            attributeSchema: relationship
              ? null
              : schema.attributes?.[props.field].control,
            renderValue: props.renderValue,
            ValueComponent: props.ValueComponent,
            defaultValueComponents: valueComponents,
          }),
        )
      } else {
        hatchifyColumns.push(schemaColumns[i])
      }
    }
  }

  for (let i = 0; i < append.length; i++) {
    const { props } = append[i]
    hatchifyColumns.push(
      getHatchifyDisplay({
        sortable: false,
        isExtraDisplay: true,
        label: props.label,
        attribute: props.label,
        render: props.renderValue,
        ValueComponent: props.ValueComponent,
        defaultValueComponents: valueComponents,
      }),
    )
  }

  return hatchifyColumns
}

export function getEmptyList(childArray: JSX.Element[]): () => JSX.Element {
  const emptyComponent = childArray.find((c) => c.type.name === "Empty")
  const emptyDisplay: JSX.Element = emptyComponent?.props.children || undefined
  const EmptyList = () => emptyDisplay || <div>No records found</div>
  return EmptyList
}

// ================================================================================

export function getHatchifyColumn({
  finalSchemas,
  schemaName,
  control,
  field,
  compoundComponentProps,
  isRelationship,
  ValueComponent,
  defaultValueComponents,
}: {
  finalSchemas: FinalSchemas
  schemaName: string
  control?: FinalAttributeRecord[string]["control"] | null
  field?: string | null
  compoundComponentProps: any
  isRelationship?: boolean
  ValueComponent?: ValueComponent | null
  defaultValueComponents: DefaultValueComponentsTypes
}) {
  const isAdditional = control === undefined
  const label = compoundComponentProps?.label || formatFieldAsLabel(field || "")

  const column: HatchifyDisplay = {
    sortable: !isAdditional && !isRelationship, // sortable if an attribute
    key: field || uuidv4(), // if no field, then it's an additional column, but needs a key?
    label,
    render: () => null,
  }

  if (compoundComponentProps.render) {
    column.render = ({ record }) => compoundComponentProps.render({ record })
  } else if (compoundComponentProps.renderValue) {
    column.render = ({ record }) =>
      compoundComponentProps.renderValue({ record })
  } else if (compoundComponentProps.ValueComponent) {
    column.render = ({ record }) =>
      compoundComponentProps.ValueComponent({ record })
  } else if (ValueComponent) {
    column.render = ({ record }) => (
      <ValueComponent
        value={record[field]}
        record={record}
        control={control}
        field={field}
      />
    )
  } else {
    column.render = getDefaultColumnRender(
      finalSchemas,
      schemaName,
      control,
      field,
      isRelationship,
      defaultValueComponents,
    )
  }
}

function getDefaultColumnRender(
  finalSchemas: FinalSchemas,
  schemaName: string,
  control: FinalAttributeRecord[string]["control"],
  field: string,
  isRelationship: boolean,
  defaultValueComponents: DefaultValueComponentsTypes,
): ({ record }: any) => React.ReactNode {
  const type = control.type.toLowerCase()
  const { String, Number, Boolean, Relationship, RelationshipList, Date } =
    defaultValueComponents

  const defaultRender = ({ record }: any) => {
    const value = record[field]

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

    if (isRelationship) {
      // todo
    }

    // fallback - todo: error?
    return <String value="" />
  }

  return defaultRender
}

function formatFieldAsLabel(field: string) {
  return field
}
