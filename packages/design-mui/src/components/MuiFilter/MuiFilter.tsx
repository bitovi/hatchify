import { forwardRef, useRef, useState } from "react"
import {
  Button,
  InputLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Popover,
  debounce,
} from "@mui/material"
import type { XCollectionProps } from "@hatchifyjs/react-ui"
import type { Attribute, Filter } from "@hatchifyjs/rest-client"
import FilterListIcon from "@mui/icons-material/FilterList"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"

interface MuiFilterRowProps {
  attributes: { [field: string]: Attribute }
  columnOptions: string[]
  column: string
  setColumn: (col: string) => void
  operator: string
  setOperator: (op: string) => void
  value: string
  setValue: (value: string) => void
  setFilter: (filterBy: Filter) => void
}

interface PopoverProps extends MuiFilterRowProps {
  open: boolean
  setOpen: (open: boolean) => void
  filter: Filter
  setFilter: (filterBy: Filter) => void
  clearFilter: () => void
}

interface Option {
  operator: string
  text: string
}

type OperatorOption = {
  [key in "string" | "date"]: Option[]
}

const operatorOptions: OperatorOption = {
  string: [
    { operator: "ilike", text: "contains" },
    { operator: "$eq", text: "equals" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
  ],
  date: [
    { operator: "$eq", text: "is" },
    { operator: "$gt", text: "is after" },
    { operator: "$gte", text: "is on or after" },
    { operator: "$lt", text: "is before" },
    { operator: "$lte", text: "is on or before" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
  ],
}

const removeEmptyOptions = (
  col: string,
  attributes: {
    [field: string]: Attribute
  },
): Option[] => {
  const proposedType =
    typeof attributes[col] === "string" ? attributes[col] : attributes[col].type

  const required =
    typeof attributes[col] === "string" ? false : !attributes[col].allowNull

  const availableOptions = operatorOptions[
    proposedType as keyof OperatorOption
  ].filter((option) => {
    if (required) {
      return option.operator !== "empty" && option.operator !== "nempty"
    } else {
      return option
    }
  })

  return availableOptions
}

//change the operator if the selected operator is not compatible with the new column type
const getOperator = (
  col: string,
  op: string,
  attributes: {
    [field: string]: Attribute
  },
): Option => {
  const availableOptions = removeEmptyOptions(col, attributes)

  const optionAvailable = availableOptions.find((option) => {
    if (option.operator === op) {
      return option
    } else return undefined
  })

  return optionAvailable ?? availableOptions[0]
}

const MuiFilterRow: React.FC<MuiFilterRowProps> = ({
  attributes,
  columnOptions,
  column,
  setColumn,
  operator,
  setOperator,
  value,
  setValue,
  setFilter,
}) => {
  const selectedType =
    typeof attributes[column] === "string"
      ? attributes[column]
      : attributes[column].type
  const availableOptions = removeEmptyOptions(column, attributes)

  return (
    <Grid container spacing={2} padding={"1.25rem"} width={"43.25rem"}>
      <Grid item xs={4}>
        <InputLabel id="select-column-label">Columns</InputLabel>
        <Select
          fullWidth
          variant="standard"
          labelId="select-column-label"
          id="simple-select"
          value={column}
          onChange={(ev) => {
            const op = getOperator(ev.target.value, operator, attributes)
            applyFilter(setFilter, ev.target.value, value, "")
            setOperator(op.operator)
            setColumn(ev.target.value)
          }}
        >
          {columnOptions.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={4}>
        <InputLabel id="select-operator-label">Operator</InputLabel>
        <Select
          variant="standard"
          fullWidth
          labelId="select-operator-label"
          id="simple-select"
          value={operator}
          onChange={(ev) => {
            applyFilter(setFilter, column, value, ev.target.value)
            setOperator(ev.target.value)
          }}
        >
          {availableOptions.map((item) => (
            <MenuItem key={item.operator} value={item.operator}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={4}>
        {operator !== "empty" && operator !== "nempty" && (
          <>
            <InputLabel id="value-field-label">Value</InputLabel>
            <TextField
              placeholder="Filter Value"
              id="value-field"
              variant="standard"
              type={selectedType === "date" ? "datetime-local" : "text"}
              onChange={(ev) => {
                applyFilter(setFilter, column, ev.target.value, operator)
                setValue(ev.target.value)
              }}
              value={value}
            />
          </>
        )}
      </Grid>
    </Grid>
  )
}

// eslint-disable-next-line react/display-name
const MuiFilterPopover = forwardRef<HTMLButtonElement, PopoverProps>(
  (
    {
      attributes,
      columnOptions,
      column,
      open,
      operator,
      value,
      setColumn,
      setOpen,
      setOperator,
      setValue,
      setFilter,
      clearFilter,
    },
    ref,
  ) => {
    return (
      <Popover
        anchorEl={
          (ref != null && typeof ref !== "function" && ref.current) || null
        }
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              alignItems: "flex-end",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <MuiFilterRow
          attributes={attributes}
          column={column}
          setColumn={setColumn}
          operator={operator}
          setOperator={setOperator}
          columnOptions={columnOptions}
          value={value}
          setValue={setValue}
          setFilter={setFilter}
        />
        <Button
          variant="text"
          startIcon={<DeleteForeverIcon />}
          onClick={clearFilter}
        >
          Remove All
        </Button>
      </Popover>
    )
  },
)

export const MuiFilter: React.FC<XCollectionProps> = ({
  allSchemas,
  schemaName,
  filter,
  setFilter,
}) => {
  const stringDateAttributes = Object.entries(allSchemas[schemaName].attributes)
    .filter(([, attr]) =>
      typeof attr === "object"
        ? attr.type === "string" || attr.type === "date"
        : attr === "string" || attr === "date",
    )
    .map(([key]) => key)

  const defaultOperator = getOperator(
    stringDateAttributes[0],
    "ilike",
    allSchemas[schemaName].attributes,
  )

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [operator, setOperator] = useState<string>(defaultOperator.operator)
  const [column, setColumn] = useState<string>(stringDateAttributes[0])
  const [value, setValue] = useState<string>("")

  const clearFilter = () => {
    setOpen(false)
    setColumn(stringDateAttributes[0])
    setOperator(defaultOperator.operator)
    setValue("")
    setFilter(undefined)
  }

  return (
    <>
      <MuiFilterPopover
        attributes={allSchemas[schemaName].attributes}
        ref={buttonRef}
        column={column}
        setColumn={setColumn}
        open={open}
        setOpen={setOpen}
        operator={operator}
        setOperator={setOperator}
        columnOptions={stringDateAttributes}
        value={value}
        setValue={setValue}
        filter={filter}
        setFilter={setFilter}
        clearFilter={clearFilter}
      />
      <Button
        ref={buttonRef}
        variant="text"
        startIcon={<FilterListIcon />}
        onClick={() => setOpen(true)}
      >
        Filters
      </Button>
    </>
  )
}

const applyFilter = debounce(
  (
    setFilter: (filterBy: Filter) => void,
    column: string,
    value: string,
    operator: string,
  ) => {
    if (operator !== "empty" && !value) setFilter(undefined)
    if (operator === "empty" || operator === "nempty")
      setFilter([{ [column]: null, operator }])
    if (value === "" && operator !== "empty" && operator !== "nempty")
      setFilter(undefined)
    else setFilter([{ [column]: value, operator: operator }])
  },
  500,
)
