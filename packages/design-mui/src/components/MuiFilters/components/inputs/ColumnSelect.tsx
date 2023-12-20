import { InputLabel, MenuItem, Select } from "@mui/material"
import { camelCaseToStartCase } from "../../../../../../core/dist/core"

const ColumnSelect: React.FC<{
  fields: string[]
  labelId: string
  value: string
  onChange: (value: string) => void
}> = ({ value, labelId, fields, onChange }) => {
  return (
    <>
      <InputLabel id={labelId}>Column</InputLabel>
      <Select
        data-testid="column-select"
        fullWidth
        variant="standard"
        labelId={labelId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {fields.map((field) => (
          <MenuItem key={field} value={field}>
            {camelCaseToStartCase(field)}
          </MenuItem>
        ))}
      </Select>
    </>
  )
}

export default ColumnSelect
