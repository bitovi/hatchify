import type { StringStep } from "@hatchifyjs/core"
import { TextField } from "@mui/material"
import type { FilterableControls } from "../../constants.js"

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24

const DateInput: React.FC<{
  controlType: FilterableControls
  labelId: string
  value: string
  onChange: (value: string) => void
  step?: StringStep | number
}> = ({ controlType, value, onChange, step }) => {
  return (
    <TextField
      fullWidth
      placeholder="Filter Value"
      variant="standard"
      type={
        step === "day" ||
        step === "week" ||
        step === "year" ||
        step === "decade" ||
        (typeof step === "number" && step % MILLISECONDS_IN_DAY === 0)
          ? "date"
          : "datetime-local"
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default DateInput
