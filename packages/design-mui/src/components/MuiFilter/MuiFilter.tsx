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
import type { Filter } from "@hatchifyjs/rest-client"
import FilterListIcon from "@mui/icons-material/FilterList"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"

interface MuiFilterRowProps {
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

const MuiFilterRow: React.FC<MuiFilterRowProps> = ({
  columnOptions,
  column,
  setColumn,
  operator,
  setOperator,
  value,
  setValue,
  setFilter,
}) => {
  return (
    <Grid container spacing={2} padding={"1.25rem"} width={"31.25rem"}>
      <Grid item xs={4}>
        <InputLabel id="select-column-label">Columns</InputLabel>
        <Select
          fullWidth
          variant="standard"
          labelId="select-column-label"
          id="simple-select"
          value={column}
          onChange={(ev) => {
            applyFilter(setFilter, ev.target.value, value, operator)
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
          <MenuItem value="ilike">contains</MenuItem>
          <MenuItem value="$eq">equals</MenuItem>
          <MenuItem value="empty">empty</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={4}>
        {operator !== "empty" && (
          <>
            <InputLabel id="value-field-label">Value</InputLabel>
            <TextField
              placeholder="Filter Value"
              id="value-field"
              variant="standard"
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
  const stringAttributes = Object.entries(allSchemas[schemaName].attributes)
    .filter(([, attr]) =>
      typeof attr === "object" ? attr.type === "string" : attr === "string",
    )
    .map(([key]) => key)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [operator, setOperator] = useState<string>("ilike")
  const [column, setColumn] = useState<string>(stringAttributes[0])
  const [value, setValue] = useState<string>("")

  const clearFilter = () => {
    setOpen(false)
    setColumn(stringAttributes[0])
    setOperator("ilike")
    setValue("")
    setFilter(undefined)
  }

  return (
    <>
      <MuiFilterPopover
        ref={buttonRef}
        column={column}
        setColumn={setColumn}
        open={open}
        setOpen={setOpen}
        operator={operator}
        setOperator={setOperator}
        columnOptions={stringAttributes}
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
    if (operator === "empty") setFilter([{ [column]: null, operator }])
    if (value === "") setFilter(undefined)
    else setFilter([{ [column]: value, operator: operator }])
  },
  500,
)
