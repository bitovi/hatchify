import { Fragment } from "react"
import { Grid, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import type { FinalAttributeRecord } from "@hatchifyjs/core"
import type { FilterArray, FinalSchemas } from "@hatchifyjs/rest-client"
import type { FilterableControls, Operators, Option } from "../constants"
import ColumnSelect from "./inputs/ColumnSelect"
import OperatorSelect from "./inputs/OperatorSelect"
import ValueInput from "./inputs/ValueInput"
import { operatorOptionsByType } from "../constants"

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

export const MuiFilterRows: React.FC<{
  fields: string[] // @todo HATCH-417 - stricter typing for fields
  filters: FilterArray
  finalSchemas: FinalSchemas
  schemaName: string
  setFilters: (filters: FilterArray) => void
  removeFilter: (index: number) => void
}> = ({
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
      // Get correct attributes for comparison
      const newControl = getAttributeControl(finalSchemas, value, schemaName)
      const currentControl = getAttributeControl(
        finalSchemas,
        newFilters[index].field,
        schemaName,
      )

      // change the operator if existing operator does not exist on new column
      newFilters[index].operator = getAvailableOperator(
        newFilters[index].operator,
        newControl,
      )

      // reset the filter value if switching from one field type to another
      if (newControl.type !== currentControl.type) {
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
      {filters.map((filter, index) => {
        const control = getAttributeControl(
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
                options={getPossibleOptions(control)}
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
                data-testid="value-input"
                labelId={`${index}-value-label`}
                controlType={control.type as FilterableControls}
                operator={filter.operator as Operators}
                value={filter.value}
                onChange={(value: any) =>
                  onChange({ field: "value", value, index })
                }
                options={"values" in control ? control?.values : []}
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
  // todo: operator should be it's own type used in FilterArray & Option
  operator: string,
  control: FinalAttributeRecord[string]["control"],
): Option["operator"] {
  const availableOptions = getPossibleOptions(control)

  const optionAvailable = availableOptions.find((option) => {
    return option.operator === operator ? option : undefined
  })

  return optionAvailable?.operator ?? availableOptions[0].operator
}

// Filter out operators that are not available for the field type
export function getPossibleOptions(
  control: FinalAttributeRecord[string]["control"],
): Option[] {
  // @todo HATCH-417 - fieldType should not be any, it should be a TS type
  const fieldType = control.type
  const required = !control.allowNull

  const options = operatorOptionsByType[
    fieldType as keyof typeof operatorOptionsByType
  ].filter((option) => {
    return required
      ? option.operator !== "empty" && option.operator !== "nempty"
      : option
  })

  return options
}

export const getAttributeControl = (
  finalSchemas: FinalSchemas,
  field: string,
  schemaName: string,
): FinalAttributeRecord[string]["control"] => {
  const getRelatedTargetSchema = () => {
    const relatedField = field.split(".")[0]
    const relations = finalSchemas[schemaName].relationships

    return relations && relations[relatedField]
      ? relations[relatedField].targetSchema
      : relatedField
  }

  const isRelationship = field.includes(".")
  const attribute = isRelationship ? field.split(".")[1] : field
  const schema = isRelationship ? getRelatedTargetSchema() : schemaName

  return finalSchemas[schema].attributes[attribute].control
}
