import { Autocomplete, InputLabel, TextField } from "@mui/material"

const ChipInput: React.FC<{
  value: string[]
  onChange: (value: string[]) => void
}> = ({ value, onChange }) => {
  return (
    <Autocomplete
      multiple
      freeSolo
      value={value}
      options={[]}
      ChipProps={{ size: "small", variant: "outlined" }}
      fullWidth
      disableClearable
      onChange={(e, value) => {
        onChange(value)
      }}
      renderInput={(params) => (
        <>
          <InputLabel id={`hello`}>Value</InputLabel>
          <TextField
            {...params}
            variant="standard"
            placeholder="Filter Value"
            InputProps={{
              ...params.InputProps,
            }}
          />
        </>
      )}
    />
  )
}
