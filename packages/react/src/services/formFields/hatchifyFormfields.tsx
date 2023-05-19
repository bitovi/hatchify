
import { Children as ReactChildren } from "react"
import { hasValidChildren } from "../displays/hatchifyDisplays"
import { HatchifyAttributeField } from "../../components";

import type { Schema } from "data-core";
import type { Attribute, AttributeSchema, Primitive, FieldComponent } from "../../presentation/interfaces";
import type {DefaultFieldComponentsTypes, HatchifyAttributeFieldProps} from "../../components";

export type FormFieldValueType = Primitive | string[]

export type FormFieldRender = ({
  value,
  label,
  onUpdate,
}: {
  value: FormFieldValueType
  label: string
  onUpdate: (value: FormFieldValueType) => void
}) => JSX.Element

export interface HatchifyFormField {
  key: string
  label: string
  attributeSchema: AttributeSchema
  render: FormFieldRender
}

export async function getFormFields(
  schema: Schema,
  fieldComponents: { [attribute: string]: FieldComponent },
  defaultFieldComponents: DefaultFieldComponentsTypes,
  children: React.ReactNode | null,
): Promise<HatchifyFormField[]> {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]

  return hasValidChildren(HatchifyAttributeField.name, childArray)
    ? getFormFieldsFromChildren(schema, defaultFieldComponents, childArray)
    : getFormFieldsFromSchema(schema, defaultFieldComponents, fieldComponents)
}

export function getFormFieldsFromChildren(
  schema: Schema,
  defaultFieldComponents: DefaultFieldComponentsTypes,
  children: JSX.Element[],
): HatchifyFormField[] {
  const formFields = children
    .filter((child) => child.type.name === HatchifyAttributeField.name)
    .map((child) => {
      const { props }: { props: HatchifyAttributeFieldProps } = child

      return getHatchifyFormField({
        attribute: props.attribute,
        attributeSchema: schema.attributes[props.attribute],
        label: props.label,
        defaultFieldComponents,
      })
    })

  return formFields
}

export async function getFormFieldsFromSchema(
  schema: Schema,
  defaultFieldComponents: DefaultFieldComponentsTypes,
  fieldComponents?: { [attribute: string]: FieldComponent },
): Promise<HatchifyFormField[]> {
  const attributesFormFields = Object.entries(schema.attributes)
    .filter(([_, schema]) => {
      return typeof schema === "object" ? !schema?.primaryKey : true
    })
    .map(([key, value]) => {
      return getHatchifyFormField({
        attribute: key,
        attributeSchema: value,
        defaultFieldComponents,
        fieldComponents,
      })
    })

  const hasManyFormFields = await Promise.all(
    Object.values(schema?.hasMany || []).map(async (value) => {
      const raw = await fetch(`${API_BASE_URL}/${value.target}s`)
      const response = await raw.json()
      const displayFieldKey = getDisplayValueKeyForSchema(value.target)
      const options = getFlatRecords(response).map((item) => ({
        id: item.id as string,
        label: item[displayFieldKey] as string,
      }))

      return getHatchifyFormField({
        attribute: value.target.toLowerCase(),
        label: value.target,
        attributeSchema: "relationship",
        defaultFieldComponents,
        fieldComponents,
        options,
        hasMany: true,
      })
    }),
  )

  const hasOneFormFields = await Promise.all(
    Object.values(schema?.hasOne || []).map(async (value) => {
      const raw = await fetch(`${API_BASE_URL}/${value.target}s`)
      const response = await raw.json()
      const displayFieldKey = getDisplayValueKeyForSchema(value.target)
      const options = getFlatRecords(response).map((item) => ({
        id: item.id as string,
        label: item[displayFieldKey] as string,
      }))

      return getHatchifyFormField({
        attribute: value.target.toLowerCase(),
        label: value.target,
        attributeSchema: "relationship",
        defaultFieldComponents,
        fieldComponents,
        options,
        hasMany: false,
      })
    }),
  )

  return [...attributesFormFields, ...hasManyFormFields, ...hasOneFormFields]
}

export function getHatchifyFormField({
  attribute,
  attributeSchema,
  defaultFieldComponents,
  label = undefined,
  FieldComponent = undefined,
  fieldComponents = undefined,
  render = undefined,
  options = undefined,
  hasMany = false,
}: {
  attribute: string
  attributeSchema: Attribute
  defaultFieldComponents: DefaultFieldComponentsTypes
  label?: string
  FieldComponent?: FieldComponent
  fieldComponents?: { [attribute: string]: FieldComponent }
  render?: FormFieldRender
  options?: Array<{ id: string; label: string }>
  hasMany?: boolean
}): HatchifyFormField {
  if (typeof attributeSchema === "string") {
    attributeSchema = { type: attributeSchema, allowNull: false }
  }

  const formField: HatchifyFormField = {
    key: attribute,
    label:
      label ||
      attribute // convert to "Title Case"
        .replace(/(^\w)/g, (g) => g[0].toUpperCase())
        .replace(/([-_]\w)/g, (g) => " " + g[1].toUpperCase())
        .trim(),
    attributeSchema,
    render: () => <></>,
  }

  if (render) {
    formField.render = ({ value, label, onUpdate }) =>
      render({
        value,
        label,
        onUpdate: (value) => onUpdate(value),
      })
  } else if (FieldComponent) {
    formField.render = ({ value, onUpdate }) => (
      <FieldComponent
        attributeSchema={attributeSchema}
        value={value}
        onUpdate={onUpdate}
      />
    )
  } else if (fieldComponents && fieldComponents[attribute]) {
    const RenderFieldComponent = fieldComponents[attribute]
    formField.render = ({ value, onUpdate }) => (
      <RenderFieldComponent
        attributeSchema={attributeSchema}
        value={value}
        onUpdate={onUpdate}
      />
    )
  } else {
    formField.render = getDefaultFormFieldRender(
      attribute,
      attributeSchema,
      defaultFieldComponents,
      options,
    )
  }

  return formField
}

export function getDefaultFormFieldRender(
  attribute: string,
  attributeSchema: AttributeSchema,
  defaultFieldComponents: DefaultFieldComponentsTypes,
  options: Array<{ id: string; label: string }> = [],
): FormFieldRender {
  const { String, Number, Boolean, Date, Relationship } = defaultFieldComponents

  const defaultRender = ({
    value,
    label,
    onUpdate,
  }: {
    value: FormFieldValueType
    label: string
    onUpdate: (value: FormFieldValueType) => void
  }) => {
    if (attributeSchema.type === "date" && typeof value === "string") {
      return <Date label={label} value={value} onUpdate={onUpdate} />
    }

    if (attributeSchema.type === "boolean" && typeof value === "boolean") {
      return <Boolean label={label} value={value} onUpdate={onUpdate} />
    }

    if (attributeSchema.type === "number" && typeof value === "number") {
      return <Number label={label} value={value} onUpdate={onUpdate} />
    }

    if (attributeSchema.type === "string" && typeof value === "string") {
      return <String label={label} value={value} onUpdate={onUpdate} />
    }

    if (attributeSchema.type === "relationship" && Array.isArray(value)) {
      // console.log("attribute", attribute)
      // console.log("attributeSchema", attributeSchema)
      // console.log("options", options)
      // console.log("-----------------")
      return (
        <Relationship
          hasMany={false}
          label={label}
          options={options}
          values={value}
          onUpdate={onUpdate}
        />
      )
    }

    return <String label={label} value={value as string} onUpdate={onUpdate} />
  }

  return defaultRender
}


//TODO Fix these errors