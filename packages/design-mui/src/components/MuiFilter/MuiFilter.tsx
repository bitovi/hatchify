/** @jsxImportSource @emotion/react */
import { useState } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import FilterAltIcon from "@mui/icons-material/FilterAlt"

import type { XFilterProps } from "@hatchifyjs/react-ui"
import type { Attribute } from "@hatchifyjs/rest-client"

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
  filters: { [key: string]: string }
  setFilters: (filterBy: { [key: string]: string }) => void
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
    <Grid container spacing={2} paddingTop={"20px"}>
      <Box>
        <InputLabel id="select-column-label">Columns</InputLabel>
        <Select
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
      </Box>
      <Box>
        <InputLabel id="select-operator-label">Operator</InputLabel>
        <Select
          labelId="select-operator-label"
          id="simple-select"
          value={operator}
          onChange={(ev) => setOperator(ev.target.value)}
        >
          <MenuItem value="equals">equals</MenuItem>
          <MenuItem value="contains">contains</MenuItem>
        </Select>
      </Box>
      <Box>
        <InputLabel id="value-field-label">Value</InputLabel>
        <TextField
          id="value-field"
          variant="outlined"
          onChange={(ev) => setValue(ev.target.value)}
          value={value}
        />
      </Box>
    </Grid>
  )
}

const MuiFilterDialog: React.FC<DialogProps> = ({
  attributes,
  column,
  open,
  operator,
  value,
  filters,
  setColumn,
  setOpen,
  setOperator,
  setValue,
  setFilters,
}) => {
  const clearFilter = () => {
    setColumn("")
    setOperator("")
    setValue("")
    setFilters({})
    setOpen(false)
  }

  const applyFilter = () => {
    //our filter query functions don't currently handle anything but "="
    setFilters({
      ...filters,
      [column]: value,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Filter</DialogTitle>
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
        <Button onClick={() => setOpen(false)}>Close</Button>
        <Button onClick={clearFilter}>Clear Filter</Button>
        <Button onClick={applyFilter} disabled={column === ""}>
          Apply Filter
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const MuiFilter: React.FC<XFilterProps> = ({
  schemas,
  schemaName,
  filters,
  setFilters,
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
        attributes={schemas[schemaName].attributes}
        value={value}
        setValue={setValue}
        filters={filters}
        setFilters={setFilters}
      />
      <Grid item xs={10.5}>
        <FilterAltIcon onClick={() => setOpen(true)} sx={{ color: "grey" }} />
      </Grid>
    </Grid>
  )
}
