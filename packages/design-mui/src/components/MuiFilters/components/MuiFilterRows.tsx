import type {
  Attribute,
  EnumObject,
  FilterArray,
} from "@hatchifyjs/rest-client"
import { Fragment } from "react"
import {
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import MuiFilterEnumValue from "./MuiFilterEnumValue"

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
  [key in "enum" | "date" | "string"]: Option[]
}

const operatorOptions: OperatorOption = {
  date: [
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
  string: [
    { operator: "ilike", text: "contains" },
    { operator: "$eq", text: "equals" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
  ],
}

export const MuiFilterRows: React.FC<{
  attributes: Record<string, Attribute>
  fields: string[]
  filters: FilterArray
  setFilters: (filters: FilterArray) => void
  removeFilter: (index: number) => void
}> = ({ attributes, fields, filters, setFilters, removeFilter }) => {
  const fieldType = (field: string) => {
    const attribute = attributes[field]
    return typeof attribute === "string" ? attribute : attribute.type
  }

  const onChange = ({ field, value, index }: ChangeParams) => {
    const newFilters = [...filters]
    if (field === "field") {
      newFilters[index].operator = getAvailableOperator(
        value,
        newFilters[index].operator,
        attributes,
      )

      if (fieldType(value) !== fieldType(newFilters[index].field)) {
        newFilters[index].value = ""
      }
    }
    if (field === "operator") {
      //reset the filter value if switching from an array operator to another operator and vice versa
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
      {filters.map((filter, index) => (
        <Fragment key={index}>
          <Grid item xs={1}>
            <IconButton aria-label="close" onClick={() => removeFilter(index)}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <InputLabel id={`${index}-column-label`}>Column</InputLabel>
            <Select
              fullWidth
              variant="standard"
              labelId={`${index}-column-label`}
              value={filter.field}
              onChange={(e) =>
                onChange({
                  field: "field",
                  value: e.target.value,
                  index: index,
                })
              }
            >
              {fields.map((field) => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4}>
            <InputLabel id={`${index}-operator-label`}>Operator</InputLabel>
            <Select
              fullWidth
              variant="standard"
              labelId={`${index}-operator-label`}
              value={filter.operator}
              onChange={(e) =>
                onChange({
                  field: "operator",
                  value: e.target.value,
                  index: index,
                })
              }
            >
              {getPossibleOptions(filter.field, attributes).map((option) => (
                <MenuItem key={option.operator} value={option.operator}>
                  {option.text}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4}>
            {filter.operator !== "empty" && filter.operator !== "nempty" && (
              <>
                {/* todo: We should look into moving this all into its own component */}
                <InputLabel id={`${index}-value-label`}>Value</InputLabel>
                {fieldType(filter.field) === "enum" ? (
                  <MuiFilterEnumValue
                    options={(attributes[filter.field] as EnumObject).values}
                    handleChange={(value) =>
                      onChange({ field: "value", value: value, index })
                    }
                    value={filter.value as string}
                    operator={filter.operator}
                  />
                ) : (
                  <TextField
                    fullWidth
                    placeholder="Filter Value"
                    variant="standard"
                    type={
                      fieldType(filter.field) === "date"
                        ? "datetime-local"
                        : "text"
                    }
                    value={filter.value}
                    onChange={(e) =>
                      onChange({
                        field: "value",
                        value: e.target.value,
                        index: index,
                      })
                    }
                  />
                )}
              </>
            )}
          </Grid>
        </Fragment>
      ))}
    </Grid>
  )
}

export default MuiFilterRows

// Get the first available operator for the field type
export function getAvailableOperator(
  field: string,
  // todo: operator should be it's own type used in FilterArray & Option
  operator: string,
  attributes: {
    [field: string]: Attribute
  },
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
  attributes: {
    [field: string]: Attribute
  },
): Option[] {
  const attribute = attributes[field]
  const fieldType = typeof attribute === "string" ? attribute : attribute.type
  const required = typeof attribute === "string" ? false : !attribute.allowNull

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
