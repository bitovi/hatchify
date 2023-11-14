import { TextField } from "@mui/material"
import MuiAutocomplete from "../../../MuiAutocomplete/MuiAutocomplete"
import type { Operators } from "../../constants"

const NumberInput: React.FC<{
  labelId: string
  operator: Operators
  value: string | string[]
  onChange: (value: string | string[]) => void
  options?: string[]
}> = ({ operator, value, onChange, options }) => {
  if (operator === "$in") {
    return (
      <MuiAutocomplete
        freeSolo
        disableClearable
        textFieldType="number"
        options={options || []}
        selectedOptions={Array.isArray(value) ? (value as string[]) : []}
        handleChange={(value) => onChange(value)}
      />
    )
  }

  return (
    <TextField
      fullWidth
      placeholder="Filter Value"
      variant="standard"
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default NumberInput
