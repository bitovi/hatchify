import type {
  PartialAttributeRecord,
  FinalAttributeRecord,
} from "@hatchifyjs/core"
import type { FilterArray, FinalSchemas } from "@hatchifyjs/rest-client"
import { Fragment } from "react"
import { Grid, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ColumnSelect from "./inputs/ColumnSelect"
import OperatorSelect from "./inputs/OperatorSelect"
import ValueInput from "./inputs/ValueInput"
import capitalize from "lodash/capitalize"

type ChangeParams =
  | {
      field: "value"
      value: string | string[]
      index: number
    }
  | {
      field: "field" | "operator"
      value: string
      index: number
    }
interface Option {
  operator: string
  text: string
}

type OperatorOption = {
  [key in "enum" | "Dateonly" | "Datetime" | "String"]: Option[]
}

const operatorOptions: OperatorOption = {
  String: [
    { operator: "icontains", text: "contains" },
    { operator: "istarts", text: "starts with" },
    { operator: "iends", text: "ends with" },
    { operator: "$eq", text: "equals" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
    { operator: "$in", text: "is any of" },
  ],
  Dateonly: [
    { operator: "$eq", text: "is" },
    { operator: "$gt", text: "is after" },
    { operator: "$gte", text: "is on or after" },
    { operator: "$lt", text: "is before" },
    { operator: "$lte", text: "is on or before" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
  ],
  Datetime: [
    { operator: "$eq", text: "is" },
    { operator: "$gt", text: "is after" },
    { operator: "$gte", text: "is on or after" },
    { operator: "$lt", text: "is before" },
    { operator: "$lte", text: "is on or before" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
  ],
  enum: [
    { operator: "$eq", text: "is" },
    { operator: "$ne", text: "is not" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
    { operator: "$in", text: "is any of" },
    { operator: "$nin", text: "is not any of" },
  ],
}

export const MuiFilterRows: React.FC<{
  // todo: stricter typing
  attributes: PartialAttributeRecord
  fields: string[]
  filters: FilterArray
  finalSchemas: FinalSchemas
  schemaName: string
  setFilters: (filters: FilterArray) => void
  removeFilter: (index: number) => void
}> = ({
  attributes,
  finalSchemas,
  fields,
  filters,
  schemaName,
  setFilters,
  removeFilter,
}) => {
  const onChange = ({ field, value, index }: ChangeParams) => {
    const newFilters = [...filters]

    // modifying column select
    if (field === "field") {
      //Get correct attributes for comparison
      const { baseAttributes: newAttributes, baseField: newField } =
        getFieldAndAttributes(finalSchemas, value, schemaName)
      const { baseAttributes: currentAttributes, baseField: currentField } =
        getFieldAndAttributes(finalSchemas, newFilters[index].field, schemaName)

      // change the operator if existing operator does not exist on new column
      newFilters[index].operator = getAvailableOperator(
        newField,
        newFilters[index].operator,
        newAttributes,
      )

      // reset the filter value if switching from one field type to another
      if (
        getFieldType(newAttributes, newField) !==
        getFieldType(currentAttributes, currentField)
      ) {
        newFilters[index].value = ""
      }
    }

    // modifying operator select
    if (field === "operator") {
      // reset the filter value if switching from an array operator to another operator and vice versa
      if (value !== "$nin" && value !== "$in") {
        newFilters[index].value = Array.isArray(filters[index].value)
          ? ""
          : filters[index].value
      }
      if (value === "$nin" || value === "$in") {
        newFilters[index].value = Array.isArray(filters[index].value)
          ? filters[index].value
          : []
      }
    }

    newFilters[index][field] = value as string & string[]
    setFilters(newFilters)
  }

  return (
    <Grid container spacing={1} alignItems="center" justifyContent="center">
      {/* {filters.map((filter, index) => (
        <Fragment key={index}>
          <Grid item xs={1}>
            <IconButton aria-label="close" onClick={() => removeFilter(index)}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <ColumnSelect
              labelId={`${index}-column-label`}
              value={filter.field}
              fields={fields}
              onChange={(value) =>
                onChange({
                  field: "field",
                  value,
                  index: index,
                })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <OperatorSelect
              labelId={`${index}-operator-label`}
              value={filter.operator}
              options={getPossibleOptions(filter.field, attributes)}
              onChange={(value) =>
                onChange({
                  field: "operator",
                  value,
                  index: index,
                })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <ValueInput
              labelId={`${index}-value-label`}
              fieldType={getFieldType(attributes, filter.field)}
              value={filter.value}
              operator={filter.operator}
              onChange={(value: any) =>
                onChange({ field: "value", value, index })
              }
              // todo: v2 schema only supports numbers, fix with enums (use finalSchema.attributes)
              options={undefined}
            />
          </Grid>
        </Fragment>
      ))} */}
      {filters.map((filter, index) => {
        const { baseAttributes, baseField } = getFieldAndAttributes(
          finalSchemas,
          filter.field,
          schemaName,
        )

        return (
          <Fragment key={index}>
            <Grid item xs={1}>
              <IconButton
                aria-label="close"
                onClick={() => removeFilter(index)}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3}>
              <ColumnSelect
                labelId={`${index}-column-label`}
                value={filter.field}
                fields={fields}
                onChange={(value) =>
                  onChange({
                    field: "field",
                    value,
                    index: index,
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <OperatorSelect
                labelId={`${index}-operator-label`}
                value={filter.operator}
                options={getPossibleOptions(baseField, baseAttributes)}
                onChange={(value) =>
                  onChange({
                    field: "operator",
                    value,
                    index: index,
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <ValueInput
                labelId={`${index}-value-label`}
                fieldType={getFieldType(baseAttributes, baseField)}
                value={filter.value}
                operator={filter.operator}
                onChange={(value: any) =>
                  onChange({ field: "value", value, index })
                }
                options={baseAttributes[filter.field].control?.values || []}
              />
            </Grid>
          </Fragment>
        )
      })}
    </Grid>
  )
}

export default MuiFilterRows

// Get the first available operator for the field type
export function getAvailableOperator(
  field: string,
  // todo: operator should be it's own type used in FilterArray & Option
  operator: string,
  attributes: FinalAttributeRecord,
): Option["operator"] {
  const availableOptions = getPossibleOptions(field, attributes)

  const optionAvailable = availableOptions.find((option) => {
    return option.operator === operator ? option : undefined
  })

  return optionAvailable?.operator ?? availableOptions[0].operator
}

// Filter out operators that are not available for the field type
export function getPossibleOptions(
  field: string,
  attributes: FinalAttributeRecord,
): Option[] {
  const attribute = attributes[field]
  const fieldType = attribute.control.type
  const required = !attribute.control.allowNull

  const options = operatorOptions[
    // todo(v2 schema): operatorOption types should match possible Attribute types
    fieldType as keyof OperatorOption
  ].filter((option) => {
    return required
      ? option.operator !== "empty" && option.operator !== "nempty"
      : option
  })

  return options
}

export const getFieldType = (
  attributes: FinalAttributeRecord, // todo: stricter typing
  field: string,
): string => {
  const attribute = attributes[field]
  return attribute.control.type
}

export const getFieldAndAttributes = (
  finalSchemas: FinalSchemas,
  field: string,
  schemaName: string,
): { baseAttributes: FinalAttributeRecord; baseField: string } => {
  const baseField = field.includes(".") ? field.split(".")[1] : field

  const baseAttributes =
    finalSchemas[
      field.includes(".") ? capitalize(field.split(".")[0]) : schemaName
    ].attributes

  return { baseAttributes, baseField }
}
