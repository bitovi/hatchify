import { InputLabel, MenuItem, Select } from "@mui/material"
import type {
  OptionsByFilterableControls,
  FilterableControls,
} from "../../constants.js"

const OperatorSelect: React.FC<{
  options: OptionsByFilterableControls[FilterableControls]
  labelId: string
  value: string
  onChange: (value: string) => void
}> = ({ labelId, onChange, options, value }) => {
  return (
    <>
      <InputLabel id={labelId}>Operator</InputLabel>
      <Select
        data-testid="operator-select"
        fullWidth
        variant="standard"
        labelId={labelId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.operator} value={option.operator}>
            {option.text}
          </MenuItem>
        ))}
      </Select>
    </>
  )
}

export default OperatorSelect
