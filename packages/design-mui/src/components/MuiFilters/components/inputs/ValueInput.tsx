import { InputLabel } from "@mui/material"
import DateInput from "./DateInput"
import EnumInput from "./EnumInput"
import StringInput from "./StringInput"

const ValueInput: React.FC<{
  labelId: string
  controlType: string
  value: any
  operator: string
  onChange: (value: string | string[]) => void
  options?: string[]
}> = ({ labelId, controlType, value, operator, onChange, options = [] }) => {
  if (operator === "empty" || operator === "nempty") {
    return null
  }

  console.log("fieldType", controlType)
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
      {(controlType === "Datetime" || controlType === "Dateonly") && (
        <DateInput
          labelId={labelId}
          value={value}
          onChange={onChange}
          controlType={controlType}
        />
      )}
    </>
  )
}

export default ValueInput
