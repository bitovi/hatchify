import { MenuItem, Select } from "@mui/material"
import { MuiMultiSelect } from "../../MuiMultiSelect/MuiMultiSelect"

export const MuiFilterEnumValue: React.FC<{
  options: string[]
  handleChange: (value: string | string[]) => void
  value: string | string[]
  operator: string
}> = ({ operator, options, handleChange, value }) => {
  return (
    <>
      {operator !== "$in" && operator !== "$nin" ? (
        <Select
          fullWidth
          variant="standard"
          labelId={`value-field-label`}
          value={value ?? ""}
          onChange={(e) => handleChange(e.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <MuiMultiSelect
          options={options}
          selectedOptions={Array.isArray(value) ? value : []}
          handleChange={(value) => handleChange(value)}
        />
      )}
    </>
  )
}

export default MuiFilterEnumValue
