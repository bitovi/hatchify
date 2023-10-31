import { TextField } from "@mui/material"

const DateInput: React.FC<{
  controlType: string
  labelId: string
  value: string
  onChange: (value: string) => void
}> = ({ controlType, value, onChange }) => {
  return (
    <TextField
      fullWidth
      placeholder="Filter Value"
      variant="standard"
      type={controlType === "Datetime" ? "datetime-local" : "date"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default DateInput
