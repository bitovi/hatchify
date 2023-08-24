import { InputLabel, MenuItem, Select } from "@mui/material"

const OperatorSelect: React.FC<{
  options: Array<{ operator: string; text: string }>
  labelId: string
  value: string
  onChange: (value: string) => void
}> = ({ labelId, onChange, options, value }) => {
  return (
    <>
      <InputLabel id={labelId}>Operator</InputLabel>
      <Select
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
