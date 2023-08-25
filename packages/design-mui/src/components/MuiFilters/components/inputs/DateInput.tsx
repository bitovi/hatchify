import { TextField } from "@mui/material"

const DateInput: React.FC<{
  labelId: string
  value: string
  onChange: (value: string) => void
}> = ({ value, onChange }) => {
  return (
    <TextField
      fullWidth
      placeholder="Filter Value"
      variant="standard"
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default DateInput
