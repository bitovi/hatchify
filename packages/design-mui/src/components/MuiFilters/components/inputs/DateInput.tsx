import { TextField } from "@mui/material"

const DateInput: React.FC<{
  fieldType: string
  labelId: string
  value: string
  onChange: (value: string) => void
}> = ({ fieldType, value, onChange }) => {
  return (
    <TextField
      fullWidth
      placeholder="Filter Value"
      variant="standard"
      type={fieldType === "Datetime" ? "datetime-local" : "date"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default DateInput
