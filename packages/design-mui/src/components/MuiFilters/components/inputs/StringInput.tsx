import { TextField } from "@mui/material"
import type { Operators } from "../../constants.js"
import MuiAutocomplete from "../../../MuiAutocomplete/MuiAutocomplete.js"

const StringInput: React.FC<{
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
      type="text"
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default StringInput
