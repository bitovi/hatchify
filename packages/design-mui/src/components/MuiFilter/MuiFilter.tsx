/** @jsxImportSource @emotion/react */
import { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"

import type { XCollectionProps } from "@hatchifyjs/react-ui"
import type { Attribute, Filter } from "@hatchifyjs/rest-client"
import FilterAltIcon from "@mui/icons-material/FilterAlt"

interface MuiFilterRowProps {
  attributes: { [field: string]: Attribute }
  column: string
  setColumn: (col: string) => void
  operator: string
  setOperator: (op: string) => void
  value: string
  setValue: (value: string) => void
}

interface DialogProps extends MuiFilterRowProps {
  open: boolean
  setOpen: (open: boolean) => void
  filter: Filter
  setFilter: (filterBy: Filter) => void
}

const MuiFilterRow: React.FC<MuiFilterRowProps> = ({
  attributes,
  column,
  setColumn,
  operator,
  setOperator,
  value,
  setValue,
}) => {
  const columnsList = Object.keys(attributes)

  return (
    <Grid container spacing={2} padding={"1.25rem"} width={"31.25rem"}>
      <Grid item xs={4}>
        <InputLabel id="select-column-label">Columns</InputLabel>
        <Select
          fullWidth
          labelId="select-column-label"
          id="simple-select"
          value={column}
          onChange={(ev) => setColumn(ev.target.value)}
        >
          {columnsList.map((item) => {
            return (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            )
          })}
        </Select>
      </Grid>
      <Grid item xs={4}>
        <InputLabel id="select-operator-label">Operator</InputLabel>
        <Select
          fullWidth
          labelId="select-operator-label"
          id="simple-select"
          value={operator}
          onChange={(ev) => setOperator(ev.target.value)}
        >
          <MenuItem value="empty">empty</MenuItem>
          <MenuItem value="$eq">equals</MenuItem>
          <MenuItem value="ilike">contains</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={4}>
        <InputLabel id="value-field-label">Value</InputLabel>
        <TextField
          placeholder="Filter Value"
          id="value-field"
          variant="outlined"
          onChange={(ev) => setValue(ev.target.value)}
          value={value}
        />
      </Grid>
    </Grid>
  )
}

const MuiFilterDialog: React.FC<DialogProps> = ({
  attributes,
  column,
  open,
  operator,
  value,
  setColumn,
  setOpen,
  setOperator,
  setValue,
  setFilter,
}) => {
  const clearFilter = () => {
    setColumn("")
    setOperator("")
    setValue("")
    setFilter(undefined)
    setOpen(false)
  }

  const applyFilter = () => {
    //On first pass, we are only supporting one filter row.
    setFilter([
      {
        [column]: value,
        operator: operator,
      },
    ])
    setOpen(false)
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <MuiFilterRow
          column={column}
          setColumn={setColumn}
          operator={operator}
          setOperator={setOperator}
          attributes={attributes}
          value={value}
          setValue={setValue}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={clearFilter}>Clear Filter</Button>
        <Button onClick={applyFilter} disabled={column === ""}>
          Apply Filter
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const MuiFilter: React.FC<XCollectionProps> = ({
  allSchemas,
  schemaName,
  filter,
  setFilter,
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [operator, setOperator] = useState<string>("")
  const [column, setColumn] = useState<string>("")
  const [value, setValue] = useState<string>("")

  return (
    <Grid container spacing={2}>
      <MuiFilterDialog
        column={column}
        setColumn={setColumn}
        open={open}
        setOpen={setOpen}
        operator={operator}
        setOperator={setOperator}
        attributes={allSchemas[schemaName].attributes}
        value={value}
        setValue={setValue}
        filter={filter}
        setFilter={setFilter}
      />
      <Grid item onClick={() => setOpen(true)}>
        <FilterAltIcon sx={{ color: "grey", cursor: "pointer" }} />
      </Grid>
    </Grid>
  )
}
