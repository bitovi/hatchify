import { Autocomplete, Chip, TextField } from "@mui/material"

export const MuiAutocomplete: React.FC<{
  options: string[]
  handleChange: (value: string[]) => void
  selectedOptions: string[]
}> = ({ options, handleChange, selectedOptions }) => {
  return (
    <Autocomplete
      multiple
      id="value-autocomplete"
      options={options}
      value={selectedOptions}
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
            size="small"
            key={index}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} variant="standard" fullWidth />
      )}
      onChange={(e, value) => {
        handleChange(value)
      }}
    />
  )
}

export default MuiAutocomplete
