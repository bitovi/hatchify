import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material"
import type { DefaultFieldComponentsTypes } from "@hatchifyjs/react"

export const String: DefaultFieldComponentsTypes["String"] = ({
  value,
  label,
  onUpdate,
}) => {
  return (
    <TextField
      label={label}
      type="text"
      variant="outlined"
      value={value}
      onChange={(e) => onUpdate(e.target.value)}
    />
  )
}

export const Number: DefaultFieldComponentsTypes["Number"] = ({
  value,
  label,
  onUpdate,
}) => {
  return (
    <TextField
      label={label}
      type="number"
      variant="outlined"
      value={value}
      onChange={(e) => onUpdate(window.Number(e.target.value))}
    />
  )
}

export const Date: DefaultFieldComponentsTypes["Date"] = ({
  value,
  label,
  onUpdate,
}) => {
  return (
    <TextField
      label={label}
      type="date"
      variant="outlined"
      value={value}
      InputLabelProps={{ shrink: true }}
      onChange={(e) => onUpdate(e.target.value)}
    />
  )
}

export const Boolean: DefaultFieldComponentsTypes["Boolean"] = ({
  value,
  label,
  onUpdate,
}) => {
  return (
    <FormControlLabel
      control={<Checkbox value={value} onChange={() => onUpdate(!value)} />}
      label={label}
      labelPlacement="end"
    />
  )
}

export const Relationship: DefaultFieldComponentsTypes["Relationship"] = ({
  values,
  hasMany,
  options,
  label,
  onUpdate,
}) => {
  // TODO should this be a controlled input?
  return (
    <Autocomplete
      multiple={hasMany}
      filterSelectedOptions
      options={options}
      onChange={(_, values) => {
        if (hasMany && Array.isArray(values)) {
          const ids = values.map((value) => value.id)
          onUpdate(ids)
        } else if (values && !Array.isArray(values)) {
          onUpdate([values.id])
        }
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  )
}
