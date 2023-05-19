import { useEffect, useState } from "react";
import { isEmpty } from "lodash"

import type { Schema } from "@hatchifyjs/data-core";

import { useHatchifyPresentation } from "..";
import { getFormFields } from "../../services";

import type { Primitive, FieldComponent } from "../../presentation/interfaces";
import type {
  FormFieldValueType,
  HatchifyFormField,
} from "../../services";

export type FormState = { [key: string]: Primitive | string[] }

interface HatchifyFormProps {
  isEdit?: boolean
  schema: Schema
  fieldComponents?: { [attribute: string]: FieldComponent }
  routeOnSuccess: () => void
  children?: React.ReactNode | null
}

export const HatchifyForm: React.FC<HatchifyFormProps> = ({
  isEdit = false,
  schema,
  fieldComponents,
  routeOnSuccess,
  children,
}) => {
  const { Form, defaultFieldComponents } = useHatchifyPresentation()
  const [formFields, setFormFields] = useState<HatchifyFormField[]>([])
  const [formState, setFormState] = useState<FormState>({})

  useEffect(() => {
    getFormFields(
      schema,
      fieldComponents || {},
      defaultFieldComponents,
      children,
    ).then((formFields) => {
      setFormFields(formFields)
      setFormState(getDefaultFormState(formFields))
    })
  }, [])

  const onSave = async () => {
    try {
      // await createOne(schema, formFields, formState)
      routeOnSuccess()
    } catch (error) {
      console.error("failed to create", error)
    }
  }

  const onUpdateField = ({
    key,
    value,
  }: {
    key: string
    value: FormFieldValueType
  }) => {
    setFormState({ ...formState, [key]: value })
  }

  return (
    <Form
      isEdit={isEdit}
      fields={!isEmpty(formState) ? formFields : []}
      formState={formState}
      onUpdateField={onUpdateField}
      onSave={onSave}
    />
  )
}

function getDefaultFormState(formFields: HatchifyFormField[]): FormState {
  return formFields.reduce((acc, next) => {
    return {
      ...acc,
      // set default value
      [next.key]:
        next.attributeSchema.type === "relationship"
          ? []
          : next.attributeSchema.type === "boolean"
          ? false
          : next.attributeSchema.type === "number"
          ? 0
          : "",
    }
  }, {})
}