import { Fragment } from "react"
import { Attribute, FilterArray } from "@hatchifyjs/rest-client"
import {
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

interface Option {
  operator: string
  text: string
}

type OperatorOption = {
  [key in "string" | "date"]: Option[]
}

const operatorOptions: OperatorOption = {
  string: [
    { operator: "ilike", text: "contains" },
    { operator: "$eq", text: "equals" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
  ],
  date: [
    { operator: "$eq", text: "is" },
    { operator: "$gt", text: "is after" },
    { operator: "$gte", text: "is on or after" },
    { operator: "$lt", text: "is before" },
    { operator: "$lte", text: "is on or before" },
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
  function onChange(
    field: "field" | "operator" | "value",
    value: string,
    index: number,
  ) {
    const newFilters = [...filters]
    newFilters[index][field] = value
    if (field === "field") {
      newFilters[index].operator = getOperator(
        value,
        newFilters[index].operator,
        attributes,
      )
    }
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
              onChange={(e) => onChange("field", e.target.value, index)}
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
              onChange={(e) => onChange("operator", e.target.value, index)}
            >
              {operatorOptions[
                attributes[filter.field] as keyof OperatorOption
              ].map((option) => (
                <MenuItem key={option.operator} value={option.operator}>
                  {option.text}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={4}>
            {filter.operator !== "empty" && filter.operator !== "nempty" && (
              <>
                <InputLabel id={`${index}-value-label`}>Value</InputLabel>
                <TextField
                  fullWidth
                  placeholder="Filter Value"
                  variant="standard"
                  type={
                    (attributes[filter.field] as string) === "date"
                      ? "datetime-local"
                      : "text"
                  }
                  value={filter.value}
                  onChange={(e) => onChange("value", e.target.value, index)}
                />
              </>
            )}
          </Grid>
        </Fragment>
      ))}
    </Grid>
  )
}

export default MuiFilterRows

export function getOperator(
  col: string,
  op: string,
  attributes: {
    [field: string]: Attribute
  },
): Option["operator"] {
  const proposedType = attributes[col] as string

  // todo this only works when Attribute is a string, not object!!
  const availableOptions = operatorOptions[proposedType as keyof OperatorOption]
  const optionAvailable = availableOptions.find((option) => {
    if (option.operator === op) {
      return option
    } else return undefined
  })

  return optionAvailable?.operator ?? availableOptions[0].operator
}
