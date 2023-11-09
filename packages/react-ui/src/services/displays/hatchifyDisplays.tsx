import { Children as ReactChildren } from "react"
import cloneDeep from "lodash/cloneDeep"
import { v4 as uuidv4 } from "uuid"
import type { Attribute, Record, Schema } from "@hatchifyjs/rest-client"

import {
  HatchifyColumn,
  HatchifyExtraColumn,
  HatchifyEmptyList,
} from "../../components"

import type {
  // Attribute,
  Relationship as RelationshipType,
  ValueComponent,
} from "../../presentation/interfaces"

import type {
  Render,
  RenderValue,
  DefaultValueComponentsTypes,
} from "../../components"
import type { FinalSchema } from "@hatchifyjs/core"

export interface HatchifyDisplay {
  sortable: boolean
  key: string
  label: string
  dataCellRender: ({ record }: { record: Record }) => React.ReactNode
  headerCellRender: ({ record }: { record: Record }) => React.ReactNode
}

export function getDefaultDisplayRender(
  attribute: string,
  attributeType: string,
  defaultValueComponents: DefaultValueComponentsTypes,
): ({ record }: { record: Record }) => React.ReactNode {
  const attType = attributeType.toLowerCase()
  const { String, Number, Boolean, Relationship, RelationshipList, Date } =
    defaultValueComponents

  // @todo primitive lists?
  const defaultRender = ({ record }: { record: Record }) => {
    const value = record[attribute]

    if (["date", "dateonly", "datetime"].includes(attType)) {
      return <Date value={value} dateOnly={attType === "dateonly"} />
    }

    if (
      (attType === "string" || attType === "enum") &&
      typeof value === "string"
    ) {
      return <String value={value} />
    }

    if (attType === "boolean" && typeof value === "boolean") {
      return <Boolean value={value} />
    }

    if (attType === "number" && typeof value === "number") {
      return <Number value={value} />
    }

    // @todo <HatchifyColumn/> with relationship category|user|filetype is coming through as "extra" rather than "relationship"
    if (attType === "relationship" || attType === "extra") {
      if (!value) {
        return <String value="" />
      }

      // todo: __label is set at `react-rest` level - ideally this package is responsible for figuring out label via displayAttribute
      value.label = value.__label || value.id

      return Array.isArray(value) ? (
        <RelationshipList values={value} />
      ) : (
        <Relationship value={value as RelationshipType} />
      )
    }

    // fallback
    return <String value=" " />
  }

  return defaultRender
}

export function getDisplaysFromChildren(
  schema: Schema,
  defaultValueComponents: DefaultValueComponentsTypes,
  children: JSX.Element[],
): HatchifyDisplay[] {
  const displays = children
    .filter((child) => child.type.name === HatchifyColumn.displayName)
    .map((child) => {
      const { props } = child
      const relationship = schema?.relationships?.[props.attribute]

      return getHatchifyDisplay({
        isRelationship: relationship !== undefined,
        attribute: props.attribute,
        label: props.label,
        attributeSchema: relationship
          ? null
          : schema.attributes[props.attribute],
        defaultValueComponents,
        dataCellRenderValue: props.dataCellRenderValue,
        DataCellValueComponent: props.DataCellValueComponent,
        headerCellRenderValue: props.headerCellRenderValue,
        HeaderCellValueComponent: props.HeaderCellValueComponent,
      })
    })

  return displays
}

export function getDisplaysFromSchema(
  schema: FinalSchema,
  defaultValueComponents: DefaultValueComponentsTypes,
  dataCellValueComponents: {
    [attribute: string]: ValueComponent
  } | null,
  headerCellValueComponents: {
    [attribute: string]: ValueComponent
  } | null,
): HatchifyDisplay[] {
  const attributesDisplays = Object.entries(schema.attributes)
    .filter(([, { control }]) => control.hidden !== true)
    .map(([attributeName, { control }]) => {
      return getHatchifyDisplay({
        sortable: true,
        attribute: attributeName,
        attributeSchema: control,
        dataCellValueComponents,
        headerCellValueComponents,
        defaultValueComponents,
      })
    })

  // table does not need to show many relationships by default at the moment
  // const manyRelationshipDisplays = Object.entries(schema?.relationships || {})
  //   .filter(([key, relationship]) => {
  //     return (
  //       relationship.type === "hasMany" ||
  //       relationship.type === "hasManyThrough"
  //     )
  //   })
  //   .map(([key, relationship]) => {
  //     return getHatchifyDisplay({
  //       isRelationship: true,
  //       attribute: key,
  //       label: key,
  //       attributeSchema: null, // the schema in this case is a "relationship"
  //       valueComponents,
  //       defaultValueComponents,
  //     })
  //   })

  const oneRelationshipDisplays = Object.entries(schema?.relationships || {})
    .filter(([key, relationship]) => {
      return relationship.type === "belongsTo" || relationship.type === "hasOne"
    })
    .map(([key, relationship]) => {
      // related schema = schema[relationship.schema]
      return getHatchifyDisplay({
        isRelationship: true,
        attribute: key,
        label: key,
        attributeSchema: null, // the schema in this case is a "relationship"
        dataCellValueComponents,
        headerCellValueComponents,
        defaultValueComponents,
      })
    })

  return [
    ...attributesDisplays,
    // ...manyRelationshipDisplays,
    ...oneRelationshipDisplays,
  ]
}

// @todo refactor the logic around render in this function
export function getHatchifyDisplay({
  attribute,
  sortable = true,
  isRelationship = false,
  isExtraDisplay = false, // @todo necessary? should always be covered by `dataCellRender` or `DataCellValueComponent` case!
  label = null,
  attributeSchema = null,
  DataCellValueComponent = null,
  dataCellValueComponents = null,
  HeaderCellValueComponent = null,
  headerCellValueComponents = null,
  defaultValueComponents,
  dataCellRender = null,
  dataCellRenderValue = null,
  headerCellRender = null,
  headerCellRenderValue = null,
}: {
  isRelationship?: boolean
  sortable?: boolean
  isExtraDisplay?: boolean
  attribute: string
  label?: string | null
  attributeSchema?: Attribute | null
  DataCellValueComponent?: ValueComponent | null
  dataCellValueComponents?: {
    [attribute: string]: ValueComponent
  } | null
  HeaderCellValueComponent?: ValueComponent | null
  headerCellValueComponents?: {
    [attribute: string]: ValueComponent
  } | null
  defaultValueComponents: DefaultValueComponentsTypes
  dataCellRender?: Render | null
  dataCellRenderValue?: RenderValue | null
  headerCellRender?: Render | null
  headerCellRenderValue?: RenderValue | null
}): HatchifyDisplay {
  if (!attributeSchema) {
    attributeSchema = { type: "extra" }
  }

  if (typeof attributeSchema === "string") {
    attributeSchema = { type: attributeSchema }
  }

  if (isRelationship) {
    attributeSchema = { type: "relationship" }
  }

  const display: HatchifyDisplay = {
    sortable,
    key: attribute || uuidv4(),
    label:
      label ||
      attribute // convert to "Title Case"
        .replace(/(^\w)/g, (g) => g[0].toUpperCase())
        .replace(/([-_]\w)/g, (g) => " " + g[1].toUpperCase())
        .trim(),
    dataCellRender: () => null,
    headerCellRender: () => null,
  }

  /**
   * cell render priority:
   * 1. `dataCellRenderValue` prop from `HatchifyExtraColumn` or `HatchifyColumn`
   * 2. `DataCellValueComponent` prop from `HatchifyExtraColumn` or `HatchifyColumn`
   * 3. `valueComponents` prop from `HatchifyList`
   * 6. default `dataCellRender` using presentation's defaultvalueComponents
   */

  if (dataCellRender) {
    display.dataCellRender = ({ record }) => dataCellRender({ record })
  } else if (dataCellRenderValue) {
    display.dataCellRender = ({ record }) =>
      dataCellRenderValue({ record, value: record[attribute] })
  } else if (DataCellValueComponent) {
    display.dataCellRender = ({ record }) => (
      <DataCellValueComponent
        value={record[attribute]}
        record={record}
        attributeSchema={attributeSchema}
        attribute={attribute}
      />
    )
  } else if (dataCellValueComponents && dataCellValueComponents[attribute]) {
    const RenderCell = dataCellValueComponents[attribute]
    display.dataCellRender = ({ record }) => (
      <RenderCell
        value={record[attribute]}
        record={record}
        attributeSchema={attributeSchema}
      />
    )
  } else {
    display.dataCellRender = getDefaultDisplayRender(
      attribute,
      attributeSchema.type,
      defaultValueComponents,
    )
  }

  if (headerCellRender) {
    display.headerCellRender = ({ record }) => headerCellRender({ record })
  } else if (headerCellRenderValue) {
    display.headerCellRender = ({ record }) =>
      headerCellRenderValue({ record, value: record[attribute] })
  } else if (HeaderCellValueComponent) {
    display.headerCellRender = ({ record }) => (
      <HeaderCellValueComponent
        value={record[attribute]}
        record={record}
        attributeSchema={attributeSchema}
        attribute={attribute}
      />
    )
  } else if (
    headerCellValueComponents &&
    headerCellValueComponents[attribute]
  ) {
    const RenderHeader = headerCellValueComponents[attribute]
    display.headerCellRender = ({ record }) => (
      <RenderHeader
        value={record[attribute]}
        record={record}
        attributeSchema={attributeSchema}
      />
    )
  } else {
    display.headerCellRender = undefined
  }

  return display
}

export function injectExtraDisplays(
  displays: HatchifyDisplay[],
  defaultValueComponents: DefaultValueComponentsTypes,
  children: JSX.Element[],
): HatchifyDisplay[] {
  const updatedDisplays = cloneDeep(displays)
  for (let i = 0; i < children.length; i++) {
    if (children[i].type.name !== HatchifyExtraColumn.displayName) {
      continue
    }
    const { props } = children[i]
    // @todo add according to props.after property
    updatedDisplays.push(
      getHatchifyDisplay({
        isExtraDisplay: true,
        label: props.label,
        attribute: props.label,
        dataCellRender: props.dataCellRender,
        DataCellValueComponent: props.DataCellValueComponent,
        headerCellRender: props.headerCellRender,
        HeaderCellValueComponent: props.HeaderCellValueComponent,
        defaultValueComponents,
      }),
    )
  }

  return updatedDisplays
}

export function hasValidChildren(
  displayName: string,
  children: JSX.Element[],
): boolean {
  return children.some((child) => child.type.name === displayName)
}

export function getDisplays(
  // todo: future; remove any, `getDisplays` used by Details page which is not yet implemented
  schema: FinalSchema,
  dataCellValueComponents: { [field: string]: ValueComponent } | undefined,
  headerCellValueComponents: { [field: string]: ValueComponent } | undefined,
  defaultValueComponents: DefaultValueComponentsTypes,
  children: React.ReactNode | null,
): HatchifyDisplay[] {
  // casting as JSX.Element because helper functions require access to
  // `child.type.name` and `child.props`
  const childArray = ReactChildren.toArray(children) as JSX.Element[]

  let displays = hasValidChildren(HatchifyColumn.displayName || "", childArray)
    ? getDisplaysFromChildren(
        // todo: future; remove unknown, `getDisplays` used by Details page which is not yet implemented
        schema as unknown as Schema,
        defaultValueComponents,
        childArray,
      )
    : getDisplaysFromSchema(
        schema,
        defaultValueComponents,
        dataCellValueComponents || null,
        headerCellValueComponents || null,
      )
  if (hasValidChildren(HatchifyExtraColumn.displayName || "", childArray)) {
    displays = injectExtraDisplays(displays, defaultValueComponents, childArray)
  }
  return displays
}

export function getEmptyList(children: React.ReactNode): () => JSX.Element {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]

  const emptyChild = childArray.find(
    (child) => child.type.name === HatchifyEmptyList.displayName,
  )

  const emptyDisplay: JSX.Element = emptyChild?.props.children || undefined

  const EmptyList = () => {
    return emptyDisplay || <div>There are no rows of data to display</div>
  }

  return EmptyList
}
