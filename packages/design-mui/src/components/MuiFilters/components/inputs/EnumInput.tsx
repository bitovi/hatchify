import { MenuItem, Select } from "@mui/material"
import MuiAutocomplete from "../../../MuiAutocomplete/index.js"
import type { Operators } from "../../constants.js"

const EnumInput: React.FC<{
  labelId: string
  operator: Operators
  value: string | string[]
  onChange: (value: any) => void
  options: string[]
}> = ({ operator, value, onChange, options }) => {
  if (operator === "$in" || operator === "$nin") {
    return (
      <MuiAutocomplete
        options={options}
        selectedOptions={Array.isArray(value) ? (value as string[]) : []}
        handleChange={(value) => onChange(value)}
      />
    )
  }

  return (
    <Select
      data-testid="enum-select"
      fullWidth
      variant="standard"
      labelId={`value-field-label`}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  )
}

export default EnumInput
