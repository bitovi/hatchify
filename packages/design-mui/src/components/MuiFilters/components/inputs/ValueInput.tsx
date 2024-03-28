import type { StringStep } from "@hatchifyjs/core"
import { InputLabel } from "@mui/material"
import type { FilterableControls, Operators } from "../../constants.js"
import DateInput from "./DateInput.js"
import EnumInput from "./EnumInput.js"
import StringInput from "./StringInput.js"
import NumberInput from "./NumberInput.js"

const ValueInput: React.FC<{
  labelId: string
  controlType: FilterableControls
  operator: Operators
  value: any
  onChange: (value: string | string[]) => void
  options?: string[]
  step?: StringStep | number
}> = ({
  labelId,
  controlType,
  value,
  operator,
  onChange,
  options = [],
  step,
}) => {
  if (operator === "empty" || operator === "nempty") {
    return null
  }

  return (
    <>
      <InputLabel id={labelId}>Value</InputLabel>
      {controlType === "String" && (
        <StringInput
          labelId={labelId}
          operator={operator}
          value={value}
          onChange={onChange}
        />
      )}
      {controlType === "enum" && (
        <EnumInput
          labelId={labelId}
          operator={operator}
          value={value}
          onChange={onChange}
          options={options}
        />
      )}
      {controlType === "Date" && (
        <DateInput
          labelId={labelId}
          value={value}
          onChange={onChange}
          controlType={controlType}
          step={step}
        />
      )}
      {controlType === "Number" && (
        <NumberInput
          labelId={labelId}
          operator={operator}
          value={value}
          onChange={onChange}
        />
      )}
    </>
  )
}

export default ValueInput
