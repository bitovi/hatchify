import type { DefaultFieldComponentsTypes } from "../HatchifyPresentationProvider"

export const String: DefaultFieldComponentsTypes["String"] = ({
  value,
  label,
  onUpdate,
}) => {
  return (
    <div>
      <label>{label}: </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onUpdate(e.target.value)}
      />
    </div>
  )
}

export const Number: DefaultFieldComponentsTypes["Number"] = ({
  value,
  label,
  onUpdate,
}) => {
  return (
    <div>
      <label>{label}: </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onUpdate(window.Number(e.target.value))}
      />
    </div>
  )
}

export const Boolean: DefaultFieldComponentsTypes["Boolean"] = ({
  value,
  label,
  onUpdate,
}) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={value}
        onChange={() => onUpdate(!value)}
      />
      <label> {label}</label>
    </div>
  )
}

export const Date: DefaultFieldComponentsTypes["String"] = ({
  value,
  label,
  onUpdate,
}) => {
  return (
    <div>
      <label>{label}: </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onUpdate(e.target.value)}
      />
    </div>
  )
}

export const Relationship: DefaultFieldComponentsTypes["Relationship"] = ({
  values,
  label,
  options,
  hasMany,
  onUpdate,
}) => {
  return (
    <fieldset>
      <label>{label}: </label>
      {options.map((option) => (
        <div key={option.id}>
          <input
            id={`checkbox-${option.id}`}
            type="checkbox"
            name={option.label}
            checked={values?.includes(option.id)}
            onChange={() => {
              if (values.includes(option.id)) {
                const index = values.indexOf(option.id)
                const newValues = [...values]
                newValues.splice(index, 1)
                onUpdate(newValues)
              } else {
                if (hasMany) {
                  onUpdate([...values, option.id])
                } else {
                  onUpdate([option.id])
                }
              }
            }}
          />
          <label htmlFor={`checkbox-${option.id}`}>{` ${option.label}`}</label>
        </div>
      ))}
    </fieldset>
  )
}
