import type { StringStep } from "@hatchifyjs/core"
import { TextField } from "@mui/material"
import type { FilterableControls } from "../../constants.js"

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24
const MILLISECONDS_IN_WEEK = MILLISECONDS_IN_DAY * 7
const MILLISECONDS_IN_YEAR = MILLISECONDS_IN_DAY * 365
const MILLISECONDS_IN_DECADE = MILLISECONDS_IN_YEAR * 10

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
        step === MILLISECONDS_IN_DAY ||
        step === "week" ||
        step === MILLISECONDS_IN_WEEK ||
        step === "year" ||
        step === MILLISECONDS_IN_YEAR ||
        step === "decade" ||
        step === MILLISECONDS_IN_DECADE
          ? "date"
          : "datetime-local"
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default DateInput
