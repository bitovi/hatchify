import { Box, Chip, MenuItem, Select } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

export const MuiMultiSelect: React.FC<{
  options: string[]
  handleChange: (value: string[]) => void
  selectedOptions: string[]
}> = ({ options, handleChange, selectedOptions }) => {
  return (
    <Select
      fullWidth
      multiple
      variant="standard"
      labelId={`value-field-label`}
      value={selectedOptions ?? []}
      renderValue={(selected) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selected.map((value) => (
            <Chip
              key={value}
              label={value}
              deleteIcon={
                <CloseIcon onMouseDown={(event) => event.stopPropagation()} />
              }
              onDelete={() =>
                handleChange(selectedOptions.filter((val) => value !== val))
              }
            />
          ))}
        </Box>
      )}
      onChange={(e) => handleChange(e.target.value as string[])}
    >
      {options
        .filter((val) => !(selectedOptions ?? []).includes(val))
        .map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
    </Select>
  )
}

export default MuiMultiSelect
